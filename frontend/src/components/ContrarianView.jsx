import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function ContrarianView({ contrarian }) {
  const [activeTab, setActiveTab] = useState('bullish');

  if (!contrarian) return <div className="skeleton-box h-48 w-full"></div>;

  const tabs = [
    { id: 'bullish', label: 'Bullish', icon: <TrendingUp size={16} />, color: 'emerald' },
    { id: 'bearish', label: 'Bearish', icon: <TrendingDown size={16} />, color: 'rose' },
    { id: 'neutral', label: 'Neutral', icon: <Minus size={16} />, color: 'amber' }
  ];

  const getColorClasses = (id, isActive) => {
    if (!isActive) return 'text-slate-400 hover:text-slate-200 hover:bg-slate-800';
    if (id === 'bullish') return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30';
    if (id === 'bearish') return 'bg-rose-500/10 text-rose-400 border border-rose-500/30';
    return 'bg-amber-500/10 text-amber-400 border border-amber-500/30';
  };

  return (
    <div className="glass-card p-5 h-full flex flex-col">
      <h3 className="text-lg font-bold text-white mb-4">Contrarian Perspectives</h3>
      
      <div className="flex gap-2 p-1 bg-slate-900 rounded-xl mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${getColorClasses(tab.id, activeTab === tab.id)}`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 bg-slate-800/40 rounded-xl p-4 text-slate-300 text-sm leading-relaxed border border-slate-700/50">
        {contrarian[activeTab]}
      </div>
    </div>
  );
}
