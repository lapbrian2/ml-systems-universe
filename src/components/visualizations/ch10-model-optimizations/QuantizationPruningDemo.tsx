'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Minus, Plus } from 'lucide-react';

interface QuantizationPruningDemoProps {
  activeSection: number;
  onExerciseComplete: () => void;
}

const BIT_OPTIONS = [32, 16, 8, 4];
const SPARSITY_STEPS = [0, 10, 25, 50, 75, 90];

// Simulated 6x6 weight matrix values (deterministic)
const WEIGHT_MATRIX: number[] = [
  0.83, -0.42, 0.15, -0.67, 0.91, 0.23,
  -0.11, 0.56, -0.78, 0.34, -0.05, 0.62,
  0.47, -0.89, 0.08, 0.72, -0.31, 0.19,
  -0.54, 0.38, 0.95, -0.16, 0.63, -0.44,
  0.27, -0.71, 0.13, 0.88, -0.59, 0.41,
  -0.36, 0.64, -0.22, 0.07, 0.76, -0.48,
];

function quantizeValue(val: number, bits: number): number {
  const levels = Math.pow(2, bits);
  return Math.round(val * (levels / 2)) / (levels / 2);
}

export default function QuantizationPruningDemo({
  activeSection,
  onExerciseComplete,
}: QuantizationPruningDemoProps) {
  void activeSection;

  const [bitWidth, setBitWidth] = useState(32);
  const [sparsity, setSparsity] = useState(0);
  const [interactionCount, setInteractionCount] = useState(0);
  const [exerciseDone, setExerciseDone] = useState(false);

  const interact = useCallback(() => {
    setInteractionCount((c) => c + 1);
  }, []);

  useEffect(() => {
    if (interactionCount >= 3 && !exerciseDone) {
      setExerciseDone(true);
      onExerciseComplete();
    }
  }, [interactionCount, exerciseDone, onExerciseComplete]);

  const handleBitChange = useCallback(
    (delta: number) => {
      setBitWidth((prev) => {
        const idx = BIT_OPTIONS.indexOf(prev);
        const newIdx = Math.max(0, Math.min(BIT_OPTIONS.length - 1, idx - delta));
        return BIT_OPTIONS[newIdx];
      });
      interact();
    },
    [interact],
  );

  const handleSparsityChange = useCallback(
    (delta: number) => {
      setSparsity((prev) => {
        const idx = SPARSITY_STEPS.indexOf(prev);
        const newIdx = Math.max(0, Math.min(SPARSITY_STEPS.length - 1, idx + delta));
        return SPARSITY_STEPS[newIdx];
      });
      interact();
    },
    [interact],
  );

  // Compute metrics
  const modelSizePct = useMemo(() => {
    const bitFactor = bitWidth / 32;
    const sparsityFactor = 1 - sparsity / 100;
    return Math.max(5, bitFactor * sparsityFactor * 100);
  }, [bitWidth, sparsity]);

  const speedupPct = useMemo(() => {
    const bitSpeedup = 32 / bitWidth;
    const sparsitySpeedup = 1 / (1 - sparsity / 100 + 0.01);
    return Math.min(200, bitSpeedup * Math.sqrt(sparsitySpeedup) * 100);
  }, [bitWidth, sparsity]);

  const accuracyPct = useMemo(() => {
    let loss = 0;
    if (bitWidth === 16) loss += 0.2;
    else if (bitWidth === 8) loss += 1.5;
    else if (bitWidth === 4) loss += 5;
    loss += (sparsity / 100) * 8;
    return Math.max(60, 100 - loss);
  }, [bitWidth, sparsity]);

  // Process weight matrix
  const processedWeights = useMemo(() => {
    const sorted = WEIGHT_MATRIX.map((v, i) => ({ v: Math.abs(v), i }))
      .sort((a, b) => a.v - b.v);
    const prunedCount = Math.floor((sparsity / 100) * WEIGHT_MATRIX.length);
    const prunedIndices = new Set(sorted.slice(0, prunedCount).map((s) => s.i));

    return WEIGHT_MATRIX.map((val, i) => {
      if (prunedIndices.has(i)) return { value: 0, pruned: true };
      return { value: quantizeValue(val, bitWidth), pruned: false };
    });
  }, [bitWidth, sparsity]);

  const metrics = [
    { label: 'Model Size', value: modelSizePct, unit: '%', color: 'rgba(74,106,255,0.6)' },
    { label: 'Inference Speed', value: speedupPct, unit: '%', color: 'rgba(34,197,94,0.6)' },
    { label: 'Accuracy', value: accuracyPct, unit: '%', color: 'rgba(168,85,247,0.6)' },
  ];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-3 p-4">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Quantization & Pruning
      </h4>

      {/* Weight matrix visualization */}
      <div className="glass-panel rounded-lg p-3 w-full max-w-xs">
        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">
          Weight Matrix
        </span>
        <div className="grid grid-cols-6 gap-0.5 mt-2">
          {processedWeights.map((w, i) => (
            <motion.div
              key={i}
              className="aspect-square rounded-sm flex items-center justify-center"
              animate={{
                backgroundColor: w.pruned
                  ? 'rgba(100,100,100,0.1)'
                  : w.value >= 0
                    ? `rgba(74,106,255,${0.1 + Math.abs(w.value) * 0.5})`
                    : `rgba(249,115,22,${0.1 + Math.abs(w.value) * 0.5})`,
                opacity: w.pruned ? 0.3 : 1,
              }}
              transition={{ duration: 0.3 }}
            >
              <span
                className="text-[6px] font-mono"
                style={{ color: w.pruned ? 'rgba(150,150,150,0.5)' : 'rgba(255,255,255,0.7)' }}
              >
                {w.pruned ? '0' : w.value.toFixed(1)}
              </span>
            </motion.div>
          ))}
        </div>
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-[8px] text-muted-foreground/50">
            {processedWeights.filter((w) => w.pruned).length}/{WEIGHT_MATRIX.length} pruned
          </span>
          <span className="text-[8px] text-muted-foreground/50">{bitWidth}-bit precision</span>
        </div>
      </div>

      {/* Metric bars */}
      <div className="w-full max-w-xs space-y-2">
        {metrics.map((m) => (
          <div key={m.label} className="flex items-center gap-2">
            <span className="text-[10px] text-muted-foreground w-20 flex-shrink-0">{m.label}</span>
            <div className="flex-1 h-3 bg-muted/20 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: m.color }}
                animate={{ width: `${Math.min(100, m.value)}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
            <span className="text-[10px] font-mono text-foreground w-10 text-right">
              {m.value.toFixed(1)}{m.unit}
            </span>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="glass-panel rounded-lg p-3 w-full max-w-xs space-y-3">
        {/* Bit width */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Bit Width</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleBitChange(-1)}
              disabled={bitWidth === BIT_OPTIONS[BIT_OPTIONS.length - 1]}
              className="w-6 h-6 rounded flex items-center justify-center border border-border hover:bg-muted/50 disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Decrease bit width"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="text-sm font-mono text-foreground w-8 text-center">{bitWidth}b</span>
            <button
              onClick={() => handleBitChange(1)}
              disabled={bitWidth === BIT_OPTIONS[0]}
              className="w-6 h-6 rounded flex items-center justify-center border border-border hover:bg-muted/50 disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Increase bit width"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Sparsity */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Sparsity</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSparsityChange(-1)}
              disabled={sparsity === SPARSITY_STEPS[0]}
              className="w-6 h-6 rounded flex items-center justify-center border border-border hover:bg-muted/50 disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Decrease sparsity"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="text-sm font-mono text-foreground w-8 text-center">{sparsity}%</span>
            <button
              onClick={() => handleSparsityChange(1)}
              disabled={sparsity === SPARSITY_STEPS[SPARSITY_STEPS.length - 1]}
              className="w-6 h-6 rounded flex items-center justify-center border border-border hover:bg-muted/50 disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Increase sparsity"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Exercise hint */}
      {!exerciseDone && (
        <p className="text-[10px] text-muted-foreground/50">
          Adjust controls to explore ({interactionCount}/3)
        </p>
      )}
      {exerciseDone && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[10px] text-primary/60"
        >
          Exercise complete
        </motion.p>
      )}
    </div>
  );
}
