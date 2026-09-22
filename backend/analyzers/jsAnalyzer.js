// analyzers/jsAnalyzer.js
const acorn = require('acorn');
const walk = require('acorn-walk');

function tryParseJavaScript(codeString) {
    // Prefer ES module mode (supports import/export), then fall back to script
    // mode so CommonJS-style snippets still parse. This lets the analyzer
    // actually inspect modern JS instead of reporting a bogus "Syntax Error".
    try {
        const ast = acorn.parse(codeString, { ecmaVersion: 2022, locations: true, sourceType: 'module' });
        return { ast, error: null };
    } catch (moduleError) {
        try {
            const ast = acorn.parse(codeString, { ecmaVersion: 2022, locations: true, sourceType: 'script' });
            return { ast, error: null };
        } catch (scriptError) {
            return { ast: null, error: moduleError || scriptError };
        }
    }
}

// Attempt to build a corrected program from a failed parse.
function repairJavaScript(codeString, parseError) {
    const lines = codeString.split(/\r?\n/);
    const errLine = (parseError.loc && parseError.loc.line) ? parseError.loc.line - 1 : 0;
    const errCol = (parseError.loc && typeof parseError.loc.column === 'number') ? parseError.loc.column : 0;
    const candidates = [];

    // 1) Remove the stray character at the reported position (`a=10:` -> `a=10`)
    if (lines[errLine] && lines[errLine][errCol] === ':') {
        const copy = lines.slice();
        copy[errLine] = lines[errLine].slice(0, errCol) + lines[errLine].slice(errCol + 1);
        candidates.push(copy.join('\n'));
    }

    // 2) Drop a trailing colon on the failing line
    if (lines[errLine] && lines[errLine].trim().endsWith(':') && !/[{}]/.test(lines[errLine])) {
        const copy = lines.slice();
        copy[errLine] = lines[errLine].replace(/:\s*$/, '');
        candidates.push(copy.join('\n'));
    }

    // 3) Finally try removing a trailing colon on any line
    lines.forEach((line, i) => {
        const t = line.trim();
        if (t.endsWith(':') && !/[{}]/.test(line) && !/^\s*(case\b|default\s*:)/.test(line)) {
            const copy = lines.slice();
            copy[i] = line.replace(/:\s*$/, '');
            candidates.push(copy.join('\n'));
        }
    });

    for (const candidate of candidates) {
        if (!tryParseJavaScript(candidate).error) return candidate;
    }
    return null;
}

// Report EVERY syntax error, not just the first one. Acorn itself only raises
// the first error it hits, so we "mask" (blank out) each failing line and
// re-parse to uncover the errors that follow it. Blank lines are always valid
// at statement level in JS ({ } blocks may legally be empty), so this is safe.
function collectSyntaxErrors(codeString) {
    const errors = [];
    let working = codeString;
    const seen = new Set();         // (line|col|message) dedupe
    const maskedLines = new Set();  // lines already blanked
    for (let pass = 0; pass < 100; pass++) {
        const { error } = tryParseJavaScript(working);
        if (!error) break;
        const line = (error.loc && error.loc.line) || 1;
        const col = (error.loc && typeof error.loc.column === 'number') ? error.loc.column : 0;
        const key = line + '|' + col + '|' + error.message;
        if (seen.has(key) || maskedLines.has(line)) break; // no progress / cascade
        seen.add(key);
        errors.push({ line, col, message: error.message });
        const ls = working.split(/\r?\n/);
        const idx = line - 1;
        if (idx < 0 || idx >= ls.length) break;
        const last = errors[errors.length - 1];
        if (last && col === 0 && last.message === error.message) break; // cascade
        maskedLines.add(line);
        ls[idx] = '';
        const next = ls.join('\n');
        if (next === working) break;
        working = next;
    }
    return errors;
}

