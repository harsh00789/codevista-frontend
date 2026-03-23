import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import BubbleSort from './pages/dsa/BubbleSort';
import TwoSum from './pages/problems/TwoSum';
import MinimumOR from './pages/problems/MinimumOR';
import MaxProductPath from './pages/problems/MaxProductPath';
import SystemDesign from './pages/systemdesign/SystemDesign';
import apiClient from './api/client';
import './index.css';

const App: React.FC = () => {
  // Keep-alive mechanism to prevent Render free instance from sleeping
  useEffect(() => {
    const keepBackendAwake = async () => {
      try {
        await apiClient.get('/');
      } catch (error) {
        // Discard errors, we just want to wake up the server
      }
    };
    
    // Hit immediately on load
    keepBackendAwake();

    // Hit the backend every 5 minutes (5 * 60 * 1000 = 300000ms)
    const interval = setInterval(keepBackendAwake, 300000);
    return () => clearInterval(interval);
  }, []);

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
            <Route path="/leetcode/max-product-path" element={<MaxProductPath />} />
            
            {/* System Design Routes */}
            <Route path="/system-design" element={<Navigate to="/system-design/url-shortener" replace />} />
            <Route path="/system-design/url-shortener" element={<SystemDesign />} />

            {/* Redirects for backward compatibility */}
            <Route path="/bubble-sort" element={<Navigate to="/dsa/bubble-sort" replace />} />
            <Route path="/two-sum" element={<Navigate to="/leetcode/two-sum" replace />} />
            <Route path="/minimum-or" element={<Navigate to="/leetcode/minimum-or" replace />} />
            <Route path="/max-product-path" element={<Navigate to="/leetcode/max-product-path" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;
