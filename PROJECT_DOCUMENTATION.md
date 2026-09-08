# DEBUGIQUE — CODE INTELLIGENCE & BUG DETECTOR

## PROJECT DOCUMENTATION

A Full-Stack Web Application for:

- Real-Time Bug Detection
- AST-Powered Static Code Analysis (JavaScript, Python, C/C++, Java)
- Automatic Fix Generation (Corrected Code + Suggested Patches)
- Severity-Rated Issue Reports (HIGH / MEDIUM / LOW)
- Scan History Storage & Persistence (MongoDB + Offline Fallback)
- Configurable & Custom Static Analysis Rules
- CI/CD Pipeline Integration (GitHub Actions)
- Webhook & Notification Alerts (Slack, Discord)
- JSON Audit Report Export

**Technology Stack:**
React.js | Vite | Node.js | Express.js | MongoDB | Acorn AST | Firebase Auth

---

### ABSTRACT

Debugique is a comprehensive full-stack web application designed to accelerate the process of code debugging and static analysis. In modern software teams, catching syntax errors, unsafe patterns, and logical bugs before code reaches production is a critical bottleneck. Traditional workflows rely on manual code review, scattered linters, and IDE plugins that rarely agree with one another, resulting in slow feedback loops and security gaps that slip into production.

Developed using Node.js, Express.js, MongoDB, and React with Vite, the application allows developers to paste code snippets into a browser-based editor and instantly receive a structured vulnerability report. The JavaScript analyzer uses the **Acorn** parser to build a true Abstract Syntax Tree (AST), the Python analyzer delegates to the machine's real Python interpreter (`ast` module), the C/C++ analyzer pipes code through a native compiler in syntax-only mode, and Java is covered by a dedicated heuristic linter. Every analysis reports a severity-tagged issue list with context-aware suggested fixes and — where possible — an auto-generated **corrected program**.

Each scan is scored, duplicate-merged, and persisted to MongoDB, with an automatic file-based and browser localStorage fallback so history survives even when the database is offline. The platform also ships a Custom Rule Studio, rule-configuration toggles, GitHub Actions CI/CD integration, Slack/Discord webhook alerts, Firebase authentication, and a one-click JSON audit export — an all-in-one debugging solution for modern developers.

---

### TABLE OF CONTENTS

1. Introduction
2. Problem Statement
3. Objectives
4. Existing System
5. Proposed System
6. Technology Stack
7. System Requirements
8. System Architecture
9. Project Workflow
10. Project Modules
11. Database Design
12. API Documentation
13. Testing
14. Installation & Setup
15. Security
16. Advantages & Limitations
17. Future Enhancements
18. Conclusion
19. References

---

### 1. INTRODUCTION

A code bug is the first point of friction between a developer and a healthy codebase. In the modern software industry, code is no longer reviewed only by humans — it is scanned by CI pipelines, linters, and security tools the moment it is pushed to a repository. This shift demands fast, structured, and consistent static analysis that developers can trust.

Students, freelancers, and engineering teams often juggle multiple disconnected tools to check syntax, find vulnerabilities, and fix formatting — each with its own rules, output formats, and installation requirements. This project proposes a platform that automates the analysis workflow: it provides a browser-based multi-language editor, performs **Abstract Syntax Tree (AST)** inspection, reports issues with clear severity levels, auto-generates corrected code, and stores every scan for later review. By combining real parser/compiler engines with a configurable rule engine, Debugique lets developers find and fix bugs in seconds instead of hours.

### 2. PROBLEM STATEMENT

- Manually reviewing code for syntax errors (missing semicolons, stray colons, unbalanced braces) is slow and unreliable.
- Setting up separate linters and IDE checkers for JavaScript, Python, C/C++, and Java is fragmented and time-consuming.
- Dangerous patterns such as `eval()`, `gets()`, assignment-in-condition (`if (x = 5)`), and non-strict equality (`==`) silently slip into production.
- Python 2-style `print` statements and stray `console.log` calls left in shared code confuse developers across language boundaries.
- Undefined and unused variables are only caught at runtime or by strict IDE configs, not by default.
- Scan results and past runs are stored in terminal logs and local files that are easy to lose or never audited.
- Customizing analysis rules usually requires writing plugin code or editing tool config files by hand.
- Checking code in CI requires manual setup and is not integrated with webhook alerting.
- Existing debugging tools are fragmented across IDEs, CLIs, and web services — none offer one centralized, end-to-end workflow.

