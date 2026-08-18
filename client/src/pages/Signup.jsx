import { ShieldAlert, User, Mail, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Signup({ setCurrentView }) {
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
        <h2 className="text-2xl font-bold text-ink">Start for free</h2>
        <p className="text-muted text-sm">No credit card required.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"><User size={16} /></span>
          <input type="text" placeholder="First name" required className="field field-neo pl-9" />
        </div>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"><User size={16} /></span>
          <input type="text" placeholder="Last name" required className="field field-neo pl-9" />
        </div>
      </div>

      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"><Mail size={16} /></span>
        <input type="email" placeholder="Work email" required className="field field-neo pl-9" />
      </div>

      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"><Lock size={16} /></span>
        <input type="password" placeholder="Create password" required className="field field-neo pl-9" />
      </div>

      <button type="submit" className="btn btn-clay-accent btn-block">
        <span>Create Account</span>
        <ArrowRight size={16} />
      </button>

      <div className="space-y-1.5 text-xs text-muted">
        <p className="flex items-center gap-2"><CheckCircle2 size={14} className="text-ok" /> Instant access to all features</p>
        <p className="flex items-center gap-2"><CheckCircle2 size={14} className="text-ok" /> No payment method required</p>
      </div>

      <p className="text-center text-sm text-muted">
        Already have an account?{' '}
        <button type="button" onClick={() => setCurrentView('login')} className="font-semibold text-ink hover:underline">
          Log in
        </button>
      </p>
    </form>
  );
}