// Repair multiple syntax errors at once. The single-pass repairJavaScript()
// only ever fixes one error, so when several lines are broken it gives up and
// produces nothing. This wraps it in a loop: after each single-error repair (or,
// as a fallback, blanking the offending line) it re-parses and keeps going until
// the whole program is valid.
function repairAllJavaScript(codeString) {
    let current = codeString;
    const maskedLines = new Set();
    let lastKey = null;
    for (let i = 0; i < 100; i++) {
        const { error } = tryParseJavaScript(current);
        if (!error) return { code: current, fixed: true };
        const line = (error.loc && error.loc.line) || 1;
        const col = (error.loc && typeof error.loc.column === 'number') ? error.loc.column : 0;
        const key = line + '|' + col + '|' + error.message;
        if (key === lastKey) return { code: current, fixed: false }; // stuck
        lastKey = key;
        const repaired = repairJavaScript(current, error);
        if (repaired) { current = repaired; continue; }
        const ls = current.split(/\r?\n/);
        const idx = line - 1;
        if (idx < 0 || idx >= ls.length) break;
        if (maskedLines.has(line)) break;
        maskedLines.add(line);
        ls[idx] = '';
        current = ls.join('\n');
    }
    const final = tryParseJavaScript(current);
    return { code: current, fixed: !final.error };
}


// Build a corrected program by applying SAFE, mechanical fixes for the semantic
// issues the analyzer reported (syntax repairs are handled by repairAllJavaScript
// above). Edits are derived from the AST so string literals and comments are
// never touched, and the output is validated with a full re-parse before being
// presented to the user — invalid code is never shown as "fixed".
function buildCorrectedJavaScript(codeString, issues) {
    if (!codeString || !codeString.trim()) return null;
    const { ast } = tryParseJavaScript(codeString);
    if (!ast) return null;

    // (line, col) -> character offset, using the same 0-based columns Acorn uses.
    const lineStarts = [0];
    for (let i = 0; i < codeString.length; i++) {
        if (codeString[i] === '\n') lineStarts.push(i + 1);
    }
    const offsetOf = (loc) => {
        if (!loc || !loc.line || loc.line < 1 || loc.line > lineStarts.length) return 0;
        return lineStarts[loc.line - 1] + (loc.column || 0);
    };

    const edits = []; // { start, end, text }, applied from the end of the file backwards
    const hasRule = (name) => issues.some((i) => i.ruleName === name);

    // 1) Python-style print(...) -> console.log(...)
    if (hasRule('Use of print()')) {
        walk.simple(ast, {
            CallExpression(node) {
                const callee = node.callee;
                if (callee && callee.type === 'Identifier' && callee.name === 'print') {
                    edits.push({
                        start: offsetOf(callee.loc.start),
                        end: offsetOf(callee.loc.end),
                        text: 'console.log'
                    });
                }
            }
        });
    }

    // 2) `if (x = 5)` style bugs — assignment used as a condition -> comparison.
    if (hasRule('Assignment in Condition')) {
        const fixTest = (stmt) => {
            const test = stmt.test;
            if (test && test.type === 'AssignmentExpression' && test.operator === '=') {
                edits.push({
                    start: offsetOf(test.left.loc.end),
                    end: offsetOf(test.right.loc.start),
                    text: ' === '
                });
            }
        };
        walk.simple(ast, {
            IfStatement: fixTest,
            WhileStatement: fixTest,
            DoWhileStatement: fixTest
        });
    }

    // 3) Non-strict equality: == -> === and != -> !==
    if (issues.some((i) => i.ruleName && i.ruleName.startsWith('Non-strict equality'))) {
        walk.simple(ast, {
            BinaryExpression(node) {
                if (node.operator === '==' || node.operator === '!=') {
                    edits.push({
                        start: offsetOf(node.left.loc.end),
                        end: offsetOf(node.right.loc.start),
                        text: node.operator === '==' ? ' === ' : ' !== '
                    });
                }
            }
        });
    }

    // 4) Legacy `var` declarations -> `let`
    if (hasRule('Use of var')) {
        walk.simple(ast, {
            VariableDeclaration(node) {
                if (node.kind === 'var') {
                    const start = offsetOf(node.loc.start);
                    edits.push({ start, end: start + 3, text: 'let' });
                }
            }
        });
    }

    if (!edits.length) return null;

    edits.sort((a, b) => b.start - a.start);
    let candidate = codeString;
    for (const e of edits) {
        if (e.start < 0 || e.end < e.start || e.end > candidate.length) return null;
        candidate = candidate.slice(0, e.start) + e.text + candidate.slice(e.end);
    }

    if (candidate === codeString) return null;
    if (tryParseJavaScript(candidate).error) return null; // never present invalid code as "fixed"
    return candidate;
}