### 3. OBJECTIVES

- To develop a user-friendly, browser-based code editor with automatic language detection.
- To implement a true AST-powered static analysis engine for JavaScript using the Acorn parser.
- To integrate the native Python 3 interpreter and C/C++ compilers (GCC/Clang) for real syntax validation.
- To provide a dedicated heuristic analyzer for Java covering structure, syntax, and common pitfalls.
- To generate context-aware corrected code and per-issue suggested fixes automatically.
- To report issues with unified severity levels (HIGH / MEDIUM / LOW) and line/column positions.
- To provide persistent scan storage using MongoDB, with file-based and localStorage fallbacks for offline resilience.
- To let developers toggle built-in rules and create custom rules through an in-browser Rule Studio.
- To enable GitHub Actions CI/CD integration and Slack/Discord webhook alert configuration.
- To provide a one-click JSON audit report export for sharing and record-keeping.
- To secure the workspace using Firebase email/password authentication.

### 4. EXISTING SYSTEM

| Feature | Existing System | Proposed System (Debugique) |
| --- | --- | --- |
| Bug Detection | Manual code review and print-debugging | Instant AST-powered static analysis in the browser |
| Language Coverage | Separate linters per language | One platform for JavaScript, Python, C/C++ and Java |
| Error Reporting | Tool-specific, unclear severity | Unified HIGH/MEDIUM/LOW report with line & column |
| Fixes | Hand-written patches by the developer | Auto-generated corrected code + suggested patches |
| Rule Customization | Editing config/plugin files | In-browser rule toggles and Custom Rule Studio |
| History | Terminal logs and local files, easily lost | MongoDB scan telemetry with offline fallback |
| Automation | Manual checks before commit | GitHub Actions CI/CD workflow + webhook alerts |
| Team Access | None, single developer | Firebase-authenticated multi-user workspace |

### 5. PROPOSED SYSTEM

The proposed system is an integrated platform that removes the need for multiple external debugging tools. It centralizes code entry, static analysis, correction, persistence, automation, and alerting into a single responsive workflow.

**Workflow at a glance:**
1. Developer logs in (Firebase) and pastes a code snippet; language is auto-detected.
2. Backend dispatches the snippet to the correct language analyzer.
3. Real parser/compiler engines (Acorn AST, Python `ast`, GCC/Clang, Java heuristics) produce structured issues.
4. Frontend renders the report with severity badges, a health grade (A+ / B / C), corrected code, and per-issue fix patches.
5. The scan is saved to MongoDB (or the local fallback) and appears in the scan history.
6. Reports can be exported as JSON, rules customized, and CI/CD / webhooks configured.

### 6. TECHNOLOGY STACK

| Technology | Purpose |
| --- | --- |
| React.js | Building the interactive UI, state management, and hash-based view routing. |
| Vite | Fast build tool and development server for the modern web frontend. |
| Node.js | JavaScript runtime for the server-side environment. |
| Express.js | Web framework for building the RESTful API backend. |
| MongoDB | NoSQL database for persistent scan storage. |
| Mongoose | ODM for MongoDB to define the Scan schema and perform CRUD operations. |
| Acorn + Acorn-walk | JavaScript parser and AST walker used by the JavaScript analyzer. |
| Python 3 (external) | Native `ast.parse` syntax validation via subprocess for the Python analyzer. |
| GCC / G++ / Clang (external) | Native `-fsyntax-only` compile validation for the C/C++ analyzer. |
| Firebase Authentication | Email/password signup, login, session persistence, and protected-route gating. |
| Tailwind CSS | Utility-first styling for the glass, clay, neo, and brutalist design system. |
| lucide-react | Icon library used across the UI. |
| oxlint | Linting of the frontend source. |

