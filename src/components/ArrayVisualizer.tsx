import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ArrayVisualizerProps {
    array: number[];
    currentIndexI: number;
    currentIndexJ: number;
    isSwapped: boolean;
    labelI?: string;
    labelJ?: string;
}

const ArrayVisualizer: React.FC<ArrayVisualizerProps> = ({
    array,
    currentIndexI,
    currentIndexJ,
    isSwapped,
    labelI = 'i',
    labelJ = 'j',
}) => {
    const maxVal = Math.max(...array, 1);

    return (
        <div className="array-container glass-panel mb-8">
            <AnimatePresence mode="popLayout">
                {array.map((value, idx) => {
                    const isI = idx === currentIndexI;
                    const isJ = idx === currentIndexJ;

                    let stateClass = 'default';
                    if (isSwapped && (isI || isJ)) {
                        stateClass = 'swapped';
                    } else if (isI) {
                        stateClass = 'active-i';
                    } else if (isJ) {
                        stateClass = 'active-j';
                    }

                    const height = `${(value / maxVal) * 85}%`;

                    return (
                        <motion.div
                            key={`${idx}-${value}`} // unique key for layout animations
                            layout
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="array-column"
                        >
                            <div className="font-mono text-sm text-secondary mb-2">{value}</div>
                            <motion.div
                                className={`array-bar ${stateClass}`}
                                animate={{ height }}
                                transition={{ duration: 0.3 }}
                            >
                                {(isI || isJ) && (
                                    <div className="pointer-label-container">
                                        {isI && <span className="pointer-i" style={{ background: 'var(--accent-glass)', color: 'var(--accent-primary)', border: '1px solid var(--accent-glass)' }}>{labelI}</span>}
                                        {isJ && <span className="pointer-j" style={{ background: 'rgba(6, 182, 212, 0.1)', color: 'var(--accent-cyan)', border: '1px solid rgba(6, 182, 212, 0.2)' }}>{labelJ}</span>}
                                    </div>
                                )}
                            </motion.div>
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
};

export default ArrayVisualizer;
