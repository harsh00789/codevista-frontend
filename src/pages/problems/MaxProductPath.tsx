import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, SkipForward, SkipBack, Loader2, ArrowDown, ArrowRight } from 'lucide-react';
import apiClient from '../../api/client';
import ComplexityChart from '../../components/ComplexityChart';

/* ─── TYPES ─── */
interface StepData {
  step: string;
  i: number;
  j: number;
  dpMin: number;
  dpMax: number;
  upMin?: number;
  upMax?: number;
  downMin?: number;
  downMax?: number;
}

/* ─── DEFAULT JAVA CODE ─── */
const DEFAULT_JAVA_CODE = `class Solution {
    public int maxProductPath(int[][] grid) {
        int m = grid.length, n = grid[0].length;
        long[][] maxDp = new long[m][n];
        long[][] minDp = new long[m][n];
        
        maxDp[0][0] = minDp[0][0] = grid[0][0];
        
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (i == 0 && j == 0) continue;

                long upMin = Long.MAX_VALUE, upMax = Long.MIN_VALUE;
                if (i - 1 >= 0) {
                    long first = maxDp[i-1][j] * grid[i][j];
                    long second = minDp[i-1][j] * grid[i][j];
                    upMin = Math.min(first, second);
                    upMax = Math.max(first, second);
                }

                long leftMin = Long.MAX_VALUE, leftMax = Long.MIN_VALUE;
                if (j - 1 >= 0) {
                    long first = maxDp[i][j-1] * grid[i][j];
                    long second = minDp[i][j-1] * grid[i][j];
                    leftMin = Math.min(first, second);
                    leftMax = Math.max(first, second);
                }

                minDp[i][j] = Math.min(upMin, leftMin);
                maxDp[i][j] = Math.max(upMax, leftMax);
            }
        }
        
        long ans = maxDp[m-1][n-1];
        return ans < 0 ? -1 : (int)(ans % 1000000007);
    }
}`;