### 7. SYSTEM REQUIREMENTS

**Hardware (recommended):**
- Processor: 2 GHz dual-core or better
- RAM: 4 GB minimum, 8 GB recommended
- Disk: 500 MB free space for dependencies and node_modules

**Software:**
- Node.js 18 or newer (required for backend and frontend)
- MongoDB Atlas account or a local MongoDB instance (optional — offline mode is fully supported)
- Python 3.x installed and on PATH (optional — enables full Python syntax detection)
- GCC / G++ or Clang on PATH (optional — enables real C/C++ compiler checks)
- A modern browser (Chrome, Edge, or Firefox) with JavaScript enabled
- A Firebase project (optional — required for signup/login; the app runs without it, with protected views disabled)

### 8. SYSTEM ARCHITECTURE

The system follows a **three-tier architecture** with an external tooling layer:

`DEVELOPER -> React Frontend (Vite) -> fetch/HTTP -> Express REST API -> Language Analyzers -> Acorn AST / Python ast / GCC/Clang -> MongoDB / local-history.json`

**Presentation Layer:** Built with React.js (served by Vite), delivering the code editor, live report cards, modals, and hash-based navigation.

**Frontend Logic:** Handles state management (code, rules, report, theme), Firebase auth session sync, backend health polling, language auto-detection, and calling backend services.

**API Layer:** RESTful endpoints created with Express.js to handle analysis requests, history retrieval, and health checks, with CORS restricted to allowed origins.

**Analysis Layer:** Language-specific engines — `jsAnalyzer` (Acorn AST), `pyAnalyzer` (Python subprocess + heuristics), `ccppAnalyzer` (compiler subprocess + heuristics), and `javaAnalyzer` (heuristic lint) — dispatched through `analyzer.js`.

**Data Layer:** MongoDB interface via Mongoose for persisting Scan documents, backed by a JSON file store (`local-history.json`) and browser localStorage when the database is unreachable.

**External Tooling Layer:** Python interpreter and C/C++ compiler invoked as sandboxed subprocesses (timeout-bounded, stdin/stdout piping, syntax-only checks); Firebase Auth runs client-side for identity.

### 9. PROJECT WORKFLOW

1. User opens the app (local: `http://localhost:5173`) and lands on the Home page; the client health-checks the backend (`/api/health`) and auto-retries every 5 seconds while offline.
2. User creates an account or logs in via Firebase (email/password); sessions persist across refreshes.
3. User opens the Live Analyzer, pastes a code snippet; the language is auto-detected (JavaScript/Python/C/C++/Java) or chosen manually.
4. User optionally toggles analysis rules (noEval, noConsole, strictComparisons, noUnusedVars, undefinedVars).
5. Scan is triggered: the frontend POSTs `{ code, language, rules }` to `/api/analyze`.
6. Backend dispatches to the matching language analyzer; real parsers/compilers or heuristics produce the issue list.
7. Report is rendered: total issues, per-issue severity badges, health grade (A+ / B / C), corrected program, and per-issue suggested fix patches.
8. The scan is persisted (MongoDB → local JSON file → browser localStorage fallback chain) and merged into scan history.
9. User can apply/copy the corrected code, export a JSON audit report, configure webhook alerts, or integrate the CI/CD workflow.
10. History view shows the merged log of all past scans, newest first, deduplicated across sources.

### 10. PROJECT MODULES

**Home Module**
Purpose: Primary landing page of the application.
Processing: Displays hero benefits, key feature cards (AST Parsing, Smart Fixes, Database Logs), and quick access to signup, login, and scan history.
Output: Navigable landing page with clear calls-to-action.

**Authentication Module**
Purpose: User identity and workspace access control.
Processing: Firebase email/password signup and login with friendly error mapping (wrong password, weak password, duplicate email, network errors, etc.); signup captures first/last name into the Firebase profile.
Output: Persistent session; protected views (`dashboard`, `analyzer`, `history`, `rules`, `cicd`, `alerts`, `settings`) redirect unauthenticated users to Login.

