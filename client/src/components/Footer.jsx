export default function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
        <div className="col-span-2 md:col-span-1"><span className="font-bold text-xl">Debugique</span></div>
        {['Product', 'Features', 'Resources', 'Company'].map(cat => (
          <div key={cat}>
            <h4 className="font-bold text-slate-900 mb-4">{cat}</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>API Access</li>
              <li>Case Studies</li>
              <li>Blog</li>
              <li>Support</li>
            </ul>
          </div>
        ))}
      </div>
      <div className="max-w-7xl mx-auto border-t pt-8 text-center text-xs text-slate-400">
        © 2026 Debugique Ltd. All rights reserved. Terms of Service | Privacy Policy
      </div>
    </footer>
  );
}