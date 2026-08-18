import { useState } from 'react';
import { Terminal, Copy, Check } from 'lucide-react';

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

      <div className="card overflow-hidden">
        <div className="editor px-6 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="flex items-center gap-1.5 mr-2">
              <span className="dot dot-red"></span>
              <span className="dot dot-yellow"></span>
              <span className="dot dot-green"></span>
            </span>
            <Terminal size={18} className="opacity-70" />
            <span className="text-xs font-mono">.github/workflows/debugique.yml</span>
          </div>
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold border border-[var(--editor-line)] text-[var(--editor-ink)] hover:bg-white/10 transition"
          >
            {copied ? <Check size={14} className="text-ok" /> : <Copy size={14} />}
            <span>{copied ? 'Copied Workflow' : 'Copy Code'}</span>
          </button>
        </div>
        <div className="editor p-6 overflow-x-auto">
          <pre className="font-mono text-xs leading-relaxed">
            {workflowCode}
          </pre>
        </div>
      </div>
    </div>
  );
}