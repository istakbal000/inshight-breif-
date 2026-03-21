import React from 'react';
import { Sparkles, Target, Zap } from 'lucide-react';

export default function AIInsights({ prediction, personalRelevance }) {
  if (!prediction && !personalRelevance) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      {/* AI Prediction Card */}
      {prediction && (
        <div className="glass-card p-6 border-l-4 border-l-blue-500 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Zap size={80} className="text-blue-400" />
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
              <Sparkles size={20} />
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">AI Prediction</h3>
          </div>
          <p className="text-slate-300 leading-relaxed italic">
            "{prediction}"
          </p>
          <div className="mt-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-400/80">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            Predictive Analysis
          </div>
        </div>
      )}

      {/* Personal Relevance Card */}
      {personalRelevance && (
        <div className="glass-card p-6 border-l-4 border-l-indigo-500 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Target size={80} className="text-indigo-400" />
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
              <Zap size={20} />
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">Why It Matters For You</h3>
          </div>
          <p className="text-slate-300 leading-relaxed">
            {personalRelevance}
          </p>
          <div className="mt-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400/80">
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
            Contextual Alignment
          </div>
        </div>
      )}
    </div>
  );
}
