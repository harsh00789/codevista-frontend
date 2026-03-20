import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Code2, LayoutDashboard } from 'lucide-react';

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
                <Code2 size={24} className="sidebar-logo-icon" />
                <span className="sidebar-logo-text">CodeVista</span>
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
                    <div className="sidebar-section">
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
                    <div className="sidebar-section">
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
                    </div>
                )}

                {activeMode === 'SysD' && (
                    <div className="sidebar-section">
                        <div className="sidebar-label">Architecture Patterns</div>
                        <div className="problem-list">
                            <NavLink to="/system-design" className={({ isActive }) => `problem-item ${isActive ? 'active' : ''}`}>
                                <div className="prob-diff medium"></div>
                                <span className="prob-name">System Design</span>
                                <span className="prob-num">LD</span>
                            </NavLink>
                        </div>
                    </div>
                )}
            </nav>

            <div className="sidebar-footer">
                Built with <span>CodeVista</span>
            </div>
        </aside>
    );
};

export default Sidebar;