**Dashboard Module**
Purpose: Command center for the workspace.
Processing: Shows live stats (total scans, active parser, database status, pending vulnerabilities) and a grid of six tools (Live Analyzer, Scan Logs, Custom Rule Studio, CI/CD Pipeline, Webhook Alerts, API Settings).
Output: One-click navigation to every platform module.

**Live Code Analyzer Module**
Purpose: Core multi-language static analysis experience.
Processing: Browser code editor with a language selector, live language auto-detection (strong signals plus a scored fallback), Run Scan, Configure Rules, and Export buttons, plus an offline-backend warning banner with Retry.
Output: Executable scan request and rendered vulnerability report.

**Analysis Engine Module**
Purpose: Server-side static analysis for four languages.
Processing: `analyzer.js` dispatches by language. JavaScript uses Acorn (AST, ES-module aware, error-masking to report multiple syntax errors) plus scope-aware rules (undefined/unused variables), duplicate object keys, empty blocks, strict-equality enforcement, `eval()`/`console.*` bans, and assignment-in-condition detection. Python pipes code to a local Python 3 interpreter running `ast.parse` (re-parsing after masking each error) and falls back to a heuristic linter. C/C++ pipes code through `g++/gcc/clang++/clang -fsyntax-only` with heuristic brace/colon/semicolon checks and unsafe `gets()` detection. Java uses a heuristic linter for braces, semicolons, stray colons, `print()`, `main()` signature, and missing class wrapper.
Output: `{ totalIssues, issuesFound[], correctedCode, engine }` per scan.

**Auto-Fix Module**
Purpose: Immediate corrective action.
Processing: Generates a corrected program string (e.g., `print(` → `console.log(`, appended semicolons, removed stray colons), plus a per-issue `suggestedFix`. The UI offers "Apply Corrected Code to Editor", "Apply Patch to Editor Buffer", and copy-to-clipboard.
Output: Editable corrected code ready in the editor buffer.

**Rule Configuration Module**
Purpose: Toggle built-in JavaScript rules per scan.
Processing: Modal with five checkbox rules (Ban Eval, Ban Console Logs, Enforce Strict Equality, Detect Unused Variables, Detect Undefined Variables) sent to the backend with each request.
Output: Customized analysis ruleset in the scan payload.

**Custom Rule Studio Module**
Purpose: Define team-specific linting rules.
Processing: Form to create rules with a name, AST node target (CallExpression, BinaryExpression, VariableDeclaration), and severity (HIGH/MEDIUM/LOW); active rule list supports enable/disable and delete.
Output: In-browser custom rule library (UI state).

**Scan History Module**
Purpose: Persistent audit trail of all scans.
Processing: Fetches `/api/history`, merges MongoDB records with the backend JSON file and browser localStorage cache, deduplicates by snippet+language+issue-count key, sorts newest first (max 50 records).
Output: Chronological log with timestamps, language badges, code preview, and issue counts.

**CI/CD Integration Module**
Purpose: Automated scanning in pipelines.
Processing: Provides a copy-ready GitHub Actions workflow (`.github/workflows/debugique.yml`) that runs `debugique/action-scanner@v1` on push/PR with an API key secret and `fail-on-severity: 'critical'`.
Output: One-click workflow YAML copied to the clipboard.

**Webhook Alerts Module**
Purpose: Real-time notifications when critical issues are found.
Processing: Form to pick Slack or Discord and paste a webhook URL; validates and saves/"tests" the endpoint (frontend simulation).
Output: Saved webhook configuration with success confirmation.

**Settings Module**
Purpose: Workspace configuration.
Processing: Displays the developer API key (demo placeholder) with copy-to-clipboard, and a team collaborator email invite form.
Output: Copied API key / simulated invitation.

