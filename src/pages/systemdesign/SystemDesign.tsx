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
    MarkerType,
    Handle,
    ConnectionLineType
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Loader2, RefreshCw, Zap, Database, Globe, Hash, ShieldCheck, HelpCircle, StepForward, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import apiClient from '../../api/client';

// ─── COLOR PALETTE ───
const COLORS: Record<string, { bg: string; border: string; shadow: string }> = {
    primary: { bg: 'rgba(99,102,241,0.18)',  border: '#818cf8', shadow: 'rgba(99,102,241,0.45)' },
    cyan:    { bg: 'rgba(6,182,212,0.18)',    border: '#22d3ee', shadow: 'rgba(6,182,212,0.45)' },
    purple:  { bg: 'rgba(168,85,247,0.18)',   border: '#c084fc', shadow: 'rgba(168,85,247,0.45)' },
    sky:     { bg: 'rgba(56,189,248,0.18)',   border: '#7dd3fc', shadow: 'rgba(56,189,248,0.45)' },
    red:     { bg: 'rgba(239,68,68,0.18)',    border: '#f87171', shadow: 'rgba(239,68,68,0.45)' },
    orange:  { bg: 'rgba(251,146,60,0.18)',   border: '#fb923c', shadow: 'rgba(251,146,60,0.45)' },
    green:   { bg: 'rgba(16,185,129,0.18)',   border: '#34d399', shadow: 'rgba(16,185,129,0.45)' },
    emerald: { bg: 'rgba(52,211,153,0.18)',   border: '#6ee7b7', shadow: 'rgba(52,211,153,0.45)' },
};

// ─── BASE NODE ───
const BaseNode = ({ data }: any) => {
    const { label, colorKey, Icon } = data;
    const c = COLORS[colorKey] ?? COLORS.primary;
    return (
        <motion.div
            whileHover={{ scale: 1.04, y: -4 }}
            style={{
                background: c.bg,
                border: `2.5px solid ${c.border}`,
                boxShadow: `0 0 30px ${c.shadow}, 0 4px 20px rgba(0,0,0,0.35)`,
                padding: '20px 28px',
                borderRadius: '20px',
                width: '260px',
                backdropFilter: 'blur(20px)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '14px',
            }}
        >
            <div style={{
                background: `${c.border}22`,
                border: `1.5px solid ${c.border}`,
                padding: '14px',
                borderRadius: '16px',
                display: 'flex',
                color: c.border,
            }}>
                <Icon size={38} />
            </div>
            <div style={{
                fontSize: '1.15rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                textAlign: 'center',
                color: '#f1f5f9',
                lineHeight: 1.4,
                textShadow: '0 1px 8px rgba(0,0,0,0.6)',
            }}>{label}</div>
        </motion.div>
    );
};

// ─── PROCESS NODE ───
// hasLeftTarget = used by "Input longURL" to accept the return edge from "Modify"
const ProcessNode = ({ data }: any) => (
    <div style={{ position: 'relative' }}>
        <Handle type="target" position={Position.Top}    id="t"  style={{ width: 10, height: 10 }} />
        {data.hasLeftTarget && (
            <Handle type="target" position={Position.Left}  id="tl" style={{ width: 12, height: 12, background: '#34d399', border: '2px solid #fff' }} />
        )}
        <BaseNode data={data} />
        <Handle type="source" position={Position.Bottom} id="b"  style={{ width: 10, height: 10 }} />
    </div>
);

