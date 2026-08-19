import { Mail, AtSign, Globe, Briefcase } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="glass border-t border-white/40 py-10 px-6 mt-auto">
      <div className="max-w-7xl mx-auto grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-3">
          <h3 className="font-black text-ink text-lg tracking-tight">Debugique</h3>
          <p className="text-xs text-muted leading-relaxed max-w-sm">
            Analyze architecture, catch vulnerabilities with AST-powered static analysis, and apply instant fixes for JS, Python, C/C++ and Java.
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="font-bold text-ink text-sm">Quick Links</h4>
          <ul className="space-y-2 text-xs text-muted">
            <li><a href="#home" className="hover:text-accent transition-colors">Home</a></li>
            <li><a href="#analyzer" className="hover:text-accent transition-colors">Analyzer</a></li>
            <li><a href="#history" className="hover:text-accent transition-colors">Scan History</a></li>
            <li><a href="#settings" className="hover:text-accent transition-colors">Settings</a></li>
          </ul>
        </div>

        <div className="space-y-3">
          <h4 className="font-bold text-ink text-sm">Contact Us</h4>
          <div className="space-y-2.5 text-xs text-muted">
            <a href="mailto:support@debugique.com" className="flex items-center gap-2 hover:text-accent transition-colors">
              <Mail size={14} /> support@debugique.com
            </a>
            <a href="https://github.com/debugique" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-accent transition-colors">
              <AtSign size={14} /> @debugique on GitHub
            </a>
            <a href="https://x.com/debugique" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-accent transition-colors">
              <Globe size={14} /> @debugique on X
            </a>
            <a href="https://linkedin.com/company/debugique" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-accent transition-colors">
              <Briefcase size={14} /> /company/debugique
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-white/40 mt-8 pt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-muted gap-2">
        <p>© 2026 Debugique Ltd. All rights reserved.</p>
        <p>Made with care by Debugique Team</p>
      </div>
    </footer>
  );
}
