import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import BubbleSort from './pages/dsa/BubbleSort';
import TwoSum from './pages/problems/TwoSum';
import MinimumOR from './pages/problems/MinimumOR';
import SystemDesign from './pages/systemdesign/SystemDesign';
import './index.css';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            
            {/* DSA Routes */}
            <Route path="/dsa/bubble-sort" element={<BubbleSort />} />
            
            {/* LeetCode Routes */}
            <Route path="/leetcode/two-sum" element={<TwoSum />} />
            <Route path="/leetcode/minimum-or" element={<MinimumOR />} />
            
            {/* System Design Routes */}
            <Route path="/system-design" element={<SystemDesign />} />

            {/* Redirects for backward compatibility */}
            <Route path="/bubble-sort" element={<Navigate to="/dsa/bubble-sort" replace />} />
            <Route path="/two-sum" element={<Navigate to="/leetcode/two-sum" replace />} />
            <Route path="/minimum-or" element={<Navigate to="/leetcode/minimum-or" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;
