import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const [topic, setTopic] = useState('');
  const navigate = useNavigate();

  const handleGenerate = () => {
    if (topic.trim()) {
      navigate(`/briefing?topic=${encodeURIComponent(topic)}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600 mb-6 drop-shadow-md pb-2">
        InsightBrief
      </h1>
      <p className="text-lg text-slate-300 mb-10 max-w-2xl">
        AI-powered interactive intelligence briefings to replace traditional news. Get highlights, impact analysis, and contrarian perspectives instantly.
      </p>
      
      <div className="w-full max-w-xl glass-card p-2 flex items-center">
        <input 
          type="text" 
          placeholder="Enter a topic (e.g., Artificial Intelligence, TSMC...)"
          className="input-field border-none bg-transparent flex-1"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
        />
        <button 
          onClick={handleGenerate}
          className="btn-primary ml-2 rounded-xl"
        >
          Generate
        </button>
      </div>
    </div>
  );
}
