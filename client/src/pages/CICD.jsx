import { useState } from 'react';
import { Terminal, Copy, Check, GitBranch } from 'lucide-react';

export default function CICD() {
  const [copied, setCopied] = useState(false);
  const workflowCode = `name: Debugique AST Security Scan

on:
  push:
    branches: [ main, dev ]
  pull_request:
    branches: [ main ]

jobs:
  analyze:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run Debugique AST Scanner
        uses: debugique/action-scanner@v1
        with:
          api-key: \${{ secrets.DEBUGIQUE_API_KEY }}
          fail-on-severity: 'critical'`;

  const handleCopy = () => {
    navigator.clipboard.writeText(workflowCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">CI/CD Pipeline Integration</h1>
        <p className="text-slate-500 text-sm">Embed automated Abstract Syntax Tree code validation directly into your GitHub Actions workflow.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center space-x-2">
            <Terminal size={18} className="text-indigo-400" />
            <span className="text-xs font-mono">.github/workflows/debugique.yml</span>
          </div>
          <button 
            onClick={handleCopy}
            className="bg-slate-800 hover:bg-slate-700 text-xs px-3 py-1.5 rounded-lg font-semibold flex items-center space-x-1.5 transition"
          >
            {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            <span>{copied ? 'Copied Workflow' : 'Copy Code'}</span>
          </button>
        </div>
        <div className="p-6 bg-slate-950 overflow-x-auto">
          <pre className="text-indigo-300 font-mono text-xs leading-relaxed">
            {workflowCode}
          </pre>
        </div>
      </div>
    </div>
  );
}