**Report Export Module**
Purpose: Sharing and record-keeping.
Processing: Executive Security Audit Summary modal with timestamp, health grade, and vulnerability count; downloads the raw report as a timestamped JSON file (`security-audit-<timestamp>.json`).
Output: Downloadable JSON audit report.

### 11. DATABASE DESIGN

**Collection: `scans`**

| Field | Type | Description |
| --- | --- | --- |
| `codeSnippet` | String | The exact code submitted for analysis (required). |
| `language` | String | Language used (`javascript` by default; `python`, `cpp`, `c`, `ccpp`, `java`). |
| `totalIssues` | Number | Total number of issues found by the analyzer (required). |
| `issuesFound` | Array | Structured issue objects: `{ ruleName, severity, line, col, message, snippet, suggestedFix }`. |
| `createdAt` | Date | Auto-set scan timestamp (default `Date.now`), used for newest-first history sorting. |

**Fallback storage:**

| Store | Location | Purpose |
| --- | --- | --- |
| `local-history.json` | `backend/` | JSON file cache (max 50 records) written when MongoDB is unavailable. |
| `debugique-scan-history` | browser localStorage | Frontend cache (max 50 records) so scanned code stays visible even when the backend is down. |
| History merge | `/api/history` + client `mergeHistory()` | Deduplicates server and local entries so each scan appears once, newest first. |

### 12. API DOCUMENTATION

**Base URL:** `http://localhost:5000` (local); `process.env.PORT` in production. All routes are prefixed with `/api`.

**GET `/api/health`** — Lightweight connectivity + database status.
Response (200):
```json
{
  "status": "ok",
  "db": "connected",
  "time": "2026-09-08T10:00:00.000Z"
}
```
Notes: `db` is `"connected"` when Mongo's readyState is 1, otherwise `"disconnected"`. The frontend polls this endpoint on load, on Retry, and every 5 seconds while offline.

**POST `/api/analyze`** — Run static analysis on a snippet.
Request body:
```json
{
  "code": "const x = 5\nif (x = 6) { console.log(x) }",
  "language": "javascript",
  "rules": { "noEval": true, "noConsole": true, "strictComparisons": true, "noUnusedVars": true, "undefinedVars": true }
}
```
Response (200):
```json
{
  "totalIssues": 2,
  "issuesFound": [
    {
      "ruleName": "Assignment in Condition",
      "severity": "HIGH",
      "line": 2,
      "col": 4,
      "message": "Assignment (=) used as a condition — ...",
      "snippet": "if (x = 6) {",
      "suggestedFix": "Use === for comparison ..."
    }
  ],
  "correctedCode": "const x = 5\nif (x === 6) { console.log(x) }",
  "engine": "Acorn AST",
  "persisted": true
}
```
Error responses: `400` with `{ "error": "No code provided." }` when input is empty; `500` with `{ "error": "..." }` on analyzer failure.
Notes: The scan is saved to MongoDB when connected; otherwise written to `backend/local-history.json` and `persisted` is `false`.

**GET `/api/history`** — Merged, deduplicated scan history.
Response (200): an array (max 50) of:
```json
[
  {
    "_id": "...",
    "codeSnippet": "...",
    "language": "javascript",
    "totalIssues": 2,
    "issuesFound": [],
    "createdAt": "2026-09-08T09:00:00.000Z"
  }
]
```
Notes: Combines MongoDB records with the file-based fallback; entries are keyed by `codeSnippet|language|totalIssues` and sorted newest-first. When `client/dist` exists, the Express server also serves the built React app with an SPA fallback for non-`/api` routes.

### 13. TESTING

