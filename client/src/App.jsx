import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { 
  Code, History, Lightbulb, ArrowRight, CheckCircle2, 
  Zap, AlertTriangle, CheckCircle, Network, Terminal 
} from 'lucide-react';

function App() {
  const [currentView, setCurrentView] = useState('home'); // 'home', 'analyzer', 'history', 'login', 'signup'
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
      <Navbar currentView={currentView} setCurrentView={setCurrentView} />

      {/* Main Views */}
      <main className="grow">
        {currentView === 'home' && (
          <div className="space-y-24 pb-24">
            
            {/* Hero Section with Image Preview */}
            <section className="relative pt-16 pb-12 px-6 bg-linear-to-b from-white via-slate-50 to-slate-100 border-b border-slate-200">
              <div className="max-w-5xl mx-auto text-center space-y-6">
                <div className="inline-flex items-center space-x-2 bg-indigo-50 border border-indigo-100 text-indigo-700 px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-2xs">
                  <Zap className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Next-Gen AST Static Analysis Platform</span>
                </div>
                <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  Be faster than your <span className="text-indigo-600">competition</span>
                </h1>
                <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                  Optimize code architecture, identify vulnerabilities instantly using Abstract Syntax Trees, and automatically generate code fixes.
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
              </div>

              {/* Attractive Hero Image Banner */}
              <div className="max-w-5xl mx-auto mt-12 relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200 group">
                <div className="absolute inset-0 bg-indigo-950/20 z-10 group-hover:bg-transparent transition duration-500"></div>
                <img 
                  src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80" 
                  alt="Code Development Dashboard" 
                  className="w-full h-80 sm:h-96 object-cover transform group-hover:scale-105 transition duration-700"
                />
                <div className="absolute bottom-4 left-4 right-4 z-20 bg-slate-900/90 backdrop-blur-md p-4 rounded-xl border border-slate-800 text-left flex items-center justify-between text-white">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></div>
                    <span className="text-xs font-mono">Live Scan: Acorn Engine Parser Active</span>
                  </div>
                  <span className="text-xs bg-indigo-600 text-white px-2.5 py-1 rounded-md font-semibold">Ready</span>
                </div>
              </div>
            </section>

            {/* Feature Cards with Tech Imagery */}
            <section className="max-w-6xl mx-auto px-6">
              <div className="text-center max-w-xl mx-auto space-y-3 mb-12">
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Comprehensive code intelligence</h2>
                <p className="text-slate-600 text-sm">Everything you need to catch vulnerabilities and refactor code seamlessly.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80" 
                      alt="AST Parsing" 
                      className="w-full h-full object-cover hover:scale-105 transition duration-500"
                    />
                  </div>
                  <div className="p-6 space-y-2">
                    <h3 className="text-lg font-bold text-slate-900">AST Structural Parsing</h3>
                    <p className="text-slate-600 text-sm">Parses code syntax trees via Acorn engine instead of basic string regex checks.</p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80" 
                      alt="Instant Fixes" 
                      className="w-full h-full object-cover hover:scale-105 transition duration-500"
                    />
                  </div>
                  <div className="p-6 space-y-2">
                    <h3 className="text-lg font-bold text-slate-900">Instant Solutions</h3>
                    <p className="text-slate-600 text-sm">Automatically offers actionable refactoring guidelines for every bug discovered.</p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80" 
                      alt="Database Persistence" 
                      className="w-full h-full object-cover hover:scale-105 transition duration-500"
                    />
                  </div>
                  <div className="p-6 space-y-2">
                    <h3 className="text-lg font-bold text-slate-900">MongoDB Persistence</h3>
                    <p className="text-slate-600 text-sm">Maintains persistent logs of past scan histories and structured JSON reports.</p>
                  </div>
                </div>
              </div>
            </section>

          </div>
        )}

        {currentView === 'analyzer' && (
          <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
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

        {currentView === 'login' && <Login setCurrentView={setCurrentView} />}
        {currentView === 'signup' && <Signup setCurrentView={setCurrentView} />}
      </main>

      <Footer />
    </div>
  );
}

export default App;