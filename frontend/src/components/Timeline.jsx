import React from 'react';
import { Clock } from 'lucide-react';

export default function Timeline({ timeline }) {
  if (!timeline) return <div className="skeleton-box h-full w-full"></div>;

  return (
    <div className="glass-card p-6 h-full flex flex-col overflow-hidden">
      <div className="flex items-center gap-3 mb-6">
        <Clock className="text-indigo-400" size={20} />
        <h3 className="text-lg font-bold text-white">Event Timeline</h3>
      </div>

      <div className="flex-1 overflow-y-auto pr-4 relative">
        <div className="absolute left-3 top-0 bottom-0 w-px bg-slate-700"></div>
        <div className="space-y-6">
          {timeline.map((item, idx) => (
            <div key={idx} className="relative pl-8">
              <div className="absolute left-[9px] top-1.5 w-2 h-2 rounded-full bg-indigo-500 ring-4 ring-slate-900"></div>
              <div className="text-xs font-bold text-indigo-400 mb-1">{item.date}</div>
              <div className="text-sm text-slate-300">{item.event}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