// ---------------------------------------------------------------------------
// Rule configuration — mirrors the frontend "Configure Rules" panel
// ---------------------------------------------------------------------------
const DEFAULT_RULES = {
    noEval: true,             // ban eval()
    noConsole: true,          // ban console.* calls
    strictComparisons: true,  // ban == and !=
    noUnusedVars: true,       // report declared-but-never-used names
    undefinedVars: true       // report references to undeclared names (typos / missing imports)
};

function normalizeRules(options) {
    const input = (options && typeof options === 'object') ? options : {};
    const rules = {};
    for (const key of Object.keys(DEFAULT_RULES)) {
        rules[key] = input[key] === undefined ? DEFAULT_RULES[key] : !!input[key];
    }
    return rules;
}

// ---------------------------------------------------------------------------
// Scope-aware analysis (acorn-walk) -> "Undefined Variable" / "Unused Variable"
// ---------------------------------------------------------------------------
const GLOBAL_NAMES = new Set([
    // ECMAScript built-ins
    'Array', 'Object', 'String', 'Number', 'Boolean', 'Symbol', 'BigInt', 'Function',
    'Math', 'JSON', 'Date', 'RegExp', 'Promise', 'Set', 'Map', 'WeakSet', 'WeakMap',
    'Proxy', 'Reflect', 'Error', 'TypeError', 'RangeError', 'ReferenceError',
    'SyntaxError', 'EvalError', 'AggregateError', 'URIError', 'Intl', 'ArrayBuffer',
    'DataView', 'SharedArrayBuffer', 'Atomics', 'WeakRef', 'FinalizationRegistry',
    'Uint8Array', 'Uint8ClampedArray', 'Uint16Array', 'Uint32Array', 'Int8Array',
    'Int16Array', 'Int32Array', 'Float32Array', 'Float64Array', 'BigInt64Array',
    'BigUint64Array', 'eval', 'arguments', 'undefined', 'NaN', 'Infinity', 'isFinite',
    'isNaN', 'parseFloat', 'parseInt', 'decodeURI', 'encodeURI',
    'decodeURIComponent', 'encodeURIComponent', 'globalThis',
    // Browser / DOM
    'window', 'self', 'top', 'parent', 'frames', 'document', 'navigator', 'location',
    'history', 'screen', 'localStorage', 'sessionStorage', 'indexedDB', 'alert',
    'confirm', 'prompt', 'fetch', 'XMLHttpRequest', 'WebSocket', 'EventSource',
    'URL', 'URLSearchParams', 'Blob', 'File', 'FileReader', 'FormData', 'Headers',
    'Request', 'Response', 'AbortController', 'AbortSignal', 'Image', 'Audio',
    'Element', 'HTMLElement', 'HTMLInputElement', 'HTMLButtonElement', 'Node',
    'NodeList', 'Document', 'Event', 'CustomEvent', 'KeyboardEvent', 'MouseEvent',
    'PointerEvent', 'MutationObserver', 'IntersectionObserver', 'ResizeObserver',
    'requestAnimationFrame', 'cancelAnimationFrame', 'queueMicrotask',
    'TextEncoder', 'TextDecoder', 'performance', 'crypto', 'atob', 'btoa',
    'structuredClone', 'console', 'event',
    // Node.js
    'require', 'module', 'exports', 'process', 'Buffer', '__dirname', '__filename',
    'global', 'setTimeout', 'setInterval', 'setImmediate', 'clearTimeout',
    'clearInterval', 'clearImmediate',
    // Common global libs / framework globals
    '_', '$', 'jQuery', 'React', 'ReactDOM', 'Vue', 'vue', 'angular', 'moment',
    'lodash', 'axios', 'd3', 'THREE', 'io', 'Backbone', 'swal', 'toastr', 'Noty',
    'define', 'requirejs',
    // Test-framework globals (Jest / Mocha / Jasmine / Vitest / Node's assert)
    'describe', 'it', 'test', 'expect', 'beforeEach', 'afterEach', 'beforeAll',
    'afterAll', 'jest', 'vi', 'suite', 'specify', 'setup', 'teardown', 'should',
    'assert', 'sinon', 'chai'
]);

