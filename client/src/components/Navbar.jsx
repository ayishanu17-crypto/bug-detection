import { ShieldAlert, ChevronDown } from 'lucide-react';

export default function Navbar({ setCurrentView, isLoggedIn }) {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200">
      <div className="absolute inset-0 bg-white"></div>
      <div className="relative max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <div 
            className="flex items-center space-x-3 cursor-pointer" 
            onClick={() => setCurrentView('home')}
          >
            <div className="bg-indigo-50 p-2 rounded text-indigo-600">
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
                className="text-sm font-semibold transition-all duration-300 px-4 py-2 rounded-lg text-slate-600 hover:text-indigo-600"
              >
                Log In
              </button>
              <button 
                onClick={() => setCurrentView('signup')} 
                className="text-sm font-bold px-5 py-2.5 rounded-lg transition-all duration-300 bg-indigo-600 text-white"
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