import React, { useEffect, useState } from 'react';
import apiClient from '../api/apiClient';
import BriefingCard from '../components/BriefingCard';
import ImpactAnalysis from '../components/ImpactAnalysis';
import ContrarianView from '../components/ContrarianView';
import Timeline from '../components/Timeline';
import { Calendar, Loader2 } from 'lucide-react';
import AIInsights from '../components/AIInsights';

export default function DailyBriefPage() {
  const [briefings, setBriefings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDailyBriefings();
  }, []);

  const fetchDailyBriefings = async () => {
    try {
      const { data } = await apiClient.get('/daily-brief');
      setBriefings(data.briefings || []);
    } catch (err) {
      setError('Failed to load daily briefings.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center flex flex-col items-center gap-4 text-slate-400">
        <Loader2 className="animate-spin text-blue-500" size={48} />
        <p className="animate-pulse">Loading your daily intelligence...</p>
      </div>
    );
  }

  if (error) {
    return <div className="p-12 text-center text-rose-400 font-medium">{error}</div>;
  }

  return (
    <div className="p-6 max-w-screen-2xl mx-auto space-y-12 pb-32">
      <div className="flex items-center gap-4 border-b border-white/5 pb-6">
        <div className="bg-indigo-600/20 p-3 rounded-2xl border border-indigo-500/30">
          <Calendar className="text-indigo-400" size={32} />
        </div>
        <div>
          <h2 className="text-4xl font-extrabold text-white tracking-tight">Your Daily AI Briefing</h2>
          <p className="text-slate-400 mt-1">Personalized market intelligence updated every morning at 8 AM.</p>
        </div>
      </div>

      {briefings.length === 0 ? (
        <div className="glass-card text-center p-24 text-slate-400 rounded-3xl border border-dashed border-white/10">
          <p className="text-xl font-medium mb-2">No daily briefings found yet.</p>
          <p className="text-sm">Make sure you have added interests in your profile and triggered a briefing.</p>
        </div>
      ) : (
        <div className="space-y-24">
          {briefings.map((briefing, index) => (
            <div key={briefing._id} className="space-y-8">
              <div className="flex items-center gap-4">
                <span className="bg-blue-900/40 text-blue-300 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-blue-500/20">
                  {new Date(briefing.createdAt).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                </span>
                <div className="h-px flex-1 bg-gradient-to-r from-blue-500/50 to-transparent"></div>
              </div>

              <AIInsights 
                prediction={briefing.prediction} 
                personalRelevance={briefing.personalRelevance} 
              />

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 space-y-6">
                  <BriefingCard highlights={briefing.highlights} topic={briefing.topic} />
                  <ImpactAnalysis 
                    winners={briefing.winners} 
                    losers={briefing.losers} 
                    impact={briefing.impact} 
                  />
                </div>
                <div className="space-y-6">
                  <ContrarianView contrarian={briefing.contrarian} />
                  <Timeline timeline={briefing.timeline} />
                </div>
              </div>
              {index < briefings.length - 1 && <hr className="border-white/5 mt-16" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
