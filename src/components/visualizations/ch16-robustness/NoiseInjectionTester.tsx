'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Waves, Settings2 } from 'lucide-react';

interface Props {
  activeSection: number;
  onExerciseComplete: () => void;
}

type NoiseType = 'gaussian' | 'uniform' | 'salt-pepper';
type SignalType = 'sine' | 'step';

const NOISE_TYPES: { id: NoiseType; label: string }[] = [
  { id: 'gaussian', label: 'Gaussian' },
  { id: 'uniform', label: 'Uniform' },
  { id: 'salt-pepper', label: 'Salt & Pepper' },
];

const SIGNAL_TYPES: { id: SignalType; label: string }[] = [
  { id: 'sine', label: 'Sine Wave' },
  { id: 'step', label: 'Step Function' },
];

function seededRandom(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

function generateSignal(type: SignalType, points: number): number[] {
  const data: number[] = [];
  for (let i = 0; i < points; i++) {
    const t = i / points;
    if (type === 'sine') {
      data.push(Math.sin(t * Math.PI * 4) * 40);
    } else {
      data.push(t < 0.25 ? -30 : t < 0.5 ? 30 : t < 0.75 ? -30 : 30);
    }
  }
  return data;
}

function addNoise(signal: number[], noiseType: NoiseType, level: number, seed: number): number[] {
  return signal.map((v, i) => {
    const r1 = seededRandom(seed + i * 7);
    const r2 = seededRandom(seed + i * 13 + 1);
    if (noiseType === 'gaussian') {
      const gaussian = Math.sqrt(-2 * Math.log(Math.max(r1, 0.001))) * Math.cos(2 * Math.PI * r2);
      return v + gaussian * level * 30;
    } else if (noiseType === 'uniform') {
      return v + (r1 - 0.5) * 2 * level * 40;
    } else {
      if (r1 < level * 0.3) return r2 > 0.5 ? 50 : -50;
      return v;
    }
  });
}

function SignalPath({ data, color, yOffset }: { data: number[]; color: string; yOffset: number }) {
  const width = 320;
  const points = data
    .map((v, i) => `${(i / (data.length - 1)) * width},${yOffset - v}`)
    .join(' ');
  return <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" />;
}

export default function NoiseInjectionTester({ activeSection, onExerciseComplete }: Props) {
  void activeSection;
  const [signalType, setSignalType] = useState<SignalType>('sine');
  const [noiseType, setNoiseType] = useState<NoiseType>('gaussian');
  const [noiseLevel, setNoiseLevel] = useState(0.3);
  const [interactions, setInteractions] = useState(0);
  const [exerciseDone, setExerciseDone] = useState(false);

  const POINTS = 80;
  const clean = useMemo(() => generateSignal(signalType, POINTS), [signalType]);
  const noisy = useMemo(
    () => addNoise(clean, noiseType, noiseLevel, 42),
    [clean, noiseType, noiseLevel],
  );

  const snr = useMemo(() => {
    const signalPower = clean.reduce((s, v) => s + v * v, 0) / clean.length;
    const noisePower = clean.reduce((s, v, i) => s + (v - noisy[i]) ** 2, 0) / clean.length;
    if (noisePower === 0) return Infinity;
    return 10 * Math.log10(signalPower / noisePower);
  }, [clean, noisy]);

  const interact = useCallback(() => {
    setInteractions((c) => c + 1);
  }, []);

  useEffect(() => {
    if (interactions >= 4 && !exerciseDone) {
      setExerciseDone(true);
      onExerciseComplete();
    }
  }, [interactions, exerciseDone, onExerciseComplete]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-3 p-4">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
        <Waves className="w-3 h-3" /> Noise Injection Tester
      </h4>

      {/* Signal type selector */}
      <div className="flex gap-1">
        {SIGNAL_TYPES.map((s) => (
          <button
            key={s.id}
            onClick={() => { setSignalType(s.id); interact(); }}
            className={[
              'px-3 py-1 rounded-md text-[10px] border transition-colors',
              signalType === s.id ? 'bg-primary/15 border-primary/40 text-foreground' : 'border-border/50 text-muted-foreground',
            ].join(' ')}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* SVG signal comparison */}
      <div className="w-full max-w-sm">
        <svg viewBox="0 0 320 200" className="w-full" aria-label="Signal comparison chart">
          {/* Grid lines */}
          <line x1="0" y1="50" x2="320" y2="50" stroke="rgba(74,106,255,0.1)" strokeDasharray="4 4" />
          <line x1="0" y1="150" x2="320" y2="150" stroke="rgba(74,106,255,0.1)" strokeDasharray="4 4" />
          {/* Labels */}
          <text x="4" y="15" fill="rgba(74,106,255,0.6)" fontSize="9" fontFamily="monospace">Original</text>
          <text x="4" y="115" fill="rgba(239,68,68,0.6)" fontSize="9" fontFamily="monospace">Noisy</text>
          {/* Original signal */}
          <SignalPath data={clean} color="rgba(74,106,255,0.7)" yOffset={50} />
          {/* Noisy signal */}
          <SignalPath data={noisy} color="rgba(239,68,68,0.7)" yOffset={150} />
          {/* Center lines */}
          <line x1="0" y1="50" x2="320" y2="50" stroke="rgba(74,106,255,0.15)" strokeWidth="0.5" />
          <line x1="0" y1="150" x2="320" y2="150" stroke="rgba(239,68,68,0.15)" strokeWidth="0.5" />
        </svg>
      </div>

      {/* Noise type selector */}
      <div className="flex gap-1">
        {NOISE_TYPES.map((n) => (
          <button
            key={n.id}
            onClick={() => { setNoiseType(n.id); interact(); }}
            className={[
              'px-3 py-1 rounded-md text-[10px] border transition-colors',
              noiseType === n.id ? 'bg-primary/15 border-primary/40 text-foreground' : 'border-border/50 text-muted-foreground',
            ].join(' ')}
          >
            {n.label}
          </button>
        ))}
      </div>

      {/* Noise level slider */}
      <div className="w-full max-w-xs">
        <label className="flex items-center justify-between text-xs text-muted-foreground mb-1">
          <span className="flex items-center gap-1"><Settings2 className="w-3 h-3" /> Noise Level</span>
          <span className="text-foreground font-mono">{noiseLevel.toFixed(2)}</span>
        </label>
        <input
          type="range" min={0} max={1} step={0.05} value={noiseLevel}
          onChange={(e) => { setNoiseLevel(Number(e.target.value)); interact(); }}
          className="w-full accent-red-500 h-1"
        />
      </div>

      {/* SNR display */}
      <div className="glass-panel rounded-lg px-4 py-2 text-center">
        <p className="text-[10px] text-muted-foreground">Signal-to-Noise Ratio</p>
        <p className="text-lg font-mono text-foreground">
          {isFinite(snr) ? `${snr.toFixed(1)} dB` : 'Inf'}
        </p>
      </div>

      {!exerciseDone && (
        <p className="text-[10px] text-muted-foreground/50">Try different signals & noise types ({interactions}/4)</p>
      )}
      {exerciseDone && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] text-primary/60">
          Exercise complete
        </motion.p>
      )}
    </div>
  );
}
