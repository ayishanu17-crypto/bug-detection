import { ShieldAlert, LogOut, ArrowRight, CheckCircle2, Activity, User, Code2, Database, Clock, Terminal, Key, GitBranch, Sliders, Webhook } from 'lucide-react';

export default function Dashboard({ setCurrentView }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-mono">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4 cursor-pointer">
            <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900 block leading-none">Debugique</span>
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">User Dashboard</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 px-4 py-2 rounded-lg border text-xs font-semibold text-slate-700 bg-slate-50 border-slate-200">
              <User className="w-4 h-4 text-indigo-600" />
              <span>Workspace Active</span>
            </div>
            <button
              onClick={() => setCurrentView('home')}
              className="flex items-center space-x-2 text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-300 border text-slate-600 hover:text-red-600 border-slate-200 hover:bg-slate-50"
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
        <div className="border border-slate-200 bg-white rounded-lg p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-fadeIn">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Code Intelligence Dashboard</h1>
            <p className="text-slate-600 text-sm max-w-xl">
              Launch live AST static analysis scans, review custom rules, and configure webhook notifications.
            </p>
          </div>
          <button
            onClick={() => setCurrentView('analyzer')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-lg text-xs flex items-center space-x-2 transition shrink-0"
          >
            <span>Open Live Analyzer</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Total Scans Run', value: '12', subtext: 'Engine operational', icon: CheckCircle2 },
            { label: 'Active Parsers', value: 'Acorn AST', subtext: 'Real-time syntax tracking', icon: Terminal },
            { label: 'Database Status', value: 'Connected', subtext: 'MongoDB telemetry active', icon: Database },
            { label: 'Vulnerabilities Found', value: '3 Pending', subtext: 'Auto-fix available', icon: Activity }
          ].map((stat, i) => (
            <div 
              key={i} 
              className="border p-6 bg-white space-y-3 rounded-lg border-slate-200"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</span>
                <stat.icon className="w-5 h-5 text-indigo-600 opacity-60" />
              </div>
              <div className="text-3xl font-bold text-slate-800">{stat.value}</div>
              <p className="text-xs text-slate-500 font-medium">{stat.subtext}</p>
            </div>
          ))}
        </div>

        {/* Extended Navigation Grid */}
        <div className="border bg-white p-8 space-y-8 rounded-lg border-slate-200">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Platform Tools & Modules</h2>
            <p className="text-slate-500 text-sm mt-2">Access all debugging features and customization options.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Code2, title: 'Live Analyzer', desc: 'Run static AST code checks', action: 'analyzer' },
              { icon: Database, title: 'Scan Logs', desc: 'View database telemetry records', action: 'history' },
              { icon: Sliders, title: 'Custom Rule Studio', desc: 'Define custom AST linting rules', action: 'rules' },
              { icon: GitBranch, title: 'CI/CD Pipeline', desc: 'GitHub Actions integration snippets', action: 'cicd' },
              { icon: Webhook, title: 'Webhook Alerts', desc: 'Slack & Discord notifications', action: 'alerts' },
              { icon: Key, title: 'API Settings', desc: 'Manage tokens & team members', action: 'settings' }
            ].map((tool, i) => (
              <div 
                key={i}
                onClick={() => setCurrentView(tool.action)}
                className="p-6 bg-white border border-slate-200 cursor-pointer space-y-4 group transition-all duration-300 rounded-lg"
              >
                <div className="p-2.5 rounded-lg w-fit bg-indigo-50 text-indigo-600">
                  <tool.icon size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{tool.title}</h3>
                  <p className="text-slate-600 text-sm pt-1">{tool.desc}</p>
                </div>
                <div className="flex items-center space-x-2 text-sm font-semibold text-indigo-600 pt-2">
                  <span>Access</span>
                  <ArrowRight size={16} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}