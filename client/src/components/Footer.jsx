import { Code2, Share2, Globe, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-slate-300 pt-20 pb-8 px-6 border-t border-slate-800/50">
      <div className="max-w-7xl mx-auto">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          <div className="lg:col-span-1">
            <div className="space-y-3">
              <span className="font-black text-2xl text-white">Debugique</span>
              <p className="text-sm text-slate-400 leading-relaxed">Advanced AST-based code analysis for modern developers.</p>
              <div className="flex items-center space-x-3 pt-4">
                <a href="#" className="p-2 bg-slate-800 hover:bg-indigo-600 rounded-lg transition-colors duration-300">
                  <Code2 size={16} className="text-slate-300" />
                </a>
                <a href="#" className="p-2 bg-slate-800 hover:bg-blue-600 rounded-lg transition-colors duration-300">
                  <Share2 size={16} className="text-slate-300" />
                </a>
                <a href="#" className="p-2 bg-slate-800 hover:bg-blue-600 rounded-lg transition-colors duration-300">
                  <Globe size={16} className="text-slate-300" />
                </a>
                <a href="#" className="p-2 bg-slate-800 hover:bg-red-600 rounded-lg transition-colors duration-300">
                  <Mail size={16} className="text-slate-300" />
                </a>
              </div>
            </div>
          </div>

          {[
            { 
              title: 'Product', 
              links: ['Features', 'Pricing', 'Security', 'Roadmap'] 
            },
            { 
              title: 'Resources', 
              links: ['Documentation', 'API Reference', 'Blog', 'Changelog'] 
            },
            { 
              title: 'Company', 
              links: ['About Us', 'Careers', 'Contact', 'Support'] 
            },
            { 
              title: 'Legal', 
              links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Contact'] 
            }
          ].map((col, idx) => (
            <div key={idx} className="animate-slideUp" style={{animationDelay: `${idx * 0.1}s`}}>
              <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map((link, i) => (
                  <li key={i}>
                    <a href="#" className="text-sm text-slate-400 hover:text-indigo-400 transition-colors duration-300">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800/50 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-500">© 2026 Debugique Ltd. All rights reserved.</p>
            <div className="flex items-center space-x-1 text-xs text-slate-500">
              <span>Made with</span>
              <span className="text-red-500 animate-pulse">❤</span>
              <span>by Debugique Team</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}