// ─── DECISION NODE ───
const DecisionNode = ({ data }: any) => {
    const { label, colorKey, Icon } = data;
    const c = COLORS[colorKey] ?? COLORS.red;
    return (
        <div style={{ position: 'relative' }}>
            <Handle type="target" position={Position.Top}    id="t"   style={{ width: 10, height: 10 }} />
            <motion.div
                initial={{ rotate: 45, opacity: 0, scale: 0.9 }}
                animate={{ rotate: 45, scale: 1, opacity: 1 }}
                style={{
                    width: 130, height: 130,
                    background: c.bg,
                    border: `3px solid ${c.border}`,
                    boxShadow: `0 0 36px ${c.shadow}`,
                    borderRadius: 16,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backdropFilter: 'blur(16px)',
                }}
            >
                <div style={{ transform: 'rotate(-45deg)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                    {Icon && <Icon size={30} color={c.border} />}
                    <div style={{ fontSize: '0.92rem', fontWeight: 900, color: '#fff', maxWidth: 100, lineHeight: 1.3, textShadow: '0 1px 8px #000', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{label}</div>
                </div>
            </motion.div>
            {/* No  = Bottom handle */}
            <Handle type="source" position={Position.Bottom} id="no"  style={{ left: '50%', width: 12, height: 12, background: '#34d399', border: '2px solid #fff' }} />
            {/* Yes = Right handle */}
            <Handle type="source" position={Position.Right}  id="yes" style={{ top: '50%',  width: 12, height: 12, background: '#f87171', border: '2px solid #fff' }} />
        </div>
    );
};

const nodeTypes = { process: ProcessNode, decision: DecisionNode };

// ─── HARDCODED POSITIONS  (main column X=200, cycle lane X=660) ───
const CX = 200;
const CL = 660;
const YS = 280; // vertical step

const POSITIONS: Record<string, { x: number; y: number }> = {
    'Start':          { x: CX, y: YS * 0 },
    'Input longURL':  { x: CX, y: YS * 1 },
    'Hash Function':  { x: CX, y: YS * 2 },
    'Short URL':      { x: CX, y: YS * 3 },
    'Exist in DB?':   { x: CX, y: YS * 4 },
    'Save to DB':     { x: CX, y: YS * 5 },
    'End':            { x: CX, y: YS * 6 },
    'Modify longURL': { x: CL, y: YS * 4 },   // Right lane, same height as decision
};

const NODE_CFG: Record<string, { type: string; colorKey: string; Icon: any; hasLeftTarget?: true }> = {
    'Start':          { type: 'process',  colorKey: 'primary', Icon: Zap           },
    'Input longURL':  { type: 'process',  colorKey: 'cyan',    Icon: Globe,  hasLeftTarget: true },
    'Hash Function':  { type: 'process',  colorKey: 'purple',  Icon: Hash          },
    'Short URL':      { type: 'process',  colorKey: 'sky',     Icon: StepForward   },
    'Exist in DB?':   { type: 'decision', colorKey: 'red',     Icon: HelpCircle    },
    'Save to DB':     { type: 'process',  colorKey: 'green',   Icon: Database      },
    'End':            { type: 'process',  colorKey: 'emerald', Icon: ShieldCheck   },
    'Modify longURL': { type: 'process',  colorKey: 'orange',  Icon: AlertCircle   },
};

// ─── EDGE FACTORY ───
const mkEdge = (
    id: string, src: string, tgt: string,
    { label, color = 'var(--accent-primary)', sh, th }: { label?: string; color?: string; sh?: string; th?: string }
): Edge => ({
    id, source: src, target: tgt,
    sourceHandle: sh, targetHandle: th,
    animated: true, type: 'step',
    label,
    labelStyle: { fill: '#fff', fontWeight: 700, fontSize: '13px' },
    labelBgPadding:      [8, 5] as [number, number],
    labelBgBorderRadius: 7,
    labelBgStyle: {
        fill: label === 'Yes' ? '#ef4444' : label === 'No' ? '#10b981' : '#1e293b',
        fillOpacity: 1, stroke: '#fff', strokeWidth: 1.5,
    },
    style: { stroke: color, strokeWidth: 3, opacity: 1 },
    markerEnd: { type: MarkerType.ArrowClosed, color, width: 20, height: 20 },
});

// ─── TYPES ───
interface BackendNode   { id: string; label: string; }
interface BackendEdge   { source: string; target: string; label?: string | null; }
interface DesignResponse {
    nodes: BackendNode[]; edges: BackendEdge[];
    title: string; description: string;
    steps: string[]; tradeOffs: string[]; complexities: string[];
}

// ─── COMPONENT ───
const SystemDesign: React.FC = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
    const [title, setTitle]               = useState('');
    const [description, setDescription]   = useState('');
    const [designSteps, setDesignSteps]   = useState<string[]>([]);
    const [tradeOffs, setTradeOffs]       = useState<string[]>([]);
    const [complexities, setComplexities] = useState<string[]>([]);
    const [isLoading, setIsLoading]       = useState(false);
    const [error, setError]               = useState('');

    const fetchDesign = useCallback(async () => {
        try {
            setIsLoading(true); setError('');
            const res = await apiClient.get<DesignResponse>('/api/design/url-shortner');
            const { nodes: bNodes, edges: bEdges, title: t, description: d, steps, tradeOffs: to, complexities: co } = res.data;
            setTitle(t); setDescription(d); setDesignSteps(steps); setTradeOffs(to); setComplexities(co);

            // Build id → label map
            const idToLabel: Record<string, string> = {};
            bNodes.forEach((n: BackendNode) => { idToLabel[n.id] = n.label; });

            // Nodes with hardcoded positions
            const rfNodes: Node[] = bNodes.map((n: BackendNode) => {
                const pos = POSITIONS[n.label] ?? { x: CX, y: 0 };
                const cfg = NODE_CFG[n.label]  ?? { type: 'process', colorKey: 'primary', Icon: Database };
                return {
                    id: n.id, type: cfg.type, position: pos,
                    data: { label: n.label, colorKey: cfg.colorKey, Icon: cfg.Icon, hasLeftTarget: cfg.hasLeftTarget ?? false },
                };
            });

            // Edges with explicit handles
            const rfEdges: Edge[] = bEdges.map((e: BackendEdge, i: number) => {
                const srcLabel = idToLabel[e.source] ?? '';
                const tgtLabel = idToLabel[e.target] ?? '';

                const srcNode     = rfNodes.find(n => n.id === e.source);
                const isDecision  = srcNode?.type === 'decision';
                const isYes       = isDecision && e.label === 'Yes';
                const isNo        = isDecision && e.label === 'No';
                const isReturn    = srcLabel === 'Modify longURL' && tgtLabel === 'Input longURL';

                const color = isYes ? '#f87171' : isNo ? '#34d399' : 'var(--accent-primary)';

                return mkEdge(`e${i}`, e.source, e.target, {
                    label:  e.label ?? undefined,
                    color,
                    sh: isYes ? 'yes' : isNo ? 'no' : 'b',
                    th: isReturn ? 'tl' : 't',
                });
            });

            setNodes(rfNodes);
            setEdges(rfEdges);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch system design from the server.');
        } finally {
            setIsLoading(false);
        }
    }, [setNodes, setEdges]);

    useEffect(() => { fetchDesign(); }, [fetchDesign]);

    return (
        <div className="system-design-container animate-fade-in">
            <header className="mb-6 pb-6 border-b flex-between" style={{ flexShrink: 0 }}>
                <div>
                    <h1 className="text-3xl font-bold mb-2">System Design Visualizer</h1>
                    <p className="text-secondary">Interactive architecture diagram for a URL Shortener system.</p>
                </div>
                <button className="btn-icon" onClick={fetchDesign} disabled={isLoading}
                    title="Refresh" style={{ color: '#818cf8', borderColor: 'rgba(99,102,241,0.3)' }}>
                    <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
                </button>
            </header>

            {error ? (
                <div className="error-banner">{error}</div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', flex: 1, minHeight: 0 }}>
                    <div className="react-flow-wrapper" style={{ minHeight: '520px', flex: 1 }}>
                        {isLoading && nodes.length === 0 ? (
                            <div className="loading-overlay">
                                <Loader2 size={48} className="animate-spin" color="#6366f1" />
                            </div>
                        ) : (
                            <ReactFlow
                                nodes={nodes} edges={edges}
                                onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}
                                nodeTypes={nodeTypes}
                                fitView fitViewOptions={{ padding: 0.18 }}
                                minZoom={0.1} maxZoom={2}
                                connectionLineType={ConnectionLineType.Step}
                                attributionPosition="bottom-right"
                            >
                                <Background color="#334155" gap={28} size={1.5} />
                                <Controls style={{ background: 'var(--bg-secondary)', border: 'none', fill: 'white' }} />
                            </ReactFlow>
                        )}
                    </div>

                    <div className="design-info-panel">
                        <div className="glass-panel">
                            <h2 className="text-2xl font-bold mb-4 gradient-text">{title || 'System Overview'}</h2>
                            <p className="text-secondary leading-relaxed mb-6">{description || 'Fetching system description...'}</p>
                            <div className="dashboard-grid">
                                <div>
                                    <h3 className="design-section-title">
                                        <span className="w-2 h-6 bg-indigo-500 rounded-full"></span>
                                        Implementation Steps
                                    </h3>
                                    <ol className="step-list">
                                        {designSteps.map((step, i) => <li key={i}>{step}</li>)}
                                    </ol>
                                </div>
                                <div>
                                    <h3 className="design-section-title">
                                        <span className="w-2 h-6 bg-amber-500 rounded-full"></span>
                                        Trade-offs &amp; Decisions
                                    </h3>
                                    <ul className="tradeoff-list">
                                        {tradeOffs.map((t, i) => <li key={i}>{t}</li>)}
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="glass-panel">
                            <h3 className="text-lg font-semibold mb-4">Scalability &amp; Constraints</h3>
                            <div className="flex-row" style={{ flexWrap: 'wrap', gap: '1rem' }}>
                                {complexities.map((comp, i) => (
                                    <div key={i} className="info-chip" style={{ padding: '0.75rem 1.25rem', fontSize: '1rem', background: 'rgba(99,102,241,0.1)' }}>
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
