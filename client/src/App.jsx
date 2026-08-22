import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import CICD from './pages/CICD';
import RuleBuilder from './pages/RuleBuilder';
import Alerts from './pages/Alerts';
import {
  Lightbulb, ArrowRight, AlertTriangle, CheckCircle, CheckCircle2,
  Sliders, Download, FileText, X, Play, Sun, Moon, Copy, Sparkles
} from 'lucide-react';
import { getLocalHistory, saveLocalScan, mergeHistory } from './historyStore';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function App() {
  const getInitialView = () => {
    const hash = window.location.hash.replace('#', '');
    return hash || 'home';
  };

  const [currentView, setCurrentView] = useState(getInitialView);
  const [code, setCode] = useState('');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [backendOnline, setBackendOnline] = useState(null); // null = checking, true/false = result
  const [analyzeError, setAnalyzeError] = useState(null);

  // Light / dark minimalist theme
  const [theme, setTheme] = useState(() => {
    let initial = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    try {
      const savedTheme = localStorage.getItem('debugique-theme');
      if (savedTheme === 'dark' || savedTheme === 'light') initial = savedTheme;
    } catch {
      /* ignore */
    }
    document.documentElement.setAttribute('data-theme', initial);
    return initial;
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('debugique-theme', theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  
  const [activeRules, setActiveRules] = useState({
    noEval: true,
    noConsole: true,
    strictComparisons: true,
    noUnusedVars: true
  });

  const changeView = (view) => {
    window.location.hash = view;
    setCurrentView(view);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    const handleHashChange = () => {
      const view = window.location.hash.replace('#', '') || 'home';
      setCurrentView(view);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const fetchHistory = async () => {
    let serverEntries = [];
    try {
      const res = await fetch(`${API_BASE_URL}/api/history`);
      const data = await res.json();
      if (Array.isArray(data)) serverEntries = data;
    } catch (err) {
      console.error('Failed to load history', err);
    }

    // Merge the database entries with everything cached in the browser so the
    // scanned code stays visible even when the backend/MongoDB is unreachable.
    const localEntries = getLocalHistory();
    setHistory(mergeHistory(serverEntries, localEntries));
  };

  // Lightweight connectivity check — used on load and by the Retry button
  const checkBackend = async () => {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 5000);
      const res = await fetch(`${API_BASE_URL}/api/health`, { signal: controller.signal });
      clearTimeout(timer);
      setBackendOnline(res.ok);
    } catch (err) {
      console.error('Backend health check failed:', err);
      setBackendOnline(false);
    }
  };

  useEffect(() => {
    checkBackend();
    fetchHistory();
  }, []);

  // Refresh the scan history every time the user opens that view, so newly
  // scanned code is always present when they navigate back to it.
  useEffect(() => {
    if (currentView === 'history') fetchHistory();
  }, [currentView]);

  // While the backend is offline, keep re-checking every few seconds so the
  // warning banner clears by itself as soon as the server comes back up.
  useEffect(() => {
    if (backendOnline !== false) return;
    const id = setInterval(() => {
      checkBackend();
    }, 5000);
    return () => clearInterval(id);
  }, [backendOnline]);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setCurrentView('dashboard');
  };

  // Detect programming language from code content
  const detectLanguage = (codeText) => {
    const trimmedText = (codeText || '').trim();
    if (!trimmedText) return selectedLanguage;

    const lower = trimmedText.toLowerCase();

    // ---------- Strong, unambiguous signals ----------
    if (/^\s*#\s*include/.test(lower)) return 'cpp';                          // #include <iostream>
    if (/\b(std::|iostream|namespace\s+\w+\s*\{|\.hpp\b)/.test(lower)) return 'cpp';
    if (/\b(public\s+static\s+void\s+main|System\.(out|in)|import\s+(javax?|static\s+java)\.)/.test(lower)) return 'java';
    if (/\bpublic\s+(abstract\s+|final\s+)?class\s+\w+/.test(lower)) return 'java';
    if (/\b(def|class)\s+\w+/.test(lower) && /:\s*$/.test(lower)) return 'python';
    if (/(^|\n)\s*(def|import|from|elif|else|except|finally|with)\b/.test(lower) && !/\b(import\s+java)/.test(lower)) return 'python';
    if (/\b(print|input|range|len|isinstance)\s*\(/.test(lower)) return 'python';

    // ---------- Scored fallback ----------
    const scores = { javascript: 0, python: 0, cpp: 0, java: 0 };

    if (/\b(const|let|var|function|=>|typedef|declare)\b/.test(lower)) scores.javascript += 3;
    if (/(console\.log|document\.|window\.|addEventListener|import\s+.*\s+from\s+['"])/.test(lower)) scores.javascript += 3;

    if (/\b(printf|cout|cin|cerr)\b/.test(lower)) scores.cpp += 4;
    if (/\b(int|float|double|char|long|short|unsigned|signed|bool|void|struct|typedef|union)\b/.test(lower) && /;/.test(lower)) scores.cpp += 2;

    if (/:\s*$/.test(lower) && !/[{};]/.test(trimmedText) && !/\b(int|float|double|char|bool|void)\b/.test(lower)) scores.python += 2;
    if (/^\s*#\s*\w/.test(lower) && !/^#\s*include/.test(lower)) scores.python += 1;   // '#' comments in Python

    const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
    return best[1] > 0 ? best[0] : 'javascript';
  };

  const handleAnalyze = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setAnalyzeError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language: selectedLanguage }),
      });
      const data = await response.json();

      if (!response.ok || data.error) {
        console.error('Analysis request failed:', response.status, data.error);
        setAnalyzeError(data.error || `Server error (HTTP ${response.status}).`);
        setReport(null);
      } else {
        setReport(data);
        setBackendOnline(true);

        // Cache the scan in the browser so it stays in history even without a
        // reachable database or backend.
        saveLocalScan({
          _id: `local-${Date.now()}`,
          codeSnippet: code,
          language: selectedLanguage,
          totalIssues: data.totalIssues || 0,
          issuesFound: data.issuesFound || [],
          createdAt: new Date().toISOString()
        });

        fetchHistory();
      }
    } catch (err) {
      console.error('Error connecting to backend:', err);
      setAnalyzeError('Cannot reach the analysis server. Start the backend with `npm start` inside the backend folder, then run the scan again.');
      setReport(null);
      setBackendOnline(false);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFix = (suggestedFix) => {
    if (!suggestedFix) return;
    setCode(suggestedFix);
    setSelectedIssue(null);
    alert('Fix applied to code editor buffer!');
  };

  const copyText = (text) => {
    if (!text) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text)
        .then(() => alert('Copied to clipboard!'))
        .catch(() => alert('Could not copy to clipboard.'));
    } else {
      alert('Clipboard access is unavailable in this browser.');
    }
  };

  const getHealthScore = () => {
    if (!report) return { grade: 'A+', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' };
    if (report.totalIssues === 0) return { grade: 'A+', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' };
    if (report.totalIssues <= 2) return { grade: 'B', color: 'text-amber-600 bg-amber-50 border-amber-200' };
    return { grade: 'C', color: 'text-red-600 bg-red-50 border-red-200' };
  };

  const health = getHealthScore();

  const isSplitLayout = currentView === 'login' || currentView === 'signup';
  
  // Check if user is on a logged-in page
  const loggedInPages = ['dashboard', 'analyzer', 'history', 'rules', 'cicd', 'alerts', 'settings'];
  const isOnLoggedInPage = loggedInPages.includes(currentView);

  return (
    <div className="relative min-h-screen text-ink selection:bg-accent selection:text-onaccent flex flex-col w-full">
      {/* Animated layered background — feeds the glass & skeuomorphic depth */}
      <div className="scene" aria-hidden="true">
        <div className="blob blob-a"></div>
        <div className="blob blob-b"></div>
        <div className="blob blob-c"></div>
        <div className="blob blob-d"></div>
      </div>
      
      {!isSplitLayout && currentView !== 'dashboard' && (
        <Navbar 
          currentView={currentView} 
          setCurrentView={changeView} 
          isLoggedIn={isLoggedIn || isOnLoggedInPage} 
          theme={theme}
          toggleTheme={toggleTheme}
        />
      )}

      <main className={`grow w-full flex flex-col ${!isSplitLayout ? 'pb-24' : ''}`}>
        
        {/* Split screen only for login/signup views */}
        {isSplitLayout ? (
          <div className="w-full min-h-screen">
            <div className="min-h-screen flex items-center justify-center px-6 py-12">
              <div className="w-full max-w-md space-y-5">
                <div className="flex items-center justify-between">
                  <button onClick={() => changeView('home')} className="text-sm font-semibold text-muted hover:text-ink transition-colors">← Back to Home</button>
                  <button onClick={toggleTheme} className="theme-btn" aria-label="Toggle theme">
                    {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                  </button>
                </div>
                {currentView === 'login' && <Login setCurrentView={changeView} onAuthSuccess={handleLoginSuccess} />}
                {currentView === 'signup' && <Signup setCurrentView={changeView} onAuthSuccess={handleLoginSuccess} />}
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Home View */}
            {currentView === 'home' && (
              <div className="w-full max-w-6xl mx-auto px-6 pt-20 pb-10">
                <div className="space-y-28">

                  {/* Hero — maximalist + spatial + skeuomorphic */}
                  <section className="perspective grid lg:grid-cols-2 gap-14 items-center">
                    <div className="space-y-7 preserve-3d">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="brutal-tag">AST Static Analysis</span>
                        <span className="badge bg-accent text-white">v2.4 · Acorn Engine</span>
                      </div>
                      <h1 className="text-5xl sm:text-6xl font-black tracking-tighter text-ink leading-[1.04]">
                        Debug <span className="brutal-text text-accent">code</span> faster<br />
                        than ever before
                      </h1>
                      <p className="text-lg text-muted max-w-lg leading-relaxed">
                        Analyze architecture, catch vulnerabilities with Abstract Syntax Trees, and apply instant fixes — for JS, Python, C/C++ and Java.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <button onClick={() => changeView('signup')} className="btn btn-clay-accent">
                          <span>Start Analyzing Code</span>
                          <ArrowRight size={16} />
                        </button>
                        <button onClick={() => changeView('history')} className="btn btn-glass">
                          View Scan History
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-4 pt-2">
                        <span className="neo px-4 py-2 text-xs font-bold text-ink">12k+ scans</span>
                        <span className="neo px-4 py-2 text-xs font-bold text-ink">4 languages</span>
                        <span className="neo px-4 py-2 text-xs font-bold text-ink">AST-powered</span>
                      </div>
                    </div>

                    <div className="preserve-3d float-slow">
                      <div className="skeuo-win tilt">
                        <div className="window-chrome">
                          <span className="dot dot-red"></span>
                          <span className="dot dot-yellow"></span>
                          <span className="dot dot-green"></span>
                          <span className="ml-3 text-[11px] font-mono text-[var(--editor-muted)]">analyzer.js — Debugique</span>
                        </div>
                        <div className="p-5 font-mono text-xs leading-relaxed text-[var(--editor-ink)]">
                          <p><span className="text-[#ff7b72]">const</span> <span className="text-[#79c0ff]">scan</span> <span className="text-[#ff7b72]">=</span> <span className="text-[#ffa657]">(code)</span> <span className="text-[#ff7b72]">=&gt;</span> <span className="text-[#ff7b72]">{'{'}</span></p>
                          <p className="pl-4"><span className="text-[#ff7b72]">const</span> <span className="text-[#79c0ff]">tree</span> <span className="text-[#ff7b72]">=</span> <span className="text-[#79c0ff]">acorn</span>.<span className="text-[#d2a8ff]">parse</span>(code);</p>
                          <p className="pl-4"><span className="text-[#79c0ff]">report</span> <span className="text-[#ff7b72]">=</span> <span className="text-[#d2a8ff]">analyze</span>(tree);</p>
                          <p><span className="text-[#ff7b72]">{'}'}</span> <span className="text-[#8b949e]">// 0 vulnerabilities</span></p>
                        </div>
                        <div className="statusbar">
                          <span>JavaScript</span>
                          <span className="text-[#3fb950]">✓ 3 checks passed</span>
                          <span>Acorn v9</span>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Features — claymorphism */}
                  <section className="space-y-8">
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-ink">Core capabilities</h2>
                        <p className="text-muted mt-2 max-w-xl">Everything you need to catch bugs and refactor code seamlessly.</p>
                      </div>
                      <span className="brutal-tag hidden sm:inline-flex">3 pillars</span>
                    </div>
                    <div className="grid md:grid-cols-3 gap-7">
                      {[
                        { icon: CheckCircle2, title: 'AST Parsing', desc: 'Syntax analysis powered by the Acorn parser engine instead of basic string matching.' },
                        { icon: Lightbulb, title: 'Actionable Patches', desc: 'Immediate bug-fix recommendations you can import straight into your buffer.' },
                        { icon: FileText, title: 'Scan History', desc: 'Every run persisted to MongoDB for easy auditing and tracking.' }
                      ].map((item, i) => (
                        <div key={i} className="clay p-7 space-y-4 tilt">
                          <span className="flex items-center justify-center w-12 h-12 rounded-2xl clay-accent">
                            <item.icon size={20} />
                          </span>
                          <h3 className="font-bold text-ink text-lg">{item.title}</h3>
                          <p className="text-muted text-sm leading-relaxed">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* CTA band — brutalism */}
                  <section className="brutal brutal-accent p-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">Ready to run your first scan?</h2>
                      <p className="text-white/80 mt-1 text-sm">Paste a snippet and get an executive security report in seconds.</p>
                    </div>
                    <button onClick={() => changeView('login')} className="btn btn-brutal shrink-0">
                      Open the Analyzer
                    </button>
                  </section>
                </div>
              </div>
            )}

            {/* Analyzer View */}
            {currentView === 'analyzer' && (
              <div className="w-full max-w-6xl mx-auto px-6 py-8 space-y-4 relative">
                <div className="liquid p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full rounded-2xl">
                  <div className="flex items-center space-x-3">
                    <div>
                      <h2 className="font-bold text-slate-900 text-base">Interactive AST Code Analyzer</h2>
                      <p className="text-slate-500 text-xs">Run syntax trees, configure rules, and export executive reports.</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {report && (
                      <div className={`px-3 py-1.5 rounded-lg border font-bold text-xs ${health.color}`}>
                        <span>Health: {health.grade}</span>
                      </div>
                    )}
                    
                    <button
                      onClick={handleAnalyze}
                      disabled={loading}
                      className="btn btn-clay-accent btn-sm"
                    >
                      {loading ? (
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Play size={12} className="fill-white" />
                      )}
                      <span>{loading ? 'Scanning...' : 'Run Scan'}</span>
                    </button>

                    <button
                      onClick={() => setShowRulesModal(true)}
                      className="btn btn-glass btn-sm"
                    >
                      <Sliders size={12} />
                      <span>Configure Rules</span>
                    </button>
                    
                    {report && (
                      <button
                        onClick={() => setShowExportModal(true)}
                        className="btn btn-brutal btn-sm"
                      >
                        <Download size={12} />
                        <span>Export</span>
                      </button>
                    )}
                  </div>
                </div>

                {analyzeError && (
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-red-400/40 bg-red-50 text-red-700 px-4 py-3 text-sm">
                    <div className="flex items-center gap-2">
                      <AlertTriangle size={16} className="shrink-0" />
                      <span>{analyzeError}</span>
                    </div>
                    <button onClick={() => setAnalyzeError(null)} className="font-bold hover:underline shrink-0">Dismiss</button>
                  </div>
                )}

                {backendOnline === false && (
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-amber-400/40 bg-amber-50 text-amber-700 px-4 py-3 text-sm">
                    <div className="flex items-center gap-2">
                      <AlertTriangle size={16} className="shrink-0" />
                      <span>Backend server is not running. Start it with <code className="font-mono text-xs">npm start</code> in the <code className="font-mono text-xs">backend</code> folder (or run <code className="font-mono text-xs">start.bat</code>) — this banner clears automatically once it is online.</span>
                    </div>
                    <button onClick={checkBackend} className="font-bold hover:underline shrink-0">Retry</button>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                  <div className="skeuo-win flex flex-col w-full">
                    <div className="window-chrome">
                      <span className="dot dot-red"></span>
                      <span className="dot dot-yellow"></span>
                      <span className="dot dot-green"></span>
                      <span className="ml-3 text-[11px] font-mono text-[var(--editor-muted)]">buffer.js</span>
                      <select
                        value={selectedLanguage}
                        onChange={(e) => {
                          setSelectedLanguage(e.target.value);
                        }}
                        className="ml-auto text-[11px] font-mono font-semibold bg-transparent text-[var(--editor-ink)] outline-none cursor-pointer border border-[var(--editor-line)] rounded px-2 py-0.5"
                      >
                        <option value="javascript">JavaScript</option>
                        <option value="python">Python</option>
                        <option value="cpp">C/C++</option>
                        <option value="java">Java</option>
                      </select>
                    </div>
                    <textarea
                      className="w-full h-125 font-mono text-sm p-5 resize-none bg-[var(--editor-bg)] text-[var(--editor-ink)] placeholder-[var(--editor-muted)] focus:outline-none focus:ring-1 focus:ring-accent"
                      placeholder="// Paste your code here (JavaScript, Python, C++, Java)..."
                      value={code}
                      onChange={(e) => {
                        setCode(e.target.value);
                        // Auto-detect language as user types
                        const detected = detectLanguage(e.target.value);
                        if (detected !== selectedLanguage) {
                          setSelectedLanguage(detected);
                        }
                      }}
                    />
                    <div className="statusbar">
                      <span>{selectedLanguage}{report && report.engine ? ` · ${report.engine}` : ' · Ready'}</span>
                      <span>Ln 1, Col 1</span>
                      <span>UTF-8</span>
                    </div>
                  </div>

                  <div className="flex flex-col liquid p-5 w-full rounded-2xl">
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="text-xs font-bold uppercase tracking-wider text-muted">Discovered Issues & Patches</h2>
                      {report && <span className="text-xs font-medium text-slate-500">Total: {report.totalIssues}</span>}
                    </div>

                    <div className="w-full bg-surface2/70 border border-line p-4 overflow-y-auto rounded-xl">
                      {!report ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400 text-sm text-center px-4">
                          <AlertTriangle className="w-8 h-8 mb-2 opacity-50 text-indigo-500" />
                          <p>Run an analysis using the toolbar scan button above to generate solutions.</p>
                        </div>
                      ) : report.totalIssues === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-emerald-600 text-sm font-medium">
                          <CheckCircle className="w-8 h-8 mb-2" />
                          <p>No issues detected! Clean code.</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {report.issuesFound.map((issue, index) => (
                            <div 
                              key={index} 
                              onClick={() => setSelectedIssue(issue)}
                              className="card hover:border-linestrong hover:-translate-y-0.5 p-4 text-sm space-y-1.5 cursor-pointer transition"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-slate-800 text-xs">Line {issue.line}: {issue.ruleName}</span>
                                <span className="px-2.5 py-0.5 text-[10px] font-bold text-red-700 bg-red-100 rounded">{issue.severity}</span>
                              </div>
                              <p className="text-slate-600 text-xs truncate">{issue.message}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Corrected Program panel — shown when the analyzer generated a fixed version */}
                {report && report.correctedCode && report.correctedCode !== code && (
                  <div className="glass rounded-2xl p-5 w-full space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <Sparkles size={16} className="text-accent" />
                        <h3 className="text-sm font-bold uppercase tracking-wider text-muted">Corrected Program</h3>
                      </div>
                      {report.engine && <span className="text-[11px] font-mono text-slate-500">engine: {report.engine}</span>}
                    </div>
                    <pre className="text-xs font-mono text-[var(--editor-ink)] bg-[var(--editor-bg)] p-4 rounded-xl border border-line overflow-x-auto max-h-80 overflow-y-auto whitespace-pre-wrap">
                      {report.correctedCode}
                    </pre>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleApplyFix(report.correctedCode)}
                        className="btn btn-clay-accent btn-sm"
                      >
                        Apply Corrected Code to Editor
                      </button>
                      <button
                        onClick={() => copyText(report.correctedCode)}
                        className="btn btn-glass btn-sm"
                      >
                        <Copy size={12} />
                        Copy
                      </button>
                    </div>
                  </div>
                )}

                {selectedIssue && (
                  <div className="fixed inset-0 bg-[#000]/50 z-50 flex items-end justify-center">
                    <div className="liquid rounded-t-3xl p-6 max-w-xl w-full space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div>
                          <span className="text-[11px] text-indigo-600 font-bold uppercase tracking-wider">Line {selectedIssue.line} Violation</span>
                          <h3 className="font-bold text-slate-900 text-sm">{selectedIssue.ruleName}</h3>
                        </div>
                        <button onClick={() => setSelectedIssue(null)} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">{selectedIssue.message}</p>

                      <div className="glass rounded-xl p-3.5 space-y-2">
                        <div className="flex items-center space-x-1.5 text-xs font-bold text-ink">
                          <Lightbulb size={14} className="text-accent" />
                          <span>Suggested Auto-Fix Patch:</span>
                        </div>
                        <pre className="text-[11px] text-ink2 font-mono bg-surface p-2.5 rounded-lg border border-line overflow-x-auto">
                          {selectedIssue.suggestedFix}
                        </pre>
                      </div>

                      <button
                        onClick={() => handleApplyFix(selectedIssue.suggestedFix)}
                        className="btn btn-clay-accent btn-block"
                      >
                        Apply Patch to Editor Buffer
                      </button>
                    </div>
                  </div>
                )}

                {showRulesModal && (
                  <div className="fixed inset-0 bg-[#000]/50 z-50 flex items-center justify-center p-4">
                    <div className="liquid rounded-2xl p-6 max-w-md w-full space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
                          <Sliders size={18} className="text-indigo-600" />
                          <span>Static Analysis Rule Config</span>
                        </h3>
                        <button onClick={() => setShowRulesModal(false)} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
                      </div>
                      
                      <div className="space-y-3">
                        {Object.keys(activeRules).map((ruleKey) => (
                          <label key={ruleKey} className="flex items-center justify-between p-3 bg-surface2/70 rounded-xl border border-line cursor-pointer text-xs">
                            <span className="font-bold font-mono text-slate-700 capitalize">{ruleKey.replace(/([A-Z])/g, ' $1')}</span>
                            <input
                              type="checkbox"
                              checked={activeRules[ruleKey]}
                              onChange={(e) => setActiveRules({...activeRules, [ruleKey]: e.target.checked})}
                              className="w-4 h-4 accent-indigo-600 rounded"
                            />
                          </label>
                        ))}
                      </div>

                      <button
                        onClick={() => setShowRulesModal(false)}
                        className="btn btn-primary btn-block"
                      >
                        Save Rule Configuration
                      </button>
                    </div>
                  </div>
                )}

                {showExportModal && (
                  <div className="fixed inset-0 bg-[#000]/50 z-50 flex items-center justify-center p-4">
                    <div className="liquid rounded-2xl p-6 max-w-lg w-full space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
                          <FileText size={18} className="text-emerald-600" />
                          <span>Executive Security Audit Summary</span>
                        </h3>
                        <button onClick={() => setShowExportModal(false)} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
                      </div>
                      
                      <div className="space-y-2 bg-surface2/70 p-4 rounded-xl border border-line text-xs font-mono">
                        <p className="text-slate-600">Scan Timestamp: {new Date().toLocaleString()}</p>
                        <p className="text-slate-600">Health Rating Score: <strong className="text-slate-900">{health.grade}</strong></p>
                        <p className="text-slate-600">Total Vulnerabilities: <strong className="text-slate-900">{report?.totalIssues || 0}</strong></p>
                      </div>

                      <div className="flex space-x-3">
                        <button
                          onClick={() => {
                            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2));
                            const dl = document.createElement('a');
                            dl.setAttribute("href", dataStr);
                            dl.setAttribute("download", `security-audit-${Date.now()}.json`);
                            dl.click();
                            setShowExportModal(false);
                          }}
                          className="grow btn btn-brutal"
                        >
                          <Download size={16} />
                          <span>Download JSON Report</span>
                        </button>
                        <button
                          onClick={() => setShowExportModal(false)}
                          className="btn btn-ghost"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* History View */}
            {currentView === 'history' && (
              <div className="w-full p-8 space-y-4">
                <div className="liquid rounded-2xl p-6 w-full">
                  <h2 className="text-lg font-bold text-slate-800 mb-4">Past Scans Database Log</h2>
                  {history.length === 0 ? (
                    <p className="text-slate-500 text-sm">No past scans found in MongoDB.</p>
                  ) : (
                    <div className="space-y-3">
                      {history.map((scan) => (
                        <div key={scan._id} className="card p-4 rounded-xl flex items-center justify-between w-full gap-4">
                          <div className="min-w-0">
                            <p className="text-xs text-slate-400 mb-1">
                              Scanned at: {new Date(scan.createdAt).toLocaleString()}
                              <span className="ml-2 px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wide">
                                {scan.language || 'javascript'}
                              </span>
                            </p>
                            <p className="text-sm font-mono text-slate-700 truncate max-w-2xl" title={scan.codeSnippet}>{scan.codeSnippet}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <span className={`px-3 py-1 text-xs font-bold rounded-full ${scan.totalIssues > 0 ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                              {scan.totalIssues} Issues Found
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Dashboard View */}
            {currentView === 'dashboard' && (
              <div className="w-full max-w-6xl mx-auto px-6 py-8">
                <Dashboard setCurrentView={changeView} theme={theme} toggleTheme={toggleTheme} />
              </div>
            )}

            {/* Rule Builder View */}
            {currentView === 'rules' && (
              <div className="w-full">
                <RuleBuilder setCurrentView={changeView} />
              </div>
            )}

            {/* CI/CD View */}
            {currentView === 'cicd' && (
              <div className="w-full">
                <CICD setCurrentView={changeView} />
              </div>
            )}

            {/* Alerts View */}
            {currentView === 'alerts' && (
              <div className="w-full">
                <Alerts setCurrentView={changeView} />
              </div>
            )}

            {/* Settings View */}
            {currentView === 'settings' && (
              <div className="w-full">
                <Settings setCurrentView={changeView} />
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;