// backend/analyzers/ccppAnalyzer.js
const { execFileSync } = require('child_process');

let cachedCompiler = null;

// Find a working C/C++ compiler for real syntax checks (g++ -> gcc -> clang++ -> clang).
function findCompiler() {
    if (cachedCompiler) return cachedCompiler;
    const candidates = ['g++', 'gcc', 'clang++', 'clang'];
    for (const cand of candidates) {
        try {
            execFileSync(cand, ['--version'], { timeout: 5000, windowsHide: true, stdio: 'ignore' });
            cachedCompiler = cand;
            return cand;
        } catch (err) {
            /* try the next compiler */
        }
    }
    return null;
}

// Pipe the snippet through the compiler with '-fsyntax-only' for real error messages.
function compilerCheck(code, lang) {
    const compiler = findCompiler();
    if (!compiler) return { available: false, errors: [] };
    const syntaxLang = String(lang).toLowerCase() === 'c' ? 'c' : 'c++';
    try {
        execFileSync(compiler, ['-x', syntaxLang, '-fsyntax-only', '-'], {
            input: code,
            encoding: 'utf8',
            timeout: 20000,
            windowsHide: true,
            stdio: ['pipe', 'ignore', 'pipe'],
            maxBuffer: 4 * 1024 * 1024
        });
        return { available: true, errors: [] };
    } catch (err) {
        const stderr = String(err.stderr || '');
        return { available: true, errors: parseCompilerErrors(stderr) };
    }
}

function parseCompilerErrors(stderr) {
    const errors = [];
    const re = /(?:^|\n)<stdin>:(\d+):(\d+):\s*(fatal error|error|warning):\s*(.*?)(?:\r?\n|$)/g;
    let m;
    while ((m = re.exec(stderr))) {
        errors.push({ line: Number(m[1]), col: Number(m[2]), kind: m[3], message: m[4] });
    }
    if (errors.length === 0 && stderr.trim()) {
        errors.push({ line: 1, col: 0, kind: 'error', message: stderr.trim().split(/\r?\n/)[0] });
    }
    return errors;
}

/* ----------------------- heuristics ----------------------- */

