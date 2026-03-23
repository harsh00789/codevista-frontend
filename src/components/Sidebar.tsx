import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Code2, LayoutDashboard, Linkedin } from 'lucide-react';

type Mode = 'DSA' | 'LeetCode' | 'SysD';

const Sidebar: React.FC = () => {
    const location = useLocation();
    const [activeMode, setActiveMode] = useState<Mode>('LeetCode');

    useEffect(() => {
        if (location.pathname.startsWith('/dsa')) setActiveMode('DSA');
        else if (location.pathname.startsWith('/leetcode')) setActiveMode('LeetCode');
        else if (location.pathname.startsWith('/system-design')) setActiveMode('SysD');
    }, [location.pathname]);

    return (
        <aside className="sidebar">
            <NavLink to="/" className="sidebar-logo">
                <div className="card-icon" style={{ marginBottom: 0, width: 40, height: 40, background: 'var(--accent-glass)' }}>
                    <Code2 size={22} className="sidebar-logo-icon" style={{ color: 'var(--accent-primary)' }} />
                </div>
                <span className="sidebar-logo-text gradient-text">CodeVista</span>
            </NavLink>

            <nav className="sidebar-nav">
                <NavLink to="/" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <LayoutDashboard size={20} className="nav-icon" />
                    Dashboard
                </NavLink>

                <div className="mode-tabs">
                    <button 
                        className={`tab ${activeMode === 'DSA' ? 'active' : ''}`}
                        onClick={() => setActiveMode('DSA')}
                    >
                        DSA
                    </button>
                    <button 
                        className={`tab ${activeMode === 'LeetCode' ? 'active' : ''}`}
                        onClick={() => setActiveMode('LeetCode')}
                    >
                        LeetCode
                    </button>
                    <button 
                        className={`tab ${activeMode === 'SysD' ? 'active' : ''}`}
                        onClick={() => setActiveMode('SysD')}
                    >
                        SysD
                    </button>
                </div>

                {activeMode === 'DSA' && (
                    <div className="sidebar-section animate-fade-in">
                        <div className="sidebar-label">Sorting Algorithms</div>
                        <div className="problem-list">
                            <NavLink to="/dsa/bubble-sort" className={({ isActive }) => `problem-item ${isActive ? 'active' : ''}`}>
                                <div className="prob-diff easy"></div>
                                <span className="prob-name">Bubble Sort</span>
                                <span className="prob-num">O(n²)</span>
                            </NavLink>
                        </div>
                    </div>
                )}

                {activeMode === 'LeetCode' && (
                    <div className="sidebar-section animate-fade-in">
                        <div className="sidebar-label">Array & Strings</div>
                        <div className="problem-list">
                            <NavLink to="/leetcode/two-sum" className={({ isActive }) => `problem-item ${isActive ? 'active' : ''}`}>
                                <div className="prob-diff easy"></div>
                                <span className="prob-name">Two Sum</span>
                                <span className="prob-num">#1</span>
                            </NavLink>
                        </div>
                        <div className="sidebar-label mt-2">Bit Manipulation</div>
                        <div className="problem-list">
                            <NavLink to="/leetcode/minimum-or" className={({ isActive }) => `problem-item ${isActive ? 'active' : ''}`}>
                                <div className="prob-diff medium"></div>
                                <span className="prob-name">Minimum OR</span>
                                <span className="prob-num">#3858</span>
                            </NavLink>
                        </div>
                        <div className="sidebar-label mt-2">Matrix DP</div>
                        <div className="problem-list">
                            <NavLink to="/leetcode/max-product-path" className={({ isActive }) => `problem-item ${isActive ? 'active' : ''}`}>
                                <div className="prob-diff medium"></div>
                                <span className="prob-name">Max Prod Path</span>
                                <span className="prob-num">#1594</span>
                            </NavLink>
                        </div>
                    </div>
                )}

                {activeMode === 'SysD' && (
                    <div className="sidebar-section animate-fade-in">
                        <div className="sidebar-label">High-Level Designs</div>
                        <div className="problem-list">
                            <NavLink to="/system-design/url-shortener" className={({ isActive }) => `problem-item ${isActive ? 'active' : ''}`}>
                                <div className="prob-diff medium"></div>
                                <span className="prob-name">URL Shortener</span>
                                <span className="prob-num">HLD</span>
                            </NavLink>
                        </div>
                    </div>
                )}
            </nav>

            <div className="sidebar-footer">
                <div style={{ opacity: 0.6, marginBottom: '8px' }}>Developed by</div>
                <a 
                    href="https://www.linkedin.com/in/harsh-thaker-658b48218/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-row"
                    style={{ justifyContent: 'center', gap: '8px' }}
                >
                    <Linkedin size={16} style={{ color: 'var(--accent-primary)' }} />
                    <span className="gradient-text" style={{ fontSize: '0.85rem', fontWeight: 700 }}>Harsh Thaker</span>
                </a>
            </div>
        </aside>
    );
};

export default Sidebar;
