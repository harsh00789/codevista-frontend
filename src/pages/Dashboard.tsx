import React from 'react';
import { Link } from 'react-router-dom';
import { SortAsc, BrainCircuit, Network, ArrowRight } from 'lucide-react';

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
            <div className="orb orb-1"></div>
            <div className="orb orb-2"></div>

            <header className="mb-14 dashboard-hero pt-8">
                <div className="hero-tag">✦ Visualize Every Concept</div>
                <h1 className="font-bold mb-4">
                    Algorithms as <br />
                    <em>Stories</em>
                </h1>
                <p className="text-xl text-secondary leading-relaxed">
                    Stop memorizing. Start understanding. Every algorithm, data structure, 
                    and system design becomes an animated visual narrative.
                </p>
            </header>

            <div className="dashboard-grid">
                {cards.map((card, idx) => (
                    <Link key={idx} to={card.path} className="glass-panel dashboard-card">
                        <div className="card-icon">
                            {card.icon}
                        </div>
                        <h2 className="text-xl font-bold mb-2">{card.title}</h2>
                        <p className="text-secondary mb-8" style={{ flexGrow: 1 }}>{card.description}</p>
                        <div className="flex-row font-semibold text-sm">
                            Explore Demo <ArrowRight size={16} />
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
