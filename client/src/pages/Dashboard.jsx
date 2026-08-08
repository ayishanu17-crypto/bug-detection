import { ShieldAlert, LogOut, ArrowRight, CheckCircle2, Activity, User, Code2, Database, Clock, Terminal, Key, GitBranch } from 'lucide-react';

export default function Dashboard({ setCurrentView }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Bar */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-600 p-2 rounded-xl text-white">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 block leading-none">Debugique</span>
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">User Dashboard</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-slate-100 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700">
              <User className="w-4 h-4 text-indigo-600" />
              <span>Workspace Active</span>
            </div>
            <button
              onClick={() => setCurrentView('home')}
              className="flex items-center space-x-1 text-sm font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Dashboard Main Content */}
      <main className="max-w-7xl mx-auto p-6 space-y-8 grow w-full">
        {/* Hero Welcome Banner */}
        <div className="bg-gradient-to-r from-indigo-900 to-slate-900 rounded-2xl p-8 text-white shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <span className="bg-indigo-500/30 text-indigo-300 text-xs font-semibold px-3 py-1 rounded-full border border-indigo-400/30">
              Welcome to Debugique
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight">Your Code Intelligence Hub</h1>
            <p className="text-slate-300 text-sm max-w-xl">
              Launch live AST static analysis code scans, review past telemetry logs, and configure CI/CD pipelines seamlessly.
            </p>
          </div>
          <button
            onClick={() => setCurrentView('analyzer')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3.5 rounded-xl shadow-md transition flex items-center space-x-2 shrink-0"
          >
            <span>Open Live Analyzer</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Scans Run</span>
            <div className="text-3xl font-bold text-slate-900">12</div>
            <p className="text-xs text-emerald-600 font-medium flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Engine operational</span>
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Parsers</span>
            <div className="text-3xl font-bold text-slate-900">Acorn AST</div>
            <p className="text-xs text-indigo-600 font-medium">Real-time syntax tracking</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Database Status</span>
            <div className="text-3xl font-bold text-emerald-600">Connected</div>
            <p className="text-xs text-slate-500">MongoDB telemetry active</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Vulnerabilities Found</span>
            <div className="text-3xl font-bold text-amber-600">3 Pending</div>
            <p className="text-xs text-slate-500">Auto-fix available</p>
          </div>
        </div>

        {/* Extended Navigation Grid (Includes Settings & CI/CD) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Platform Navigation & Tools</h2>
            <p className="text-slate-500 text-xs">Access all debugging modules and integration pipelines.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div 
              onClick={() => setCurrentView('analyzer')}
              className="p-5 rounded-xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/20 transition cursor-pointer flex flex-col justify-between space-y-3"
            >
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg w-fit"><Code2 size={20} /></div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Live Analyzer</h3>
                <p className="text-slate-500 text-xs pt-1">Run static AST code checks.</p>
              </div>
              <div className="flex items-center space-x-1 text-xs font-semibold text-indigo-600 pt-2">
                <span>Launch</span><ArrowRight size={14} />
              </div>
            </div>

            <div 
              onClick={() => setCurrentView('history')}
              className="p-5 rounded-xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/20 transition cursor-pointer flex flex-col justify-between space-y-3"
            >
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg w-fit"><Database size={20} /></div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Scan Logs</h3>
                <p className="text-slate-500 text-xs pt-1">View database telemetry records.</p>
              </div>
              <div className="flex items-center space-x-1 text-xs font-semibold text-emerald-600 pt-2">
                <span>View records</span><ArrowRight size={14} />
              </div>
            </div>

            <div 
              onClick={() => setCurrentView('settings')}
              className="p-5 rounded-xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/20 transition cursor-pointer flex flex-col justify-between space-y-3"
            >
              <div className="p-2 bg-amber-50 text-amber-600 rounded-lg w-fit"><Key size={20} /></div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">API Settings</h3>
                <p className="text-slate-500 text-xs pt-1">Manage bearer tokens & team members.</p>
              </div>
              <div className="flex items-center space-x-1 text-xs font-semibold text-amber-600 pt-2">
                <span>Configure</span><ArrowRight size={14} />
              </div>
            </div>

            <div 
              onClick={() => setCurrentView('cicd')}
              className="p-5 rounded-xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/20 transition cursor-pointer flex flex-col justify-between space-y-3"
            >
              <div className="p-2 bg-purple-50 text-purple-600 rounded-lg w-fit"><GitBranch size={20} /></div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">CI/CD Pipeline</h3>
                <p className="text-slate-500 text-xs pt-1">GitHub Actions integration snippets.</p>
              </div>
              <div className="flex items-center space-x-1 text-xs font-semibold text-purple-600 pt-2">
                <span>View snippet</span><ArrowRight size={14} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}