import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import HomePage from './pages/HomePage';
import BriefingPage from './pages/BriefingPage';
import DailyBriefPage from './pages/DailyBriefPage';
import ProfilePage from './pages/ProfilePage';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

// Import icons (assuming lucide-react is installed)
import { Home, FileText, Calendar, User as UserIcon, LogOut } from 'lucide-react';

function Navigation() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-slate-900/60 border-b border-white/5 p-4 flex items-center justify-between">
      <Link to="/home" className="text-2xl font-bold tracking-tight text-white flex gap-2 items-center">
        <span className="bg-blue-600 p-1.5 rounded-lg text-white">
          <FileText size={20} />
        </span>
        InsightBrief
      </Link>
      <div className="flex gap-6 items-center">
        <Link to="/home" className="text-slate-300 hover:text-white transition flex items-center gap-2 font-medium">
          <Home size={18} /> Home
        </Link>
        <Link to="/daily-brief" className="text-slate-300 hover:text-white transition flex items-center gap-2 font-medium">
          <Calendar size={18} /> Daily Brief
        </Link>
        <Link to="/profile" className="text-slate-300 hover:text-white transition flex items-center gap-2 font-medium">
          <UserIcon size={18} /> Profile
        </Link>
        <button 
          onClick={logout}
          className="text-red-400 hover:text-red-300 transition flex items-center gap-2 font-medium cursor-pointer"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>
    </nav>
  );
}

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <LandingPage />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-slate-950 font-sans text-slate-100 flex flex-col">
          <Navigation />
          <main className="flex-1 w-full">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
              <Route path="/briefing" element={<ProtectedRoute><BriefingPage /></ProtectedRoute>} />
              <Route path="/daily-brief" element={<ProtectedRoute><DailyBriefPage /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
