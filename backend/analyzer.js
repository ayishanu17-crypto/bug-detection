// analyzer.js (Main Entry Point)
const { analyzeJavaScript } = require('./analyzers/jsAnalyzer');
const { analyzePython } = require('./analyzers/pyAnalyzer');
const { analyzeCCpp } = require('./analyzers/ccppAnalyzer');
const { analyzeJava } = require('./analyzers/javaAnalyzer');

function analyzeSourceCode(codeString, language = 'javascript', options = {}) {
    switch (language.toLowerCase()) {
        case 'python':
            return analyzePython(codeString, options);
        case 'c':
        case 'cpp':
        case 'ccpp':
            return analyzeCCpp(codeString, language, options);
        case 'java':
            return analyzeJava(codeString, options);
        case 'javascript':
        default:
            return analyzeJavaScript(codeString, options);
    }
}

module.exports = { analyzeSourceCode };