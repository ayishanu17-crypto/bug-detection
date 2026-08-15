import { Zap, Globe, BarChart3, ArrowRight, ShieldCheck, Cpu, Terminal, Users, TrendingUp, Activity, Layers, Sparkles, Code2, Database, ShieldAlert, GitBranch, Lock, CheckCircle2, Award, ZapOff, Server } from 'lucide-react';

export default function Home({ setCurrentView }) {
  return (
    <div className="space-y-0 pb-24">
      {/* 1. Hero Section */}
      <section className="relative pt-32 pb-24 px-6 bg-gradient-to-b from-white via-indigo-50/30 to-white border-b border-indigo-100/50 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{animationDelay: '2s'}}></div>
        </div>

        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10 animate-slideUp">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 text-indigo-700 px-4 py-2 rounded-full text-xs font-semibold shadow-sm hover:shadow-md transition-shadow">
            <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
            <span>Next-Gen AST Static Analysis Platform</span>
          </div>
          
          <h1 className="text-5xl sm:text-7xl font-black text-slate-900 tracking-tighter leading-tight">
            Debug <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 text-transparent bg-clip-text">code faster</span> than ever
          </h1>
          
          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
            Analyze code architecture, detect vulnerabilities instantly using Abstract Syntax Trees, and auto-generate fixes with Debugique.
          </p>
          
          <div className="pt-6 flex flex-col sm:flex-row justify-center items-center gap-4">
            <button
              onClick={() => setCurrentView('analyzer')}
              className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-indigo-500/40 transition-all duration-300 flex items-center justify-center space-x-2 hover:scale-105 group"
            >
              <span>Start Analyzing Code</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => setCurrentView('history')}
              className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-700 font-bold px-8 py-4 rounded-xl border-2 border-slate-200 hover:border-indigo-300 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              View Database Logs
            </button>
          </div>
          
          <p className="text-xs text-slate-400 pt-2">✨ No setup required • Real-time analysis • Instant fixes</p>
        </div>

        {/* Hero Visual Mockup Preview */}
        <div className="max-w-5xl mx-auto mt-16 relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200 bg-slate-900 p-4 animate-slideUp" style={{animationDelay: '0.2s'}}>
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 via-transparent to-purple-600/10 pointer-events-none"></div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 px-4">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
              <div className="w-3 h-3 rounded-full bg-amber-500 animate-pulse" style={{animationDelay: '0.2s'}}></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" style={{animationDelay: '0.4s'}}></div>
            </div>
            <span className="text-xs text-slate-400 font-mono">Live Scan: Acorn Engine Parser Active</span>
            <div className="text-xs bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-3 py-1 rounded font-mono font-semibold">Ready</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 px-4">
            <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/50 p-5 rounded-xl border border-slate-700/50 text-left space-y-2 hover:border-emerald-500/30 transition-all duration-300 hover:bg-slate-800/95">
              <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">AST Parsing</span>
              <div className="text-lg font-bold text-emerald-400">Active Syntax Tree</div>
              <span className="text-[11px] text-slate-500">Parses code trees via Acorn instead of regex patterns.</span>
            </div>
            <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/50 p-5 rounded-xl border border-slate-700/50 text-left space-y-2 hover:border-indigo-500/30 transition-all duration-300 hover:bg-slate-800/95">
              <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Smart Fixes</span>
              <div className="text-lg font-bold text-indigo-400">Auto Refactoring</div>
              <span className="text-[11px] text-slate-500">Instant actionable code suggestions for every bug.</span>
            </div>
            <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/50 p-5 rounded-xl border border-slate-700/50 text-left space-y-2 hover:border-amber-500/30 transition-all duration-300 hover:bg-slate-800/95">
              <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Database</span>
              <div className="text-lg font-bold text-amber-400">Persistent Logs</div>
              <span className="text-[11px] text-slate-500">Complete history of all scan results and analysis.</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Core Capabilities Section */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16 animate-slideUp">
          <h2 className="text-4xl font-bold text-slate-900 tracking-tight">Comprehensive code intelligence</h2>
          <p className="text-slate-600 text-base leading-relaxed">Everything you need to catch bugs and refactor code seamlessly.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: Code2, title: 'AST Parsing', desc: 'Break down scripts into deep Abstract Syntax Trees to detect structural patterns.' },
            { icon: Cpu, title: 'Smart Fixes', desc: 'Generate context-aware corrective code blocks automatically.' },
            { icon: Database, title: 'Database Logs', desc: 'Store scan telemetry safely for iterative review and tracking.' }
          ].map((item, i) => (
            <div 
              key={i} 
              className="p-8 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all duration-300 space-y-4 hover:translate-y-[-4px] animate-slideUp" 
              style={{animationDelay: `${i * 0.1}s`}}
            >
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-xl flex items-center justify-center text-indigo-600 shadow-sm">
                <item.icon size={28} />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">{item.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Workflow Pipeline Section */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-24 px-6 my-12 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full mix-blend-screen filter blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full mix-blend-screen filter blur-3xl"></div>
        </div>

        <div className="max-w-6xl mx-auto space-y-16 relative z-10">
          <div className="text-center space-y-4 max-w-2xl mx-auto animate-slideUp">
            <span className="inline-block text-indigo-400 text-xs font-bold uppercase tracking-wider bg-indigo-950/50 px-4 py-2 rounded-full border border-indigo-500/30">Streamlined Pipeline</span>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">An efficient static analysis workflow</h2>
            <p className="text-slate-300 text-base leading-relaxed">Analyze, trace, and patch vulnerabilities in three simple steps.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { num: '1', title: 'Ingest source code', desc: 'Paste your JavaScript or frontend code directly into the parser engine.' },
              { num: '2', title: 'Detect deep flaws', desc: 'Uncover anti-patterns, missing blocks, and security vulnerabilities.' },
              { num: '3', title: 'Log & optimize', desc: 'Archive reports to history and deploy optimized code seamlessly.' }
            ].map((step, i) => (
              <div 
                key={i} 
                className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-indigo-500/50 space-y-4 transition-all duration-300 hover:bg-white/10 hover:translate-y-[-4px] animate-slideUp group"
                style={{animationDelay: `${i * 0.15}s`}}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-500 text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-lg group-hover:scale-110 transition-transform">{step.num}</div>
                <h3 className="font-bold text-xl text-white">{step.title}</h3>
                <p className="text-slate-300 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Deep Inspection & Metrics Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-4 animate-slideUp">
          <h2 className="text-4xl font-bold text-slate-900 tracking-tight">Built for high-performance developers</h2>
          <p className="text-slate-500 text-base leading-relaxed">Engineered to handle complex syntax without breaking your pipeline.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {[
            { icon: GitBranch, title: 'Granular Syntax Breakdown', desc: 'Complete AST hierarchy analysis instead of simple pattern matching. Catches nested scope issues and promise handling.' },
            { icon: Lock, title: 'Secure Execution', desc: 'Sandboxed parsing environment ensures your code never leaves your system.' },
            { icon: TrendingUp, title: 'Performance Metrics', desc: 'Track code quality improvements across scans with detailed analytics.' },
            { icon: Award, title: 'Actionable Insights', desc: 'Not just bugs—get recommendations for best practices and optimization opportunities.' }
          ].map((item, i) => (
            <div 
              key={i} 
              className="p-8 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 space-y-4 hover:border-indigo-300 animate-slideUp"
              style={{animationDelay: `${i * 0.1}s`}}
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-indigo-100 to-blue-100 text-indigo-600 rounded-lg shadow-sm">
                  <item.icon size={24} />
                </div>
                <h3 className="font-bold text-slate-900 text-lg">{item.title}</h3>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. CTA Section */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center space-y-8">
        <div className="space-y-4 animate-slideUp">
          <h2 className="text-4xl font-bold text-slate-900 tracking-tight">Ready to optimize your code?</h2>
          <p className="text-lg text-slate-600 leading-relaxed">Join developers who are catching bugs before production.</p>
        </div>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <button
            onClick={() => setCurrentView('analyzer')}
            className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-indigo-500/40 transition-all duration-300 hover:scale-105"
          >
            Get Started Now
          </button>
          <button
            onClick={() => setCurrentView('home')}
            className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold px-8 py-4 rounded-xl transition-all duration-300"
          >
            Learn More
          </button>
        </div>
      </section>
    </div>
  );
}
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