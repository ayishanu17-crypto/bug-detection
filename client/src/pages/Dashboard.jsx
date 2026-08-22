import { ShieldAlert, ArrowRight, CheckCircle2, Activity, Code2, Database, Terminal, Key, GitBranch, Sliders, Webhook, LogOut, Sun, Moon } from 'lucide-react';

export default function Dashboard({ setCurrentView, theme, toggleTheme, onLogout }) {
  const stats = [
    { label: 'Total Scans Run', value: '12', subtext: 'Engine operational', icon: CheckCircle2 },
    { label: 'Active Parsers', value: 'Acorn AST', subtext: 'Real-time syntax tracking', icon: Terminal },
    { label: 'Database Status', value: 'Connected', subtext: 'MongoDB telemetry active', icon: Database },
    { label: 'Vulnerabilities Found', value: '3 Pending', subtext: 'Auto-fix available', icon: Activity },
  ];

  const tools = [
    { icon: Code2, title: 'Live Analyzer', desc: 'Run static AST code checks', action: 'analyzer' },
    { icon: Database, title: 'Scan Logs', desc: 'View database telemetry records', action: 'history' },
    { icon: Sliders, title: 'Custom Rule Studio', desc: 'Define custom AST linting rules', action: 'rules' },
    { icon: GitBranch, title: 'CI/CD Pipeline', desc: 'GitHub Actions integration snippets', action: 'cicd' },
    { icon: Webhook, title: 'Webhook Alerts', desc: 'Slack & Discord notifications', action: 'alerts' },
    { icon: Key, title: 'API Settings', desc: 'Manage tokens & team members', action: 'settings' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 glass border-b border-white/40">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-16">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setCurrentView('home')}>
            <span className="clay-accent flex items-center justify-center w-9 h-9 rounded-xl">
              <ShieldAlert className="w-4 h-4" />
            </span>
            <span className="text-lg font-bold tracking-tight text-ink leading-none">Debugique</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md border border-line text-xs font-semibold text-muted">
              <span className="w-1.5 h-1.5 rounded-full bg-ok"></span>
              Workspace Active
            </span>
            <button onClick={toggleTheme} className="theme-btn" title="Toggle theme" aria-label="Toggle theme">
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button onClick={onLogout} className="btn btn-ghost btn-sm">
              <LogOut className="w-4 h-4" />
              Log Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-8 grow w-full">
        <div className="liquid p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-fadeIn">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-ink tracking-tight">Code Intelligence Dashboard</h1>
            <p className="text-muted text-sm max-w-xl">
              Launch live AST static analysis scans, review custom rules, and configure webhook notifications.
            </p>
          </div>
          <button onClick={() => setCurrentView('analyzer')} className="btn btn-clay-accent shrink-0">
            <span>Open Live Analyzer</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="neo p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted uppercase tracking-wider">{stat.label}</span>
                <stat.icon className="w-5 h-5 text-muted" />
              </div>
              <div className="text-3xl font-bold text-ink">{stat.value}</div>
              <p className="text-xs text-muted">{stat.subtext}</p>
            </div>
          ))}
        </div>

        <div className="glass rounded-2xl p-8 space-y-8">
          <div>
            <span className="brutal-tag mb-3">Modules</span>
            <h2 className="text-2xl font-bold text-ink">Platform Tools &amp; Modules</h2>
            <p className="text-muted text-sm mt-2">Access all debugging features and customization options.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool, i) => (
              <div
                key={i}
                onClick={() => setCurrentView(tool.action)}
                className="clay p-6 cursor-pointer space-y-4 tilt"
              >
                <span className="clay-accent flex items-center justify-center w-10 h-10 rounded-xl">
                  <tool.icon size={18} />
                </span>
                <div>
                  <h3 className="font-semibold text-ink text-base">{tool.title}</h3>
                  <p className="text-muted text-sm pt-1">{tool.desc}</p>
                </div>
                <div className="flex items-center gap-1.5 text-sm font-semibold text-ink pt-1">
                  <span>Access</span>
                  <ArrowRight size={15} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}