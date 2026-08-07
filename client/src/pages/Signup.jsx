export default function Signup({ setCurrentView }) {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl border border-slate-200 shadow-xl">
        <h2 className="text-2xl font-bold mb-2">Start your free trial</h2>
        <p className="text-slate-500 mb-6">No credit card required.</p>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="First name" className="p-3 border border-slate-300 rounded-xl" />
            <input type="text" placeholder="Last name" className="p-3 border border-slate-300 rounded-xl" />
          </div>
          <input type="email" placeholder="Work email" className="w-full p-3 border border-slate-300 rounded-xl" />
          <input type="password" placeholder="Create password" className="w-full p-3 border border-slate-300 rounded-xl" />
          <button className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800">Create Account</button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account? <button onClick={() => setCurrentView('login')} className="text-indigo-600 font-bold hover:underline">Log in</button>
        </p>
      </div>
    </div>
  );
}