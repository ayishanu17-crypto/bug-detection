const fs = require('fs');

const rules = [
    {
        name: 'Use of eval()',
        pattern: /\beval\s*\(/,
        severity: 'HIGH',
        message: 'Avoid using eval() as it introduces severe code injection vulnerabilities.'
    },
    {
        name: 'Use of var',
        pattern: /\bvar\s+/,
        severity: 'MEDIUM',
        message: 'Prefer using "let" or "const" instead of legacy "var" for block scoping.'
    },
    {
        name: 'Console statement in code',
        pattern: /console\.log\s*\(/,
        severity: 'LOW',
        message: 'Remove debugging console statements before production deployment.'
    }
];

function analyzeSourceCode(codeString) {
    const lines = codeString.split('\n');
    const issues = [];

    lines.forEach((line, index) => {
        const lineNumber = index + 1;
        rules.forEach(rule => {
            if (rule.pattern.test(line)) {
                issues.push({
                    line: lineNumber,
                    ruleName: rule.name,
                    severity: rule.severity,
                    message: rule.message,
                    snippet: line.trim()
                });
            }
        });
    });

    return {
        totalIssues: issues.length,
        issuesFound: issues
    };
}

module.exports = { analyzeSourceCode };