// analyzers/pyAnalyzer.js
const { execFileSync } = require('child_process');

let cachedPython = null;

// Find a real Python 3 interpreter (python3 -> python -> py -3 -> py).
function getPythonCmd() {
    if (cachedPython) return cachedPython;
    const candidates = [
        { bin: 'python3', args: [] },
        { bin: 'python', args: [] },
        { bin: 'py', args: ['-3'] },
        { bin: 'py', args: [] }
    ];
    for (const cand of candidates) {
        try {
            const out = execFileSync(cand.bin, [...cand.args, '-c', 'import sys; print(sys.version_info[0])'], {
                timeout: 5000,
                windowsHide: true,
                stdio: ['ignore', 'pipe', 'ignore']
            });
            if (out.toString().trim() === '3') {
                cachedPython = cand;
                return cand;
            }
        } catch (err) {
            /* try the next interpreter name (avoids the Windows Store stub) */
        }
    }
    return null;
}

function runPythonScript(script, codeString) {
    const cmd = getPythonCmd();
    if (!cmd) return { ok: false, output: '' };
    try {
        const out = execFileSync(cmd.bin, [...cmd.args, '-c', script], {
            input: codeString,
            encoding: 'utf8',
            timeout: 10000,
            windowsHide: true,
            maxBuffer: 2 * 1024 * 1024
        });
        return { ok: true, output: out };
    } catch (err) {
        return { ok: false, output: '' };
    }
}

// Real Python syntax check with the `ast` module (catches things like `a=10:`).
// Python's ast.parse only raises the FIRST SyntaxError, so we re-parse after
// deleting the offending character each time to uncover the errors that follow.
const SYNTAX_SCRIPT = `
import sys, json, ast

def abs_index(code, lineno, offset):
    # lineno is 1-based, offset is the 1-based display column -> absolute index
    if lineno <= 1:
        return max(0, (offset or 1) - 1)
    idx = 0
    for _ in range(lineno - 1):
        nl = code.find("\\n", idx)
        if nl == -1:
            return len(code)
        idx = nl + 1
    return min(len(code), idx + max(0, (offset or 1) - 1))

code = sys.stdin.read()
masked = code
errors = []
reported_lines = set()
seen = set()
MAX = 200
try:
    for _ in range(MAX):
        try:
            ast.parse(masked)
            break
        except SyntaxError as e:
            line = e.lineno or 1
            msg = (e.msg or "").replace(chr(10), " ")
            if line in reported_lines:
                break  # cascading errors on an already-reported line -> stop
            key = (line, msg)
            if key in seen:
                break  # no progress -> stop here
            seen.add(key)
            reported_lines.add(line)
            errors.append({
                "line": line,
                "col": e.offset or 0,
                "message": msg,
                "text": (e.text or "").rstrip()
            })
            pos = abs_index(masked, line, e.offset)
            if pos < 0 or pos >= len(masked) or masked[pos] == "\\n":
                break
            masked = masked[:pos] + masked[pos + 1:]
except Exception:
    pass  # never crash the analyzer; report whatever errors were already found
print(json.dumps(errors))
`;

function getSyntaxErrors(codeString) {
    const res = runPythonScript(SYNTAX_SCRIPT, codeString);
    if (!res.ok) return [];
    try {
        return JSON.parse(res.output.trim());
    } catch (err) {
        return [];
    }
}
/* ------------------------- Fix engine ------------------------- */

const BLOCK_HEADER = /^\s*(async\s+)?(def|class|if|elif|else|for|while|try|except|finally|with|match|case)\b.*:\s*$/;
const COMPOUND_KEYWORD = /^\s*(async\s+)?(def|class|if|elif|else|for|while|try|except|finally|with|match|case)\b/;
const ELSE_FAMILY = /^(elif|else|except|finally|case)\b/;

const INDENT = '    ';

