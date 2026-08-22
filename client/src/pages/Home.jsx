import { ArrowRight, Code2, Database, Cpu } from 'lucide-react';

const FEATURES = [
  { id: 'ast-parsing', icon: Code2, title: 'AST Parsing', desc: 'Break down scripts into Abstract Syntax Trees to detect structural patterns.' },
  { id: 'smart-fixes', icon: Cpu, title: 'Smart Fixes', desc: 'Generate context-aware corrective code blocks automatically.' },
  { id: 'database-logs', icon: Database, title: 'Database Logs', desc: 'Store scan telemetry safely for iterative review and tracking.' },
];

function FeatureCard({ icon: Icon, title, desc }) {
  return (
    <div className="card p-8 space-y-4">
      <span className="flex items-center justify-center w-10 h-10 border border-line rounded-md text-ink" aria-hidden="true">
        <Icon size={18} aria-hidden="true" />
      </span>
      <h3 className="font-semibold text-ink text-lg">{title}</h3>
      <p className="text-muted text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

export default function Home({ setCurrentView }) {
  return (
    <div className="page-container max-w-4xl">
      <div className="space-y-20">
        <section className="space-y-6" aria-label="Introduction">
          <div className="space-y-4">
            <span className="badge bg-surface2 text-ink border border-line">Next-Gen AST Static Analysis Platform</span>
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tighter text-ink">
              Debug code faster than ever
            </h1>
            <p className="text-muted text-lg max-w-xl leading-relaxed">
              Analyze code architecture, detect vulnerabilities instantly using Abstract Syntax Trees, and auto-generate fixes.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button onClick={() => setCurrentView('signup')} className="btn btn-primary">
                <span>Start Analyzing Code</span>
                <ArrowRight size={16} aria-hidden="true" />
              </button>
              <button onClick={() => setCurrentView('login')} className="btn btn-ghost">
                View Database Logs
              </button>
            </div>
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-6" aria-label="Key features">
          {FEATURES.map((feature) => (
            <FeatureCard key={feature.id} {...feature} />
          ))}
        </section>
      </div>
    </div>
  );
}