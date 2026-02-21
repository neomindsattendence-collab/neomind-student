import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import { SessionProvider } from './context/SessionContext';

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

  // Check if assigned to any batch
  if (!userDoc || userDoc.assignedBatches?.length === 0) {
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
