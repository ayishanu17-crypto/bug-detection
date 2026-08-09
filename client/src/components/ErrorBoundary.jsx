import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 space-y-4">
          <div className="p-3 bg-red-500/20 text-red-400 rounded-2xl border border-red-500/30">
            <AlertTriangle size={32} />
          </div>
          <h1 className="text-xl font-bold">Runtime Component Crash Detected</h1>
          <p className="text-slate-400 text-xs font-mono bg-slate-950 p-4 rounded-xl border border-slate-800 max-w-xl overflow-x-auto text-red-300">
            {this.state.error?.toString()}
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 rounded-xl text-sm font-semibold transition"
          >
            Reload Application
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}