import React from 'react';
import { Link } from 'react-router-dom';
import { SortAsc, BrainCircuit, Network, ArrowRight, Linkedin } from 'lucide-react';

const Dashboard: React.FC = () => {
    const cards = [
        {
            title: 'DSA Visualizer',
            description: 'Step-by-step visual implementation of sorting algorithms.',
            icon: <SortAsc size={32} color="#10b981" />,
            path: '/bubble-sort',
        },
        {
            title: 'LeetCode Problems',
            description: 'Understand coding problems visually using pointers and states.',
            icon: <BrainCircuit size={32} color="#c084fc" />,
            path: '/two-sum',
        },
        {
            title: 'System Design',
            description: 'Interactive architectural diagrams generated from backend.',
            icon: <Network size={32} color="#38bdf8" />,
            path: '/system-design',
        }
    ];

    return (
        <div className="max-w-container animate-fade-in relative">
            <header className="mb-14 dashboard-hero pt-12">
                <div className="hero-tag" style={{ background: 'var(--accent-glass)', color: 'var(--accent-primary)', border: '1px solid var(--accent-glass)' }}>
                    ✦ Visualize Every Concept
                </div>
                <h1 className="font-bold mb-6 text-4xl" style={{ lineHeight: 1.1 }}>
                    Stop memorizing. <br />
                    <span className="gradient-text">Start Architecting.</span>
                </h1>
                <p className="text-xl text-secondary leading-relaxed max-w-2xl">
                    Every algorithm, data structure, and system design becomes an 
                    interactive visual narrative. Designed for high-performance learners.
                </p>
                <div className="flex-row mt-8">
                    <button className="btn-primary">Get Started</button>
                    <button className="btn-icon" style={{ borderRadius: '50%' }}><BrainCircuit size={20} /></button>
                </div>
            </header>

            <div className="dashboard-grid">
                {cards.map((card, idx) => (
                    <Link key={idx} to={card.path} className="glass-panel dashboard-card">
                        <div className="card-icon" style={{ background: 'var(--accent-glass)', border: '1px solid rgba(255, 255, 255, 0.1)', color: 'var(--accent-primary)' }}>
                            {card.icon}
                        </div>
                        <h2 className="text-xl font-bold mb-2">{card.title}</h2>
                        <p className="text-secondary mb-8 text-sm leading-relaxed" style={{ flexGrow: 1 }}>{card.description}</p>
                        <div className="flex-row font-semibold text-xs uppercase tracking-wider text-primary">
                            Explore Module <ArrowRight size={14} style={{ color: 'var(--accent-primary)' }} />
                        </div>
                        
                        {/* Decorative background element for card */}
                        <div style={{ 
                            position: 'absolute', 
                            bottom: '-20px', 
                            right: '-20px', 
                            width: '100px', 
                            height: '100px', 
                            background: 'var(--accent-glass)', 
                            filter: 'blur(40px)', 
                            borderRadius: '50%',
                            zIndex: -1
                        }}></div>
                    </Link>
                ))}
            </div>
            <footer className="mt-20 pt-8 border-t flex-between pb-8" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <div className="text-secondary text-sm">© 2026 CodeVista Project</div>
                <a 
                    href="https://www.linkedin.com/in/harsh-thaker-658b48218/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-row hover:opacity-80 transition-opacity"
                    style={{ gap: '8px' }}
                >
                    <Linkedin size={18} style={{ color: 'var(--accent-primary)' }} />
                    <span className="gradient-text font-bold">Connect with Harsh Thaker</span>
                </a>
            </footer>
        </div>
    );
};

export default Dashboard;
