'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ToggleLeft, ToggleRight } from 'lucide-react';

interface DataPipelineSimulatorProps {
  activeSection: number;
  onExerciseComplete: () => void;
}

interface Transform {
  id: string;
  label: string;
  description: string;
}

const TRANSFORMS: Transform[] = [
  { id: 'normalize', label: 'Normalize [0,1]', description: 'Scale values to [0, 1] range' },
  { id: 'onehot', label: 'One-Hot Encode', description: 'Convert categorical to binary vectors' },
  { id: 'log', label: 'Log Transform', description: 'Apply log(x+1) to reduce skewness' },
  { id: 'standardize', label: 'Standardize (z)', description: 'Zero mean, unit variance' },
];

// Simulated raw data distribution (8 bins)
const RAW_DATA = [12, 45, 78, 95, 62, 38, 20, 8];
const BIN_LABELS = ['0-1', '1-2', '2-3', '3-4', '4-5', '5-6', '6-7', '7-8'];

function applyTransforms(data: number[], active: Set<string>): number[] {
  let result = [...data];

  if (active.has('normalize')) {
    const max = Math.max(...result);
    const min = Math.min(...result);
    const range = max - min || 1;
    result = result.map((v) => ((v - min) / range) * 95);
  }

  if (active.has('log')) {
    const max = Math.max(...result);
    result = result.map((v) => (Math.log(v + 1) / Math.log(max + 1)) * 95);
  }

  if (active.has('standardize')) {
    const mean = result.reduce((a, b) => a + b, 0) / result.length;
    const std = Math.sqrt(result.reduce((a, b) => a + (b - mean) ** 2, 0) / result.length) || 1;
    const zScores = result.map((v) => (v - mean) / std);
    const zMin = Math.min(...zScores);
    const zMax = Math.max(...zScores);
    const zRange = zMax - zMin || 1;
    result = zScores.map((z) => ((z - zMin) / zRange) * 95);
  }

  if (active.has('onehot')) {
    // Simulate flattening effect - values become more uniform
    const avg = result.reduce((a, b) => a + b, 0) / result.length;
    result = result.map((v) => v * 0.4 + avg * 0.6);
  }

  return result;
}

export default function DataPipelineSimulator({
  activeSection,
  onExerciseComplete,
}: DataPipelineSimulatorProps) {
  void activeSection;

  const [activeTransforms, setActiveTransforms] = useState<Set<string>>(new Set());
  const [exerciseDone, setExerciseDone] = useState(false);
  const [toggleCount, setToggleCount] = useState(0);

  const toggleTransform = useCallback((id: string) => {
    setActiveTransforms((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    setToggleCount((c) => c + 1);
  }, []);

  useEffect(() => {
    if (toggleCount >= 3 && !exerciseDone) {
      setExerciseDone(true);
      onExerciseComplete();
    }
  }, [toggleCount, exerciseDone, onExerciseComplete]);

  const transformedData = useMemo(
    () => applyTransforms(RAW_DATA, activeTransforms),
    [activeTransforms],
  );

  const maxRaw = Math.max(...RAW_DATA);
  const maxTransformed = Math.max(...transformedData, 1);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-3 p-4">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Data Pipeline Simulator
      </h4>

      {/* Histogram comparison */}
      <div className="w-full max-w-xs glass-panel rounded-lg p-3 space-y-3">
        {/* Before histogram */}
        <div>
          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
            Raw Distribution
          </span>
          <div className="flex items-end gap-1 h-16 mt-1">
            {RAW_DATA.map((val, i) => (
              <div key={`raw-${i}`} className="flex-1 flex flex-col items-center">
                <motion.div
                  className="w-full rounded-t"
                  style={{ backgroundColor: 'rgba(74,106,255,0.35)' }}
                  animate={{ height: `${(val / maxRaw) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
                <span className="text-[7px] text-muted-foreground/50 mt-0.5">
                  {BIN_LABELS[i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Arrow */}
        <div className="flex items-center justify-center gap-2">
          <div className="h-px flex-1 bg-border/30" />
          <span className="text-[10px] text-muted-foreground">
            {activeTransforms.size === 0 ? 'No transforms' : `${activeTransforms.size} active`}
          </span>
          <div className="h-px flex-1 bg-border/30" />
        </div>

        {/* After histogram */}
        <div>
          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
            Transformed Distribution
          </span>
          <div className="flex items-end gap-1 h-16 mt-1">
            {transformedData.map((val, i) => (
              <div key={`tfm-${i}`} className="flex-1 flex flex-col items-center">
                <motion.div
                  className="w-full rounded-t"
                  style={{
                    backgroundColor:
                      activeTransforms.size > 0
                        ? 'rgba(34,197,94,0.45)'
                        : 'rgba(74,106,255,0.35)',
                  }}
                  animate={{ height: `${(val / maxTransformed) * 100}%` }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                />
                <span className="text-[7px] text-muted-foreground/50 mt-0.5">
                  {BIN_LABELS[i]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Transform toggles */}
      <div className="w-full max-w-xs space-y-1.5">
        {TRANSFORMS.map((t) => {
          const isActive = activeTransforms.has(t.id);
          return (
            <motion.button
              key={t.id}
              onClick={() => toggleTransform(t.id)}
              className={[
                'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg border transition-colors text-left',
                isActive
                  ? 'bg-primary/10 border-primary/30'
                  : 'bg-transparent border-border/30 hover:border-border/50',
              ].join(' ')}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              aria-pressed={isActive}
              aria-label={`Toggle ${t.label}`}
            >
              {isActive ? (
                <ToggleRight className="w-5 h-5 text-primary flex-shrink-0" />
              ) : (
                <ToggleLeft className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <span className="text-xs font-medium text-foreground">{t.label}</span>
                <p className="text-[9px] text-muted-foreground">{t.description}</p>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Exercise hint */}
      {!exerciseDone && (
        <p className="text-[10px] text-muted-foreground/50">
          Toggle transforms to explore ({toggleCount}/3)
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
