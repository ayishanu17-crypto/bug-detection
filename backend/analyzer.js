// analyzer.js (Main Entry Point)
const { analyzeJavaScript } = require('./analyzers/jsAnalyzer');
const { analyzePython } = require('./analyzers/pyAnalyzer');
const { analyzeCCpp } = require('./analyzers/ccppAnalyzer');
const { analyzeJava } = require('./analyzers/javaAnalyzer');

function analyzeSourceCode(codeString, language = 'javascript') {
    switch (language.toLowerCase()) {
        case 'python':
            return analyzePython(codeString);
        case 'c':
        case 'cpp':
        case 'ccpp':
            return analyzeCCpp(codeString, language);
        case 'java':
            return analyzeJava(codeString);
        case 'javascript':
        default:
            return analyzeJavaScript(codeString);
    }
}

module.exports = { analyzeSourceCode };