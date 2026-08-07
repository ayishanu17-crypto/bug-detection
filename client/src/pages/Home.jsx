import { Zap, Globe, BarChart3, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Home({ setCurrentView }) {
  return (
    <div className="space-y-24 py-12">
      {/* Hero Section */}
      <section className="text-center space-y-6 px-6 max-w-4xl mx-auto">
        <span className="bg-indigo-50 border border-indigo-200 text-indigo-700 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
          Enterprise Web Performance & Optimization
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Monitor Page Speed & <br /><span className="text-indigo-600">Core Web Vitals</span>
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Optimize web performance to improve user experience and Google rankings with Debugique.
        </p>
        <div className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-4">
          <button
            onClick={() => setCurrentView('signup')}
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3.5 rounded-xl shadow-md transition flex items-center justify-center space-x-2"
          >
            <span>Start Free Trial</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentView('analyzer')}
            className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-700 font-semibold px-8 py-3.5 rounded-xl border border-slate-300 transition"
          >
            Interactive Demo
          </button>
        </div>
      </section>

      {/* Capability Grid */}
      <section className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">
        <div className="p-8 bg-white border border-slate-200 rounded-2xl shadow-2xs hover:shadow-md transition">
          <Zap className="text-indigo-600 mb-4" size={32} />
          <h3 className="font-bold text-slate-900 text-lg mb-2">Synthetic Monitoring</h3>
          <p className="text-slate-500 text-sm">Run scheduled lab tests and keep track of Google Lighthouse scores continuously.</p>
        </div>
        <div className="p-8 bg-white border border-slate-200 rounded-2xl shadow-2xs hover:shadow-md transition">
          <Globe className="text-indigo-600 mb-4" size={32} />
          <h3 className="font-bold text-slate-900 text-lg mb-2">Real User Monitoring</h3>
          <p className="text-slate-500 text-sm">Track actual visitor experiences across your website in real-time.</p>
        </div>
        <div className="p-8 bg-white border border-slate-200 rounded-2xl shadow-2xs hover:shadow-md transition">
          <BarChart3 className="text-indigo-600 mb-4" size={32} />
          <h3 className="font-bold text-slate-900 text-lg mb-2">Google CrUX Data</h3>
          <p className="text-slate-500 text-sm">Monitor real-world visitor performance data directly from Google Chrome reports.</p>
        </div>
      </section>
    </div>
  );
}