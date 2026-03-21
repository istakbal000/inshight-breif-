import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Zap, Shield, BarChart3, ArrowRight } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white selection:bg-purple-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 px-6 py-4 flex justify-between items-center backdrop-blur-md bg-black/20 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">InsightBrief</span>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/login" className="text-sm font-medium hover:text-purple-400 transition-colors">Login</Link>
          <Link to="/signup" className="px-5 py-2 bg-white text-black text-sm font-bold rounded-full hover:bg-gray-200 transition-all active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.15)]">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-purple-500/20 blur-[120px] rounded-full -z-10" />
        <div className="absolute top-40 right-0 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full -z-10" />

        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-purple-300 mb-8 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
            </span>
            New: Gemini 2.5 Intelligence Engine
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black mb-8 leading-[1.1] tracking-tighter">
            Next-Gen AI <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-emerald-400">
              Intelligence Briefings
            </span>
          </h1>
          
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            Stop drowning in news. Transform thousands of articles into structured, high-signal briefings with RAG-powered analysis and market impact intelligence.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <Link to="/signup" className="group flex items-center gap-2 px-8 py-4 bg-white text-black font-bold rounded-2xl hover:bg-gray-200 transition-all transform active:scale-95 text-lg">
              Start Free Trial
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="px-8 py-4 bg-white/5 border border-white/10 font-bold rounded-2xl hover:bg-white/10 transition-all text-lg backdrop-blur-sm">
              View Demo
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-md hover:bg-white/[0.05] transition-colors group">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Deep Summarization</h3>
            <p className="text-gray-400">Advanced AI analyzes multiple sources to extract highlights, market impacts, and key entities.</p>
          </div>

          <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-md hover:bg-white/[0.05] transition-colors group">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Shield className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold mb-4">RAG Questioning</h3>
            <p className="text-gray-400">Chat with your briefing. Ask follow-up questions grounded strictly in the processed news sources.</p>
          </div>

          <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-md hover:bg-white/[0.05] transition-colors group">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <BarChart3 className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Market Impact</h3>
            <p className="text-gray-400">Identify winners, losers, and neutral shifts in real-time across industry sectors.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5 px-6 text-center text-gray-500 text-sm">
        <p>&copy; 2026 InsightBrief Intelligence. Powered by Gemini 2.5.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
