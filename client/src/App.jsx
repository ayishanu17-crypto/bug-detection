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
  Code, History, Lightbulb, ArrowRight, CheckCircle2, 
  Zap, AlertTriangle, CheckCircle, Network, Terminal, User, LogOut, ShieldAlert, GitCompare, ShieldCheck, Sliders, Download, FileText, X, Play
} from 'lucide-react';

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
    try {
      const res = await fetch('http://localhost:5000/api/history');
      const data = await res.json();
      setHistory(data);
    } catch (err) {
      console.error('Failed to load history', err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleAnalyze = async () => {
    if (!code.trim()) return;
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, activeRules }),
      });
      const data = await response.json();
      setReport(data);
      fetchHistory();
    } catch (err) {
      console.error('Error connecting to backend:', err);
      alert('Failed to connect to the bug detector server. Make sure your backend and MongoDB are running.');
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

  const getHealthScore = () => {
    if (!report) return { grade: 'A+', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' };
    if (report.totalIssues === 0) return { grade: 'A+', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' };
    if (report.totalIssues <= 2) return { grade: 'B', color: 'text-amber-600 bg-amber-50 border-amber-200' };
    return { grade: 'C', color: 'text-red-600 bg-red-50 border-red-200' };
  };

  const health = getHealthScore();

  const isSplitLayout = currentView === 'login' || currentView === 'signup' || currentView === 'settings' || currentView === 'cicd' || currentView === 'rules' || currentView === 'alerts';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-indigo-500 selection:text-white flex flex-col w-full">
      
      {!isSplitLayout && currentView !== 'dashboard' && <Navbar currentView={currentView} setCurrentView={changeView} />}

      <main className={`grow w-full flex flex-col ${!isSplitLayout ? 'pb-24' : ''}`}>
        
        {/* Split Screen Layout for Auth/Settings */}
        {isSplitLayout ? (
          <div className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-slate-950">
            <div className="bg-white p-8 sm:p-16 flex flex-col justify-between overflow-y-auto">
              <div className="space-y-6 w-full max-w-xl mx-auto">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold tracking-widest text-indigo-600 uppercase">CodeGuard</span>
                  <button onClick={() => changeView('home')} className="text-xs text-slate-500 hover:text-indigo-600 font-semibold">Back to Home</button>
                </div>
                {currentView === 'login' && <Login setCurrentView={changeView} />}
                {currentView === 'signup' && <Signup setCurrentView={changeView} />}
                {currentView === 'settings' && <Settings />}
                {currentView === 'cicd' && <CICD />}
                {currentView === 'rules' && <RuleBuilder />}
                {currentView === 'alerts' && <Alerts />}
              </div>
              <div className="w-full max-w-xl mx-auto text-xs text-slate-400 pt-6 border-t border-slate-100 flex justify-between items-center mt-4">
                <span>Enterprise Workspace</span>
                <span className="text-indigo-600 font-semibold">v2.4</span>
              </div>
            </div>

            <div className="relative overflow-hidden hidden lg:flex flex-col justify-between p-12 text-white bg-slate-950">
              <div className="absolute inset-0 z-0">
                <img 
                  src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1800&q=80" 
                  alt="Developer Code Workspace" 
                  className="w-full h-full object-cover opacity-85 transform scale-100 hover:scale-105 transition duration-1000"
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
              </div>

              <div className="flex justify-between items-center z-10">
                <span className="font-bold tracking-wider text-xs bg-black/40 text-white px-3.5 py-1.5 rounded-full uppercase border border-white/20 backdrop-blur-md">
                  Enterprise Grade
                </span>
                <span className="font-extrabold text-lg tracking-tight text-white drop-shadow-md">CodeGuard</span>
              </div>

              <div className="z-10 space-y-3 bg-slate-950/70 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-2xl max-w-lg">
                <h3 className="text-base font-bold text-white">Automated Code Intelligence</h3>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  Real-time AST parsing, automated patch generation, and deep repository health metrics built for modern development teams.
                </p>
                <div className="pt-2 flex items-center space-x-2 text-xs text-emerald-400 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Static Analysis Engine Fully Operational</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Home View */}
            {currentView === 'home' && (
              <div className="w-full space-y-24 pb-24">
                <section className="relative pt-16 pb-12 px-8 w-full bg-white border-b border-slate-200 animated-fade-in-up">
                  <div className="w-full text-center space-y-6">
                    <div className="inline-flex items-center space-x-2 bg-indigo-50 border border-indigo-100 text-indigo-700 px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-2xs animated-pulse-glow">
                      <Zap className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Next-Gen AST Static Analysis Platform</span>
                    </div>
                    <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
                      Be faster than your <span className="text-indigo-600">competition</span>
                    </h1>
                    <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                      Optimize code architecture, identify vulnerabilities instantly using Abstract Syntax Trees, and automatically generate code fixes.
                    </p>
                    <div className="pt-4 flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-4">
                      <button
                        onClick={() => changeView('analyzer')}
                        className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3.5 rounded-xl shadow-md flex items-center justify-center space-x-2 transition"
                      >
                        <span>Start Analyzing Code</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => changeView('history')}
                        className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-700 font-semibold px-8 py-3.5 rounded-xl border border-slate-300 transition shadow-2xs"
                      >
                        View Database Logs
                      </button>
                    </div>
                  </div>

                  <div className="w-full mt-12 relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200 group animated-float">
                    <div className="absolute inset-0 bg-indigo-950/20 z-10 group-hover:bg-transparent transition duration-500"></div>
                    <img 
                      src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1800&q=80" 
                      alt="Code Development Dashboard" 
                      className="w-full h-96 sm:h-112.5 object-cover transform group-hover:scale-105 transition duration-700"
                    />
                    <div className="absolute bottom-6 left-6 right-6 z-20 bg-slate-900/90 backdrop-blur-md p-5 rounded-xl border border-slate-800 text-left flex items-center justify-between text-white">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></div>
                        <span className="text-xs sm:text-sm font-mono">Live Scan: Acorn Engine Parser Active</span>
                      </div>
                      <span className="text-xs bg-indigo-600 text-white px-3 py-1 rounded-md font-semibold">Ready</span>
                    </div>
                  </div>
                </section>

                <section className="w-full px-8">
                  <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Comprehensive code intelligence</h2>
                    <p className="text-slate-600 text-base">Everything you need to catch vulnerabilities and refactor code seamlessly.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full animated-fade-in-up">
                    <div className="motion-card bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition">
                      <div className="h-56 overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80" alt="AST Parsing" className="w-full h-full object-cover hover:scale-105 transition duration-500" />
                      </div>
                      <div className="p-6 space-y-2">
                        <h3 className="text-lg font-bold text-slate-900">AST Structural Parsing</h3>
                        <p className="text-slate-600 text-sm">Parses code syntax trees via Acorn engine instead of basic string regex checks.</p>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition">
                      <div className="h-56 overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80" alt="Instant Fixes" className="w-full h-full object-cover hover:scale-105 transition duration-500" />
                      </div>
                      <div className="p-6 space-y-2">
                        <h3 className="text-lg font-bold text-slate-900">Instant Solutions</h3>
                        <p className="text-slate-600 text-sm">Automatically offers actionable refactoring guidelines for every bug discovered.</p>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition">
                      <div className="h-56 overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80" alt="Database Persistence" className="w-full h-full object-cover hover:scale-105 transition duration-500" />
                      </div>
                      <div className="p-6 space-y-2">
                        <h3 className="text-lg font-bold text-slate-900">MongoDB Persistence</h3>
                        <p className="text-slate-600 text-sm">Maintains persistent logs of past scan histories and structured JSON reports.</p>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="w-full bg-slate-50 px-8 py-16 animated-fade-in-up">
                  <div className="max-w-5xl mx-auto grid gap-10 lg:grid-cols-2 items-center">
                    <div className="space-y-6">
                      <span className="inline-flex items-center rounded-full bg-indigo-100 text-indigo-700 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em]">How it works</span>
                      <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">From code scan to confidence in minutes</h2>
                      <p className="text-slate-600 text-base sm:text-lg leading-8">
                        Debugique analyzes your repository using static AST parsing, identifies security issues, and returns clear remediation steps. It is designed for developers, security teams, and engineering managers who need fast, accurate insights.
                      </p>
                    </div>

                    <div className="grid gap-4">
                      {[
                        { title: 'Analyze code instantly', description: 'Paste or upload source files and run a single scan to uncover hidden bugs, dead code, and security vulnerabilities.' },
                        { title: 'Track issues over time', description: 'Store scan results in MongoDB and review historical trends to identify recurring quality risks.' },
                        { title: 'Generate actionable fixes', description: 'Receive exact patch suggestions and apply them directly to your editor buffer with one click.' },
                        { title: 'Maintain rule hygiene', description: 'Enable or disable rules such as no-eval, strict comparisons, and unused variable detection with an intuitive panel.' },
                      ].map((item) => (
                        <div key={item.title} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition">
                          <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                          <p className="mt-2 text-slate-600 text-sm leading-6">{item.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                <section className="w-full px-8 py-16 animated-fade-in-up">
                  <div className="max-w-6xl mx-auto space-y-10">
                    <div className="grid gap-6 lg:grid-cols-3">
                      {[
                        { value: '98%', label: 'Accuracy in issue detection' },
                        { value: '3x', label: 'Faster remediation planning' },
                        { value: '24/7', label: 'Live scan readiness' },
                      ].map((stat) => (
                        <div key={stat.label} className="rounded-3xl bg-slate-900 text-white p-8 text-center shadow-lg">
                          <p className="text-4xl font-extrabold">{stat.value}</p>
                          <p className="mt-3 text-sm text-slate-300">{stat.label}</p>
                        </div>
                      ))}
                    </div>

                    <div className="grid gap-6 lg:grid-cols-3">
                      <div className="rounded-3xl bg-white border border-slate-200 p-8 shadow-sm">
                        <h3 className="text-xl font-semibold text-slate-900">Developer-friendly UX</h3>
                        <p className="mt-3 text-slate-600 text-sm leading-6">Code-aware scan reports help your team fix problems without hunting through logs or manual reviews.</p>
                      </div>
                      <div className="rounded-3xl bg-white border border-slate-200 p-8 shadow-sm">
                        <h3 className="text-xl font-semibold text-slate-900">Compliance-oriented checks</h3>
                        <p className="mt-3 text-slate-600 text-sm leading-6">Gain visibility into quality issues, insecure patterns, and rule violations before they reach production.</p>
                      </div>
                      <div className="rounded-3xl bg-white border border-slate-200 p-8 shadow-sm">
                        <h3 className="text-xl font-semibold text-slate-900">Built for modern teams</h3>
                        <p className="mt-3 text-slate-600 text-sm leading-6">From single developers to cross-functional security squads, Debugique supports rapid iteration and clear ownership.</p>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="w-full bg-slate-50 px-8 py-16 animated-fade-in-up">
                  <div className="max-w-6xl mx-auto grid gap-10 lg:grid-cols-3">
                    <div className="lg:col-span-2 rounded-3xl bg-white border border-slate-200 p-10 shadow-sm">
                      <h2 className="text-3xl font-extrabold text-slate-900">What engineers love about Debugique</h2>
                      <p className="mt-4 text-slate-600 leading-7">Instead of noisy static reports, enjoy structured issue summaries, recommended fixes, and tracking for every scan. The platform is built to help you ship stable code faster.</p>
                      <div className="mt-8 space-y-5">
                        {[
                          { title: 'Clear remediation guidance', caption: 'Each issue includes a suggested patch sequence and explanation for rapid repair.' },
                          { title: 'Historical context', caption: 'Review past scan history to see how your code quality improves over time.' },
                          { title: 'Flexible rule control', caption: 'Toggle rule sets quickly so you can enforce the standards that matter most for your project.' },
                        ].map((feature) => (
                          <div key={feature.title} className="rounded-3xl bg-slate-50 border border-slate-200 p-6">
                            <h3 className="font-semibold text-slate-900">{feature.title}</h3>
                            <p className="mt-2 text-slate-600 text-sm leading-6">{feature.caption}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-3xl bg-white border border-slate-200 p-10 shadow-sm flex flex-col justify-between">
                      <div>
                        <span className="text-xs uppercase tracking-[0.25em] text-indigo-600 font-bold">Trusted by developers</span>
                        <h3 className="mt-4 text-2xl font-bold text-slate-900">Keep code quality visible</h3>
                        <p className="mt-3 text-slate-600 text-sm leading-6">Whether you are performing a quick sanity scan or doing an executive audit, Debugique offers a full code health overview in one place.</p>
                      </div>
                      <div className="mt-8 space-y-4 text-sm text-slate-600">
                        <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200">
                          <p className="font-semibold text-slate-900">DevOps</p>
                          <p>Optimize pipeline health with fast results and reduced manual debugging.</p>
                        </div>
                        <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200">
                          <p className="font-semibold text-slate-900">Security teams</p>
                          <p>Catch insecure patterns early and maintain control over vulnerable code paths.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {/* Analyzer View */}
            {currentView === 'analyzer' && (
              <div className="w-full p-8 space-y-6 relative">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between w-full">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl"><Code size={22} /></div>
                    <div>
                      <h2 className="font-bold text-slate-900 text-base">Interactive AST Code Analyzer</h2>
                      <p className="text-slate-500 text-xs">Run syntax trees, configure rules, and export executive reports.</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {report && (
                      <div className={`px-4 py-2 rounded-xl border font-bold text-xs ${health.color}`}>
                        <span>Health: {health.grade}</span>
                      </div>
                    )}
                    <button
                      onClick={() => setShowRulesModal(true)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-4 py-2.5 rounded-xl text-xs flex items-center space-x-1.5 transition border border-slate-200"
                    >
                      <Sliders size={14} />
                      <span>Configure Rules</span>
                    </button>
                    {report && (
                      <button
                        onClick={() => setShowExportModal(true)}
                        className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold px-4 py-2.5 rounded-xl text-xs flex items-center space-x-1.5 transition border border-emerald-200"
                      >
                        <Download size={14} />
                        <span>Export</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                  <div className="flex flex-col bg-white rounded-2xl p-6 shadow-xs border border-slate-200 w-full">
                    <label className="text-sm font-semibold text-slate-700 mb-3">Source Code Buffer</label>
                    <textarea
                      className="w-full h-125 bg-slate-900 text-slate-100 font-mono text-sm p-5 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none shadow-inner"
                      placeholder="// Paste JavaScript code here..."
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col bg-white rounded-2xl p-6 shadow-xs border border-slate-200 w-full">
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="text-sm font-semibold text-slate-700">Discovered Issues & Patches</h2>
                      {report && <span className="text-xs font-medium text-slate-500">Total: {report.totalIssues}</span>}
                    </div>

                    <div className="w-full h-125 bg-slate-50 rounded-xl border border-slate-200 p-4 overflow-y-auto">
                      {!report ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400 text-sm text-center px-4">
                          <AlertTriangle className="w-8 h-8 mb-2 opacity-50 text-indigo-500" />
                          <p>Run an analysis using the floating play button below to generate solutions.</p>
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
                              className="bg-white border border-slate-200 hover:border-indigo-300 rounded-xl p-4 shadow-2xs text-sm space-y-1.5 cursor-pointer transition"
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

                <button
                  onClick={handleAnalyze}
                  disabled={loading}
                  className="fixed bottom-8 right-8 z-40 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold p-4 rounded-full shadow-2xl flex items-center justify-center transition active:scale-95 disabled:opacity-50"
                  title="Run Quick Scan"
                >
                  {loading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Play size={24} className="fill-white" />}
                </button>

                {selectedIssue && (
                  <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-end justify-center">
                    <div className="bg-white rounded-t-3xl p-6 max-w-xl w-full space-y-4 shadow-2xl border-t border-slate-200">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div>
                          <span className="text-[11px] text-indigo-600 font-bold uppercase tracking-wider">Line {selectedIssue.line} Violation</span>
                          <h3 className="font-bold text-slate-900 text-sm">{selectedIssue.ruleName}</h3>
                        </div>
                        <button onClick={() => setSelectedIssue(null)} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">{selectedIssue.message}</p>

                      <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-3.5 space-y-2">
                        <div className="flex items-center space-x-1.5 text-xs font-bold text-indigo-700">
                          <Lightbulb size={14} />
                          <span>Suggested Auto-Fix Patch:</span>
                        </div>
                        <pre className="text-[11px] text-slate-700 font-mono bg-white p-2.5 rounded-lg border border-indigo-100 overflow-x-auto">
                          {selectedIssue.suggestedFix}
                        </pre>
                      </div>

                      <button
                        onClick={() => handleApplyFix(selectedIssue.suggestedFix)}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl text-xs transition shadow"
                      >
                        Apply Patch to Editor Buffer
                      </button>
                    </div>
                  </div>
                )}

                {showRulesModal && (
                  <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-6 shadow-2xl border border-slate-200">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
                          <Sliders size={18} className="text-indigo-600" />
                          <span>Static Analysis Rule Config</span>
                        </h3>
                        <button onClick={() => setShowRulesModal(false)} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
                      </div>
                      
                      <div className="space-y-3">
                        {Object.keys(activeRules).map((ruleKey) => (
                          <label key={ruleKey} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer text-xs">
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
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl text-sm transition"
                      >
                        Save Rule Configuration
                      </button>
                    </div>
                  </div>
                )}

                {showExportModal && (
                  <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-lg w-full space-y-6 shadow-2xl border border-slate-200">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
                          <FileText size={18} className="text-emerald-600" />
                          <span>Executive Security Audit Summary</span>
                        </h3>
                        <button onClick={() => setShowExportModal(false)} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
                      </div>
                      
                      <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs font-mono">
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
                          className="grow bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-xl text-sm transition flex items-center justify-center space-x-2"
                        >
                          <Download size={16} />
                          <span>Download JSON Report</span>
                        </button>
                        <button
                          onClick={() => setShowExportModal(false)}
                          className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold px-4 py-2.5 rounded-xl text-sm transition"
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
                <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 w-full">
                  <h2 className="text-lg font-bold text-slate-800 mb-4">Past Scans Database Log</h2>
                  {history.length === 0 ? (
                    <p className="text-slate-500 text-sm">No past scans found in MongoDB.</p>
                  ) : (
                    <div className="space-y-3">
                      {history.map((scan) => (
                        <div key={scan._id} className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-center justify-between w-full">
                          <div>
                            <p className="text-xs text-slate-400 mb-1">Scanned at: {new Date(scan.createdAt).toLocaleString()}</p>
                            <p className="text-sm font-mono text-slate-700 truncate max-w-2xl">{scan.codeSnippet}</p>
                          </div>
                          <div className="text-right">
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
              <div className="w-full p-8 space-y-4">
                <Dashboard setCurrentView={changeView} />
              </div>
            )}
          </>
        )}
      </main>

      {!isSplitLayout && currentView !== 'dashboard' && <Footer />}
    </div>
  );
}

export default App;