function collectPatternNames(pattern, set) {
    if (!pattern) return set;
    switch (pattern.type) {
        case 'Identifier':
            set.add(pattern.name);
            break;
        case 'ObjectPattern':
            for (const prop of pattern.properties) {
                if (!prop) continue;
                if (prop.type === 'RestElement') collectPatternNames(prop.argument, set);
                else collectPatternNames(prop.value, set);
            }
            break;
        case 'ArrayPattern':
            for (const el of pattern.elements) if (el) collectPatternNames(el, set);
            break;
        case 'AssignmentPattern':
            collectPatternNames(pattern.left, set);
            break;
        case 'RestElement':
            collectPatternNames(pattern.argument, set);
            break;
    }
    return set;
}
function collectPatternLocations(pattern, fallbackLoc, map) {
    if (!pattern) return;
    const loc = (pattern.loc && pattern.loc.start) || fallbackLoc || { line: 1, col: 0 };
    switch (pattern.type) {
        case 'Identifier':
            if (!map.has(pattern.name)) map.set(pattern.name, { line: loc.line, col: loc.col });
            break;
        case 'ObjectPattern':
            for (const prop of pattern.properties) {
                if (!prop) continue;
                if (prop.type === 'RestElement') collectPatternLocations(prop.argument, loc, map);
                else collectPatternLocations(prop.value, loc, map);
            }
            break;
        case 'ArrayPattern':
            for (const el of pattern.elements) if (el) collectPatternLocations(el, loc, map);
            break;
        case 'AssignmentPattern':
            collectPatternLocations(pattern.left, loc, map);
            break;
        case 'RestElement':
            collectPatternLocations(pattern.argument, loc, map);
            break;
    }
}