// Remove a stray trailing ":" on a non-block line (e.g. `a=10:` -> `a=10`).
function fixTrailingColon(line) {
    const noComment = line.replace(/\s*#.*$/, '').trimEnd();
    if (!noComment.endsWith(':')) return line;
    if (BLOCK_HEADER.test(line)) return line; // def foo(): / if cond: stay untouched
    const trimmed = line.trim();
    const opens = (trimmed.match(/[(\[{]/g) || []).length;
    const closes = (trimmed.match(/[)\]}]/g) || []).length;
    if (opens > closes) return line; // dangling dict/slice literal
    if (/#/.test(line)) return line.replace(/:\s*(#.*)$/, ' $1'); // keep a trailing comment
    return line.replace(/:\s*$/, '');
}

// Python 2 style `print x` -> `print(x)`.
function fixPrintStatement(line) {
    const trimmed = line.trim();
    if (/^print\s*\(/.test(trimmed)) return line; // already a call
    const m = trimmed.match(/^print\s+(.+)$/);
    if (!m) return line;
    const indent = line.slice(0, line.length - line.trimStart().length);
    return `${indent}print(${m[1].trimEnd()})`;
}

// Common typo: `printf(...)` -> `print(...)` (only when it looks like a call).
function fixPrintf(line) {
    if (!/\bprintf\s*\(/.test(line)) return line;
    const indent = line.slice(0, line.length - line.trimStart().length);
    return indent + line.trim().replace(/\bprintf\s*\(/, 'print(');
}

// Returns the quote char if [line] contains a single-line string that is never
// closed (e.g. `print("you are selected)`), else null. Triple-quoted strings
// are deliberately not auto-closed.
function unterminatedQuoteChar(line) {
    const code = line.replace(/\s*#.*$/, '');
    let quote = null;
    let escaped = false;
    for (let i = 0; i < code.length; i++) {
        const ch = code[i];
        if (quote) {
            if (escaped) { escaped = false; continue; }
            if (ch === '\\') { escaped = true; continue; }
            if (ch === quote) {
                if (code[i + 1] === quote && code[i + 2] === quote) { quote = null; i += 2; }
                else quote = null;
            }
        } else if (ch === '"' || ch === "'") {
            if (code[i + 1] === ch && code[i + 2] === ch) return null; // triple-quote
            quote = ch;
        }
    }
    return (quote && quote.length === 1) ? quote : null;
}

// Close a missing string quote, inserting before any trailing ")" "]" "}" so a
// call like `print("you are selected)` repairs to `print("you are selected")`
// instead of `print("you are selected)")`.
function fixUnterminatedString(line) {
    const q = unterminatedQuoteChar(line);
    if (!q) return line;
    const code = line.replace(/\s*#.*$/, '');
    const openIdx = code.indexOf(q);
    if (openIdx < 0) return line;
    let insertAt = code.length;
    const rest = code.slice(openIdx + 1);
    const m = rest.match(/^[^)\]}]*[)\]}]/);
    if (m) insertAt = openIdx + 1 + m[0].length - 1;
    const fixed = code.slice(0, insertAt) + q + code.slice(insertAt);
    return fixed + line.slice(code.length);
}

// PEP8 E225: add spaces around a single "=" (skips ==, !=, <=, +=, etc.)
function addSpacesAroundAssignment(line) {
    let out = line;
    for (let i = 0; i < 3; i++) {
        const next = out.replace(/([A-Za-z_]\w*)\s*=\s*([^\s=])/g, '$1 = $2');
        if (next === out) break;
        out = next;
    }
    return out;
}

function fixLine(line) {
    let out = line.replace(/\s+$/, ''); // PEP8 W291
    out = fixTrailingColon(out);
    out = fixPrintStatement(out);
    out = fixPrintf(out);
    out = fixUnterminatedString(out);
    out = addSpacesAroundAssignment(out);
    return out;
}

// Turn a bare `elif`/`except`/`finally` (no condition) into `else:` — we can't
// guess the missing condition, so the only sane repair is an `else` branch.
// Also makes sure compound-keyword lines carry a trailing ":".
function normalizeBlockHeader(trimmed) {
    let t = trimmed;
    if (/^elif\s*:?\s*$/.test(t)) t = t.replace(/^elif/, 'else');
    if (/^(elif|else|except|finally)\s*$/.test(t)) t = t + ':';
    if (COMPOUND_KEYWORD.test(t) && !/:\s*$/.test(t)) t = t + ':';
    return t;
}

// Re-indent a block-structured program (fixes missing indentation under
// if/for/while/def/etc. and missing colons). Best-effort — the caller only
// accepts its output when it still parses cleanly.
function fixIndentation(lines) {
    const stack = [];      // one entry per open compound block
    let prevOrigIndent = 0;
    const out = [];

    for (let i = 0; i < lines.length; i++) {
        const raw = lines[i];
        const trimmed = raw.trim();
        if (!trimmed) { out.push(''); continue; }
        if (trimmed.startsWith('#')) { out.push(raw.replace(/\s+$/, '')); continue; }

        const origIndent = raw.length - raw.trimStart().length;
        const continuation = (i > 0) ? /\\\s*$/.test(lines[i - 1]) : false;
        if (continuation) { out.push(raw.replace(/\s+$/, '')); continue; }

        // Inline compound: `if x: stmt` on one line — keep it as-is.
        if (COMPOUND_KEYWORD.test(trimmed) && /:\s*\S/.test(trimmed) && !/:\s*$/.test(trimmed)) {
            out.push(INDENT.repeat(stack.length) + trimmed);
            prevOrigIndent = origIndent;
            continue;
        }

        if (ELSE_FAMILY.test(trimmed)) {
            if (stack.length > 0) stack.pop();      // close the previous body
            out.push(INDENT.repeat(stack.length) + normalizeBlockHeader(trimmed));
            stack.push({});                          // this sibling opens a new body
            prevOrigIndent = origIndent;
            continue;
        }

        if (COMPOUND_KEYWORD.test(trimmed)) {
            if (origIndent < prevOrigIndent && stack.length > 0) stack.pop();
            out.push(INDENT.repeat(stack.length) + normalizeBlockHeader(trimmed));
            stack.push({});
            prevOrigIndent = origIndent;
            continue;
        }

        // Plain statement — dedent when its original indent is shallower than the
        // previous content line (it ends the current block).
        if (origIndent < prevOrigIndent && stack.length > 0) stack.pop();
        out.push(INDENT.repeat(stack.length) + trimmed);
        prevOrigIndent = origIndent;
    }
    return out;
}

function buildCorrectedPython(codeString, interpreterAvailable, hadSyntaxErrors) {
    if (!codeString.trim()) return null;
    const lines = codeString.split(/\r?\n/);

    // Stage 1: safe per-line fixes (typos, spacing, unbalanced quotes).
    const candidate = lines.map(fixLine).join('\n');
    if (candidate !== codeString && (!interpreterAvailable || getSyntaxErrors(candidate).length === 0)) {
        return candidate;
    }

    // Stage 2: structural repair (indentation + missing colons). Only runs when
    // the original had real syntax errors, and only accepts output that still
    // parses — so invalid code is never presented as "fixed".
    if (interpreterAvailable && hadSyntaxErrors) {
        const reindented = fixIndentation(candidate.split(/\r?\n/)).join('\n');
        if (reindented !== codeString && getSyntaxErrors(reindented).length === 0) return reindented;
    }
    return null;
}
function analyzePython(codeString) {
    const issues = [];
    const lines = codeString.split(/\r?\n/);
    const pythonAvailable = !!getPythonCmd();
    const fixedLines = lines.map(fixLine);

    // 1) Real Python syntax errors (catches `a=10:`, mismatched brackets, etc.)
    const syntaxErrors = getSyntaxErrors(codeString);
    for (const err of syntaxErrors) {
        const lineIndex = Math.max(0, (err.line || 1) - 1);
        const lineText = (lines[lineIndex] || '').trim();
        const fixed = (fixedLines[lineIndex] || '').trim();
        issues.push({
            line: err.line || 1,
            col: err.col,
            ruleName: 'Syntax Error',
            severity: 'HIGH',
            message: `Syntax error: ${err.message}${err.text ? ` — "${err.text}"` : ''}`,
            snippet: err.text || lineText,
            suggestedFix: fixed && fixed !== lineText
                ? `Replace this line with: ${fixed}`
                : `Fix the syntax on line ${err.line || 1} and run the scan again.`
        });
    }

    // 2) Tell the user when deep analysis is unavailable
    if (!pythonAvailable) {
        issues.push({
            line: 1,
            col: 0,
            ruleName: 'Interpreter Not Found',
            severity: 'LOW',
            message: 'Python is not available on this machine, so only basic static checks ran. Install Python 3 for full syntax error detection.',
            snippet: '',
            suggestedFix: 'Install Python 3, add it to your PATH, then restart the backend.'
        });
    }

    // 3) Style / potential-bug lint checks
    lines.forEach((line, index) => {
        const lineNumber = index + 1;
        const trimmed = line.trim();
        if (!trimmed) return;

        if (/^print\s+[^\(]/.test(trimmed)) {
            issues.push({
                line: lineNumber,
                ruleName: 'Python 2 Print Syntax',
                severity: 'MEDIUM',
                message: 'Python 2 style print statement detected.',
                snippet: trimmed,
                suggestedFix: `Use the Python 3 print function: ${(fixedLines[index] || '').trim() || 'print(...)'}`
            });
        }

        if (trimmed.includes('eval(')) {
            issues.push({
                line: lineNumber,
                ruleName: 'Use of eval()',
                severity: 'HIGH',
                message: 'Use of eval() poses security and reliability risks.',
                snippet: 'eval(...)',
                suggestedFix: 'Avoid dynamic code execution. Use safer alternatives such as ast.literal_eval().'
            });
        }

        const fixedLine = (fixedLines[index] || '').trim();
        if (/[A-Za-z0-9_)\])"'\d]=[A-Za-z0-9_(\["'\d]/.test(trimmed)) {
            issues.push({
                line: lineNumber,
                ruleName: 'Missing whitespace around operator',
                severity: 'LOW',
                message: 'PEP 8 (E225): expected spaces around the "=" operator.',
                snippet: trimmed,
                suggestedFix: fixedLine && fixedLine !== trimmed
                    ? `Replace with: ${fixedLine}`
                    : 'Add spaces around the operator, e.g. "a = 10" instead of "a=10".'
            });
        }

        if (line.length > 79) {
            issues.push({
                line: lineNumber,
                ruleName: 'Line too long',
                severity: 'LOW',
                message: `Line is ${line.length} characters (PEP 8 limit is 79).`,
                snippet: trimmed,
                suggestedFix: 'Break the line into multiple shorter lines.'
            });
        }

        if (/\s+$/.test(line) && trimmed.length > 0) {
            issues.push({
                line: lineNumber,
                ruleName: 'Trailing whitespace',
                severity: 'LOW',
                message: 'Unnecessary trailing whitespace at the end of the line.',
                snippet: trimmed,
                suggestedFix: fixedLine || 'Remove the whitespace at the end of the line.'
            });
        }
    });

    return {
        totalIssues: issues.length,
        issuesFound: issues,
        correctedCode: buildCorrectedPython(codeString, pythonAvailable, syntaxErrors.length > 0),
        engine: pythonAvailable ? 'Python AST' : 'Heuristic lint'
    };
}

module.exports = { analyzePython };