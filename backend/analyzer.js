// analyzer.js (Main Entry Point)
const { analyzeJavaScript } = require('./analyzers/jsAnalyzer');
const { analyzePython } = require('./analyzers/pyAnalyzer');

function analyzeSourceCode(codeString, language = 'javascript') {
    switch (language.toLowerCase()) {
        case 'python':
            return analyzePython(codeString);
        case 'c':
        case 'cpp':
            // You can build a cCppAnalyzer.js file later and route it here
            return {
                totalIssues: 0,
                issuesFound: [{ line: 1, ruleName: 'Not Implemented', severity: 'LOW', message: 'C/C++ analysis coming soon.', snippet: '', suggestedFix: 'Stay tuned.' }]
            };
        case 'javascript':
        default:
            return analyzeJavaScript(codeString);
    }
}

module.exports = { analyzeSourceCode };