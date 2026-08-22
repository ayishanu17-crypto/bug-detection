import { useState } from 'react';
import { ShieldAlert, Mail, Lock, ArrowRight } from 'lucide-react';
import { auth, signInWithEmailAndPassword } from '../firebase';

export default function Login({ setCurrentView, onAuthSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      onAuthSuccess(userCredential.user);
    } catch (err) {
      const code = err && err.code;
      const msg =
        code === 'auth/invalid-credential' ||
        code === 'auth/user-not-found' ||
        code === 'auth/wrong-password'
          ? 'Invalid email or password. Please try again.'
          : code === 'auth/invalid-email'
            ? 'Please enter a valid email address.'
            : code === 'auth/too-many-requests'
              ? 'Too many attempts. Please wait a moment and try again.'
              : code === 'auth/network-request-failed'
                ? 'Network error. Check your connection and try again.'
                : (err && err.message) || 'Unable to log in. Please try again.';
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
        <h2 className="text-2xl font-bold text-ink">Welcome back</h2>
        <p className="text-muted text-sm">Log in to access your code analysis dashboard.</p>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"><Mail size={18} /></span>
          <input
            type="email"
            placeholder="Email address"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="field field-neo pl-10"
          />
        </div>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"><Lock size={18} /></span>
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="field field-neo pl-10"
          />
        </div>
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
            Logging in...
          </span>
        ) : (
          <>
            <span>Log In</span>
            <ArrowRight size={16} />
          </>
        )}
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