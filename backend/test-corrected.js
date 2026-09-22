// Temporary: verify correctedCode generation for JS semantic issues.
const { analyzeJavaScript } = require('./analyzers/jsAnalyzer');

const cases = [
  { label: 'assignment in condition', code: 'if (x = 5) {\n  alert("five");\n}' },
  { label: 'non-strict equality', code: 'const a = 1;\nconst b = 2;\nif (a == b) {\n  console.log(a);\n}' },
  { label: 'print + var', code: 'var total = 0;\nprint(total);' },
  { label: 'console.log only', code: 'console.log("hi");' },
  { label: 'syntax error repair', code: 'const x = 5\nif (x == 6) { console.log(x) }' },
  { label: 'combined', code: 'var y = 2;\nif(y = 3) {\n  print("y is now three");\n  alert(y == 3);\n}' }
];

for (const c of cases) {
  const r = analyzeJavaScript(c.code, { undefinedVars: true, noConsole: true, strictComparisons: true, noEval: true, noUnusedVars: true });
  console.log('\n=== ' + c.label + ' ===  issues:', r.totalIssues);
  console.log('correctedCode:', JSON.stringify(r.correctedCode));
}