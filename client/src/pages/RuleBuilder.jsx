import { useState } from 'react';
import { Sliders, Plus, Check, Code2, Trash2 } from 'lucide-react';

export default function RuleBuilder() {
  const [rules, setRules] = useState([
    { id: 1, name: 'No Console Logs', target: 'CallExpression', property: 'console.log', severity: 'MEDIUM', active: true },
    { id: 2, name: 'Enforce Strict Equality', target: 'BinaryExpression', property: '==', severity: 'HIGH', active: true },
  ]);
  const [ruleName, setRuleName] = useState('');
  const [targetNode, setTargetNode] = useState('CallExpression');
  const [severity, setSeverity] = useState('HIGH');

  const handleAddRule = (e) => {
    e.preventDefault();
    if (!ruleName.trim()) return;
    const newRule = {
      id: Date.now(),
      name: ruleName,
      target: targetNode,
      property: 'custom_check',
      severity,
      active: true,
    };
    setRules([...rules, newRule]);
    setRuleName('');
  };

  const toggleRule = (id) => {
    setRules(rules.map(r => r.id === id ? { ...r, active: !r.active } : r));
  };

  const deleteRule = (id) => {
    setRules(rules.filter(r => r.id !== id));
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Custom AST Rule Studio</h1>
        <p className="text-slate-500 text-sm">Define custom static analysis linting rules tailored to your team's architecture guidelines.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Rule Form */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center space-x-2 text-slate-900 font-bold">
            <Sliders size={18} className="text-indigo-600" />
            <span>Create New Rule</span>
          </div>
          <form onSubmit={handleAddRule} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Rule Name</label>
              <input 
                type="text" 
                placeholder="e.g., Ban Eval Statements" 
                value={ruleName}
                onChange={(e) => setRuleName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500" 
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">AST Node Target</label>
              <select 
                value={targetNode} 
                onChange={(e) => setTargetNode(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm outline-none"
              >
                <option value="CallExpression">CallExpression (Functions)</option>
                <option value="BinaryExpression">BinaryExpression (Operators)</option>
                <option value="VariableDeclaration">VariableDeclaration (Vars)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Severity Level</label>
              <select 
                value={severity} 
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm outline-none"
              >
                <option value="HIGH">HIGH</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="LOW">LOW</option>
              </select>
            </div>
            <button 
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl text-sm transition flex items-center justify-center space-x-2"
            >
              <Plus size={16} />
              <span>Save Custom Rule</span>
            </button>
          </form>
        </div>

        {/* Active Custom Rules List */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <h3 className="font-bold text-slate-900">Active Custom Rules ({rules.length})</h3>
          <div className="space-y-3">
            {rules.map((rule) => (
              <div key={rule.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-800 text-sm">{rule.name}</span>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${rule.severity === 'HIGH' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>{rule.severity}</span>
                  </div>
                  <p className="text-xs text-slate-500 font-mono">Target: {rule.target}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={() => toggleRule(rule.id)}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${rule.active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}
                  >
                    {rule.active ? 'Active' : 'Disabled'}
                  </button>
                  <button onClick={() => deleteRule(rule.id)} className="text-slate-400 hover:text-red-600 transition">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}