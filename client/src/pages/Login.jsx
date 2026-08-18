import { ShieldAlert, Mail, Lock, ArrowRight } from 'lucide-react';

export default function Login({ setCurrentView }) {
  return (
    <form
      className="liquid p-8 space-y-5 rounded-2xl"
      onSubmit={(e) => { e.preventDefault(); setCurrentView('dashboard'); }}
    >
      <div className="flex items-center gap-2.5">
        <span className="clay-accent flex items-center justify-center w-10 h-10 rounded-xl">
          <ShieldAlert size={18} />
        </span>
        <span className="text-xl font-bold tracking-tight text-ink">Debugique</span>
      </div>

      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-ink">Welcome back</h2>
        <p className="text-muted text-sm">Log in to access your code analysis dashboard.</p>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"><Mail size={18} /></span>
          <input type="email" placeholder="Email address" required className="field field-neo pl-10" />
        </div>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"><Lock size={18} /></span>
          <input type="password" placeholder="Password" required className="field field-neo pl-10" />
        </div>
      </div>

      <button type="submit" className="btn btn-clay-accent btn-block">
        <span>Log In</span>
        <ArrowRight size={16} />
      </button>

      <p className="text-center text-sm text-muted">
        Don&apos;t have an account?{' '}
        <button type="button" onClick={() => setCurrentView('signup')} className="font-semibold text-ink hover:underline">
          Sign up free
        </button>
      </p>
    </form>
  );
}