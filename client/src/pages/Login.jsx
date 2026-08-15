import { ShieldAlert, Mail, Lock, ArrowRight } from 'lucide-react';

export default function Login({ setCurrentView }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="w-full max-w-md relative z-10 animate-slideUp">
        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-2xl border border-slate-200/50 shadow-xl hover:shadow-2xl transition-shadow duration-300">
          <div className="flex items-center space-x-3 mb-8 justify-center">
            <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 p-3 rounded-xl text-white shadow-lg hover:shadow-indigo-500/50 transition-all animate-glow">
              <ShieldAlert size={24} />
            </div>
            <div>
              <span className="text-2xl font-black text-slate-900">Debugique</span>
              <p className="text-xs text-slate-500 font-semibold">Code Intelligence</p>
            </div>
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-2 text-center">Welcome back</h2>
            <p className="text-slate-600 text-center text-sm">Log in to access your code analysis dashboard</p>
          </div>
          
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setCurrentView('dashboard'); }}>
            <div className="relative animate-slideUp" style={{animationDelay: '0.1s'}}>
              <div className="absolute left-3 top-3 text-indigo-600"><Mail size={20} /></div>
              <input 
                type="email" 
                placeholder="Email address" 
                className="w-full p-3.5 pl-10 border border-slate-200 rounded-xl focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 outline-none transition-all bg-white/50" 
                required 
              />
            </div>
            
            <div className="relative animate-slideUp" style={{animationDelay: '0.2s'}}>
              <div className="absolute left-3 top-3 text-indigo-600"><Lock size={20} /></div>
              <input 
                type="password" 
                placeholder="Password" 
                className="w-full p-3.5 pl-10 border border-slate-200 rounded-xl focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 outline-none transition-all bg-white/50" 
                required 
              />
            </div>
            
            <button 
              type="submit" 
              className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white py-3.5 rounded-xl font-bold shadow-lg hover:shadow-indigo-500/40 transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2 animate-slideUp" 
              style={{animationDelay: '0.3s'}}
            >
              <span>Log In</span>
              <ArrowRight size={18} />
            </button>
          </form>
          
          <div className="mt-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-500">or</span>
            </div>
          </div>
          
          <p className="mt-6 text-center text-sm text-slate-600">
            Don't have an account? 
            <button 
              type="button" 
              onClick={() => setCurrentView('signup')} 
              className="text-indigo-600 font-bold hover:text-indigo-700 ml-1 hover:underline transition-colors"
            >
              Sign up free
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}