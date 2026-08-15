import { ShieldAlert, LogOut, ArrowRight, CheckCircle2, Activity, User, Code2, Database, Clock, Terminal, Key, GitBranch, Sliders, Webhook } from 'lucide-react';

export default function Dashboard({ setCurrentView }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 flex flex-col">
      {/* Top Bar with Glassmorphism */}
      <header className="sticky top-0 z-50 animate-slideDown backdrop-blur-xl bg-white/80 border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4 hover:scale-105 transition-transform duration-300 cursor-pointer">
            <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 p-2 rounded-xl text-white shadow-lg hover:shadow-indigo-500/50 transition-all">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 block leading-none">Debugique</span>
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">User Dashboard</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-gradient-to-r from-emerald-50 to-blue-50 px-4 py-2 rounded-lg border border-emerald-200/50 text-xs font-semibold text-slate-700 animate-pulse-slow">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <User className="w-4 h-4 text-indigo-600" />
              <span>Workspace Active</span>
            </div>
            <button
              onClick={() => setCurrentView('home')}
              className="flex items-center space-x-2 text-sm font-semibold text-red-600 hover:text-red-700 bg-gradient-to-r from-red-50 to-pink-50 hover:from-red-100 hover:to-pink-100 px-4 py-2 rounded-lg transition-all duration-300 border border-red-200/50 hover:border-red-300/50"
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
        <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-slate-900 rounded-2xl p-8 text-white shadow-xl hover:shadow-2xl transition-shadow duration-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 overflow-hidden relative animate-slideUp">
          {/* Background decoration */}
          <div className="absolute -right-24 -top-24 w-48 h-48 bg-indigo-400/10 rounded-full blur-3xl"></div>
          <div className="absolute -left-12 -bottom-12 w-40 h-40 bg-indigo-400/5 rounded-full blur-3xl"></div>
          
          <div className="space-y-3 relative z-10">
            <span className="inline-block bg-indigo-500/30 text-indigo-200 text-xs font-semibold px-4 py-1.5 rounded-full border border-indigo-400/30 backdrop-blur-sm">
              🚀 Welcome to Debugique
            </span>
            <h1 className="text-4xl font-black tracking-tight leading-tight">Your Code Intelligence Hub</h1>
            <p className="text-indigo-100 text-base max-w-xl leading-relaxed">
              Launch live AST static analysis scans, review custom rules, and configure webhook notifications seamlessly.
            </p>
          </div>
          <button
            onClick={() => setCurrentView('analyzer')}
            className="bg-white text-indigo-700 font-bold px-6 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 shrink-0 hover:scale-105 hover:bg-indigo-50"
          >
            <span>Open Live Analyzer</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-slideUp">
          {[
            { label: 'Total Scans Run', value: '12', subtext: 'Engine operational', icon: CheckCircle2, bgGradient: 'from-emerald-50 to-emerald-100/50', borderColor: 'border-emerald-200/50', textColor: 'text-emerald-600', valueColor: 'text-emerald-700', hoverBorder: 'hover:border-emerald-300' },
            { label: 'Active Parsers', value: 'Acorn AST', subtext: 'Real-time syntax tracking', icon: Terminal, bgGradient: 'from-indigo-50 to-indigo-100/50', borderColor: 'border-indigo-200/50', textColor: 'text-indigo-600', valueColor: 'text-indigo-700', hoverBorder: 'hover:border-indigo-300' },
            { label: 'Database Status', value: 'Connected', subtext: 'MongoDB telemetry active', icon: Database, bgGradient: 'from-emerald-50 to-emerald-100/50', borderColor: 'border-emerald-200/50', textColor: 'text-emerald-600', valueColor: 'text-emerald-700', hoverBorder: 'hover:border-emerald-300' },
            { label: 'Vulnerabilities Found', value: '3 Pending', subtext: 'Auto-fix available', icon: Activity, bgGradient: 'from-amber-50 to-amber-100/50', borderColor: 'border-amber-200/50', textColor: 'text-amber-600', valueColor: 'text-amber-700', hoverBorder: 'hover:border-amber-300' }
          ].map((stat, i) => (
            <div 
              key={i} 
              className={`bg-gradient-to-br ${stat.bgGradient} border ${stat.borderColor} p-6 rounded-2xl shadow-sm hover:shadow-lg ${stat.hoverBorder} transition-all duration-300 space-y-3 hover:translate-y-[-4px] animate-slideUp`}
              style={{animationDelay: `${i * 0.1}s`}}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</span>
                <stat.icon className={`w-5 h-5 ${stat.textColor} opacity-60`} />
              </div>
              <div className={`text-3xl font-bold ${stat.valueColor}`}>{stat.value}</div>
              <p className={`text-xs ${stat.textColor} font-medium`}>{stat.subtext}</p>
            </div>
          ))}
        </div>

        {/* Extended Navigation Grid */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 p-8 shadow-sm hover:shadow-md transition-all duration-300 space-y-8 animate-slideUp">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Platform Tools & Modules</h2>
            <p className="text-slate-500 text-sm mt-2">Access all debugging features and customization options.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Code2, title: 'Live Analyzer', desc: 'Run static AST code checks', action: 'analyzer', bgColor: 'bg-indigo-50', borderColor: 'border-indigo-200/50', hoverBg: 'hover:from-indigo-50', hoverBorder: 'hover:border-indigo-300', bgGradient: 'from-indigo-50/50 to-indigo-100/20', hoverGradient: 'hover:to-indigo-100/40', btnBg: 'bg-indigo-600', textColor: 'text-indigo-600' },
              { icon: Database, title: 'Scan Logs', desc: 'View database telemetry records', action: 'history', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-200/50', hoverBg: 'hover:from-emerald-50', hoverBorder: 'hover:border-emerald-300', bgGradient: 'from-emerald-50/50 to-emerald-100/20', hoverGradient: 'hover:to-emerald-100/40', btnBg: 'bg-emerald-600', textColor: 'text-emerald-600' },
              { icon: Sliders, title: 'Custom Rule Studio', desc: 'Define custom AST linting rules', action: 'rules', bgColor: 'bg-amber-50', borderColor: 'border-amber-200/50', hoverBg: 'hover:from-amber-50', hoverBorder: 'hover:border-amber-300', bgGradient: 'from-amber-50/50 to-amber-100/20', hoverGradient: 'hover:to-amber-100/40', btnBg: 'bg-amber-600', textColor: 'text-amber-600' },
              { icon: GitBranch, title: 'CI/CD Pipeline', desc: 'GitHub Actions integration snippets', action: 'cicd', bgColor: 'bg-purple-50', borderColor: 'border-purple-200/50', hoverBg: 'hover:from-purple-50', hoverBorder: 'hover:border-purple-300', bgGradient: 'from-purple-50/50 to-purple-100/20', hoverGradient: 'hover:to-purple-100/40', btnBg: 'bg-purple-600', textColor: 'text-purple-600' },
              { icon: Webhook, title: 'Webhook Alerts', desc: 'Slack & Discord notifications', action: 'alerts', bgColor: 'bg-rose-50', borderColor: 'border-rose-200/50', hoverBg: 'hover:from-rose-50', hoverBorder: 'hover:border-rose-300', bgGradient: 'from-rose-50/50 to-rose-100/20', hoverGradient: 'hover:to-rose-100/40', btnBg: 'bg-rose-600', textColor: 'text-rose-600' },
              { icon: Key, title: 'API Settings', desc: 'Manage tokens & team members', action: 'settings', bgColor: 'bg-sky-50', borderColor: 'border-sky-200/50', hoverBg: 'hover:from-sky-50', hoverBorder: 'hover:border-sky-300', bgGradient: 'from-sky-50/50 to-sky-100/20', hoverGradient: 'hover:to-sky-100/40', btnBg: 'bg-sky-600', textColor: 'text-sky-600' }
            ].map((tool, i) => (
              <div 
                key={i}
                onClick={() => setCurrentView(tool.action)}
                className={`p-6 rounded-2xl ${tool.borderColor} border bg-gradient-to-br ${tool.bgGradient} ${tool.hoverBg} ${tool.hoverBorder} ${tool.hoverGradient} hover:shadow-lg transition-all duration-300 cursor-pointer space-y-4 hover:translate-y-[-4px] group animate-slideUp`}
                style={{animationDelay: `${i * 0.08}s`}}
              >
                <div className={`p-3 ${tool.btnBg} text-white rounded-xl w-fit shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all`}>
                  <tool.icon size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{tool.title}</h3>
                  <p className="text-slate-600 text-sm pt-1">{tool.desc}</p>
                </div>
                <div className={`flex items-center space-x-2 text-sm font-semibold ${tool.textColor} pt-2 group-hover:space-x-3 transition-all`}>
                  <span className="group-hover:translate-x-1 transition-transform">Access</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}