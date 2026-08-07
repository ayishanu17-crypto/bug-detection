// backend/analyzers/ccppAnalyzer.js
function analyzeCCpp(codeString, lang) {
    const issues = [];
    const lines = codeString.split('\n');

    lines.forEach((line, index) => {
        const lineNumber = index + 1;
        const trimmed = line.trim();

        if (trimmed.includes('gets(')) {
            issues.push({
                line: lineNumber,
                ruleName: 'Unsafe gets() function',
                severity: 'HIGH',
                message: 'Unsafe gets() is prone to buffer overflows.',
                snippet: trimmed,
                suggestedFix: 'Use fgets() instead for safe input handling.'
            });
        }
    });

    return {
        totalIssues: issues.length,
        issuesFound: issues
    };
}

module.exports = { analyzeCCpp };