// Decide whether an Identifier occurrence is a declaration bit, a property key,
// a label, or part of a destructuring pattern — i.e. NOT a variable reference.
function isNotReference(node, parent, ancestors) {
    for (const a of ancestors) {
        if (a.type === 'ObjectPattern' || a.type === 'ArrayPattern') return true;
        if (a.type === 'AssignmentPattern' && a.left === node) return true;
    }
    if (!parent) return true;
    if (parent.type === 'VariableDeclarator' && parent.id === node) return true;
    if ((parent.type === 'FunctionDeclaration' || parent.type === 'FunctionExpression') && parent.id === node) return true;
    if ((parent.type === 'ClassDeclaration' || parent.type === 'ClassExpression') && parent.id === node) return true;
    if ((parent.type === 'FunctionDeclaration' || parent.type === 'FunctionExpression' || parent.type === 'ArrowFunctionExpression') &&
        Array.isArray(parent.params) && parent.params.includes(node)) return true;
    if (parent.type === 'CatchClause' && parent.param === node) return true;
    if ((parent.type === 'ForInStatement' || parent.type === 'ForOfStatement') && parent.left === node) return true;
    if ((parent.type === 'ImportSpecifier' || parent.type === 'ImportDefaultSpecifier' || parent.type === 'ImportNamespaceSpecifier') && parent.local === node) return true;
    if (parent.type === 'ExportSpecifier' && parent.local === node) return true;
    if (parent.type === 'MemberExpression' && parent.property === node && !parent.computed) return true;
    if (parent.type === 'Property' && parent.key === node && !parent.computed) return !parent.shorthand || parent.method;
    if ((parent.type === 'MethodDefinition' || parent.type === 'PropertyDefinition') && parent.key === node && !parent.computed) return true;
    if (parent.type === 'LabeledStatement' && parent.label === node) return true;
    if ((parent.type === 'BreakStatement' || parent.type === 'ContinueStatement') && parent.label === node) return true;
    return false;
}
function collectScopeInfo(ast) {
    const declaredAll = new Set();           // every name declared anywhere
    const declaredVarLocations = new Map();  // var/let/const + params -> { line, col }
    const referenced = new Map();            // name -> [{ line, col }]
    const exportedNames = new Set();         // names re-exported -> treated as "used"

    walk.full(ast, (node) => {
        if (!node || typeof node.type !== 'string') return;
        switch (node.type) {
            case 'VariableDeclarator':
                collectPatternNames(node.id, declaredAll);
                collectPatternLocations(node.id, node.loc, declaredVarLocations);
                break;
            case 'FunctionDeclaration':
            case 'FunctionExpression':
                if (node.id) declaredAll.add(node.id.name);
                for (const p of node.params || []) collectPatternNames(p, declaredAll);
                for (const p of node.params || []) collectPatternLocations(p, p.loc, declaredVarLocations);
                break;
            case 'ArrowFunctionExpression':
                for (const p of node.params || []) collectPatternNames(p, declaredAll);
                for (const p of node.params || []) collectPatternLocations(p, p.loc, declaredVarLocations);
                break;
            case 'ClassDeclaration':
                if (node.id) declaredAll.add(node.id.name);
                break;
            case 'CatchClause':
                collectPatternNames(node.param, declaredAll);
                break;
            case 'ForInStatement':
            case 'ForOfStatement':
                collectPatternNames(node.left, declaredAll);
                collectPatternLocations(node.left, node.loc, declaredVarLocations);
                break;
            case 'ImportSpecifier':
            case 'ImportDefaultSpecifier':
            case 'ImportNamespaceSpecifier':
                if (node.local) declaredAll.add(node.local.name);
                break;
            case 'ExportSpecifier':
                if (node.local) exportedNames.add(node.local.name);
                break;
            case 'ExportNamedDeclaration':
                if (node.declaration && node.declaration.type === 'VariableDeclaration') {
                    for (const d of node.declaration.declarations || []) {
                        const tmp = new Set();
                        collectPatternNames(d.id, tmp);
                        for (const n of tmp) exportedNames.add(n);
                    }
                } else if (node.declaration && node.declaration.id) {
                    exportedNames.add(node.declaration.id.name);
                }
                break;
            case 'ExportDefaultDeclaration':
                if (node.declaration && node.declaration.id) exportedNames.add(node.declaration.id.name);
                break;
        }
    });

    walk.ancestor(ast, {
        Identifier(node, ancestors) {
            if (!node || !node.name) return;
            const parent = ancestors[ancestors.length - 2] || null;
            if (isNotReference(node, parent, ancestors)) return;
            // `typeof foo` is intentional even if foo is undeclared
            if (parent && parent.type === 'UnaryExpression' && parent.operator === 'typeof') return;
            const list = referenced.get(node.name) || [];
            list.push({ line: node.loc ? node.loc.start.line : 1, col: node.loc ? node.loc.start.column : 0 });
            referenced.set(node.name, list);
        },
        AssignmentExpression(node) {
            // acorn-walk descends into the LHS of an assignment as a "Pattern"
            // (base.VariablePattern is an `ignore` node), so the Identifier
            // visitor above never runs for it. Catch bare assignment targets
            // here so `undefinedVars` can also flag writes to undeclared names
            // such as `x = 5` or the classic `if (x = 5)` typo.
            const left = node.left;
            if (left && left.type === 'Identifier' && left.name) {
                const loc = (left.loc && left.loc.start) || (node.loc && node.loc.start) || null;
                const list = referenced.get(left.name) || [];
                list.push({ line: loc ? loc.line : 1, col: loc ? loc.column : 0 });
                referenced.set(left.name, list);
            }
        }
    });

    return { declaredAll, declaredVarLocations, referenced, exportedNames };
}

function isLikelyUnusedName(name) {
    if (!name) return false;
    if (/^_/.test(name)) return false;
    if (name === 'event' || name === 'evt') return false;
    if (GLOBAL_NAMES.has(name)) return false;
    return true;
}

