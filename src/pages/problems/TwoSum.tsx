import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, FastForward, Loader2 } from 'lucide-react';
import apiClient from '../../api/client';
import ArrayVisualizer from '../../components/ArrayVisualizer';
import ComplexityChart from '../../components/ComplexityChart';

interface Step {
    array: number[];
    i: number;
    j: number;
    swapped: boolean;
}

interface AlgorithmResponse {
    steps: Step[];
    code: string;
    explanation: string;
    timeComplexity: string;
    spaceComplexity: string;
}

const TwoSum: React.FC = () => {
    const [inputArray, setInputArray] = useState<string>('2, 7, 11, 15');
    const [target, setTarget] = useState<string>('9');
    const [steps, setSteps] = useState<Step[]>([]);
    const [code, setCode] = useState<string>('');
    const [explanation, setExplanation] = useState<string>('');
    const [timeComplexity, setTimeComplexity] = useState<string>('');
    const [spaceComplexity, setSpaceComplexity] = useState<string>('');
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const currentStep = steps[currentStepIndex];

    useEffect(() => {
        let timer: number;
        if (isPlaying && currentStepIndex < steps.length - 1) {
            timer = window.setTimeout(() => {
                setCurrentStepIndex(prev => prev + 1);
            }, 1000);
        } else if (currentStepIndex >= steps.length - 1) {
            setIsPlaying(false);
        }
        return () => clearTimeout(timer);
    }, [isPlaying, currentStepIndex, steps.length]);

    const handleSolve = async () => {
        try {
            setError('');
            setIsLoading(true);
            const nums = inputArray.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
            const targetInt = parseInt(target.trim());

            if (nums.length < 2) {
                setError('Please enter at least 2 valid numbers in the array.');
                return;
            }

            if (isNaN(targetInt)) {
                setError('Please enter a valid target integer.');
                return;
            }

            const response = await apiClient.post<AlgorithmResponse>('/api/problems/two-sum', {
                nums,
                target: targetInt
            });

            const { steps: newSteps, code: newCode, explanation: newExp, timeComplexity: newTime, spaceComplexity: newSpace } = response.data;

            setSteps(newSteps);
            setCode(newCode);
            setExplanation(newExp);
            setTimeComplexity(newTime);
            setSpaceComplexity(newSpace);
            setCurrentStepIndex(0);
            setIsPlaying(true);
        } catch (err) {
            setError('Failed to fetch Two Sum steps from the server.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setIsPlaying(false);
        setCurrentStepIndex(0);
    };

    const handleStepForward = () => {
        if (currentStepIndex < steps.length - 1) {
            setCurrentStepIndex(prev => prev + 1);
        }
    };

    const getMessage = () => {
        if (!currentStep) return '';
        const numI = currentStep.array[currentStep.i];
        const numJ = currentStep.array[currentStep.j];
        const sum = numI + numJ;

        if (currentStep.swapped) {
            return `Found it! ${numI} + ${numJ} = ${sum} (Target: ${target})`;
        } else {
            return `Checking indices ${currentStep.i} and ${currentStep.j}: ${numI} + ${numJ} = ${sum} (Target: ${target})`;
        }
    };

    return (
        <div className="max-w-container animate-fade-in">
            <header className="mb-8 pb-6 border-b">
                <h1 className="text-3xl font-bold mb-2">Two Sum Visualizer</h1>
                <p className="text-secondary">Step by step visualization of finding two numbers that add up to a target.</p>
            </header>

            <div className="glass-panel mb-8 input-group">
                <div className="input-control" style={{ flex: 2 }}>
                    <label className="input-label">Enter Array (comma-separated)</label>
                    <input
                        type="text"
                        className="input-field"
                        value={inputArray}
                        onChange={(e) => setInputArray(e.target.value)}
                        placeholder="e.g. 2, 7, 11, 15"
                    />
                </div>
                <div className="input-control" style={{ flex: 1 }}>
                    <label className="input-label">Target Sum</label>
                    <input
                        type="number"
                        className="input-field"
                        value={target}
                        onChange={(e) => setTarget(e.target.value)}
                        placeholder="e.g. 9"
                    />
                </div>
                <button
                    className="btn-primary"
                    onClick={handleSolve}
                    disabled={isLoading}
                >
                    {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Play size={20} />}
                    {isLoading ? 'Solving...' : 'Solve'}
                </button>
            </div>

            {/* Story Chapters */}
            <div className="mo-story mb-8 pb-4">
                <div className="mo-story-accent" style={{ background: 'linear-gradient(90deg, #6366f1, #38bdf8)' }}></div>
                <div className="story-body">
                    <div className="story-chapter">
                        <div className="chapter-line">
                            <div className="chapter-dot dot-1">01</div>
                            <div className="chapter-connector"></div>
                        </div>
                        <div className="chapter-content">
                            <div className="chapter-label">The Goal</div>
                            <div className="chapter-title">The Perfect Pair</div>
                            <p className="chapter-text">You are given a list of numbers and a <strong>Target Sum</strong>. Your mission is to find the indices of two numbers that add up exactly to that target. It's like finding two puzzle pieces that fit perfectly together.</p>
                        </div>
                    </div>

                    <div className="story-chapter">
                        <div className="chapter-line">
                            <div className="chapter-dot dot-2">02</div>
                            <div className="chapter-connector"></div>
                        </div>
                        <div className="chapter-content">
                            <div className="chapter-label">The Slow Way</div>
                            <div className="chapter-title">Brute Force Search</div>
                            <p className="chapter-text">The simplest way is to check <em>every possible pair</em>. But as the crowd grows, this becomes painfully slow — an O(n²) journey where you're constantly backtracking.</p>
                        </div>
                    </div>

                    <div className="story-chapter">
                        <div className="chapter-line">
                            <div className="chapter-dot dot-3">03</div>
                            <div className="chapter-connector"></div>
                        </div>
                        <div className="chapter-content">
                            <div className="chapter-label">The Secret Weapon</div>
                            <div className="chapter-title">Infinite Memory Map</div>
                            <p className="chapter-text">Instead of looking back, we use a <strong>Hash Map</strong> to remember every number we've seen. For each new number, we calculate its <em>complement</em> (Target - Current) and ask the map: "Have we met before?"</p>
                        </div>
                    </div>

                    <div className="story-chapter">
                        <div className="chapter-line">
                            <div className="chapter-dot dot-4">04</div>
                        </div>
                        <div className="chapter-content">
                            <div className="chapter-label">The Result</div>
                            <div className="chapter-title">Instant Match</div>
                            <p className="chapter-text">In just <strong>one pass</strong> (O(n)), the pair is found. We spend a little extra memory to gain incredible speed. Efficiency wins the day!</p>
                        </div>
                    </div>
                </div>
            </div>

            {error && (
                <div className="error-banner">
                    {error}
                </div>
            )}

            {steps.length > 0 && (
                <div className="mb-12">
                    <div className="flex-between mb-4">
                        <h2 className="text-xl font-semibold">Visualization</h2>
                        <div className="flex-row">
                            <button className="btn-icon" onClick={handleReset} title="Reset">
                                <RotateCcw size={18} />
                            </button>
                            <button
                                className={`btn-icon ${isPlaying ? 'active' : ''}`}
                                onClick={() => setIsPlaying(!isPlaying)}
                                title={isPlaying ? 'Pause' : 'Play'}
                            >
                                <Play size={18} style={{ display: isPlaying ? 'none' : 'block' }} />
                                <div style={{ display: isPlaying ? 'flex' : 'none', gap: '4px' }}>
                                    <div style={{ width: '4px', height: '14px', background: 'currentColor', borderRadius: '2px' }}></div>
                                    <div style={{ width: '4px', height: '14px', background: 'currentColor', borderRadius: '2px' }}></div>
                                </div>
                            </button>
                            <button
                                className="btn-icon"
                                onClick={handleStepForward}
                                disabled={currentStepIndex >= steps.length - 1}
                                title="Step Forward"
                            >
                                <FastForward size={18} />
                            </button>
                        </div>
                    </div>

                    <div style={{ position: 'relative' }} className="mb-12">
                        <ArrayVisualizer
                            array={currentStep?.array || []}
                            currentIndexI={currentStep?.i}
                            currentIndexJ={currentStep?.j}
                            isSwapped={currentStep?.swapped}
                            labelI="L"
                            labelJ="R"
                        />
                        <div className="glass-panel text-center mt-8" style={{ borderLeft: currentStep?.swapped ? '4px solid #10b981' : '4px solid #818cf8', background: currentStep?.swapped ? 'rgba(16, 185, 129, 0.1)' : 'rgba(30, 41, 59, 0.7)' }}>
                            <p className="font-mono text-lg text-primary">
                                {getMessage()}
                            </p>
                            <p className="text-sm text-secondary mt-2">
                                Step {currentStepIndex + 1} of {steps.length}
                            </p>
                        </div>
                    </div>

                    <div className="metadata-grid">
                        <div className="flex-column gap-6">
                            <div className="code-window">
                                <div className="code-header">
                                    <div className="code-dots">
                                        <div className="code-dot" style={{ backgroundColor: '#ff5f56' }}></div>
                                        <div className="code-dot" style={{ backgroundColor: '#ffbd2e' }}></div>
                                        <div className="code-dot" style={{ backgroundColor: '#27c93f' }}></div>
                                    </div>
                                    <span className="text-sm text-secondary font-mono">TwoSum.java</span>
                                </div>
                                <div className="code-content">
                                    {code}
                                </div>
                            </div>

                            <div className="glass-panel">
                                <h3 className="text-lg font-semibold mb-3">Solution Explanation</h3>
                                <div className="explanation-section">
                                    {explanation.split('\n').map((para, idx) => (
                                        <p key={idx}>{para}</p>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex-column gap-6">
                            <div className="glass-panel complexity-card">
                                <h3 className="text-lg font-semibold mb-2">Complexity Analysis</h3>

                                <div className="complexity-item">
                                    <span className="complexity-label">Time Complexity</span>
                                    <div className="badge-complexity badge-blue">
                                        {timeComplexity}
                                    </div>
                                    <ComplexityChart algorithmType={timeComplexity} />
                                    <p className="text-sm text-secondary mt-1">
                                        {timeComplexity.includes('O(n)') && !timeComplexity.includes('n^2') ? 'Linear time: Efficient for large datasets using hash map approach.' : 'Efficiency of the algorithm relative to input size.'}
                                    </p>
                                </div>

                                <div className="complexity-item">
                                    <span className="complexity-label">Space Complexity</span>
                                    <div className="badge-complexity badge-purple">
                                        {spaceComplexity}
                                    </div>
                                    <p className="text-sm text-secondary mt-1">
                                        Extra memory used for data structures (like a Map).
                                    </p>
                                </div>
                            </div>

                            <div className="glass-panel">
                                <h3 className="text-sm font-semibold mb-3 text-secondary uppercase tracking-wider">Algorithm Tags</h3>
                                <div className="flex-row" style={{ flexWrap: 'wrap', gap: '8px' }}>
                                    <div className="info-chip">Hash Map</div>
                                    <div className="info-chip">Two Pointers</div>
                                    <div className="info-chip">Array</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TwoSum;
