const acorn = require('acorn');

function analyzeSourceCode(codeString) {
    const issues = [];

    let ast;
    try {
        // Parse the code into an Abstract Syntax Tree
        ast = acorn.parse(codeString, { 
            ecmaVersion: 2020, 
            locations: true, // Enables line and column tracking
            sourceType: 'script'
        });
    } catch (parseError) {
        // If the code has syntax errors, catch them as HIGH severity bugs
        return {
            totalIssues: 1,
            issuesFound: [
                {
                    line: parseError.loc ? parseError.loc.line : 1,
                    ruleName: 'Syntax Error',
                    severity: 'HIGH',
                    message: parseError.message,
                    snippet: 'Check syntax near this line.'
                }
            ]
        };
    }

    // Recursive function to walk through the AST nodes
    function walk(node) {
        if (!node || typeof node !== 'object') return;

        // Rule 1: Detect explicit usage of eval()
        if (
            node.type === 'CallExpression' &&
            node.callee &&
            node.callee.name === 'eval'
        ) {
            issues.push({
                line: node.loc.start.line,
                ruleName: 'Use of eval()',
                severity: 'HIGH',
                message: 'Avoid using eval() as it introduces severe security vulnerabilities.',
                snippet: `Line ${node.loc.start.line}: eval(...) call detected.`
            });
        }

        // Rule 2: Detect var declarations (discouraged in modern JS)
        if (node.type === 'VariableDeclaration' && node.kind === 'var') {
            issues.push({
                line: node.loc.start.line,
                ruleName: 'Use of var',
                severity: 'MEDIUM',
                message: 'Prefer using "let" or "const" instead of legacy "var".',
                snippet: `Line ${node.loc.start.line}: var declaration used.`
            });
        }

        // Rule 3: Detect empty blocks (e.g., empty if statements or loops)
        if (node.type === 'BlockStatement' && node.body.length === 0) {
            issues.push({
                line: node.loc.start.line,
                ruleName: 'Empty Block Statement',
                severity: 'LOW',
                message: 'Empty code block detected. Remove or implement logic.',
                snippet: `Line ${node.loc.start.line}: {}`
            });
        }

        // Traverse child nodes
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