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

const BubbleSort: React.FC = () => {
    const [inputArray, setInputArray] = useState<string>('5, 3, 8, 4, 2');
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
            }, 800);
        } else if (currentStepIndex >= steps.length - 1) {
            setIsPlaying(false);
        }
        return () => clearTimeout(timer);
    }, [isPlaying, currentStepIndex, steps.length]);

    const handleSort = async () => {
        try {
            setError('');
            setIsLoading(true);
            const parsedArray = inputArray.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));

            if (parsedArray.length < 2) {
                setError('Please enter at least 2 valid numbers.');
                return;
            }

            const response = await apiClient.post<AlgorithmResponse>('/api/sort/bubble-sort', parsedArray);
            const { steps: newSteps, code: newCode, explanation: newExp, timeComplexity: newTime, spaceComplexity: newSpace } = response.data;

            setSteps(newSteps);
            setCode(newCode);
            setExplanation(newExp);
            setTimeComplexity(newTime);
            setSpaceComplexity(newSpace);
            setCurrentStepIndex(0);
            setIsPlaying(true);
        } catch (err) {
            setError('Failed to fetch sorting steps from the server.');
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

    return (
        <div className="max-w-container animate-fade-in">
            <header className="mb-8 pb-6 border-b">
                <h1 className="text-3xl font-bold mb-2">Bubble Sort Visualizer</h1>
                <p className="text-secondary">Watch the Bubble Sort algorithm sort an array step-by-step.</p>
            </header>

            <div className="glass-panel mb-8 input-group">
                <div className="input-control">
                    <label className="input-label">Enter Array (comma-separated)</label>
                    <input
                        type="text"
                        className="input-field"
                        value={inputArray}
                        onChange={(e) => setInputArray(e.target.value)}
                        placeholder="e.g. 5, 3, 8, 4, 2"
                    />
                </div>
                <button
                    className="btn-primary"
                    onClick={handleSort}
                    disabled={isLoading}
                >
                    {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Play size={20} />}
                    {isLoading ? 'Sorting...' : 'Start Sort'}
                </button>
            </div>

            {/* Story Chapters */}
            <div className="mo-story mb-8 pb-4">
                <div className="mo-story-accent"></div>
                <div className="story-body">
                    <div className="story-chapter">
                        <div className="chapter-line">
                            <div className="chapter-dot dot-1">01</div>
                            <div className="chapter-connector"></div>
                        </div>
                        <div className="chapter-content">
                            <div className="chapter-label">The Problem</div>
                            <div className="chapter-title">An Unsorted Kingdom</div>
                            <p className="chapter-text">Imagine a kingdom where numbers live in a line, completely out of order. <strong>Bubble Sort</strong> is the most patient guard—it walks the line again and again, swapping neighbors who are out of place.</p>
                        </div>
                    </div>

                    <div className="story-chapter">
                        <div className="chapter-line">
                            <div className="chapter-dot dot-2">02</div>
                            <div className="chapter-connector"></div>
                        </div>
                        <div className="chapter-content">
                            <div className="chapter-label">The Mechanism</div>
                            <div className="chapter-title">The Bubble Rises</div>
                            <p className="chapter-text">In each pass, the guard compares two neighbors. If the left is bigger, they swap. Like a bubble in water, the <em>largest element floats to the end</em> with every pass through the array.</p>
                        </div>
                    </div>

                    <div className="story-chapter">
                        <div className="chapter-line">
                            <div className="chapter-dot dot-3">03</div>
                            <div className="chapter-connector"></div>
                        </div>
                        <div className="chapter-content">
                            <div className="chapter-label">The Optimization</div>
                            <div className="chapter-title">The Early Exit</div>
                            <p className="chapter-text">A clever guard tracks if any swap happened. If a full pass completes <strong>with no swaps</strong>, the array is already sorted. We stop early, skipping unnecessary work.</p>
                        </div>
                    </div>

                    <div className="story-chapter">
                        <div className="chapter-line">
                            <div className="chapter-dot dot-4">04</div>
                        </div>
                        <div className="chapter-content">
                            <div className="chapter-label">The Lesson</div>
                            <div className="chapter-title">When to Use It</div>
                            <p className="chapter-text">Bubble Sort shines in <strong>nearly sorted</strong> data or tiny arrays. For large datasets, its O(n²) complexity makes it a slow guard. Use <em>Merge Sort</em> for the big leagues!</p>
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
                        />
                        <div className="glass-panel text-center mt-8">
                            <p className="font-mono text-lg text-primary">
                                {currentStep?.swapped
                                    ? `Swapped ${currentStep.array[currentStep.j]} and ${currentStep.array[currentStep.i]}!`
                                    : `Comparing index ${currentStep?.i} with index ${currentStep?.j}`}
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
                                    <span className="text-sm text-secondary font-mono">bubble_sort.java</span>
                                </div>
                                <div className="code-content">
                                    {code}
                                </div>
                            </div>

                            <div className="glass-panel">
                                <h3 className="text-lg font-semibold mb-3">Algorithm Explanation</h3>
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
                                        {timeComplexity.includes('n^2') ? 'Quadratic time: Performance decreases significantly with larger arrays.' : 'Efficiency of the algorithm relative to input size.'}
                                    </p>
                                </div>

                                <div className="complexity-item">
                                    <span className="complexity-label">Space Complexity</span>
                                    <div className="badge-complexity badge-purple">
                                        {spaceComplexity}
                                    </div>
                                    <p className="text-sm text-secondary mt-1">
                                        Memory used by the algorithm during its execution.
                                    </p>
                                </div>
                            </div>

                            <div className="glass-panel">
                                <h3 className="text-sm font-semibold mb-3 text-secondary uppercase tracking-wider">Quick Info</h3>
                                <div className="flex-column gap-3">
                                    <div className="info-chip">
                                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                        In-place Sorting
                                    </div>
                                    <div className="info-chip">
                                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                        Stable Algorithm
                                    </div>
                                    <div className="info-chip">
                                        <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                                        Comparison Based
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BubbleSort;
