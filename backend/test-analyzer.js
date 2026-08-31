// backend/test-analyzer.js
// Quick smoke-test for the bug-detector analyzers.
// Run with:  node test-analyzer.js
const { analyzeSourceCode } = require('./analyzer');

const CASES = [
  {
    label: 'JS: undefined variable + assignment-in-condition + console.log',
    language: 'javascript',
    code: `
function sum(a, b) {
  return a + b;
}
const total = sum(1, 2);
console.log(total);
if (x = 5) {
  alert("five");
}
`
  },
  {
    label: 'JS: non-strict equality + unused variable',
    language: 'javascript',
    code: `
const unused = 42;
function check(value) {
  var result;
  return value == 42;
}
`
  },
  {
    label: 'JS: ES module code (previously impossible to parse on the analyzer)',
    language: 'javascript',
    code: `
import { helper } from './helpers';
export const VERSION = '1.2.0';
export function run() {
  return helper() + missingName;
}
`
  },
  {
    label: 'JS: duplicate object key',
    language: 'javascript',
    code: `
const config = { port: 3000, port: 8080 };
startServer(config);
`
  },
  {
    label: 'Python: print without parentheses + eval',
    language: 'python',
    code: `
print "hello"
eval("os.system('rm -rf /')")
`
  },
  {
    label: 'Java: missing semicolon',
    language: 'java',
    code: `
public class Main {
  public static void main(String[] args) {
    int x = 5
    System.out.println(x);
  }
}
`
  }
];

let failures = 0;
for (const c of CASES) {
  console.log('\n=== ' + c.label + ' ===');
  const report = analyzeSourceCode(c.code, c.language);
  console.log('engine: ' + report.engine + '  totalIssues: ' + report.totalIssues);
  for (const issue of report.issuesFound) {
    console.log('  [' + issue.severity.padEnd(6) + '] L' + (issue.line || 1) + '  ' + issue.ruleName + ' — ' + issue.message);
  }
  if (report.correctedCode) {
    console.log('  (corrected program generated)');
  }
  if (!Array.isArray(report.issuesFound)) {
    console.error('  FAIL: issuesFound is not an array');
    failures++;
  }
}

console.log('\n' + (failures === 0 ? '✅ Smoke test passed — all analyzers returned structured reports.' : `❌ ${failures} failures.`));
process.exit(failures === 0 ? 0 : 1);