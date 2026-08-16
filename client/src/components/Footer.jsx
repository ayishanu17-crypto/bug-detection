import { Code2, Share2, Globe, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-6 px-6 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
        <p>© 2026 Debugique Ltd. All rights reserved.</p>
        <div className="flex items-center space-x-1">
          <span>Made with ❤ by Debugique Team</span>
        </div>
      </div>
    </footer>
  );
}