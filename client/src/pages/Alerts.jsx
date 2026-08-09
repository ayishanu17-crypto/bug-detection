import { useState } from 'react';
import { Bell, Webhook, Check, Send } from 'lucide-react';

export default function Alerts() {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [platform, setPlatform] = useState('slack');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    if (!webhookUrl.trim()) return;
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Webhook & Notification Alerts</h1>
        <p className="text-slate-500 text-sm">Configure real-time alerts dispatched to Slack or Discord when vulnerabilities or critical issues are found.</p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Webhook size={20} /></div>
          <div>
            <h3 className="font-bold text-slate-900">Webhook Integration</h3>
            <p className="text-slate-500 text-xs">Paste your channel webhook URL to receive instant telemetry summaries.</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1">Platform Service</label>
            <select 
              value={platform} 
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none"
            >
              <option value="slack">Slack Channel</option>
              <option value="discord">Discord Server</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1">Webhook URL Endpoint</label>
            <input 
              type="url" 
              placeholder="https://hooks.slack.com/services/T00/B00/XX" 
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none font-mono" 
            />
          </div>

          <button 
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition flex items-center space-x-2"
          >
            {saved ? <Check size={16} /> : <Send size={16} />}
            <span>{saved ? 'Webhook Saved Successfully!' : 'Save & Test Webhook'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}