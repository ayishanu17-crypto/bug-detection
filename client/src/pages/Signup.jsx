import { useState } from 'react';
import { ShieldAlert, User, Mail, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { auth, createUserWithEmailAndPassword, updateProfile } from '../firebase';

export default function Signup({ setCurrentView, onAuthSuccess }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;

      // Attach the user's full name to their Firebase profile.
      const displayName = [firstName.trim(), lastName.trim()].filter(Boolean).join(' ').trim();
      if (displayName) {
        try {
          await updateProfile(user, { displayName });
        } catch (profileError) {
          console.warn('Could not update profile display name:', profileError.message);
        }
      }

      onAuthSuccess(user);
    } catch (err) {
      const code = err && err.code;
      const msg =
        code === 'auth/email-already-in-use'
          ? 'An account already exists for this email. Try logging in instead.'
          : code === 'auth/weak-password'
            ? 'Password is too weak. Use at least 6 characters.'
            : code === 'auth/invalid-email'
              ? 'Please enter a valid email address.'
              : code === 'auth/network-request-failed'
                ? 'Network error. Check your connection and try again.'
                : (err && err.message) || 'Unable to create your account. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="liquid p-8 space-y-5 rounded-2xl"
      onSubmit={handleSubmit}
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
          <input
            type="text"
            placeholder="First name"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="field field-neo pl-9"
          />
        </div>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"><User size={16} /></span>
          <input
            type="text"
            placeholder="Last name"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="field field-neo pl-9"
          />
        </div>
      </div>

      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"><Mail size={16} /></span>
        <input
          type="email"
          placeholder="Work email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="field field-neo pl-9"
        />
      </div>

      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"><Lock size={16} /></span>
        <input
          type="password"
          placeholder="Create password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="field field-neo pl-9"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
          {error}
        </p>
      )}

      <button type="submit" disabled={loading} className="btn btn-clay-accent btn-block">
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            Creating account...
          </span>
        ) : (
          <>
            <span>Create Account</span>
            <ArrowRight size={16} />
          </>
        )}
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