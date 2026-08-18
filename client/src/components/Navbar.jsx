import { ShieldAlert, Sun, Moon } from 'lucide-react';

const NAV_LINKS = [
  { view: 'analyzer', label: 'Analyzer' },
  { view: 'history', label: 'History' },
  { view: 'rules', label: 'Rules' },
  { view: 'cicd', label: 'CI/CD' },
  { view: 'alerts', label: 'Alerts' },
  { view: 'settings', label: 'Settings' },
];

export default function Navbar({ setCurrentView, isLoggedIn, theme, toggleTheme, currentView }) {
  return (
    <header className="sticky top-0 z-50 glass border-b border-white/40">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-6 min-w-0">
          <button
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-2.5 shrink-0"
            aria-label="Debugique home"
          >
            <span className="clay-accent flex items-center justify-center w-9 h-9 rounded-xl">
              <ShieldAlert size={18} />
            </span>
            <span className="text-lg font-bold tracking-tight text-ink leading-none">Debugique</span>
          </button>
          {isLoggedIn && (
            <nav className="hidden md:flex items-center gap-1 overflow-x-auto">
              {NAV_LINKS.map((item) => (
                <button
                  key={item.view}
                  onClick={() => setCurrentView(item.view)}
                  className={`navlink ${currentView === item.view ? 'active' : ''}`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={toggleTheme}
            className="theme-btn"
            title="Toggle light/dark theme"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          {!isLoggedIn && (
            <>
              <button onClick={() => setCurrentView('login')} className="btn btn-glass">Log In</button>
              <button onClick={() => setCurrentView('signup')} className="btn btn-clay-accent">Get started</button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}