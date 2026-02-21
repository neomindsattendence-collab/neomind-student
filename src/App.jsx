import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import { SessionProvider } from './context/SessionContext';
import { auth } from './firebase/firebaseConfig';
import { ShieldAlert } from 'lucide-react';

// Pages
import Dashboard from './pages/Dashboard';
import MyBatches from './pages/MyBatches';
import LiveClass from './pages/LiveClass';
import Notes from './pages/Notes';
import Assignments from './pages/Assignments';
import Analytics from './pages/Analytics';
import Jobs from './pages/Jobs';
import CareerTips from './pages/CareerTips';
import Settings from './pages/Settings';

import { Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import PendingAssignment from './pages/PendingAssignment';

function App() {
  const { user, userDoc, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    );
  }

  // 🛡️ HARD ROLE GUARD
  if (userDoc?.role !== "student") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
        <div className="max-w-md text-center space-y-6">
          <div className="w-24 h-24 bg-rose-50 text-rose-600 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl shadow-rose-200">
            <ShieldAlert size={48} />
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tighter uppercase">Student Portal Only</h1>
          <p className="text-slate-500 font-medium">Your account is registered as a <span className="font-bold text-indigo-600 uppercase">{userDoc?.role}</span>. Please use the appropriate portal.</p>
          <button onClick={() => auth.signOut()} className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs">Sign Out</button>
        </div>
      </div>
    );
  }

  // Check if assigned to any batch
  if (userDoc.assignedBatches?.length === 0) {
    return (
      <Router>
        <Routes>
          <Route path="/pending" element={<PendingAssignment />} />
          <Route path="*" element={<Navigate to="/pending" />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <SessionProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/batches" element={<MyBatches />} />
            <Route path="/live" element={<LiveClass />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/assignments" element={<Assignments />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/career-tips" element={<CareerTips />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Dashboard />} />
          </Routes>
        </Layout>
      </SessionProvider>
    </Router>
  );
}

export default App;
