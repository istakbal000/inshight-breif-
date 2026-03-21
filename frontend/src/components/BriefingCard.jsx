import React from 'react';
import { Target, CheckCircle2 } from 'lucide-react';

export default function BriefingCard({ highlights, topic }) {
  if (!highlights) return <div className="skeleton-box h-full w-full"></div>;

  return (
    <div className="glass-card p-6 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-blue-500/20 p-3 rounded-xl border border-blue-500/30">
          <Target className="text-blue-400" size={24} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Executive Summary</h3>
          <p className="text-xs text-blue-300 tracking-wider uppercase font-semibold">Topic: {topic}</p>
        </div>
      </div>

      <div className="flex-1 space-y-4">
        {highlights.map((item, idx) => (
          <div key={idx} className="flex gap-3 items-start p-3 bg-slate-800/30 rounded-xl hover:bg-slate-800/60 transition duration-200">
            <CheckCircle2 className="text-green-400 shrink-0 mt-0.5" size={18} />
            <p className="text-slate-200 leading-relaxed text-sm">{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
