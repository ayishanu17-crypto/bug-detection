const acorn = require('acorn');
const walk = require('acorn-walk');

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

    // Use acorn-walk simple visitor
    walk.simple(ast, {
        CallExpression(node) {
            // Rule 1: eval() usage
            if (node.callee && node.callee.name === 'eval') {
                issues.push({
                    line: node.loc.start.line,
                    ruleName: 'Use of eval()',
                    severity: 'HIGH',
                    message: 'Avoid using eval() due to security risks.',
                    snippet: 'eval(...)',
                    suggestedFix: 'Refactor code to avoid dynamic evaluation completely.'
                });
            }
        },

        VariableDeclaration(node) {
            // Rule 2: var declaration
            if (node.kind === 'var') {
                issues.push({
                    line: node.loc.start.line,
                    ruleName: 'Use of var',
                    severity: 'MEDIUM',
                    message: 'Prefer using "let" or "const" instead of legacy "var".',
                    snippet: 'var ...',
                    suggestedFix: 'Replace "var" with "let" or "const".'
                });
            }
        },

        BlockStatement(node) {
            // Rule 3: Empty block statement (ignoring function bodies if needed, but keeping your base logic)
            if (node.body.length === 0) {
                issues.push({
                    line: node.loc.start.line,
                    ruleName: 'Empty Block Statement',
                    severity: 'LOW',
                    message: 'Empty code block detected.',
                    snippet: '{}',
                    suggestedFix: 'Add implementation logic or remove the empty block.'
                });
            }
        }
    });

    return {
        totalIssues: issues.length,
        issuesFound: issues
    };
}

module.exports = { analyzeSourceCode };