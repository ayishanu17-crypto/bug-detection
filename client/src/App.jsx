import { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, ShieldAlert, Code, History, Lightbulb } from 'lucide-react';

function App() {
  const [code, setCode] = useState('');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('analyzer');

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
      alert('Failed to connect to the bug detector server.');
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
        return <span className="px-2 py-1 text-xs font-bold text-red-700 bg-red-100 rounded">HIGH</span>;
      case 'MEDIUM':
        return <span className="px-2 py-1 text-xs font-bold text-yellow-700 bg-yellow-100 rounded">MEDIUM</span>;
      case 'LOW':
        return <span className="px-2 py-1 text-xs font-bold text-blue-700 bg-blue-100 rounded">LOW</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex items-center justify-between border-b border-gray-800 pb-4">
          <div className="flex items-center space-x-3">
            <ShieldAlert className="w-8 h-8 text-indigo-400" />
            <h1 className="text-2xl font-bold tracking-wide">Static Bug Detector & Fixer</h1>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('analyzer')}
              className={`px-4 py-2 text-sm rounded flex items-center space-x-2 ${activeTab === 'analyzer' ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
            >
              <Code className="w-4 h-4" />
              <span>Analyzer</span>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 text-sm rounded flex items-center space-x-2 ${activeTab === 'history' ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
            >
              <History className="w-4 h-4" />
              <span>Scan History</span>
            </button>
          </div>
        </header>

        {activeTab === 'analyzer' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col bg-gray-800 rounded-lg p-4 shadow-lg border border-gray-700">
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-300 mb-2">
                <Code className="w-4 h-4 text-indigo-400" />
                <span>Paste Source Code Here</span>
              </label>
              <textarea
                className="w-full h-96 bg-gray-900 text-gray-200 font-mono text-sm p-4 rounded border border-gray-700 focus:outline-none focus:border-indigo-500 resize-none"
                placeholder="// Type or paste your JavaScript code here... \nvar x = 10;\neval('alert()');"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="mt-4 w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 px-4 rounded transition duration-200 disabled:opacity-50"
              >
                {loading ? 'Analyzing Code...' : 'Run Static Analysis'}
              </button>
            </div>

            <div className="flex flex-col bg-gray-800 rounded-lg p-4 shadow-lg border border-gray-700">
              <h2 className="text-sm font-medium text-gray-300 mb-2 flex items-center justify-between">
                <span>Analysis Report & Solutions</span>
                {report && (
                  <div className="flex items-center space-x-3">
                    <span className="text-xs text-gray-400">Total: {report.totalIssues}</span>
                    <button
                      onClick={handleDownloadReport}
                      className="text-xs bg-gray-700 hover:bg-gray-600 text-indigo-300 px-2 py-1 rounded border border-gray-600"
                    >
                      Export Report
                    </button>
                  </div>
                )}
              </h2>

              <div className="w-full h-96 bg-gray-900 rounded border border-gray-700 p-4 overflow-y-auto">
                {!report ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-500 text-sm">
                    <AlertTriangle className="w-8 h-8 mb-2 opacity-40" />
                    <p>Run an analysis to view bugs and recommended solutions.</p>
                  </div>
                ) : report.totalIssues === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-green-400 text-sm">
                    <CheckCircle className="w-8 h-8 mb-2" />
                    <p>No issues detected! Clean code.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {report.issuesFound.map((issue, index) => (
                      <div key={index} className="bg-gray-800 border border-gray-700 rounded p-3 text-sm">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-gray-200">
                            Line {issue.line}: {issue.ruleName}
                          </span>
                          {getSeverityBadge(issue.severity)}
                        </div>
                        <p className="text-gray-400 text-xs mb-2">{issue.message}</p>
                        <div className="mt-2 bg-gray-900 p-2 rounded border border-indigo-900/50">
                          <div className="flex items-center space-x-1 text-xs font-semibold text-indigo-400 mb-1">
                            <Lightbulb className="w-3.5 h-3.5" />
                            <span>Suggested Solution:</span>
                          </div>
                          <p className="text-xs text-gray-300 font-mono">{issue.suggestedFix}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
            <h2 className="text-lg font-semibold text-gray-200 mb-4">Past Scans Database</h2>
            {history.length === 0 ? (
              <p className="text-gray-400 text-sm">No past scans found in MongoDB.</p>
            ) : (
              <div className="space-y-4">
                {history.map((scan) => (
                  <div key={scan._id} className="bg-gray-900 border border-gray-700 p-4 rounded flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Scanned at: {new Date(scan.createdAt).toLocaleString()}</p>
                      <p className="text-sm font-mono text-gray-300 truncate max-w-xl">{scan.codeSnippet}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 text-xs font-bold rounded ${scan.totalIssues > 0 ? 'bg-red-900 text-red-200' : 'bg-green-900 text-green-200'}`}>
                        {scan.totalIssues} Issues Found
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;