| ID | Scenario | Input | Expected | Actual | Status |
| --- | --- | --- | --- | --- | --- |
| TC01 | Application Launch | Access `http://localhost:5173` | Home page loads with navigation and offline banner (if backend down) | To Be Verified | Pending |
| TC02 | Authentication | Signup then login via Firebase | Auth persists; protected views accessible after login, blocked before | To Be Verified | Pending |
| TC03 | JavaScript Analysis | `if (x = 5) { console.log(x) }` 🡒 Run Scan | Report lists "Assignment in Condition" and console.log violation with severity | To Be Verified | Pending |
| TC04 | Python Analysis | `print "hello"` with Python 3 installed | "Python 2 Print Syntax" flagged; interpreter engine reported | To Be Verified | Pending |
| TC05 | C/C++ Analysis | Snippet with missing semicolon (compiler present) | Compiler or heuristic "Missing Semicolon" (MEDIUM) flagged | To Be Verified | Pending |
| TC06 | Java Analysis | Missing `String[] args` in main | "main() Signature" HIGH issue flagged | To Be Verified | Pending |
| TC07 | Rule Configuration | Toggle off "Ban Console Logs" and rescan | `console.log` no longer reported | To Be Verified | Pending |
| TC08 | Auto-Fix | Scan code with `print(` in a JS file | Corrected program uses `console.log(`; Apply button replaces editor buffer | To Be Verified | Pending |
| TC09 | Database Save | Run a scan with MongoDB connected | `GET /api/history` contains the new document with `totalIssues` | To Be Verified | Pending |
| TC10 | Offline Fallback | Stop MongoDB / backend, then run scan from cached history | Scan visible in History from localStorage/JSON fallback; banner shows Retry | To Be Verified | Pending |
| TC11 | JSON Export | Run scan, click Export ▸ Download JSON | `security-audit-<timestamp>.json` downloads with full report | To Be Verified | Pending |
| TC12 | CI/CD Snippet | Open CI/CD page, click Copy Code | GitHub Actions workflow YAML copied to clipboard | To Be Verified | Pending |

**Automated smoke test (backend):**
```bash
cd backend
node test-analyzer.js
```
This verifies JS (undefined variable, non-strict equality, ES-module parsing, duplicate keys), Python 2 print + `eval()`, and Java missing-semicolon cases all return well-formed `{ totalIssues, issuesFound, correctedCode, engine }` reports and exits 0 on success.

### 14. INSTALLATION & SETUP

**Backend Setup**
1. Navigate to the server directory: `cd backend`
2. Install dependencies: `npm install`
3. Configure environment variables in `.env` (see `backend/.env.example`): `MONGODB_URI`, `PORT`
4. Start the server: `npm start` (or `node server.js` → `http://localhost:5000`)

**Frontend Setup**
5. Navigate to the client directory: `cd client`
6. Install dependencies: `npm install`
7. Configure Firebase variables in `client/.env` (see `client/.env.example`): `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`
8. Start the development server: `npm run dev`
9. Open the browser at the provided Vite URL (usually `http://localhost:5173`)

**One-click start (Windows)**
- Double-click `start.bat` at the project root. It installs missing dependencies on first run and opens two windows: backend on `http://localhost:5000` and frontend on `http://localhost:5173`.

**All-in-one command (root)**
```bash
npm install        # installs `concurrently` once
npm run dev        # starts backend + frontend together
```

### 15. SECURITY

- **CORS allowlist:** Only `http://localhost:5173`, `http://localhost:3000`, `CLIENT_URL`, and same-origin hosts are permitted; other origins are rejected with an error.
- **Authentication gating:** Firebase email/password auth protects all workspace views (dashboard, analyzer, history, rules, CI/CD, alerts, settings); unauthenticated visitors are redirected to Login.
- **Secrets management:** `MONGODB_URI`, `PORT`, and all `VITE_FIREBASE_*` values are read from gitignored `.env` files; `.env.example` templates document them without real credentials.
- **Safe subprocess execution:** External Python and compiler calls run with explicit timeouts (5–20s), `windowsHide`, piped stdin, and non-executing modes (`ast.parse` and `-fsyntax-only`). User code is never executed.
- **Bounded fallback stores:** The backend JSON history is capped at 50 records and browser localStorage at 50 entries; history merges are deduplicated by content key.
- **Client-side defense in depth:** The Settings API key shown in the UI is a demo placeholder; development keys are displayed as password inputs and never logged.
- **Resilience over failure:** If MongoDB is unreachable the server still starts, logs a warning, and continues serving analysis — no credentials are required to run scans.

