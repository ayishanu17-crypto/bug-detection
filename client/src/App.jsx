import { useState, useEffect } from 'react';
import { 
  ShieldAlert, Code, History, Lightbulb, ArrowRight, CheckCircle2, 
  Cpu, Database, Zap, BarChart3, TrendingUp, Search, Layers, ChevronRight, CheckCircle, AlertTriangle 
} from 'lucide-react';

function App() {
  const [currentView, setCurrentView] = useState('home'); // 'home', 'analyzer', 'history'
  const [code, setCode] = useState('');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

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
        body: JSON.stringify({ code }),
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

  const handleDownloadReport = () => {
    if (!report) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `bug-report-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'HIGH':
        return <span className="px-2 py-0.5 text-xs font-bold text-red-700 bg-red-100 rounded">HIGH</span>;
      case 'MEDIUM':
        return <span className="px-2 py-0.5 text-xs font-bold text-amber-700 bg-amber-100 rounded">MEDIUM</span>;
      case 'LOW':
        return <span className="px-2 py-0.5 text-xs font-bold text-blue-700 bg-blue-100 rounded">LOW</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Navigation Bar - DebugBear Style */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentView('home')}>
            <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-sm shadow-indigo-200">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900">DebugBear</span>
          </div>
          <nav className="flex items-center space-x-1 sm:space-x-3">
            <button
              onClick={() => setCurrentView('home')}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition ${currentView === 'home' ? 'text-indigo-600 bg-indigo-50/80' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              Overview
            </button>
            <button
              onClick={() => setCurrentView('analyzer')}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition ${currentView === 'analyzer' ? 'text-indigo-600 bg-indigo-50/80' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              Live Code Analyzer
            </button>
            <button
              onClick={() => setCurrentView('history')}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition ${currentView === 'history' ? 'text-indigo-600 bg-indigo-50/80' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              Scan History
            </button>
            <button
              onClick={() => setCurrentView('analyzer')}
              className="ml-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg shadow-sm text-sm transition"
            >
              Get Started Free
            </button>
          </nav>
        </div>
      </header>

      {/* Dynamic Content Views */}
      <main className="flex-grow">
        {currentView === 'home' && (
          <div className="space-y-20 pb-24">
            
            {/* Hero Section */}
            <section className="relative overflow-hidden pt-16 pb-12 px-6 bg-gradient-to-b from-white via-slate-50 to-slate-100 border-b border-slate-200">
              <div className="max-w-5xl mx-auto text-center space-y-6">
                <div className="inline-flex items-center space-x-2 bg-indigo-50 border border-indigo-100 text-indigo-700 px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-2xs">
                  <Zap className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Monitor Code Quality & Core Web Vitals</span>
                </div>
                <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  Be faster than your <span className="text-indigo-600">competition</span>
                </h1>
                <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                  Optimize code architecture, identify bottlenecks instantly using AST syntax analysis, and automatically generate code fixes to elevate application performance.
                </p>
                <div className="pt-4 flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-4">
                  <button
                    onClick={() => setCurrentView('analyzer')}
                    className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3.5 rounded-xl shadow-md flex items-center justify-center space-x-2 transition"
                  >
                    <span>Start Analyzing Code</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setCurrentView('history')}
                    className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-700 font-semibold px-8 py-3.5 rounded-xl border border-slate-300 transition shadow-2xs"
                  >
                    View Database Logs
                  </button>
                </div>
                <p className="text-xs text-slate-400 pt-1">Get set up in minutes. No credit card required.</p>
              </div>

              {/* Mock Dashboard Preview Image Container */}
              <div className="max-w-5xl mx-auto mt-12 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden p-2 sm:p-4">
                <div className="bg-slate-900 rounded-xl p-4 text-left font-mono text-xs text-slate-300 overflow-x-auto shadow-inner flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                    <span className="text-slate-500 ml-2">~/bug-detector/server.js</span>
                  </div>
                  <span className="text-emerald-400 font-semibold">● AST Engine Online</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 text-left">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <p className="text-xs text-slate-500 font-medium">Synthetic Scans</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">100% Real-time</p>
                    <span className="text-xs text-emerald-600 font-semibold mt-2 inline-block">✓ Acorn Engine parsing</span>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <p className="text-xs text-slate-500 font-medium">Automated Fixes</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">Instant Solution</p>
                    <span className="text-xs text-indigo-600 font-semibold mt-2 inline-block">✓ Inline code recommendations</span>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <p className="text-xs text-slate-500 font-medium">Database Persistence</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">MongoDB Logged</p>
                    <span className="text-xs text-amber-600 font-semibold mt-2 inline-block">✓ Complete audit trails</span>
                  </div>
                </div>
              </div>
            </section>

            {/* 3 Step Workflow Section */}
            <section className="max-w-6xl mx-auto px-6 py-8">
              <div className="text-center max-w-xl mx-auto space-y-3 mb-12">
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">An efficient code optimization workflow</h2>
                <p className="text-slate-600 text-sm">Everything you need to catch vulnerabilities, trace historical performance, and refactor seamlessly.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4 relative group hover:border-indigo-500 transition">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold text-lg">
                    1
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Identify slow & flawed code</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Paste raw source files or test scripts to immediately highlight syntax errors, high-risk functions, and security risks.
                  </p>
                </div>

                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4 relative group hover:border-indigo-500 transition">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-bold text-lg">
                    2
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Diagnose performance bottlenecks</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Receive comprehensive reporting paired with precise bug descriptions, line numbers, and severity breakdowns.
                  </p>
                </div>

                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4 relative group hover:border-indigo-500 transition">
                  <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center font-bold text-lg">
                    3
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Apply instant solutions</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Get clear refactoring directions and best practices to safely clean your codebase and export complete reports.
                  </p>
                </div>
              </div>
            </section>

            {/* Testimonials Section */}
            <section className="bg-slate-100/70 border-y border-slate-200 py-16 px-6">
              <div className="max-w-6xl mx-auto space-y-12">
                <div className="text-center max-w-lg mx-auto">
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Trusted by expert developers</h2>
                  <p className="text-slate-600 text-sm mt-2">See how teams use DebugBear workflows to ensure top-tier software performance.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
                    <p className="text-slate-700 text-sm leading-relaxed italic">
                      "DebugBear has been an eye opener for us and has really shown what's causing the performance bottlenecks on our codebases. The actionable solutions are invaluable."
                    </p>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Mandip Ahdan</p>
                      <p className="text-xs text-slate-500">Head of Engineering</p>
                    </div>
                  </div>

                  <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
                    <p className="text-slate-700 text-sm leading-relaxed italic">
                      "The most actionable-info packed page speed & code visualization available. Provides unique features that are crucial to debugging complex issues instantly."
                    </p>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Robin Marx</p>
                      <p className="text-xs text-slate-500">Web Protocol and Performance Expert</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Bottom Call to Action */}
            <section className="max-w-5xl mx-auto px-6 text-center space-y-6 pt-6">
              <div className="bg-indigo-900 text-white rounded-3xl p-10 sm:p-14 space-y-6 shadow-xl relative overflow-hidden">
                <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
                  <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Ready to optimize your code?</h2>
                  <p className="text-indigo-200 text-sm sm:text-base">
                    Jump into the Live Code Analyzer right now to run your first structural check.
                  </p>
                  <button
                    onClick={() => setCurrentView('analyzer')}
                    className="mt-4 bg-white text-indigo-900 hover:bg-indigo-50 font-bold px-8 py-3.5 rounded-xl shadow-lg transition inline-flex items-center space-x-2"
                  >
                    <span>Launch Live Analyzer</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </section>

          </div>
        )}

        {currentView === 'analyzer' && (
          <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Code Input Section */}
            <div className="flex flex-col bg-white rounded-2xl p-5 shadow-xs border border-slate-200">
              <label className="flex items-center space-x-2 text-sm font-semibold text-slate-700 mb-2">
                <Code className="w-4 h-4 text-indigo-600" />
                <span>Paste Source Code Here</span>
              </label>
              <textarea
                className="w-full h-96 bg-slate-900 text-slate-100 font-mono text-sm p-4 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none shadow-inner"
                placeholder="// Type or paste your JavaScript code here...&#10;var x = 10;&#10;eval('alert()');"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-xl shadow transition duration-200 disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <span>Analyzing AST Trees...</span>
                ) : (
                  <>
                    <span>Run Static Analysis</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {/* Results Report Section with Solutions */}
            <div className="flex flex-col bg-white rounded-2xl p-5 shadow-xs border border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-slate-700">Analysis Report & Solutions</h2>
                {report && (
                  <div className="flex items-center space-x-3">
                    <span className="text-xs font-medium text-slate-500">
                      Total Issues: {report.totalIssues}
                    </span>
                    <button
                      onClick={handleDownloadReport}
                      className="text-xs bg-slate-100 hover:bg-slate-200 text-indigo-700 font-semibold px-3 py-1.5 rounded-lg border border-slate-300 transition"
                    >
                      Export JSON Report
                    </button>
                  </div>
                )}
              </div>

              <div className="w-full h-96 bg-slate-50 rounded-xl border border-slate-200 p-4 overflow-y-auto">
                {!report ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 text-sm text-center px-4">
                    <AlertTriangle className="w-8 h-8 mb-2 opacity-50 text-indigo-500" />
                    <p>Run an analysis to view discovered bugs and instant inline solutions.</p>
                  </div>
                ) : report.totalIssues === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-emerald-600 text-sm font-medium">
                    <CheckCircle className="w-8 h-8 mb-2" />
                    <p>No issues detected! Clean code.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {report.issuesFound.map((issue, index) => (
                      <div key={index} className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs text-sm space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800">
                            Line {issue.line}: {issue.ruleName}
                          </span>
                          {getSeverityBadge(issue.severity)}
                        </div>
                        <p className="text-slate-600 text-xs">{issue.message}</p>
                        
                        <div className="bg-indigo-50/70 border border-indigo-100 rounded-lg p-3 mt-2">
                          <div className="flex items-center space-x-1.5 text-xs font-bold text-indigo-700 mb-1">
                            <Lightbulb className="w-3.5 h-3.5" />
                            <span>Suggested Solution:</span>
                          </div>
                          <p className="text-xs text-slate-700 font-mono bg-white p-2 rounded border border-indigo-100/60">
                            {issue.suggestedFix}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {currentView === 'history' && (
          <div className="max-w-6xl mx-auto p-6">
            <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200">
              <h2 className="text-lg font-bold text-slate-800 mb-4">Past Scans Database Log</h2>
              {history.length === 0 ? (
                <p className="text-slate-500 text-sm">No past scans found in MongoDB.</p>
              ) : (
                <div className="space-y-3">
                  {history.map((scan) => (
                    <div key={scan._id} className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-center justify-between">
                      <div>
                        <p className="text-xs text-slate-400 mb-1">Scanned at: {new Date(scan.createdAt).toLocaleString()}</p>
                        <p className="text-sm font-mono text-slate-700 truncate max-w-xl">{scan.codeSnippet}</p>
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
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 text-indigo-600" />
            <span className="font-bold text-slate-800">DebugBear Analyzer</span>
          </div>
          <p>© 2026 DebugBear Ltd. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;