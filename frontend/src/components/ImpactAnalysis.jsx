import React from 'react';
import { Trophy, ArrowDownCircle } from 'lucide-react';

export default function ImpactAnalysis({ winners, losers, impact }) {
  if (!winners || !losers) return <div className="skeleton-box h-64 w-full"></div>;

  return (
    <div className="glass-card p-6 h-full flex flex-col">
      <h3 className="text-xl font-bold text-white mb-2">Market Impact</h3>
      <p className="text-slate-400 text-sm mb-6">{impact}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
        {/* Winners */}
        <div className="bg-emerald-950/20 border border-emerald-900/50 rounded-xl p-4 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="text-emerald-500" size={20} />
            <h4 className="font-semibold text-emerald-400">Winners</h4>
          </div>
          <div className="space-y-3 flex-1 overflow-y-auto pr-2">
            {winners.map((w, idx) => (
              <div key={idx} className="text-sm">
                <span className="font-bold text-slate-200 block">{w.entity}</span>
                <span className="text-slate-400">{w.reason}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Losers */}
        <div className="bg-rose-950/20 border border-rose-900/50 rounded-xl p-4 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <ArrowDownCircle className="text-rose-500" size={20} />
            <h4 className="font-semibold text-rose-400">Losers</h4>
          </div>
          <div className="space-y-3 flex-1 overflow-y-auto pr-2">
            {losers.map((l, idx) => (
              <div key={idx} className="text-sm">
                <span className="font-bold text-slate-200 block">{l.entity}</span>
                <span className="text-slate-400">{l.reason}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