### 16. ADVANTAGES & LIMITATIONS

**Advantages**
- One unified web platform for JavaScript, Python, C/C++ and Java debugging — no per-language toolchain setup.
- Real parser/compiler validation (Acorn AST, Python `ast`, GCC/Clang) whenever available, with graceful heuristic fallback.
- Auto-generated corrected code and per-issue suggested fixes with one-click apply/copy.
- Severity-rated (HIGH/MEDIUM/LOW) findings with exact line and column positions.
- Health scoring (A+ / B / C) gives an instant, shareable code-quality signal.
- Persistent scan history with triple-layer resilience (MongoDB + JSON file + localStorage).
- Rule configuration and a custom Rule Studio for team-specific linting.
- GitHub Actions CI/CD integration and Slack/Discord webhook alert configuration.
- Firebase-authenticated, multi-page SPA with offline-aware backend monitoring.
- Lightweight: static analysis only, no user code execution, ideal for teaching and CI fast lanes.

**Limitations**
- Java analysis is heuristic-only (no Java compiler/parser integration) and may miss type-level errors.
- Python and C/C++ deep-analysis quality depends on local interpreters/compilers being installed; otherwise the engine degrades to heuristics.
- Custom rules created in the Rule Studio are stored in UI state only — they are not yet persisted to the backend or executed by the analyzers.
- The webhook alerts and team invitations are simulated on the frontend; real delivery endpoints are not implemented server-side.
- The JavaScript rule toggles currently only affect the JS analyzer; other languages run their default rule set.
- Static analysis detects patterns and syntax, not dynamic/runtime behavior — it complements, but does not replace, tests and runtime monitoring.
- No rate limiting or persistent user-to-scan ownership is implemented yet; history is workspace-global.
- Firebase configuration is required for full login flows; without it, protected views remain gated.

### 17. FUTURE ENHANCEMENTS

- Add analyzers for TypeScript, Go, Rust, and Ruby.
- Integrate an LLM (e.g., Google Gemini) to generate human-readable explanations and natural-language fix suggestions for each issue.
- Persist custom rules and user settings to MongoDB so they survive reloads and can be shared with teams.
- Implement a real server-side webhook delivery service with retries, rate limiting, and Slack/Discord payload formatting.
- Build a VS Code extension and a standalone CLI wrapping the same analysis engine.
- Add real-time WebSocket analysis for instant keystroke-level feedback in the editor.
- Introduce multi-file / project-level analysis with cross-file tracking.
- Add per-user scan ownership and role-based team access.
- Add diff views for corrected code and inline "explain rule" documentation.
- Add tests for the frontend (unit + E2E) and expand the backend smoke suite into a CI workflow.

### 18. CONCLUSION

In conclusion, the Debugique Code Intelligence and Bug Detector successfully demonstrates the integration of modern web technologies with real static-analysis engines to solve real-world code quality and security problems. By automating the technical complexities of multi-language syntax checking, vulnerability detection, auto-fix generation, and rule configuration, it allows developers to focus on writing clean, production-ready code effectively.

### 19. REFERENCES

- React Official Documentation (https://react.dev)
- Node.js API Reference (https://nodejs.org)
- MongoDB Manual (https://www.mongodb.com/docs)
- Express.js Guide (https://expressjs.com)
- Acorn JavaScript Parser Documentation (https://github.com/acornjs/acorn)
- Mongoose ODM Documentation (https://mongoosejs.com/docs)
- Vite Official Documentation (https://vitejs.dev)
- Tailwind CSS Official Documentation (https://tailwindcss.com)
- Firebase Authentication Documentation (https://firebase.google.com/docs/auth)
- Python ast Module Reference (https://docs.python.org/3/library/ast.html)
- GCC Online Documentation (https://gcc.gnu.org/onlinedocs)
- GitHub Actions Documentation (https://docs.github.com/actions)
- oxlint Documentation (https://oxc.rs/docs/guide/usage/linter.html)
- lucide-react Documentation (https://lucide.dev)