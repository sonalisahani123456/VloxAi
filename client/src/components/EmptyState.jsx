import React from 'react';
import { Sparkles, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const EmptyState = ({
  icon: Icon = Sparkles,
  title = 'No Content Found',
  description = 'Get started by authoring your first 3D blog story or producing an AI vlog.',
  actionLabel,
  actionLink,
  onActionClick,
}) => {
  return (
    <div className="p-12 rounded-3xl glass-panel border border-slate-800 text-center max-w-md mx-auto my-8 space-y-4 shadow-xl">
      <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mx-auto border border-indigo-500/30 shadow-lg">
        <Icon className="w-7 h-7" />
      </div>
      <div>
        <h3 className="text-xl font-bold text-white font-outfit">{title}</h3>
        <p className="text-xs text-slate-400 mt-1 leading-relaxed">{description}</p>
      </div>

      {actionLabel && actionLink && (
        <Link
          to={actionLink}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs shadow-lg hover:scale-105 transition-transform"
        >
          <Plus className="w-4 h-4" />
          <span>{actionLabel}</span>
        </Link>
      )}

      {actionLabel && !actionLink && onActionClick && (
        <button
          type="button"
          onClick={onActionClick}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs shadow-lg hover:scale-105 transition-transform cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
};

export default EmptyState;
