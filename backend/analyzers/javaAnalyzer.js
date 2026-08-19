// backend/analyzers/javaAnalyzer.js

function javaNeedsSemicolon(t) {
    if (!t) return false;
    if (t.startsWith('//') || t.startsWith('/*') || t.startsWith('*') || t.startsWith('@')) return false;
    if (/[;{}]\s*$/.test(t)) return false;
    if (/:\s*$/.test(t)) return false; // case / label (handled by the colon check)
    if (/^(if|for|while|switch|catch)\s*\(.*\)\s*$/.test(t)) return false; // control header, body follows
    if (/^(else|do|try|finally)\b/.test(t)) return false;
    if (/^public\s+static\s+void\s+main\s*\(.*\)\s*$/.test(t)) return false; // main header, body follows
    if (/^[\w$.[\]]+\s+[\w$]+\s*(=|;|\[)/.test(t)) return true;        // int x = 5; String name; ...
    if (/^[A-Za-z_$][\w$.\[\]]*\s*=[^=]/.test(t)) return true;         // x = 5
    if (/^[A-Za-z_$][\w$.]*\s*\(.*\)\s*$/.test(t)) return true;        // method call
    if (/^(return|break|continue|throw|yield)\b/.test(t)) return true;
    return false;
}

function analyzeJava(codeString) {
    const issues = [];
    const lines = codeString.split(/\r?\n/);

    // 1) Brace balance
    let depth = 0;
    let badLine = 0;
    for (let i = 0; i < lines.length; i++) {
        for (const ch of lines[i]) {
            if (ch === '{') depth++;
            else if (ch === '}') { depth--; if (depth < 0 && !badLine) { badLine = i + 1; depth = 0; } }
        }
    }
    if (depth !== 0) {
        issues.push({
            line: badLine || 1,
            col: 0,
            ruleName: 'Unbalanced Braces',
            severity: 'HIGH',
            message: 'Opening and closing braces { } do not match — Java blocks must be balanced.',
            snippet: '{ ... }',
            suggestedFix: 'Make sure every "{" has a matching "}".'
        });
    }

    // 2) Stray colon (Python-like) detection
    lines.forEach((line, i) => {
        const t = line.trim();
        if (/:\s*$/.test(t) && !/^\s*(case\b|default\s*:)/.test(t) && !/[{}]/.test(line)) {
            issues.push({
                line: i + 1,
                col: 0,
                ruleName: 'Stray Colon',
                severity: 'MEDIUM',
                message: 'A ":" at the end of this line looks like Python block syntax — this is not valid Java.',
                snippet: t,
                suggestedFix: `Remove the ':' — e.g. "${t.replace(/:\s*$/, '')}"`
            });
        }
    });

    // 3) Missing semicolons
    lines.forEach((line, i) => {
        const stmt = line.replace(/\s+$/, '').trim();
        if (javaNeedsSemicolon(stmt)) {
            issues.push({
                line: i + 1,
                col: 0,
                ruleName: 'Missing Semicolon',
                severity: 'MEDIUM',
                message: 'Statements in Java end with a semicolon (";").',
                snippet: stmt,
                suggestedFix: `Append ';' — e.g. "${stmt};"`
            });
        }
    });

    // 4) Python-style print() calls
    lines.forEach((line, i) => {
        const t = line.trim();
        if (/\bprint\s*\(/.test(t) && !/\.\s*print\s*\(/.test(t)) {
            issues.push({
                line: i + 1,
                col: 0,
                ruleName: 'Use of print()',
                severity: 'MEDIUM',
                message: 'print() is not a Java function — Java uses System.out.println(...).',
                snippet: t,
                suggestedFix: 'Replace print(...) with System.out.println(...).'
            });
        }
    });
// 5) Structural suggestions
    const hasMain = /\bstatic\s+void\s+main\b/.test(codeString);
    const hasClass = /\b(public\s+)?(abstract\s+|final\s+)?class\s+\w+/.test(codeString);
    if (hasMain && !/String\[\s*\]\s*args|String\s+\.\.\.\s*args/.test(codeString)) {
        issues.push({
            line: 1,
            col: 0,
            ruleName: 'main() Signature',
            severity: 'HIGH',
            message: 'A Java main method must be: public static void main(String[] args).',
            snippet: 'static void main(...)',
            suggestedFix: 'Use the full signature: public static void main(String[] args).'
        });
    }
    if (!hasClass && /System\.out|public\s+static/.test(codeString)) {
        issues.push({
            line: 1,
            col: 0,
            ruleName: 'Missing Class Wrapper',
            severity: 'LOW',
            message: 'Java code should live inside a class. Files with a public class must match the file name.',
            snippet: '',
            suggestedFix: 'Wrap your code in e.g. "public class Main { ... }".'
        });
    }

    // 6) Build the corrected program
    const correctedLines = lines.map(line => {
        let out = line.replace(/\s+$/, '');
        const t = out.trim();
        if (!t || t.startsWith('//') || t.startsWith('/*') || t.startsWith('*')) return out;

        const noComment = t.split('//')[0].replace(/\s+$/, '');
        if (noComment.endsWith(':') && !/^\s*(case\b|default\s*:)/.test(out) && !/[{}]/.test(out)) {
            out = out.replace(/:\s*$/, '');
        }
        if (/\bprint\s*\(/.test(out) && !/\.\s*print\s*\(/.test(out)) {
            out = out.replace(/\bprint\s*\(/g, 'System.out.println(');
        }
        if (javaNeedsSemicolon(out.trim())) out += ';';
        return out;
    }).join('\n');

    const correctedCode = (correctedLines !== codeString) ? correctedLines : null;

    return {
        totalIssues: issues.length,
        issuesFound: issues,
        correctedCode,
        engine: 'Heuristic lint'
    };
}

module.exports = { analyzeJava };