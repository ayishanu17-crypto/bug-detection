// analyzers/jsAnalyzer.js
const acorn = require('acorn');
const walk = require('acorn-walk');

function tryParseJavaScript(codeString) {
    try {
        const ast = acorn.parse(codeString, { ecmaVersion: 2022, locations: true, sourceType: 'script' });
        return { ast, error: null };
    } catch (error) {
        return { ast: null, error };
    }
}

// Attempt to build a corrected program from a failed parse.
function repairJavaScript(codeString, parseError) {
    const lines = codeString.split(/\r?\n/);
    const errLine = (parseError.loc && parseError.loc.line) ? parseError.loc.line - 1 : 0;
    const errCol = (parseError.loc && typeof parseError.loc.column === 'number') ? parseError.loc.column : 0;
    const candidates = [];

    // 1) Remove the stray character at the reported position (`a=10:` -> `a=10`)
    if (lines[errLine] && lines[errLine][errCol] === ':') {
        const copy = lines.slice();
        copy[errLine] = lines[errLine].slice(0, errCol) + lines[errLine].slice(errCol + 1);
        candidates.push(copy.join('\n'));
    }

    // 2) Drop a trailing colon on the failing line
    if (lines[errLine] && lines[errLine].trim().endsWith(':') && !/[{}]/.test(lines[errLine])) {
        const copy = lines.slice();
        copy[errLine] = lines[errLine].replace(/:\s*$/, '');
        candidates.push(copy.join('\n'));
    }

    // 3) Finally try removing a trailing colon on any line
    lines.forEach((line, i) => {
        const t = line.trim();
        if (t.endsWith(':') && !/[{}]/.test(line) && !/^\s*(case\b|default\s*:)/.test(line)) {
            const copy = lines.slice();
            copy[i] = line.replace(/:\s*$/, '');
            candidates.push(copy.join('\n'));
        }
    });

    for (const candidate of candidates) {
        if (!tryParseJavaScript(candidate).error) return candidate;
    }
    return null;
}

function analyzeJavaScript(codeString) {
    const issues = [];
    let workingCode = codeString;
    let changed = false;

    let { ast, error } = tryParseJavaScript(codeString);

    if (error) {
        const repaired = repairJavaScript(codeString, error);
        if (repaired) {
            workingCode = repaired;
            changed = true;
            const sourceLines = codeString.split(/\r?\n/);
            const lineText = (sourceLines[((error.loc && error.loc.line) || 1) - 1] || '').trim();
            issues.push({
                line: (error.loc && error.loc.line) || 1,
                col: (error.loc && typeof error.loc.column === 'number') ? error.loc.column : 0,
                ruleName: 'Syntax Error (auto-fixed)',
                severity: 'HIGH',
                message: `${error.message} — a corrected program was generated automatically.`,
                snippet: lineText || 'Around the reported line.',
                suggestedFix: workingCode
            });
            ({ ast } = tryParseJavaScript(workingCode));
        } else {
            issues.push({
                line: (error.loc && error.loc.line) || 1,
                col: (error.loc && typeof error.loc.column === 'number') ? error.loc.column : 0,
                ruleName: 'Syntax Error',
                severity: 'HIGH',
                message: error.message,
                snippet: 'Check the code near this line.',
                suggestedFix: 'Fix the reported syntax error, then scan again to receive a corrected program.'
            });
            return {
                totalIssues: issues.length,
                issuesFound: issues,
                correctedCode: null,
                engine: 'Acorn AST'
            };
        }
    }

    if (ast) {
        walk.simple(ast, {
            CallExpression(node) {
                const locLine = node.loc ? node.loc.start.line : 1;
                const locCol = node.loc ? node.loc.start.column : 0;
                const name = node.callee && node.callee.type === 'Identifier' ? node.callee.name : null;
                if (name === 'eval') {
                    issues.push({
                        line: locLine,
                        col: locCol,
                        ruleName: 'Use of eval()',
                        severity: 'HIGH',
                        message: 'Avoid using eval() due to security risks.',
                        snippet: 'eval(...)',
                        suggestedFix: 'Refactor the code to avoid dynamic evaluation completely.'
                    });
                } else if (name === 'print') {
                    issues.push({
                        line: locLine,
                        col: locCol,
                        ruleName: 'Use of print()',
                        severity: 'MEDIUM',
                        message: 'print() is not a built-in JavaScript function — use console.log() instead.',
                        snippet: 'print(...)',
                        suggestedFix: 'Replace print(...) with console.log(...).'
                    });
                }
            },
            VariableDeclaration(node) {
                if (node.kind === 'var') {
                    issues.push({
                        line: node.loc.start.line,
                        col: node.loc.start.column,
                        ruleName: 'Use of var',
                        severity: 'MEDIUM',
                        message: 'Prefer using "let" or "const" instead of legacy "var".',
                        snippet: 'var ...',
                        suggestedFix: 'Replace "var" with "let" or "const".'
                    });
                }
            },
            BlockStatement(node) {
                if (node.body.length === 0) {
                    issues.push({
                        line: node.loc.start.line,
                        col: node.loc.start.column,
                        ruleName: 'Empty Block Statement',
                        severity: 'LOW',
                        message: 'Empty code block detected.',
                        snippet: '{}',
                        suggestedFix: 'Add implementation logic or remove the empty block.'
                    });
                }
            }
        });
    }

    // Only emit a corrected program when one was actually generated.
    let correctedCode = null;
    const hasPrintFix = issues.some(i => i.ruleName === 'Use of print()') && /\bprint\s*\(/.test(workingCode);
    if (changed || hasPrintFix) {
        let candidate = workingCode;
        if (hasPrintFix) candidate = candidate.replace(/\bprint\s*\(/g, 'console.log(');
        if (candidate !== codeString && !tryParseJavaScript(candidate).error) correctedCode = candidate;
    }

    return {
        totalIssues: issues.length,
        issuesFound: issues,
        correctedCode,
        engine: 'Acorn AST'
    };
}

module.exports = { analyzeJavaScript };