// Detect `if (x = 5)` style bugs where `=` is used instead of `===`.
function checkAssignmentInCondition(statementNode, issues) {
    const test = statementNode.test;
    if (test && test.type === 'AssignmentExpression' && test.operator === '=') {
        issues.push({
            line: test.loc ? test.loc.start.line : 1,
            col: test.loc ? test.loc.start.column : 0,
            ruleName: 'Assignment in Condition',
            severity: 'HIGH',
            message: 'Assignment (=) used as a condition — this is almost always a bug. Did you mean a comparison (===)?',
            snippet: '... = ...',
            suggestedFix: 'Use === to compare, or extract the assignment onto its own line and test the result.'
        });
    }
}
function analyzeJavaScript(codeString, options) {
    const rules = normalizeRules(options);
    const issues = [];
    let workingCode = codeString;
    let changed = false;

    let { ast, error } = tryParseJavaScript(codeString);

    if (error) {
        // Acorn only reports the FIRST syntax error. Walk the code, masking each
        // failing line, to collect every independent syntax error — then repair
        // them all instead of giving up after the first one.
        const syntaxErrors = collectSyntaxErrors(codeString);
        const repair = repairAllJavaScript(codeString);
        const sourceLines = codeString.split(/\r?\n/);
        if (repair.fixed) {
            workingCode = repair.code;
            changed = true;
            for (const err of syntaxErrors) {
                const lineText = (sourceLines[(err.line || 1) - 1] || '').trim();
                issues.push({
                    line: err.line || 1,
                    col: err.col || 0,
                    ruleName: 'Syntax Error (auto-fixed)',
                    severity: 'HIGH',
                    message: `${err.message} — a corrected program was generated automatically.`,
                    snippet: lineText || 'Around the reported line.',
                    suggestedFix: workingCode
                });
            }
            ({ ast } = tryParseJavaScript(workingCode));
        } else {
            for (const err of syntaxErrors) {
                const lineText = (sourceLines[(err.line || 1) - 1] || '').trim();
                issues.push({
                    line: err.line || 1,
                    col: err.col || 0,
                    ruleName: 'Syntax Error',
                    severity: 'HIGH',
                    message: err.message,
                    snippet: lineText || 'Around the reported line.',
                    suggestedFix: 'Fix the reported syntax errors, then scan again to receive a corrected program.'
                });
            }
            return {
                totalIssues: issues.length,
                issuesFound: issues,
                correctedCode: null,
                engine: 'Acorn AST'
            };
        }
    }

    if (ast) {
        walk.simple(ast, {
            CallExpression(node) {
                const locLine = node.loc ? node.loc.start.line : 1;
                const locCol = node.loc ? node.loc.start.column : 0;
                const name = node.callee && node.callee.type === 'Identifier' ? node.callee.name : null;

                if (rules.noEval && name === 'eval') {
                    issues.push({
                        line: locLine,
                        col: locCol,
                        ruleName: 'Use of eval()',
                        severity: 'HIGH',
                        message: 'Avoid using eval() due to security risks.',
                        snippet: 'eval(...)',
                        suggestedFix: 'Refactor the code to avoid dynamic evaluation completely.'
                    });
                } else if (name === 'print') {
                    issues.push({
                        line: locLine,
                        col: locCol,
                        ruleName: 'Use of print()',
                        severity: 'MEDIUM',
                        message: 'print() is not a built-in JavaScript function — use console.log() instead.',
                        snippet: 'print(...)',
                        suggestedFix: 'Replace print(...) with console.log(...).'
                    });
                }

                if (rules.noConsole &&
                    node.callee && node.callee.type === 'MemberExpression' &&
                    node.callee.object && node.callee.object.type === 'Identifier' &&
                    node.callee.object.name === 'console' &&
                    node.callee.property && node.callee.property.type === 'Identifier') {
                    const method = node.callee.property.name;
                    issues.push({
                        line: locLine,
                        col: locCol,
                        ruleName: 'Use of console.' + method + '()',
                        severity: 'LOW',
                        message: 'console.' + method + '() found in the code — console statements are usually left in by mistake.',
                        snippet: 'console.' + method + '(...)',
                        suggestedFix: 'Remove the console.' + method + '() call, or guard it behind a debug/environment flag.'
                    });
                }
            },
            VariableDeclaration(node) {
                if (node.kind === 'var') {
                    issues.push({
                        line: node.loc.start.line,
                        col: node.loc.start.column,
                        ruleName: 'Use of var',
                        severity: 'MEDIUM',
                        message: 'Prefer using "let" or "const" instead of legacy "var".',
                        snippet: 'var ...',
                        suggestedFix: 'Replace "var" with "let" or "const".'
                    });
                }
            },
            BlockStatement(node) {
                if (node.body.length === 0) {
                    issues.push({
                        line: node.loc.start.line,
                        col: node.loc.start.column,
                        ruleName: 'Empty Block Statement',
                        severity: 'LOW',
                        message: 'Empty code block detected.',
                        snippet: '{}',
                        suggestedFix: 'Add implementation logic or remove the empty block.'
                    });
                }
            },
            BinaryExpression(node) {
                if (rules.strictComparisons && (node.operator === '==' || node.operator === '!=')) {
                    const strictOp = node.operator === '==' ? '===' : '!==';
                    issues.push({
                        line: node.loc.start.line,
                        col: node.loc.start.column,
                        ruleName: 'Non-strict equality (' + node.operator + ')',
                        severity: 'MEDIUM',
                        message: 'Use ' + strictOp + ' instead of ' + node.operator + ' to avoid unintended type-coercion bugs (e.g. 0 == false is true).',
                        snippet: node.operator,
                        suggestedFix: 'Replace ' + node.operator + ' with ' + strictOp + '.'
                    });
                }
            },
            IfStatement(node) {
                checkAssignmentInCondition(node, issues);
            },
            WhileStatement(node) {
                checkAssignmentInCondition(node, issues);
            },
            DoWhileStatement(node) {
                checkAssignmentInCondition(node, issues);
            },
            ObjectExpression(node) {
                const seen = new Set();
                for (const prop of node.properties) {
                    if (!prop || prop.type !== 'Property' || prop.computed) continue;
                    const key = prop.key;
                    let keyName = null;
                    if (key.type === 'Identifier') keyName = key.name;
                    else if (key.type === 'Literal') keyName = String(key.value);
                    if (!keyName) continue;
                    if (seen.has(keyName)) {
                        issues.push({
                            line: node.loc.start.line,
                            col: node.loc.start.column,
                            ruleName: 'Duplicate Object Key',
                            severity: 'MEDIUM',
                            message: 'Object literal contains the key "' + keyName + '" more than once — the later value silently overwrites the earlier one.',
                            snippet: '"' + keyName + '"',
                            suggestedFix: 'Rename the duplicate key or merge the two entries.'
                        });
                        break;
                    }
                    seen.add(keyName);
                }
            }
        });

        // Scope-aware checks: undefined variables + unused variables.
        const scope = collectScopeInfo(ast);

        if (rules.undefinedVars) {
            for (const [name, spots] of scope.referenced) {
                if (scope.declaredAll.has(name) || GLOBAL_NAMES.has(name)) continue;
                const first = spots[0] || { line: 1, col: 0 };
                issues.push({
                    line: first.line,
                    col: first.col,
                    ruleName: 'Undefined Variable',
                    severity: 'HIGH',
                    message: '"' + name + '" is used but never declared in this code.',
                    snippet: name,
                    suggestedFix: 'Declare ' + name + ' first (const/let/var), pass it in as a parameter, or check for a typo in the name.'
                });
            }
        }

        if (rules.noUnusedVars) {
            for (const [name, decl] of scope.declaredVarLocations) {
                if (scope.exportedNames.has(name)) continue;
                if (scope.referenced.has(name)) continue;
                if (!isLikelyUnusedName(name)) continue;
                issues.push({
                    line: decl.line,
                    col: decl.col,
                    ruleName: 'Unused Variable',
                    severity: 'LOW',
                    message: '"' + name + '" is declared but never used.',
                    snippet: name,
                    suggestedFix: 'Remove the declaration or actually use the variable.'
                });
            }
        }
    }

    // Build the corrected program: apply the safe semantic fixes on top of the
    // (possibly already syntax-repaired) working code, and fall back to the plain
    // syntax repair when there was nothing else to change.
    let correctedCode = null;
    const semanticCandidate = buildCorrectedJavaScript(workingCode, issues);
    if (semanticCandidate) {
        correctedCode = semanticCandidate;
    } else if (changed && workingCode !== codeString) {
        correctedCode = workingCode;
    }

    return {
        totalIssues: issues.length,
        issuesFound: issues,
        correctedCode,
        engine: 'Acorn AST'
    };
}

module.exports = { analyzeJavaScript };