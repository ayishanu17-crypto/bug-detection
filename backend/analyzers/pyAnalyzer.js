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
const SYNTAX_SCRIPT = `
import sys, json, ast
code = sys.stdin.read()
try:
    ast.parse(code)
    print(json.dumps([]))
except SyntaxError as e:
    print(json.dumps([{
        "line": e.lineno or 1,
        "col": e.offset or 0,
        "message": (e.msg or "").replace(chr(10), " "),
        "text": (e.text or "").rstrip()
    }]))
except Exception:
    print(json.dumps([]))
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
    out = addSpacesAroundAssignment(out);
    return out;
}

function buildCorrectedPython(codeString, interpreterAvailable) {
    if (!codeString.trim()) return null;
    const lines = codeString.split(/\r?\n/);
    const candidate = lines.map(fixLine).join('\n');
    if (candidate === codeString) return null;
    if (interpreterAvailable) {
        if (getSyntaxErrors(candidate).length === 0) return candidate;
        // Conservative fallback: only strip trailing whitespace / stray colons.
        const minimal = lines.map(l => l.replace(/\s+$/, '').replace(/:\s*$/, '')).join('\n');
        if (minimal !== codeString && getSyntaxErrors(minimal).length === 0) return minimal;
        return null;
    }
    return candidate; // no interpreter -> best-effort repair
}
function analyzePython(codeString) {
    const issues = [];
    const lines = codeString.split(/\r?\n/);
    const pythonAvailable = !!getPythonCmd();
    const fixedLines = lines.map(fixLine);

    // 1) Real Python syntax errors (catches `a=10:`, mismatched brackets, etc.)
    for (const err of getSyntaxErrors(codeString)) {
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
        correctedCode: buildCorrectedPython(codeString, pythonAvailable),
        engine: pythonAvailable ? 'Python AST' : 'Heuristic lint'
    };
}

module.exports = { analyzePython };