function cStatementNeedsSemicolon(t) {
    if (!t) return false;
    if (t.startsWith('#') || t.startsWith('//') || t.startsWith('/*') || t.startsWith('*')) return false;
    if (/[;{}]\s*$/.test(t)) return false;
    if (/:+\s*$/.test(t)) return false; // case / label
    if (/^(if|for|while|switch|catch)\s*\(.*\)\s*$/.test(t)) return false;   // control header, body follows
    if (/^(else|do|try|finally)\b[\s;]*$/.test(t) || /{$/.test(t)) return false;
    if (/^using\s+namespace\b/.test(t)) return true;   // `using namespace std` needs ";"
    if (/^return\b/.test(t) || /^(break|continue|goto)\b/.test(t)) return true;
    if (/^(typedef\b|struct\b|enum\b|union\b)/.test(t)) return true;
    if (/^[A-Za-z_][A-Za-z0-9_:<>]*(\s*[*&])?\s+[A-Za-z_][A-Za-z0-9_]*(\s*=|\[)/.test(t)) return true; // declaration/initializer
    if (/^[A-Za-z_][A-Za-z0-9_]*\s*=[^=]/.test(t)) return true;                // assignment
    if (/^[A-Za-z_][A-Za-z0-9_:<>]*\s*\(.*\)\s*$/.test(t)) return true;        // function call
    return false;
}

function fixCommonCCpp(line) {
    let out = line.replace(/\s+$/, '');
    const t = out.trim();
    if (!t || t.startsWith('#') || t.startsWith('//') || t.startsWith('/*') || t.startsWith('*')) return out;

    const noComment = t.split('//')[0].replace(/\s+$/, '');
    if (noComment.endsWith(':') && !/^\s*(case\b|default\s*:|\{\s*)$/.test(out) && !/[{}]/.test(out)) {
        out = out.replace(/:\s*$/, '');
    }
    for (let i = 0; i < 3; i++) { // spaces around a single "=" (skips ==, <=, += ...)
        const next = out.replace(/([A-Za-z_]\w*)\s*=\s*([^\s=])/g, '$1 = $2');
        if (next === out) break;
        out = next;
    }
    return out;
}

function addMissingSemicolons(code) {
    return code.split(/\r?\n/).map(line => {
        const trimmed = line.replace(/\s+$/, '');
        return cStatementNeedsSemicolon(trimmed.trim()) ? `${trimmed};` : line;
    }).join('\n');
}

function buildCorrectedCCpp(codeString, lang) {
    const lines = codeString.split(/\r?\n/);
    const step1 = lines.map(fixCommonCCpp).join('\n');
    const step2 = addMissingSemicolons(step1);
    const compilerAvail = !!findCompiler();
    const candidates = [step1, step2].filter(c => c !== codeString);

    if (compilerAvail) {
        for (const c of candidates) {
            const res = compilerCheck(c, lang);
            if (res.available && res.errors.length === 0) return c;
        }
    }
    return candidates.length ? candidates[candidates.length - 1] : null;
}

function analyzeCCpp(codeString, lang) {
    const issues = [];
    const lines = codeString.split(/\r?\n/);
    const compilerAvail = !!findCompiler();

    // 1) Real compiler syntax errors (most reliable when a compiler exists)
    const compileRes = compilerCheck(codeString, lang);
    for (const e of compileRes.errors) {
        if (e.kind === 'error' || e.kind === 'fatal error') {
            issues.push({
                line: e.line,
                col: e.col,
                ruleName: 'Compiler Syntax Error',
                severity: 'HIGH',
                message: e.message,
                snippet: (lines[e.line - 1] || '').trim(),
                suggestedFix: `Fix the error reported by the compiler on line ${e.line}: ${e.message}`
            });
        }
    }

    // 2) Heuristic checks (primary source when no compiler is installed)
    if (!compileRes.available) {
        let depth = 0;
        let badLine = 0;
        for (let i = 0; i < lines.length; i++) {
            for (const ch of lines[i]) {
                if (ch === '{') depth++;
                else if (ch === '}') { depth--; if (depth < 0 && !badLine) { badLine = i + 1; depth = 0; } }
            }
        }
        if (depth !== 0) {
            issues.push({
                line: badLine || 1,
                col: 0,
                ruleName: 'Unbalanced Braces',
                severity: 'HIGH',
                message: 'Opening and closing braces { } do not match — every { needs a matching }.',
                snippet: '{ ... }',
                suggestedFix: 'Count your braces and make sure each "{" has a matching "}".'
            });
        }

        lines.forEach((line, i) => {
            const t = line.trim();
            if (/:\s*$/.test(t) && !/^\s*(case\b|default\s*:)/.test(t) && !/[{}]/.test(line)) {
                issues.push({
                    line: i + 1,
                    col: 0,
                    ruleName: 'Stray Colon',
                    severity: 'MEDIUM',
                    message: 'A ":" at the end of this line looks like Python syntax — this is not valid in C/C++.',
                    snippet: t,
                    suggestedFix: `Remove the ':' — e.g. "${t.replace(/:\s*$/, '')}"`
                });
            }
            const stmt = line.replace(/\s+$/, '').trim();
            if (cStatementNeedsSemicolon(stmt)) {
                issues.push({
                    line: i + 1,
                    col: 0,
                    ruleName: 'Missing Semicolon',
                    severity: 'MEDIUM',
                    message: 'Statements in C/C++ end with a semicolon (";").',
                    snippet: stmt,
                    suggestedFix: `Append ';' — e.g. "${stmt};"`
                });
            }
        });
    }

    // 3) Unsafe function warnings (always)
    lines.forEach((line, i) => {
        if (line.includes('gets(')) {
            issues.push({
                line: i + 1,
                col: 0,
                ruleName: 'Unsafe gets() function',
                severity: 'HIGH',
                message: 'Unsafe gets() is prone to buffer overflows.',
                snippet: line.trim(),
                suggestedFix: 'Use fgets() instead for safe input handling.'
            });
        }
    });

    return {
        totalIssues: issues.length,
        issuesFound: issues,
        correctedCode: buildCorrectedCCpp(codeString, lang),
        engine: compilerAvail ? 'Compiler' : 'Heuristic lint'
    };
}

module.exports = { analyzeCCpp };