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

function App() {
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
          </Routes>
        </Layout>
      </SessionProvider>
    </Router>
  );
}

export default App;
