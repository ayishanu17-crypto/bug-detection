import { ShieldAlert, ChevronDown } from 'lucide-react';

export default function Navbar({ setCurrentView, isLoggedIn }) {
  return (
    <header className="sticky top-0 z-50 animate-slideDown">
      <div className="absolute inset-0 bg-white/95 backdrop-blur-md border-b border-slate-200/50"></div>
      <div className="relative max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <div 
            className="flex items-center space-x-3 cursor-pointer hover:scale-105 transition-transform duration-300" 
            onClick={() => setCurrentView('home')}
          >
            <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 p-2 rounded-lg text-white shadow-lg hover:shadow-indigo-500/50 transition-all duration-300 animate-glow">
              <ShieldAlert size={20} />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-slate-900 leading-none">Debugique</span>
              <span className="text-[10px] text-slate-500 font-semibold">Code Intelligence</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {!isLoggedIn && (
            <>
              <button 
                onClick={() => setCurrentView('login')} 
                className="text-sm font-semibold text-slate-600 hover:text-indigo-600 px-4 py-2 rounded-lg transition-all duration-300 hover:bg-slate-100"
              >
                Log In
              </button>
              <button 
                onClick={() => setCurrentView('signup')} 
                className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 hover:scale-105"
              >
                Get started
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}