/* ─── COMPONENT ─── */
const MaxProductPath: React.FC = () => {
  const [gridInput, setGridInput] = useState('[[1,-2,1],[1,-2,1],[3,-4,-1]]');
  const [gridMatrix, setGridMatrix] = useState<number[][]>([]);
  const [steps, setSteps] = useState<StepData[]>([]);
  const [code, setCode] = useState<string>(DEFAULT_JAVA_CODE);
  const [explanation, setExplanation] = useState<string[]>([]);
  const [timeComp, setTimeComp] = useState<string>('O(M*N)');
  const [spaceComp, setSpaceComp] = useState<string>('O(M*N)');
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [speed, setSpeed] = useState(1500);

  const stepData = steps[currentStep];

  useEffect(() => {
    let t: number;
    if (isPlaying && currentStep < steps.length - 1) {
      t = window.setTimeout(() => setCurrentStep(p => p + 1), speed);
    } else if (currentStep >= steps.length - 1) setIsPlaying(false);
    return () => clearTimeout(t);
  }, [isPlaying, currentStep, steps.length, speed]);

  const handleVisualize = useCallback(async () => {
    try {
      setError(''); 
      setIsLoading(true);
      const parsed: number[][] = JSON.parse(gridInput);
      if (!Array.isArray(parsed) || !parsed.length || !Array.isArray(parsed[0])) {
        setError('Enter a valid 2D integer array, e.g. [[1,-2,1],[1,-2,1],[3,-4,1]]'); 
        return;
      }
      setGridMatrix(parsed);
      const res = await apiClient.post<any>('/api/problems/max-product-path/1594', parsed);
      const data = res.data;
      
      setSteps(data.steps || []); 
      if (data.code || data.explanation?.mySolution) setCode(data.code || data.explanation?.mySolution);
      if (data.explanation?.explanation) {
          const exp = data.explanation.explanation;
          setExplanation(Array.isArray(exp) ? exp : exp.split('\n'));
      }
      if (data.timeComplexity || data.explanation?.timeComplexity) setTimeComp(data.timeComplexity || data.explanation?.timeComplexity);
      if (data.spaceComplexity || data.explanation?.spaceComplexity) setSpaceComp(data.spaceComplexity || data.explanation?.spaceComplexity);
      
      setCurrentStep(0); 
      setIsPlaying(true);
    } catch { 
      setError('Backend unreachable or invalid JSON input.'); 
    } finally { 
      setIsLoading(false); 
    }
  }, [gridInput]);

  const pct = steps.length > 0 ? ((currentStep + 1) / steps.length) * 100 : 0;

  return (
    <div className="max-w-container animate-fade-in">
      {/* Header */}
      <header className="mo-header">
        <div>
          <h1 className="text-3xl font-bold mb-2">Maximum Non Negative Product in a Matrix</h1>
          <div className="mo-badges">
            <span className="mo-badge mo-badge-medium">Medium</span>
            <span className="mo-badge mo-badge-cat">Dynamic Programming</span>
            <span className="mo-badge mo-badge-cat">Matrix</span>
          </div>
        </div>
        <a href="https://leetcode.com/problems/maximum-non-negative-product-in-a-matrix/description/" target="_blank" rel="noreferrer" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8rem', color: '#818cf8', textDecoration: 'underline' }}>LC #1594</a>
      </header>

      {/* ── Story Section ── */}
      <div className="glass-panel mb-8">
        <div className="story-body">
          <div className="story-chapter">
            <div className="chapter-line">
              <div className="chapter-dot dot-1">01</div>
              <div className="chapter-connector"></div>
            </div>
            <div className="chapter-content">
              <div className="chapter-label">The Challenge</div>
              <div className="chapter-title">Grid Path of Products</div>
              <p className="chapter-text">
                You start at the top-left of a grid and can only move <strong>right or down</strong> to reach the bottom-right. Your score is the <strong>product</strong> of all numbers along the path. 
              </p>
            </div>
          </div>

          <div className="story-chapter">
            <div className="chapter-line">
              <div className="chapter-dot dot-2">02</div>
              <div className="chapter-connector"></div>
            </div>
            <div className="chapter-content">
              <div className="chapter-label">The Complexity</div>
              <div className="chapter-title">Negative Multipliers</div>
              <p className="chapter-text">
                Multiplying two negative numbers gives a positive! This means the <em>smallest negative product</em> can instantly become the <em>largest positive product</em> if you hit another negative number later.
              </p>
            </div>
          </div>

          <div className="story-chapter">
            <div className="chapter-line">
              <div className="chapter-dot dot-3">03</div>
              <div className="chapter-connector"></div>
            </div>
            <div className="chapter-content">
              <div className="chapter-label">The Strategy</div>
              <div className="chapter-title">Dual Memory States (DP)</div>
              <p className="chapter-text">
                Because of this sign-flipping property, we need to track both the <strong>Maximum Product (dpMax)</strong> and the <strong>Minimum Product (dpMin)</strong> at every single cell.
              </p>
            </div>
          </div>

          <div className="story-chapter" style={{ marginBottom: 0 }}>
            <div className="chapter-line">
              <div className="chapter-dot dot-4">04</div>
            </div>
            <div className="chapter-content">
              <div className="chapter-label">The Outcome</div>
              <div className="chapter-title">Modular Arithmetic Final</div>
              <p className="chapter-text">
                The answer is the max product at the bottom-right cell. If it's negative, you return -1. Otherwise, you return it modulo <code>10^9 + 7</code>.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Workspace ── */}
      <div className="mt-4">
          {/* Input */}
          <div className="glass-panel input-group">
            <div className="input-control" style={{ flex: 1 }}>
              <label className="input-label">Input Matrix Grid (JSON 2D array)</label>
              <textarea
                className="input-textarea code-content"
                value={gridInput}
                onChange={e => setGridInput(e.target.value)}
                rows={3}
                spellCheck={false}
                placeholder="[[1,-2,1],[1,-2,1],[3,-4,-1]]"
                style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.9rem' }}
              />
            </div>
            <button className="btn-primary" onClick={handleVisualize} disabled={isLoading} style={{ minWidth: '120px' }}>
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Play size={18} />}
              {isLoading ? 'Running...' : 'Visualize'}
            </button>
          </div>

          {error && <div className="error-banner">{error}</div>}

          {/* Visualization */}
          {steps.length > 0 && gridMatrix.length > 0 && (
            <>
              <div className="glass-panel mb-8">
                <div className="flex-between mb-4">
                  <h3 className="text-xl font-bold">DP Interactive Tracker</h3>
                  <div className="mo-progress-track" style={{ width: '40%' }}>
                    <div className="mo-progress-fill" style={{ width: pct + '%' }}></div>
                  </div>
                </div>

                {/* VISUAL MATRIX RENDERER */}
                <div className="mo-matrix-display" style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px', marginTop: '30px' }}>
                  <div 
                    style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(' + (gridMatrix[0] ? gridMatrix[0].length : 1) + ', minmax(70px, 1fr))',
                      gap: '12px',
                    }}
                  >
                    {gridMatrix.map((row, rIdx) => 
                      row.map((cellValue, cIdx) => {
                        const isActive = stepData?.i === rIdx && stepData?.j === cIdx;
                        // To accurately show visited condition based on steps order 
                        // In typical DP, it's visited if its row < stepI OR (row == stepI and col <= stepJ)
                        const isVisited = rIdx < (stepData?.i || 0) || (rIdx === (stepData?.i || 0) && cIdx <= (stepData?.j || 0));
                        const isPurelyVisited = isVisited && !isActive;
                        
                        // We will show dpMin and dpMax if it has been visited so far
                        // Since we just have the raw grid, we map DP values retrospectively
                        return (
                          <div 
                            key={"cell-" + rIdx + "-" + cIdx}
                            style={{
                              aspectRatio: '1',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: isActive ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.4), rgba(56, 189, 248, 0.4))' : isPurelyVisited ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.6)',
                              border: isActive ? '2px solid #818cf8' : isPurelyVisited ? '2px solid rgba(255, 255, 255, 0.15)' : '2px dashed rgba(255, 255, 255, 0.1)',
                              borderRadius: '12px',
                              color: isActive ? '#fff' : 'var(--text-secondary)',
                              boxShadow: isActive ? '0 0 20px rgba(99, 102, 241, 0.3)' : 'none',
                              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                              position: 'relative'
                            }}
                          >
                            <span style={{ fontSize: '1.4rem', fontWeight: isActive ? 'bold' : 'normal', zIndex: 2 }}>{cellValue}</span>
                            
                            {/* Retrospectively show the DP answers if this is the active cell */}
                            {isActive && (
                              <div style={{ position: 'absolute', bottom: '-45px', width: 'max-content', background: 'rgba(15, 23, 42, 0.95)', border: '1px solid #334155', borderRadius: '8px', padding: '6px 10px', display: 'flex', gap: '10px', zIndex: 10, boxShadow: '0 4px 6px rgba(0,0,0,0.5)' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                  <span style={{ fontSize: '0.65rem', color: '#fda4af', textTransform: 'uppercase', fontWeight: 'bold' }}>Min</span>
                                  <span style={{ fontSize: '1rem', color: '#f43f5e', fontWeight: 'bold' }}>{stepData.dpMin}</span>
                                </div>
                                <div style={{ width: '1px', background: '#334155' }}></div>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                  <span style={{ fontSize: '0.65rem', color: '#6ee7b7', textTransform: 'uppercase', fontWeight: 'bold' }}>Max</span>
                                  <span style={{ fontSize: '1rem', color: '#10b981', fontWeight: 'bold' }}>{stepData.dpMax}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      })
                    )}
                  </div>
                </div>

                {/* DP ALGORITHM LOGIC EXPLANATION */}
                <div className="dp-logic-container" style={{ background: 'rgba(0, 0, 0, 0.25)', borderRadius: '16px', padding: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '20px' }}>
                    <h4 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ background: '#818cf8', color: '#fff', padding: '2px 8px', borderRadius: '6px', fontSize: '0.85rem' }}>Evaluating</span>
                      Cell ({stepData?.i}, {stepData?.j}) : Value = {gridMatrix[stepData?.i || 0]?.[stepData?.j || 0]}
                    </h4>
                    <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginTop: '8px' }}>Step Output: {stepData?.step || 'Running operations...'}</p>
                  </div>

                  {stepData?.i === 0 && stepData?.j === 0 ? (
                    <div style={{ color: '#a78bfa', fontSize: '1.1rem', textAlign: 'center', padding: '20px 0' }}>
                      Initialization Step. The starting position's dpMin and dpMax are exactly its value.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                      {/* Products from Up */}
                      {stepData?.i > 0 && (
                        <div style={{ flex: 1, minWidth: '200px', background: 'rgba(56, 189, 248, 0.05)', border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: '12px', padding: '16px' }}>
                          <h5 style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#38bdf8', fontSize: '0.9rem', marginBottom: '12px', textTransform: 'uppercase', fontWeight: 700 }}>
                            <ArrowDown size={16} /> From Above
                          </h5>
                          <div className="flex-between mb-2" style={{ fontSize: '0.9rem' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>Path Min Product:</span>
                            <span style={{ fontFamily: 'monospace', color: '#e2e8f0', fontWeight: 'bold' }}>{stepData.downMin ?? '?'}</span>
                          </div>
                          <div className="flex-between" style={{ fontSize: '0.9rem' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>Path Max Product:</span>
                            <span style={{ fontFamily: 'monospace', color: '#e2e8f0', fontWeight: 'bold' }}>{stepData.downMax ?? '?'}</span>
                          </div>
                        </div>
                      )}
                      
                      {/* Products from Left */}
                      {stepData?.j > 0 && (
                        <div style={{ flex: 1, minWidth: '200px', background: 'rgba(167, 139, 250, 0.05)', border: '1px solid rgba(167, 139, 250, 0.2)', borderRadius: '12px', padding: '16px' }}>
                          <h5 style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#a78bfa', fontSize: '0.9rem', marginBottom: '12px', textTransform: 'uppercase', fontWeight: 700 }}>
                            <ArrowRight size={16} /> From Left
                          </h5>
                          <div className="flex-between mb-2" style={{ fontSize: '0.9rem' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>Path Min Product:</span>
                            <span style={{ fontFamily: 'monospace', color: '#e2e8f0', fontWeight: 'bold' }}>{stepData.upMin ?? '?'}</span>
                          </div>
                          <div className="flex-between" style={{ fontSize: '0.9rem' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>Path Max Product:</span>
                            <span style={{ fontFamily: 'monospace', color: '#e2e8f0', fontWeight: 'bold' }}>{stepData.upMax ?? '?'}</span>
                          </div>
                        </div>
                      )}

                      {/* Resulting Cell DP value */}
                      <div style={{ width: '100%', display: 'flex', gap: '16px', marginTop: '12px' }}>
                        <div style={{ flex: 1, background: 'rgba(244, 63, 94, 0.15)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(244, 63, 94, 0.4)', textAlign: 'center' }}>
                          <div style={{ color: '#fda4af', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Resulting dpMin</div>
                          <div style={{ color: '#f43f5e', fontSize: '1.8rem', fontWeight: 800 }}>{stepData.dpMin}</div>
                        </div>
                        <div style={{ flex: 1, background: 'rgba(16, 185, 129, 0.15)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.4)', textAlign: 'center' }}>
                          <div style={{ color: '#6ee7b7', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Resulting dpMax</div>
                          <div style={{ color: '#10b981', fontSize: '1.8rem', fontWeight: 800 }}>{stepData.dpMax}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Controls */}
              <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.2rem', padding: '1rem' }}>
                <button className="btn-icon" onClick={() => { setIsPlaying(false); setCurrentStep(0); }} title="Reset">
                  <RotateCcw size={20} />
                </button>
                <button className="btn-icon" onClick={() => currentStep > 0 && setCurrentStep(p => p - 1)} title="Previous">
                  <SkipBack size={20} />
                </button>
                <button className="btn-icon" onClick={() => setIsPlaying(!isPlaying)} title={isPlaying ? 'Pause' : 'Play'}
                  style={{ background: 'linear-gradient(135deg, #6366f1, #38bdf8)', color: '#fff', border: 'none', width: 56, height: 56, boxShadow: '0 4px 15px rgba(99,102,241,0.4)' }}>
                  {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" style={{ marginLeft: '4px' }} />}
                </button>
                <button className="btn-icon" onClick={() => currentStep < steps.length - 1 && setCurrentStep(p => p + 1)} title="Next">
                  <SkipForward size={20} />
                </button>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginLeft: '1rem' }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.85rem', color: '#e2e8f0', fontWeight: 600 }}>
                    Step {currentStep + 1} of {steps.length}
                  </span>
                  <select value={speed} onChange={e => setSpeed(Number(e.target.value))}
                    style={{ background: 'transparent', border: 'none', color: '#818cf8', padding: 0, fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem', cursor: 'pointer', outline: 'none', marginTop: '2px' }}>
                    <option value={2500} style={{ color: '#000' }}>Slow (0.5x)</option>
                    <option value={1500} style={{ color: '#000' }}>Normal (1x)</option>
                    <option value={750} style={{ color: '#000' }}>Fast (2x)</option>
                    <option value={300} style={{ color: '#000' }}>Turbo (4x)</option>
                  </select>
                </div>
              </div>

              {/* Final Answer */}
              {currentStep === steps.length - 1 && stepData && (
                <div className="glass-panel mt-8">
                  <div className="mo-answer">
                    <div className="mo-answer-glow"></div>
                    <div className="mo-answer-label">Final Max Product Path Result</div>
                    <div className="mo-answer-num" style={{ color: stepData.dpMax < 0 ? '#f43f5e' : '#10b981' }}>
                      {stepData.dpMax < 0 ? -1 : stepData.dpMax % 1000000007}
                    </div>
                    {stepData.dpMax < 0 && <div style={{ color: '#f43f5e', fontSize: '0.9rem', marginTop: '12px' }}>Since the maximum product is negative, return -1.</div>}
                  </div>
                </div>
              )}
            </>
          )}

          {/* BELOW VISUALIZATION: CODE, EXPLANATION, AND COMPLEXITY */}
          {steps.length > 0 && gridMatrix.length > 0 && (
            <div className="metadata-grid mt-12 mb-12">
              <div className="flex-column gap-6">
                {/* Code Card */}
                <div className="code-window">
                  <div className="code-header">
                    <div className="code-dots">
                      <div className="code-dot" style={{ backgroundColor: '#ff5f56' }}></div>
                      <div className="code-dot" style={{ backgroundColor: '#ffbd2e' }}></div>
                      <div className="code-dot" style={{ backgroundColor: '#27c93f' }}></div>
                    </div>
                    <span className="text-sm text-secondary font-mono">MaxProductPath.java</span>
                  </div>
                  <div className="code-content" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                    <pre style={{ margin: 0, padding: 0, background: 'transparent', whiteSpace: 'pre', overflowX: 'auto', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.85rem', color: '#e2e8f0', lineHeight: 1.6 }}>
                      <code>{code}</code>
                    </pre>
                  </div>
                </div>

                {/* Explanation */}
                {explanation && explanation.length > 0 && (
                  <div className="glass-panel">
                      <h3 className="text-lg font-semibold mb-3">Solution Explanation</h3>
                      <div className="explanation-section">
                          {explanation.map((para, idx) => (
                              <p key={idx}>{para}</p>
                          ))}
                      </div>
                  </div>
                )}
              </div>

              <div className="flex-column gap-6">
                {/* Complexity */}
                <div className="glass-panel complexity-card">
                    <h3 className="text-lg font-semibold mb-2">Complexity Analysis</h3>

                    <div className="complexity-item">
                        <span className="complexity-label">Time Complexity</span>
                        <div className="badge-complexity badge-blue text-lg">
                            {timeComp}
                        </div>
                        <ComplexityChart algorithmType={timeComp} />
                        <p className="text-sm text-secondary mt-1">We traverse each cell of the `M × N` grid exactly once doing constant Math operations mapping state transitions.</p>
                    </div>

                    <div className="complexity-item">
                        <span className="complexity-label">Space Complexity</span>
                        <div className="badge-complexity badge-purple text-lg">
                            {spaceComp}
                        </div>
                        <p className="text-sm text-secondary mt-1">Space complexity corresponds to our `minDp` and `maxDp` tracking arrays sized identically to the input grid.</p>
                    </div>
                </div>

                {/* Tags */}
                <div className="glass-panel">
                    <h3 className="text-sm font-semibold mb-3 text-secondary uppercase tracking-wider">Algorithm Tags</h3>
                    <div className="flex-row" style={{ flexWrap: 'wrap', gap: '8px' }}>
                        <div className="info-chip">Dynamic Programming</div>
                        <div className="info-chip">Matrix</div>
                        <div className="info-chip">Math</div>
                    </div>
                </div>
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default MaxProductPath;
