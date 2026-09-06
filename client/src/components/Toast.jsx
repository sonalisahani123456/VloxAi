import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useBlog } from '../context/BlogContext';
import { CheckCircle2, AlertCircle, Info, Sparkles } from 'lucide-react';

const Toast = () => {
  const { toast } = useBlog();

  if (!toast) return null;

  const isError = toast.type === 'error';
  const isInfo = toast.type === 'info';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 max-w-md pointer-events-auto"
      >
        <div
          className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl glass-panel-glow text-white shadow-2xl border ${
            isError
              ? 'border-red-500/40 bg-red-950/80'
              : isInfo
              ? 'border-cyan-500/40 bg-slate-900/90'
              : 'border-indigo-500/40 bg-slate-900/90'
          }`}
        >
          {isError ? (
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          ) : isInfo ? (
            <Info className="w-5 h-5 text-cyan-400 shrink-0" />
          ) : (
            <Sparkles className="w-5 h-5 text-indigo-400 shrink-0 animate-spin" />
          )}
          <p className="text-sm font-medium text-slate-100">{toast.message}</p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Toast;
