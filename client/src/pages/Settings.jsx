import { useState } from 'react';
import { Key, Copy, Check, Shield, Globe, Users, Save } from 'lucide-react';

export default function Settings() {
  const [copied, setCopied] = useState(false);
  const apiKey = "dbg_live_99x82736410928374650";

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Workspace Settings</h1>
        <p className="text-slate-500 text-sm">Manage your developer API tokens, workspace configurations, and security policies.</p>
      </div>

      {/* API Key Management Box */}
      <div className="bg-white p-6 border border-slate-200 space-y-4 rounded-lg">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Key size={20} /></div>
          <div>
            <h3 className="font-bold text-slate-900">Developer API Key</h3>
            <p className="text-slate-500 text-xs">Use this bearer token to trigger automated AST scans via our CLI or API endpoints.</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 pt-2">
          <input 
            type="password" 
            readOnly 
            value={apiKey} 
            className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-mono text-slate-700 w-full max-w-md outline-none" 
          />
          <button 
            onClick={handleCopy}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition flex items-center space-x-2 shrink-0"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            <span>{copied ? 'Copied!' : 'Copy Key'}</span>
          </button>
        </div>
      </div>

      {/* Workspace Collaborators */}
      <div className="bg-white p-6 border border-slate-200 space-y-4 rounded-lg">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Users size={20} /></div>
          <div>
            <h3 className="font-bold text-slate-900">Team Collaborators</h3>
            <p className="text-slate-500 text-xs">Invite engineering teammates to review shared MongoDB logs and telemetry.</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 pt-2">
          <input 
            type="email" 
            placeholder="teammate@company.com" 
            className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 w-full max-w-md outline-none focus:ring-2 focus:ring-indigo-500" 
          />
          <button 
            onClick={() => alert('Invitation sent successfully!')}
            className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition shrink-0"
          >
            Invite Member
          </button>
        </div>
      </div>
    </div>
  );
}