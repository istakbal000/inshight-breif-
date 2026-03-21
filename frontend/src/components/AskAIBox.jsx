import React, { useState } from 'react';
import { MessageSquare, Send, Sparkles, AlertCircle } from 'lucide-react';
import apiClient from '../api/apiClient';

export default function AskAIBox({ briefingTopic }) {
  const [messages, setMessages] = useState([
    { role: 'ai', content: `Ask me any follow-up questions about ${briefingTopic || 'this topic'}!`, sources: [] }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await apiClient.post('/ask', { question: userMsg.content });
      const aiMsg = { 
        role: 'ai', 
        content: response.data.answer,
        sources: response.data.sources 
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to get answer. Please try again.';
      setMessages(prev => [...prev, { 
        role: 'error', 
        content: errorMsg
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-card flex flex-col h-full w-full overflow-hidden shadow-2xl border-indigo-500/20">
      <div className="bg-indigo-950/40 p-3 border-b border-indigo-500/20 flex gap-2 items-center">
        <Sparkles className="text-indigo-400" size={18} />
        <h3 className="font-semibold text-indigo-200">Ask AI Insights</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-br-none' 
                : msg.role === 'error'
                ? 'bg-rose-950/50 text-rose-300 border border-rose-900 rounded-bl-none'
                : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'
            }`}>
              {msg.role === 'error' && <AlertCircle size={14} className="inline mr-1 mb-0.5" />}
              {msg.content}
            </div>
            
            {/* Sources display */}
            {msg.sources && msg.sources.length > 0 && (
              <div className="mt-1 ml-1 text-[10px] text-slate-500 max-w-[85%]">
                <span className="font-semibold text-slate-400">Sources: </span>
                {msg.sources.map((s, i) => (
                  <span key={i} className="mr-1 hover:text-indigo-400 cursor-pointer">{s.title}{i < msg.sources.length - 1 ? ',' : ''}</span>
                ))}
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl rounded-bl-none px-4 py-3 text-sm flex gap-1 items-center">
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
          </div>
        )}
      </div>

      <div className="p-3 bg-slate-900 border-t border-slate-800">
        <div className="flex items-center gap-2">
          <input
            type="text"
            className="input-field py-2 flex-1 text-sm bg-slate-950"
            placeholder="Ask about the impact..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={isLoading}
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-xl transition disabled:opacity-50"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
