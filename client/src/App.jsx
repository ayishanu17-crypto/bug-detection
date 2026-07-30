import { useState } from 'react';
import { AlertTriangle, CheckCircle, ShieldAlert, Code } from 'lucide-react';

function App() {
  const [code, setCode] = useState('');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

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
    } catch (err) {
      console.error('Error connecting to backend:', err);
      alert('Failed to connect to the bug detector server.');
    } finally {
      setLoading(false);
    }
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
            <h1 className="text-2xl font-bold tracking-wide">Static Bug Detector</h1>
          </div>
          <span className="text-sm text-gray-400">MVP Prototype</span>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Code Input Section */}
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

          {/* Results Report Section */}
          <div className="flex flex-col bg-gray-800 rounded-lg p-4 shadow-lg border border-gray-700">
            <h2 className="text-sm font-medium text-gray-300 mb-2 flex items-center justify-between">
              <span>Analysis Report</span>
              {report && (
                <span className="text-xs text-gray-400">
                  Total Issues: {report.totalIssues}
                </span>
              )}
            </h2>

            <div className="w-full h-96 bg-gray-900 rounded border border-gray-700 p-4 overflow-y-auto">
              {!report ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 text-sm">
                  <AlertTriangle className="w-8 h-8 mb-2 opacity-40" />
                  <p>Run an analysis to view detected bugs and vulnerabilities.</p>
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
                      <code className="block bg-gray-900 p-2 rounded text-xs font-mono text-red-400 border border-gray-800 overflow-x-auto">
                        {issue.snippet}
                      </code>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;