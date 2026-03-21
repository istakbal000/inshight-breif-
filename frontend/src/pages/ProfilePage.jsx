import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import { X, Plus, Play, Loader2 } from 'lucide-react';

export default function ProfilePage() {
  const [interests, setInterests] = useState([]);
  const [newInterest, setNewInterest] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [triggerLoading, setTriggerLoading] = useState(false);

  useEffect(() => {
    fetchInterests();
  }, []);

  const fetchInterests = async () => {
    try {
      const { data } = await apiClient.get('/user/interests');
      setInterests(data.interests || []);
    } catch (err) {
      console.error('Failed to fetch interests:', err);
    } finally {
      setLoading(false);
    }
  };

  const addInterest = async () => {
    if (!newInterest.trim()) return;
    setActionLoading(true);
    const updatedInterests = [...interests, newInterest.trim()];
    try {
      await apiClient.post('/user/interests', { interests: updatedInterests });
      setInterests(updatedInterests);
      setNewInterest('');
    } catch (err) {
      alert('Failed to add interest');
    } finally {
      setActionLoading(false);
    }
  };

  const removeInterest = async (interest) => {
    setActionLoading(true);
    const updatedInterests = interests.filter(i => i !== interest);
    try {
      await apiClient.post('/user/interests', { interests: updatedInterests });
      setInterests(updatedInterests);
    } catch (err) {
      alert('Failed to remove interest');
    } finally {
      setActionLoading(false);
    }
  };

  const triggerDailyBrief = async () => {
    setTriggerLoading(true);
    try {
      await apiClient.post('/daily-brief/trigger');
      alert('Daily brief generation triggered! Check the Daily Brief page in a moment.');
    } catch (err) {
      alert('Failed to trigger daily brief');
    } finally {
      setTriggerLoading(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center animate-pulse text-slate-400">Loading profile...</div>;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      <h2 className="text-3xl font-bold text-white tracking-tight">Profile & Interests</h2>
      
      <div className="glass-card p-8 border border-white/5 bg-slate-900/40 rounded-2xl shadow-xl">
        <h3 className="text-xl font-semibold mb-2 text-slate-100 italic">Manage Daily Interests</h3>
        <p className="text-slate-400 mb-6 text-sm">Topics you follow will be included in your automatic 8 AM daily briefing.</p>
        
        <div className="flex gap-2 mb-8">
          <input 
            type="text" 
            className="input-field flex-1 bg-slate-950/50 border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 transition outline-none" 
            placeholder="e.g. NVIDIA, Quantum Computing..." 
            value={newInterest}
            onChange={(e) => setNewInterest(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addInterest()}
          />
          <button 
            className="btn-primary bg-blue-600 hover:bg-blue-500 text-white rounded-xl px-4 flex items-center gap-2 disabled:opacity-50 transition"
            onClick={addInterest}
            disabled={actionLoading}
          >
            {actionLoading ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
            Add
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {interests.length === 0 ? (
            <p className="text-slate-500 italic text-sm py-4">No interests added yet.</p>
          ) : (
            interests.map((interest, idx) => (
              <span 
                key={idx} 
                className="bg-slate-800/80 text-blue-300 border border-blue-500/20 px-4 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 group transition hover:border-blue-500/40"
              >
                {interest}
                <button 
                  onClick={() => removeInterest(interest)}
                  className="text-slate-500 hover:text-rose-400 mt-0.5 transition"
                >
                  <X size={14} />
                </button>
              </span>
            ))
          )}
        </div>
      </div>

      <div className="glass-card p-8 border border-white/5 bg-slate-900/40 rounded-2xl shadow-xl flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-slate-100 flex items-center gap-2">
            <Play size={18} className="text-indigo-400" /> Test Daily Brief Engine
          </h3>
          <p className="text-slate-400 text-sm mt-1">Manual trigger for testing current interests.</p>
        </div>
        <button 
          className="btn-secondary border border-white/10 hover:bg-white/5 text-slate-200 rounded-xl px-6 py-2.5 flex items-center gap-2 transition disabled:opacity-50"
          onClick={triggerDailyBrief}
          disabled={triggerLoading || interests.length === 0}
        >
          {triggerLoading ? <Loader2 className="animate-spin" size={18} /> : 'Run Now'}
        </button>
      </div>
    </div>
  );
}
