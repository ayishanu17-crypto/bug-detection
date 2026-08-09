import { Zap, Globe, BarChart3, ArrowRight, ShieldCheck, Cpu, Terminal, Users, TrendingUp, Activity, Layers, Sparkles, Code2, Database, ShieldAlert, GitBranch, Lock, CheckCircle2, Award, ZapOff, Server } from 'lucide-react';

export default function Home({ setCurrentView }) {
  return (
    <div className="space-y-36 pb-24">
      {/* 1. Hero Section */}
      <section className="relative pt-20 pb-16 px-6 bg-linear-to-b from-white via-slate-50 to-slate-100 border-b border-slate-200">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center space-x-2 bg-indigo-50 border border-indigo-100 text-indigo-700 px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Next-Gen AST Static Analysis Platform</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Be faster than your <br /><span className="text-indigo-600">competition</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Optimize code architecture, identify vulnerabilities instantly using Abstract Syntax Trees, and automatically generate code fixes with Debugique.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-4">
            <button
              onClick={() => setCurrentView('analyzer')}
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3.5 rounded-xl shadow-md transition flex items-center justify-center space-x-2"
            >
              <span>Start Analyzing Code</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentView('history')}
              className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-700 font-semibold px-8 py-3.5 rounded-xl border border-slate-300 transition shadow-2xs"
            >
              View Database Logs
            </button>
          </div>
          <p className="text-xs text-slate-400 pt-1">Code Development Dashboard • No setup configuration required.</p>
        </div>

        {/* Hero Visual Mockup Preview */}
        <div className="max-w-5xl mx-auto mt-12 relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200 bg-slate-900 p-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 px-2">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            </div>
            <span className="text-xs text-slate-400 font-mono">Live Scan: Acorn Engine Parser Active</span>
            <div className="text-xs bg-emerald-600 text-white px-2 py-0.5 rounded font-mono">Ready</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 px-2">
            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 text-left space-y-1">
              <span className="text-xs text-slate-400">AST Structural Parsing</span>
              <div className="text-lg font-bold text-emerald-400">Active Syntax Tree</div>
              <span className="text-[10px] text-slate-400">Parses code trees via Acorn engine instead of basic regex.</span>
            </div>
            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 text-left space-y-1">
              <span className="text-xs text-slate-400">Instant Solutions</span>
              <div className="text-lg font-bold text-indigo-400">Auto Refactoring</div>
              <span className="text-[10px] text-slate-400">Provides immediate actionable guidelines for bugs.</span>
            </div>
            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 text-left space-y-1">
              <span className="text-xs text-slate-400">MongoDB Persistence</span>
              <div className="text-lg font-bold text-amber-400">Database Logs</div>
              <span className="text-[10px] text-slate-400">Maintains persistent logs of past scan histories.</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Core Capabilities Section */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-xl mx-auto space-y-3 mb-12">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Comprehensive code intelligence</h2>
          <p className="text-slate-600 text-sm">Everything you need to catch vulnerabilities and refactor code seamlessly.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-8 bg-white border border-slate-200 rounded-2xl shadow-2xs hover:shadow-md transition space-y-3">
            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
              <Code2 size={24} />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">AST Parsing</h3>
            <p className="text-slate-500 text-sm leading-relaxed">Break down scripts into deep Abstract Syntax Trees to detect hidden structural patterns.</p>
          </div>
          <div className="p-8 bg-white border border-slate-200 rounded-2xl shadow-2xs hover:shadow-md transition space-y-3">
            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
              <Cpu size={24} />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Instant Fixes</h3>
            <p className="text-slate-500 text-sm leading-relaxed">Generate context-aware corrective code blocks automatically upon syntax detection.</p>
          </div>
          <div className="p-8 bg-white border border-slate-200 rounded-2xl shadow-2xs hover:shadow-md transition space-y-3">
            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
              <Database size={24} />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Database Persistence</h3>
            <p className="text-slate-500 text-sm leading-relaxed">Store structured scan telemetry safely in database logs for iterative review.</p>
          </div>
        </div>
      </section>

      {/* 3. Extended Workflow Section */}
      <section className="bg-slate-900 text-white py-24 px-6 my-16">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-indigo-400 text-xs font-bold uppercase tracking-wider">Streamlined Pipeline</span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">An efficient static analysis workflow</h2>
            <p className="text-slate-400 text-sm">Analyze, trace, and patch codebase vulnerabilities in three simple steps.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-800/60 p-8 rounded-2xl border border-slate-700/80 space-y-4">
              <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-bold">1</div>
              <h3 className="font-bold text-xl text-white">Ingest source code</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Paste your raw JavaScript or frontend snippets directly into the parser engine.</p>
            </div>
            <div className="bg-slate-800/60 p-8 rounded-2xl border border-slate-700/80 space-y-4">
              <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-bold">2</div>
              <h3 className="font-bold text-xl text-white">Detect deep flaws</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Uncover anti-patterns, missing exception blocks, and security liabilities.</p>
            </div>
            <div className="bg-slate-800/60 p-8 rounded-2xl border border-slate-700/80 space-y-4">
              <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-bold">3</div>
              <h3 className="font-bold text-xl text-white">Log and optimize</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Archive execution reports to history and deploy patched architecture seamlessly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Deep Inspection & Metrics Section */}
      <section className="max-w-7xl mx-auto px-6 space-y-12">
        <div className="text-center max-w-xl mx-auto space-y-3">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Built for high-performance developers</h2>
          <p className="text-slate-500 text-sm">Engineered to handle complex syntax trees without breaking your deployment pipeline.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-8 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><GitBranch size={20}/></div>
              <h3 className="font-bold text-slate-900 text-lg">Granular Syntax Breakdown</h3>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">
              Instead of simple pattern matching, Debugique builds out the complete AST hierarchy, making sure nested scope issues, unhandled promises, and scope leakage never slip through.
            </p>
          </div>
          <div className="p-8 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Lock size={20}/></div>
              <h3 className="font-bold text-slate-900 text-lg">Secure & Isolated Execution</h3>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">
              Your source code is parsed safely in client-side memory or isolated parser blocks, guaranteeing zero leakage of proprietary application logic or enterprise credentials.
            </p>
          </div>
        </div>
      </section>

      {/* 5. NEW: Enterprise Features & Compliance Section (Added to make page longer) */}
      <section className="max-w-7xl mx-auto px-6 py-12 bg-slate-100 rounded-3xl border border-slate-200 my-16 space-y-12">
        <div className="text-center max-w-xl mx-auto space-y-3">
          <span className="text-indigo-600 text-xs font-bold uppercase tracking-wider">Enterprise Grade</span>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Security and scale built for modern teams</h2>
          <p className="text-slate-600 text-sm">Designed from the ground up to support high-throughput development pipelines.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <Server className="text-indigo-600 mb-2" size={24} />
            <h4 className="font-bold text-slate-900">Zero-Config Deployment</h4>
            <p className="text-slate-500 text-xs leading-relaxed">Integrates instantly into your build environment with minimal setup requirements.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <ShieldCheck className="text-indigo-600 mb-2" size={24} />
            <h4 className="font-bold text-slate-900">Compliance Ready</h4>
            <p className="text-slate-500 text-xs leading-relaxed">Meets strict enterprise data governance standards with encrypted audit trails.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <ZapOff className="text-indigo-600 mb-2" size={24} />
            <h4 className="font-bold text-slate-900">Zero Latency Overhead</h4>
            <p className="text-slate-500 text-xs leading-relaxed">Lightning-fast parsing algorithms optimized for instantaneous feedback loops.</p>
          </div>
        </div>
      </section>

      {/* 6. Social Proof & Testimonials Section */}
      <section className="max-w-6xl mx-auto px-6 space-y-12 pt-4">
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Trusted by elite engineering teams</h2>
          <p className="text-slate-500 text-sm">See how modern web platforms maintain code integrity with Debugique.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-8 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-4 flex flex-col justify-between">
            <p className="text-slate-700 text-sm italic leading-relaxed">&ldquo;Debugique's AST parsing engine caught logical race conditions and unhandled error states that traditional linters completely ignored.&rdquo;</p>
            <div>
              <p className="font-bold text-slate-900 text-sm">Mandip Ahdan</p>
              <p className="text-xs text-slate-400">Head of Engineering</p>
            </div>
          </div>
          <div className="p-8 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-4 flex flex-col justify-between">
            <p className="text-slate-700 text-sm italic leading-relaxed">&ldquo;The instant automated fix suggestions save our development team hours of refactoring work every single week. An essential tool.&rdquo;</p>
            <div>
              <p className="font-bold text-slate-900 text-sm">Robin Marx</p>
              <p className="text-xs text-slate-400">Web Protocol & Architecture Expert</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}