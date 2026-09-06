import React from 'react';

export const BlogCardSkeleton = () => {
  return (
    <div className="rounded-3xl glass-panel border border-slate-800 p-5 space-y-4 animate-pulse">
      <div className="w-full aspect-video rounded-2xl bg-slate-900/80" />
      <div className="space-y-2">
        <div className="w-20 h-4 rounded-full bg-slate-900/80" />
        <div className="w-3/4 h-6 rounded-xl bg-slate-900/80" />
        <div className="w-full h-4 rounded-lg bg-slate-900/60" />
        <div className="w-2/3 h-4 rounded-lg bg-slate-900/60" />
      </div>
      <div className="pt-3 border-t border-slate-800 flex justify-between">
        <div className="w-24 h-4 rounded bg-slate-900/80" />
        <div className="w-16 h-4 rounded bg-slate-900/80" />
      </div>
    </div>
  );
};

export const DashboardStatsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="p-6 rounded-3xl glass-panel border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-slate-900/80" />
          <div className="w-20 h-3 rounded bg-slate-900/80" />
          <div className="w-28 h-8 rounded-xl bg-slate-900/80" />
        </div>
      ))}
    </div>
  );
};

export const TimelineTrackSkeleton = () => {
  return (
    <div className="space-y-3 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="w-28 h-4 rounded bg-slate-900/80" />
          <div className="flex-1 h-10 rounded-xl bg-slate-950/80 border border-slate-800" />
        </div>
      ))}
    </div>
  );
};
