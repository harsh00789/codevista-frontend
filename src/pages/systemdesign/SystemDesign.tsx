import React, { useState, useEffect, useCallback } from 'react';
import {
    ReactFlow,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    type Edge,
    type Node,
    Position,
    MarkerType
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Loader2, RefreshCw } from 'lucide-react';
import apiClient from '../../api/client';

interface BackendNode {
    id: string;
    label: string;
}

interface BackendEdge {
    source: string;
    target: string;
}

interface DesignResponse {
    nodes: BackendNode[];
    edges: BackendEdge[];
    title: string;
    description: string;
    steps: string[];
    tradeOffs: string[];
    complexities: string[];
}

const SystemDesign: React.FC = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [designSteps, setDesignSteps] = useState<string[]>([]);
    const [tradeOffs, setTradeOffs] = useState<string[]>([]);
    const [complexities, setComplexities] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchDesign = useCallback(async () => {
        try {
            setIsLoading(true);
            setError('');

            const response = await apiClient.get<DesignResponse>('/api/design/url-shortner');
            const {
                nodes: backendNodes,
                edges: backendEdges,
                title: newTitle,
                description: newDesc,
                steps: newSteps,
                tradeOffs: newTradeOffs,
                complexities: newComplexities
            } = response.data;

            setTitle(newTitle);
            setDescription(newDesc);
            setDesignSteps(newSteps);
            setTradeOffs(newTradeOffs);
            setComplexities(newComplexities);

            const levels: Record<string, number> = {};
            const isTarget = new Set(backendEdges.map((e: BackendEdge) => e.target));
            const roots = backendNodes.filter((n: BackendNode) => !isTarget.has(n.id));

            roots.forEach((root: BackendNode) => {
                levels[root.id] = 0;
            });

            let queue = roots.map((r: BackendNode) => r.id);
            while (queue.length > 0) {
                const currentId = queue.shift();
                if (currentId === undefined) continue;
                const currentLevel = levels[currentId] || 0;

                const childrenEdges = backendEdges.filter((e: BackendEdge) => e.source === currentId);
                childrenEdges.forEach((e: BackendEdge) => {
                    if (levels[e.target] === undefined || levels[e.target] < currentLevel + 1) {
                        levels[e.target] = currentLevel + 1;
                        queue.push(e.target);
                    }
                });
            }

            backendNodes.forEach((n: BackendNode) => {
                if (levels[n.id] === undefined) levels[n.id] = 0;
            });

            const levelCounts: Record<number, number> = {};
            const levelCurrent: Record<number, number> = {};

            Object.values(levels).forEach(lvl => {
                levelCounts[lvl] = (levelCounts[lvl] || 0) + 1;
                levelCurrent[lvl] = 0;
            });

            // Color-coded styles per component type (AlgoVerse design)
            const nodeColors: Record<string, { bg: string; border: string; shadow: string; icon: string }> = {
                'Client':         { bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.5)', shadow: 'rgba(16,185,129,0.15)', icon: '👤' },
                'Load Balancer':  { bg: 'rgba(56,189,248,0.12)', border: 'rgba(56,189,248,0.5)', shadow: 'rgba(56,189,248,0.15)', icon: '⚖️' },
                'API Server':    { bg: 'rgba(251,191,36,0.12)', border: 'rgba(251,191,36,0.5)', shadow: 'rgba(251,191,36,0.15)', icon: '⚙️' },
                'APP Service':   { bg: 'rgba(99,102,241,0.12)', border: 'rgba(99,102,241,0.5)', shadow: 'rgba(99,102,241,0.15)', icon: '🔧' },
                'Cache (Redis)': { bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.5)', shadow: 'rgba(239,68,68,0.15)', icon: '⚡' },
                'Database':      { bg: 'rgba(168,85,247,0.12)', border: 'rgba(168,85,247,0.5)', shadow: 'rgba(168,85,247,0.15)', icon: '🗄️' },
                'ID Generator':  { bg: 'rgba(251,146,60,0.12)', border: 'rgba(251,146,60,0.5)', shadow: 'rgba(251,146,60,0.15)', icon: '🔑' },
            };

            const reactFlowNodes: Node[] = backendNodes.map((n: BackendNode) => {
                const lvl = levels[n.id];
                const idx = levelCurrent[lvl];
                levelCurrent[lvl]++;

                const totalAtLevel = levelCounts[lvl];
                const xPos = lvl * 280;
                const yPos = (idx - (totalAtLevel - 1) / 2) * 150;

                const colors = nodeColors[n.label] || { bg: 'rgba(99,102,241,0.1)', border: 'rgba(99,102,241,0.4)', shadow: 'rgba(99,102,241,0.15)', icon: '📦' };

                return {
                    id: n.id,
                    position: { x: xPos + 50, y: yPos + 300 },
                    data: { label: `${colors.icon}  ${n.label}` },
                    sourcePosition: Position.Right,
                    targetPosition: Position.Left,
                    style: {
                        background: colors.bg,
                        color: '#f8fafc',
                        border: `2px solid ${colors.border}`,
                        borderRadius: '12px',
                        boxShadow: `0 0 20px ${colors.shadow}`,
                        fontWeight: 700,
                        padding: '14px 18px',
                        minWidth: '160px',
                        textAlign: 'center' as const,
                        backdropFilter: 'blur(10px)',
                        fontFamily: "'JetBrains Mono', 'Inter', monospace",
                        fontSize: '0.78rem',
                        letterSpacing: '0.02em',
                        textTransform: 'uppercase' as const,
                    }
                };
            });

            const reactFlowEdges: Edge[] = backendEdges.map((e: BackendEdge, i: number) => ({
                id: `e-${e.source}-${e.target}-${i}`,
                source: e.source,
                target: e.target,
                animated: true,
                style: { stroke: '#818cf8', strokeWidth: 2 },
                markerEnd: {
                    type: MarkerType.ArrowClosed,
                    color: '#818cf8',
                },
            }));

            setNodes(reactFlowNodes);
            setEdges(reactFlowEdges);

        } catch (err) {
            console.error(err);
            setError('Failed to fetch system design from the server.');
        } finally {
            setIsLoading(false);
        }
    }, [setNodes, setEdges]);

    useEffect(() => {
        fetchDesign();
    }, [fetchDesign]);

    return (
        <div className="system-design-container animate-fade-in">
            <header className="mb-6 pb-6 border-b flex-between" style={{ flexShrink: 0 }}>
                <div>
                    <h1 className="text-3xl font-bold mb-2">System Design Visualizer</h1>
                    <p className="text-secondary">Interactive architecture diagram for a URL Shortener system.</p>
                </div>
                <button
                    className="btn-icon"
                    onClick={fetchDesign}
                    disabled={isLoading}
                    title="Refresh Architecture"
                    style={{ color: '#818cf8', borderColor: 'rgba(99,102,241,0.3)' }}
                >
                    <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
                </button>
            </header>

            {error ? (
                <div className="error-banner">
                    {error}
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', flex: 1, minHeight: 0 }}>
                    <div className="react-flow-wrapper" style={{ minHeight: '500px', flex: 1 }}>
                        {isLoading && nodes.length === 0 ? (
                            <div className="loading-overlay">
                                <Loader2 size={48} className="animate-spin" color="#6366f1" />
                            </div>
                        ) : (
                            <ReactFlow
                                nodes={nodes}
                                edges={edges}
                                onNodesChange={onNodesChange}
                                onEdgesChange={onEdgesChange}
                                fitView
                                attributionPosition="bottom-right"
                            >
                                <Background color="#334155" gap={24} size={2} />
                                <Controls style={{ background: 'var(--bg-secondary)', border: 'none', fill: 'white' }} />
                            </ReactFlow>
                        )}
                    </div>

                    <div className="design-info-panel">
                        <div className="glass-panel">
                            <h2 className="text-2xl font-bold mb-4 gradient-text">{title || 'System Overview'}</h2>
                            <p className="text-secondary leading-relaxed mb-6">
                                {description || 'Fetching system description...'}
                            </p>

                            <div className="dashboard-grid">
                                <div>
                                    <h3 className="design-section-title">
                                        <span className="w-2 h-6 bg-indigo-500 rounded-full"></span>
                                        Implementation Steps
                                    </h3>
                                    <ol className="step-list">
                                        {designSteps.map((step, i) => (
                                            <li key={i}>{step}</li>
                                        ))}
                                    </ol>
                                </div>

                                <div>
                                    <h3 className="design-section-title">
                                        <span className="w-2 h-6 bg-amber-500 rounded-full"></span>
                                        Trade-offs & Decisions
                                    </h3>
                                    <ul className="tradeoff-list">
                                        {tradeOffs.map((tradeoff, i) => (
                                            <li key={i}>{tradeoff}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="glass-panel">
                            <h3 className="text-lg font-semibold mb-4">Scalability & Constraints</h3>
                            <div className="flex-row" style={{ flexWrap: 'wrap', gap: '1rem' }}>
                                {complexities.map((comp, i) => (
                                    <div key={i} className="info-chip" style={{ padding: '0.75rem 1.25rem', fontSize: '1rem', background: 'rgba(99, 102, 241, 0.1)' }}>
                                        {comp}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SystemDesign;
