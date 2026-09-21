import { useState } from 'react';
import { ShieldAlert, User, Mail, Lock, CheckCircle2, ArrowRight, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import { auth, createUserWithEmailAndPassword, updateProfile } from '../firebase';
import { getAuthErrorMessage } from '../authErrors';

export default function Signup({ setCurrentView, onAuthSuccess }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!auth) {
      setError('Authentication is not configured on this deployment. Add your Firebase credentials to client/.env and restart the app.');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const displayName = `${firstName.trim()} ${lastName.trim()}`.trim();
      try {
        await updateProfile(userCredential.user, { displayName: displayName || undefined });
      } catch (profileErr) {
        // Non-fatal — the account still exists even if the display name can't be saved.
        console.warn('Could not update display name:', profileErr);
      }
      if (onAuthSuccess) onAuthSuccess(userCredential.user);
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-linear-to-br from-slate-50 via-white to-indigo-50/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="w-full max-w-md relative z-10 animate-slideUp">
        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-2xl border border-slate-200/50 shadow-xl hover:shadow-2xl transition-shadow duration-300">
          <div className="flex items-center space-x-3 mb-2 justify-center">
            <div className="bg-linear-to-br from-indigo-600 to-indigo-700 p-3 rounded-xl text-white shadow-lg hover:shadow-indigo-500/50 transition-all animate-glow">
              <ShieldAlert size={24} />
            </div>
            <div>
              <span className="text-2xl font-black text-slate-900">Debugique</span>
              <p className="text-xs text-slate-500 font-semibold">Code Intelligence</p>
            </div>
          </div>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-2 text-center">Start for free</h2>
            <p className="text-slate-600 text-center text-sm flex items-center justify-center space-x-2">
              <Sparkles size={16} className="text-indigo-600" />
              <span>No credit card required</span>
            </p>
          </div>
          
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4 animate-slideUp" style={{animationDelay: '0.1s'}}>
              <div className="relative">
                <div className="absolute left-3 top-3 text-indigo-600"><User size={18} /></div>
                <input 
                  type="text" 
                  placeholder="First name" 
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full p-3.5 pl-10 border border-slate-200 rounded-xl focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 outline-none transition-all bg-white/50" 
                  required 
                  autoComplete="given-name"
                />
              </div>
              <div className="relative">
                <div className="absolute left-3 top-3 text-indigo-600"><User size={18} /></div>
                <input 
                  type="text" 
                  placeholder="Last name" 
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full p-3.5 pl-10 border border-slate-200 rounded-xl focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 outline-none transition-all bg-white/50" 
                  required 
                  autoComplete="family-name"
                />
              </div>
            </div>
<div className="relative animate-slideUp" style={{animationDelay: '0.2s'}}>
              <div className="absolute left-3 top-3 text-indigo-600"><Mail size={18} /></div>
              <input 
                type="email" 
                placeholder="Work email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3.5 pl-10 border border-slate-200 rounded-xl focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 outline-none transition-all bg-white/50" 
                required 
                autoComplete="email"
              />
            </div>
            
            <div className="relative animate-slideUp" style={{animationDelay: '0.3s'}}>
              <div className="absolute left-3 top-3 text-indigo-600"><Lock size={18} /></div>
              <input 
                type="password" 
                placeholder="Create password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3.5 pl-10 border border-slate-200 rounded-xl focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 outline-none transition-all bg-white/50" 
                required 
                minLength={6}
                autoComplete="new-password"
              />
            </div>

            {error && (
              <div className="flex items-start space-x-2 text-sm text-red-700 bg-red-50 border border-red-200/50 rounded-xl p-3 animate-slideUp" role="alert">
                <AlertCircle size={18} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-linear-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white py-3.5 rounded-xl font-bold shadow-lg hover:shadow-indigo-500/40 transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2 animate-slideUp disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100" 
              style={{animationDelay: '0.4s'}}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Creating account…</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
          <div className="mt-6 p-4 bg-linear-to-r from-emerald-50 to-emerald-100/50 rounded-xl border border-emerald-200/50 space-y-2">
            <div className="flex items-start space-x-2 text-xs text-emerald-700">
              <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
              <span>Instant access to all features</span>
            </div>
            <div className="flex items-start space-x-2 text-xs text-emerald-700">
              <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
              <span>No payment method required</span>
            </div>
          </div>
          
          <p className="mt-6 text-center text-sm text-slate-600">
            Already have an account? 
            <button 
              type="button" 
              onClick={() => setCurrentView('login')} 
              className="text-indigo-600 font-bold hover:text-indigo-700 ml-1 hover:underline transition-colors"
            >
              Log in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}