import { ShieldAlert, ChevronDown, BarChart3, Zap, Globe, Search } from 'lucide-react';

export default function Navbar({ setCurrentView }) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setCurrentView('home')}>
            <div className="bg-indigo-600 p-1.5 rounded-lg text-white"><ShieldAlert size={20} /></div>
            <span className="text-xl font-bold tracking-tighter text-slate-900">Debugique</span>
          </div>
          <nav className="hidden md:flex space-x-6 text-sm font-semibold text-slate-600">
            <button className="flex items-center hover:text-indigo-600">Product <ChevronDown size={14} className="ml-1"/></button>
            <button className="hover:text-indigo-600">Features</button>
            <button className="hover:text-indigo-600">Pricing</button>
            <button className="hover:text-indigo-600">Docs</button>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setCurrentView('login')} 
            className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition"
          >
            Log In
          </button>
          <button 
            onClick={() => setCurrentView('signup')} 
            className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-800 transition"
          >
            Start Free Trial
          </button>
        </div>
      </div>
    </header>
  );
}