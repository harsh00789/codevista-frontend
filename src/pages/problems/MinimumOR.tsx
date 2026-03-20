import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, SkipForward, SkipBack, Loader2 } from 'lucide-react';
import apiClient from '../../api/client';

/* ─── TYPES ─── */
interface RowState { numbers: number[]; validNumbers: number[]; candidateFound: boolean; }
interface StepData { bit: number; permissionSlip: number; bitForced: boolean; rows: RowState[]; }
interface ApiResponse { finalAns: number; steps: StepData[]; }

/* ─── JAVA CODE ─── */
const JAVA_CODE = `class Solution {
    public int minimumOR(int[][] grid) {
        int finalAns = 0;

        for (int i = 17; i >= 0; i--) {
            int permissionSlip = finalAns | ((1 << i) - 1);

            for (int[] row : grid) {
                boolean candidateFound = false;
                for (int num : row) {
                    if ((num | permissionSlip) == permissionSlip) {
                        candidateFound = true;
                        break;
                    }
                }
                if (!candidateFound) {
                    finalAns |= (1 << i);
                    break;
                }
            }
        }
        return finalAns;
    }
}`;

const toBin = (n: number, len = 18): string => n.toString(2).padStart(len, '0');

/* ─── COMPONENT ─── */
const MinimumOR: React.FC = () => {
  const [gridInput, setGridInput] = useState('[[1,2],[3,4]]');
  const [steps, setSteps] = useState<StepData[]>([]);
  const [finalAns, setFinalAns] = useState<number | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [speed, setSpeed] = useState(1000);

  const step = steps[currentStep];

  useEffect(() => {
    let t: number;
    if (isPlaying && currentStep < steps.length - 1) {
      t = window.setTimeout(() => setCurrentStep(p => p + 1), speed);
    } else if (currentStep >= steps.length - 1) setIsPlaying(false);
    return () => clearTimeout(t);
  }, [isPlaying, currentStep, steps.length, speed]);

  const handleVisualize = useCallback(async () => {
    try {
      setError(''); setIsLoading(true);
      const parsed: number[][] = JSON.parse(gridInput);
      if (!Array.isArray(parsed) || !parsed.length || !Array.isArray(parsed[0])) {
        setError('Enter a valid 2D array, e.g. [[1,2],[3,4]]'); return;
      }
      const res = await apiClient.post<ApiResponse>('/api/problems/minimum-or/3858', parsed);
      setSteps(res.data.steps); setFinalAns(res.data.finalAns);
      setCurrentStep(0); setIsPlaying(true);
    } catch { setError('Backend unreachable. Please ensure the server is running.'); }
    finally { setIsLoading(false); }
  }, [gridInput]);

  // Running answer up to current step
  const runAns = (() => { let a = 0; for (let s = 0; s <= currentStep && s < steps.length; s++) { if (steps[s].bitForced) a |= (1 << steps[s].bit); } return a; })();

  const getBitState = (bi: number): string => {
    if (!step) return 'free';
    if (bi > step.bit) return (runAns >> bi) & 1 ? 'locked' : 'free';
    if (bi === step.bit) return 'testing';
    return 'dontcare';
  };

  const pct = steps.length > 0 ? ((currentStep + 1) / steps.length) * 100 : 0;

  return (
    <div className="max-w-container animate-fade-in">

      {/* Header */}
      <header className="mo-header">
        <div>
          <h1 className="text-3xl font-bold mb-2">Minimum Bitwise OR</h1>
          <div className="mo-badges">
            <span className="mo-badge mo-badge-medium">Medium</span>
            <span className="mo-badge mo-badge-cat">Bit Manipulation</span>
            <span className="mo-badge mo-badge-cat">Greedy</span>
            <span className="mo-badge mo-badge-cat">Matrix</span>
          </div>
        </div>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8rem', color: 'var(--text-secondary)' }}>LC #3858</span>
      </header>

      {/* ── Story Section (AlgoVerse Chapters) ── */}
      <div className="glass-panel mb-8">
        <div className="story-body">
          <div className="story-chapter">
            <div className="chapter-line">
              <div className="chapter-dot dot-1">01</div>
              <div className="chapter-connector"></div>
            </div>
            <div className="chapter-content">
              <div className="chapter-label">The Analogy</div>
              <div className="chapter-title">The CEO's Dream Team</div>
              <p className="chapter-text">
                You're a CEO hiring one person from each department (row). Every candidate carries <strong>ego traits</strong> (bits). Your goal: minimize the team's <strong>combined ego</strong> (Bitwise OR). Fewer traits = better team.
              </p>
            </div>
          </div>

          <div className="story-chapter">
            <div className="chapter-line">
              <div className="chapter-dot dot-2">02</div>
              <div className="chapter-connector"></div>
            </div>
            <div className="chapter-content">
              <div className="chapter-label">The Strategy</div>
              <div className="chapter-title">The Permission Slip</div>
              <p className="chapter-text">
                Start from the <strong>highest bit</strong> (bit 17). Build a <em>permission slip</em> = locked bits + all lower bits. Ask each department: <em>"Do you have someone whose traits fit this slip?"</em> If yes → keep the bit OUT. If no → <strong>forced ON</strong>.
              </p>
            </div>
          </div>

          <div className="story-chapter">
            <div className="chapter-line">
              <div className="chapter-dot dot-3">03</div>
              <div className="chapter-connector"></div>
            </div>
            <div className="chapter-content">
              <div className="chapter-label">The Test</div>
              <div className="chapter-title">Checking Candidates</div>
              <p className="chapter-text">
                For each candidate, check: <em>(num | permissionSlip) == permissionSlip</em>. If true, the candidate's bits are a subset of allowed traits — they're <strong>valid</strong>. One valid candidate per dept is enough.
              </p>
            </div>
          </div>

          <div className="story-chapter" style={{ marginBottom: 0 }}>
            <div className="chapter-line">
              <div className="chapter-dot dot-4">04</div>
            </div>
            <div className="chapter-content">
              <div className="chapter-label">The Outcome</div>
              <div className="chapter-title">Greedy From High to Low</div>
              <p className="chapter-text">
                After checking all 18 bits, the <strong>locked bits</strong> form the minimum OR. The greedy approach works because higher bits dominate the OR value — removing them first yields the optimal answer.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Two-column Layout ── */}
      <div className="mo-layout">

        {/* LEFT MAIN */}
        <div className="mo-main">

          {/* Input */}
          <div className="glass-panel input-group">
            <div className="input-control">
              <label className="input-label">Input Grid (JSON 2D array)</label>
              <textarea
                className="input-textarea"
                value={gridInput}
                onChange={e => setGridInput(e.target.value)}
                rows={2}
                spellCheck={false}
              />
            </div>
            <button className="btn-primary" onClick={handleVisualize} disabled={isLoading}>
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Play size={18} />}
              {isLoading ? 'Running...' : 'Visualize'}
            </button>
          </div>

          {error && <div className="error-banner">{error}</div>}

          {/* Visualization */}
          {steps.length > 0 && (
            <>
              {/* Bit-Filter Track */}
              <div className="glass-panel">
                <h3 className="text-lg font-semibold mb-4">Bit-Filter Track — Bit {step?.bit}</h3>

                {/* Progress */}
                <div className="mo-progress-track mb-4">
                  <div className="mo-progress-fill" style={{ width: `${pct}%` }}></div>
                </div>

                <div className="mo-bit-grid mb-4">
                  {Array.from({ length: 18 }, (_, idx) => {
                    const bi = 17 - idx;
                    const state = getBitState(bi);
                    const psBit = step ? (step.permissionSlip >> bi) & 1 : 0;
                    return (
                      <div key={bi} className={`mo-bit mo-bit--${state}`}>
                        <div className="mo-bit-idx">{bi}</div>
                        <div className="mo-bit-val">{psBit}</div>
                      </div>
                    );
                  })}
                </div>

                <div className="mo-legend">
                  <span className="mo-lg"><span className="mo-lg-dot mo-lg-locked"></span>Locked</span>
                  <span className="mo-lg"><span className="mo-lg-dot mo-lg-testing"></span>Testing</span>
                  <span className="mo-lg"><span className="mo-lg-dot mo-lg-dontcare"></span>Don't care</span>
                  <span className="mo-lg"><span className="mo-lg-dot mo-lg-free"></span>Free</span>
                </div>

                <div className="mo-ps-row">
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.65rem', fontWeight: 600 }}>SLIP</span>
                  <span className="mo-ps-dec">{step?.permissionSlip}</span>
                  <span className="mo-ps-bin">{step ? toBin(step.permissionSlip) : ''}</span>
                </div>
                <div className="mo-running" style={{ marginTop: 4 }}>
                  <span>Running Answer</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="mo-running-dec">{runAns}</span>
                    <span className="mo-running-bin">{toBin(runAns)}</span>
                  </div>
                </div>
              </div>

              {/* Department Check */}
              <div className="glass-panel">
                <h3 className="text-lg font-semibold mb-4">Department Check — Bit {step?.bit}</h3>
                {step?.rows.map((row, ri) => (
                  <div key={ri} className={`mo-dept ${row.candidateFound ? 'mo-dept--pass' : 'mo-dept--fail'}`}>
                    <div className="mo-dept-top">
                      <div className="mo-dept-label">
                        <span className="mo-dept-num">{ri + 1}</span>
                        Row {ri}
                      </div>
                      <span className={row.candidateFound ? 'mo-dept-ok' : 'mo-dept-no'}>
                        {row.candidateFound ? '✓ Found' : '✗ None'}
                      </span>
                    </div>
                    <div className="mo-chips">
                      {row.numbers.map((num, ni) => {
                        const valid = row.validNumbers.includes(num);
                        return (
                          <div key={ni} className={`mo-chip ${valid ? 'mo-chip--yes' : 'mo-chip--no'}`}>
                            <span className="mo-chip-num">{num}</span>
                            <span className="mo-chip-bits">{toBin(num, 8)}</span>
                            {valid && <span className="mo-chip-ok">✓</span>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}

                <div className={`mo-verdict ${step?.bitForced ? 'mo-verdict--forced' : 'mo-verdict--kept'}`}>
                  {step?.bitForced
                    ? <>⚠ Bit {step.bit}: <strong>FORCED ON</strong> — a department has no valid candidate</>
                    : <>✓ Bit {step?.bit}: <strong>KEPT OUT</strong> — all departments have valid candidates</>}
                </div>
              </div>

              {/* Controls */}
              <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                <button className="btn-icon" onClick={() => { setIsPlaying(false); setCurrentStep(0); }} title="Reset">
                  <RotateCcw size={16} />
                </button>
                <button className="btn-icon" onClick={() => currentStep > 0 && setCurrentStep(p => p - 1)} title="Previous">
                  <SkipBack size={16} />
                </button>
                <button className="btn-icon" onClick={() => setIsPlaying(!isPlaying)} title={isPlaying ? 'Pause' : 'Play'}
                  style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8', borderColor: 'rgba(99,102,241,0.3)', width: 44, height: 44 }}>
                  {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                </button>
                <button className="btn-icon" onClick={() => currentStep < steps.length - 1 && setCurrentStep(p => p + 1)} title="Next">
                  <SkipForward size={16} />
                </button>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Step {currentStep + 1}/{steps.length}
                </span>
                <select value={speed} onChange={e => setSpeed(Number(e.target.value))}
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)',
                    padding: '6px 10px', borderRadius: 6, fontFamily: "'JetBrains Mono', monospace", fontSize: '0.72rem', cursor: 'pointer' }}>
                  <option value={2000}>0.5×</option>
                  <option value={1000}>1×</option>
                  <option value={500}>2×</option>
                  <option value={250}>4×</option>
                </select>
              </div>
            </>
          )}

          {/* Final Answer */}
          {finalAns !== null && currentStep === steps.length - 1 && (
            <div className="glass-panel">
              <div className="mo-answer">
                <div className="mo-answer-glow"></div>
                <div className="mo-answer-label">Minimum OR Result</div>
                <div className="mo-answer-num">{finalAns}</div>
                <div className="mo-answer-bin">{toBin(finalAns)}</div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT PANEL */}
        <div className="mo-right">

          {/* Code Card */}
          <div className="code-window">
            <div className="code-header">
              <div className="code-dots">
                <div className="code-dot" style={{ backgroundColor: '#ff5f56' }}></div>
                <div className="code-dot" style={{ backgroundColor: '#ffbd2e' }}></div>
                <div className="code-dot" style={{ backgroundColor: '#27c93f' }}></div>
              </div>
              <span className="text-sm text-secondary font-mono">MinimumOR.java</span>
            </div>
            <div className="code-content">{JAVA_CODE}</div>
          </div>

          {/* Complexity */}
          <div className="mo-panel">
            <div className="mo-section-title">📊 Complexity</div>
            <div className="mo-cx-row">
              <div className="mo-cx-item">
                <span className="mo-cx-label">Time</span>
                <span className="mo-cx-badge mo-cx-time">O(18 · m · n)</span>
              </div>
              <div className="mo-cx-item">
                <span className="mo-cx-label">Space</span>
                <span className="mo-cx-badge mo-cx-space">O(1)</span>
              </div>
              <div className="mo-cx-detail">
                <div className="mo-cx-line"><span>Outer loop</span><span>18 bits</span></div>
                <div className="mo-cx-line"><span>Inner loop</span><span>m × n cells</span></div>
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div className="mo-panel">
            <div className="mo-section-title">📘 How It Works</div>
            <div className="mo-how-steps">
              <div className="mo-how-step">
                <span className="mo-how-num">1</span>
                <span>Start from bit 17 (highest). Try keeping it OFF.</span>
              </div>
              <div className="mo-how-step">
                <span className="mo-how-num">2</span>
                <span>Build permission slip = locked bits + all lower bits.</span>
              </div>
              <div className="mo-how-step">
                <span className="mo-how-num">3</span>
                <span>Check: can every row give a valid candidate?</span>
              </div>
              <div className="mo-how-step">
                <span className="mo-how-num">4</span>
                <span>If not → force the bit ON into finalAns.</span>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="mo-panel">
            <div className="mo-section-title">🏷 Topics</div>
            <div className="mo-tags">
              {['Bit Manipulation', 'Greedy', 'Matrix', 'Bitmask', 'Enumeration'].map(t => (
                <span key={t} className="mo-tag">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MinimumOR;
