import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import apiClient from '../api/apiClient';

// Components
import BriefingCard from '../components/BriefingCard';
import ContrarianView from '../components/ContrarianView';
import ImpactAnalysis from '../components/ImpactAnalysis';
import Timeline from '../components/Timeline';
import AskAIBox from '../components/AskAIBox';
import AIInsights from '../components/AIInsights';

export default function BriefingPage() {
  const [searchParams] = useSearchParams();
  const topicParam = searchParams.get('topic');
  
  const [briefingData, setBriefingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBriefing = async () => {
      if (!topicParam) return;
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.get(`/briefing?topic=${topicParam}`);
        setBriefingData(response.data.briefing);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to generate briefing.');
      } finally {
        setLoading(false);
      }
    };

    fetchBriefing();
  }, [topicParam]);

  if (!topicParam) {
    return <div className="p-12 text-center text-slate-400 font-medium pt-24">No topic provided. Go back to the home page and search.</div>;
  }

  if (error) {
    return <div className="p-12 text-center text-rose-400 font-medium pt-24">{error}</div>;
  }

  return (
    <div className="p-6 max-w-screen-2xl mx-auto space-y-6 pb-32">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Intelligence Briefing</h2>
          <p className="text-slate-400 mt-2">Topic: <span className="text-indigo-400 font-semibold">{topicParam}</span></p>
        </div>
        {loading && (
          <div className="flex items-center gap-2 text-indigo-400 text-sm font-medium animate-pulse">
            <span className="w-4 h-4 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin"></span>
             AI is extracting insights...
          </div>
        )}
      </div>

      <AIInsights 
        prediction={briefingData?.prediction} 
        personalRelevance={briefingData?.personalRelevance} 
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <div className="min-h-72">
            <BriefingCard highlights={briefingData?.highlights} topic={topicParam} />
          </div>
          <div className="min-h-80">
            <ImpactAnalysis 
              winners={briefingData?.winners} 
              losers={briefingData?.losers} 
              impact={briefingData?.impact} 
            />
          </div>
        </div>
        <div className="space-y-6">
          <div className="min-h-64">
            <ContrarianView contrarian={briefingData?.contrarian} />
          </div>
          <div className="min-h-80 xl:h-[450px]">
             <Timeline timeline={briefingData?.timeline} />
          </div>
        </div>
      </div>
      
      {/* Ask AI Box - Fixed Bottom Right or inline block */}
      <div className="fixed bottom-6 right-6 w-[400px] h-[450px] shadow-2xl z-40">
        <AskAIBox briefingTopic={topicParam} />
      </div>
    </div>
  );
}
