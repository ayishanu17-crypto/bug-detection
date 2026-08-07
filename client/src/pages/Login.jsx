import { ShieldAlert } from 'lucide-react';

export default function Login({ setCurrentView }) {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl border border-slate-200 shadow-xl">
        <div className="flex items-center space-x-2 mb-6 justify-center">
          <div className="bg-indigo-600 p-2 rounded-xl text-white"><ShieldAlert size={24} /></div>
          <span className="text-2xl font-bold text-slate-900">Debugique</span>
        </div>
        <h2 className="text-xl font-bold mb-6 text-center">Log in to your account</h2>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <input type="email" placeholder="Email address" className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
          <input type="password" placeholder="Password" className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
          <button className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700">Log In</button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-600">
          Don't have an account? <button onClick={() => setCurrentView('signup')} className="text-indigo-600 font-bold hover:underline">Sign up</button>
        </p>
      </div>
    </div>
  );
}