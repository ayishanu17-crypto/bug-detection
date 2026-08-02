const acorn = require('acorn');

function analyzeSourceCode(codeString) {
    const issues = [];
    let ast;

    try {
        ast = acorn.parse(codeString, { 
            ecmaVersion: 2020, 
            locations: true, 
            sourceType: 'script'
        });
    } catch (parseError) {
        return {
            totalIssues: 1,
            issuesFound: [
                {
                    line: parseError.loc ? parseError.loc.line : 1,
                    ruleName: 'Syntax Error',
                    severity: 'HIGH',
                    message: parseError.message,
                    snippet: 'Check syntax near this line.',
                    suggestedFix: 'Fix syntax error before analyzing further.'
                }
            ]
        };
    }

    function walk(node) {
        if (!node || typeof node !== 'object') return;

        // Rule 1: eval() usage
        if (node.type === 'CallExpression' && node.callee && node.callee.name === 'eval') {
            issues.push({
                line: node.loc.start.line,
                ruleName: 'Use of eval()',
                severity: 'HIGH',
                message: 'Avoid using eval() due to security risks.',
                snippet: `eval(...)`,
                suggestedFix: 'Refactor code to avoid dynamic evaluation completely.'
            });
        }

        // Rule 2: var declaration
        if (node.type === 'VariableDeclaration' && node.kind === 'var') {
            issues.push({
                line: node.loc.start.line,
                ruleName: 'Use of var',
                severity: 'MEDIUM',
                message: 'Prefer using "let" or "const" instead of legacy "var".',
                snippet: `var ...`,
                suggestedFix: 'Replace "var" with "let" or "const".'
            });
        }

        // Rule 3: Empty block statement
        if (node.type === 'BlockStatement' && node.body.length === 0) {
            issues.push({
                line: node.loc.start.line,
                ruleName: 'Empty Block Statement',
                severity: 'LOW',
                message: 'Empty code block detected.',
                snippet: `{}`,
                suggestedFix: 'Add implementation logic or remove the empty block.'
            });
        }

        for (const key in node) {
            if (node[key] && typeof node[key] === 'object') {
                if (Array.isArray(node[key])) {
                    node[key].forEach(child => walk(child));
                } else {
                    walk(node[key]);
                }
            }
        }
    }

    walk(ast);

    return {
        totalIssues: issues.length,
        issuesFound: issues
    };
}

module.exports = { analyzeSourceCode };