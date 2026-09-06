import React from 'react';
import { AlertOctagon, RotateCcw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[VloxAI ErrorBoundary caught error]:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 my-6 rounded-3xl glass-panel-glow border border-rose-500/40 text-center max-w-lg mx-auto space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/30">
            <AlertOctagon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white font-outfit">Studio Encountered a Glitch</h3>
            <p className="text-xs text-slate-300 mt-1 font-mono">
              {this.state.error?.message || 'A 3D rendering or execution anomaly occurred.'}
            </p>
          </div>
          <button
            type="button"
            onClick={this.handleReset}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs shadow-lg hover:scale-105 transition-transform flex items-center gap-2 mx-auto cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reload Studio</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
