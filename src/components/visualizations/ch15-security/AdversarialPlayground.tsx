'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Zap } from 'lucide-react';

interface Props {
  activeSection: number;
  onExerciseComplete: () => void;
}

function seededRandom(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

export default function AdversarialPlayground({ activeSection, onExerciseComplete }: Props) {
  void activeSection;
  const [epsilon, setEpsilon] = useState(0);
  const [interactions, setInteractions] = useState(0);
  const [exerciseDone, setExerciseDone] = useState(false);

  const classes = useMemo(() => {
    const e = epsilon;
    const catDrop = 0.95 - e * 1.6;
    const dogRise = 0.03 + e * 1.2;
    const birdRise = 0.015 + e * 0.3;
    const fishRise = 0.005 + e * 0.1;
    const total = catDrop + dogRise + birdRise + fishRise;
    return [
      { label: 'Cat', value: Math.max(0, catDrop / total) },
      { label: 'Dog', value: Math.max(0, dogRise / total) },
      { label: 'Bird', value: Math.max(0, birdRise / total) },
      { label: 'Fish', value: Math.max(0, fishRise / total) },
    ];
  }, [epsilon]);

  const noisePixels = useMemo(() => {
    const pixels: { x: number; y: number; opacity: number }[] = [];
    const count = Math.floor(epsilon * 400);
    for (let i = 0; i < count; i++) {
      pixels.push({
        x: seededRandom(i * 3 + 1) * 120,
        y: seededRandom(i * 3 + 2) * 120,
        opacity: seededRandom(i * 3 + 3) * epsilon * 2,
      });
    }
    return pixels;
  }, [epsilon]);

  const topClass = classes.reduce((a, b) => (b.value > a.value ? b : a));
  const isFlipped = topClass.label !== 'Cat';

  const handleSlider = useCallback(() => {
    setInteractions((c) => c + 1);
  }, []);

  useEffect(() => {
    if (interactions >= 3 && !exerciseDone) {
      setExerciseDone(true);
      onExerciseComplete();
    }
  }, [interactions, exerciseDone, onExerciseComplete]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-3 p-4">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
        <ShieldAlert className="w-3 h-3" /> Adversarial Playground
      </h4>

      {/* Abstract image representation with noise overlay */}
      <div className="relative w-32 h-32 rounded-xl border border-border overflow-hidden bg-primary/5">
        {/* Base abstract pattern */}
        <svg viewBox="0 0 120 120" className="w-full h-full">
          <defs>
            <radialGradient id="catGrad" cx="50%" cy="40%" r="50%">
              <stop offset="0%" stopColor="rgba(168,85,247,0.3)" />
              <stop offset="100%" stopColor="rgba(74,106,255,0.1)" />
            </radialGradient>
          </defs>
          <rect width="120" height="120" fill="url(#catGrad)" />
          <ellipse cx="40" cy="35" rx="12" ry="10" fill="rgba(168,85,247,0.2)" />
          <ellipse cx="80" cy="35" rx="12" ry="10" fill="rgba(168,85,247,0.2)" />
          <ellipse cx="60" cy="60" rx="20" ry="15" fill="rgba(74,106,255,0.15)" />
          <path d="M25,15 L35,30 L15,30Z" fill="rgba(168,85,247,0.25)" />
          <path d="M95,15 L105,30 L85,30Z" fill="rgba(168,85,247,0.25)" />
          {/* Noise overlay */}
          {noisePixels.map((p, i) => (
            <rect key={i} x={p.x} y={p.y} width="3" height="3" fill="white" opacity={p.opacity} />
          ))}
        </svg>
        {isFlipped && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute top-1 right-1 bg-red-500/80 text-white text-[8px] px-1.5 py-0.5 rounded font-bold"
          >
            FLIPPED
          </motion.div>
        )}
      </div>

      {/* Epsilon slider */}
      <div className="w-full max-w-xs">
        <label className="flex items-center justify-between text-xs text-muted-foreground mb-1">
          <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> Perturbation (epsilon)</span>
          <span className="text-foreground font-mono">{epsilon.toFixed(2)}</span>
        </label>
        <input
          type="range" min={0} max={0.5} step={0.01} value={epsilon}
          onChange={(e) => { setEpsilon(Number(e.target.value)); handleSlider(); }}
          className="w-full accent-red-500 h-1"
        />
      </div>

      {/* Classification bars */}
      <div className="w-full max-w-xs space-y-2">
        {classes.map((cls) => {
          const pct = cls.value * 100;
          const isTop = cls.label === topClass.label;
          const barColor = cls.label === 'Cat'
            ? (isFlipped ? 'rgb(239,68,68)' : 'rgb(34,197,94)')
            : (isTop && isFlipped ? 'rgb(239,68,68)' : 'rgba(74,106,255,0.6)');
          return (
            <div key={cls.label}>
              <div className="flex justify-between text-[10px] mb-0.5">
                <span className={isTop ? 'text-foreground font-semibold' : 'text-muted-foreground'}>
                  {cls.label}
                </span>
                <span className="text-muted-foreground font-mono">{pct.toFixed(1)}%</span>
              </div>
              <div className="h-3 rounded-full bg-muted/30 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: barColor }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-[10px] text-muted-foreground/70 text-center max-w-xs">
        {epsilon === 0
          ? 'Clean input — model correctly classifies as Cat.'
          : epsilon < 0.3
            ? 'Small perturbation — confidence dropping but prediction holds.'
            : 'High perturbation — adversarial attack flips the prediction.'}
      </p>

      {!exerciseDone && (
        <p className="text-[10px] text-muted-foreground/50">Drag the epsilon slider ({interactions}/3)</p>
      )}
      {exerciseDone && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] text-primary/60">
          Exercise complete
        </motion.p>
      )}
    </div>
  );
}
