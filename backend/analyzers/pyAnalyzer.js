// analyzers/pyAnalyzer.js
function analyzePython(codeString) {
    const issues = [];
    const lines = codeString.split('\n');

    lines.forEach((line, index) => {
        const lineNumber = index + 1;
        const trimmed = line.trim();

        if (/^print\s+[^\(]/.test(trimmed)) {
            issues.push({
                line: lineNumber,
                ruleName: 'Python 2 Print Syntax',
                severity: 'MEDIUM',
                message: 'Python 2 style print statement detected.',
                snippet: trimmed,
                suggestedFix: 'Use Python 3 print function: print(...)'
            });
        }

        if (trimmed.includes('eval(')) {
            issues.push({
                line: lineNumber,
                ruleName: 'Use of eval()',
                severity: 'HIGH',
                message: 'Use of eval() poses security risks.',
                snippet: 'eval(...)',
                suggestedFix: 'Avoid dynamic code execution.'
            });
        }
    });

    return {
        totalIssues: issues.length,
        issuesFound: issues
    };
}

module.exports = { analyzePython };