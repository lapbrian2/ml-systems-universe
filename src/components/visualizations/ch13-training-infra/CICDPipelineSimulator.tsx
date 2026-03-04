'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code2,
  Package,
  TestTube2,
  Brain,
  ShieldCheck,
  Rocket,
  Activity,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

interface Props {
  activeSection: number;
  onExerciseComplete: () => void;
}

const STAGES = [
  { id: 'code', label: 'Code', icon: Code2, desc: 'Source code changes committed. Linters and static analysis run automatically on push.' },
  { id: 'build', label: 'Build', icon: Package, desc: 'Docker image built with model code, dependencies, and serving infrastructure.' },
  { id: 'test', label: 'Test', icon: TestTube2, desc: 'Unit tests, integration tests, and data validation checks executed.' },
  { id: 'train', label: 'Train', icon: Brain, desc: 'Model retrained on latest data. Hyperparameters tuned via automated sweep.' },
  { id: 'validate', label: 'Validate', icon: ShieldCheck, desc: 'Model evaluated against held-out set. Must exceed baseline metrics to proceed.' },
  { id: 'deploy', label: 'Deploy', icon: Rocket, desc: 'Canary deployment to 5% of traffic. Gradual rollout if metrics hold.' },
  { id: 'monitor', label: 'Monitor', icon: Activity, desc: 'Real-time monitoring of latency, accuracy drift, and data distribution shifts.' },
] as const;

export default function CICDPipelineSimulator({ activeSection, onExerciseComplete }: Props) {
  void activeSection;
  const [stageStatus, setStageStatus] = useState<Record<string, 'idle' | 'pass' | 'fail'>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [interactionCount, setInteractionCount] = useState(0);
  const [exerciseDone, setExerciseDone] = useState(false);
  const [animatingStage, setAnimatingStage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimatingStage((prev) => (prev + 1) % STAGES.length);
    }, 1200);
    return () => clearInterval(timer);
  }, []);

  const handleClick = useCallback((id: string) => {
    setSelected((prev) => (prev === id ? null : id));
    setInteractionCount((c) => c + 1);
  }, []);

  const toggleStatus = useCallback((id: string) => {
    setStageStatus((prev) => {
      const current = prev[id] || 'idle';
      const next = current === 'idle' ? 'pass' : current === 'pass' ? 'fail' : 'idle';
      return { ...prev, [id]: next };
    });
    setInteractionCount((c) => c + 1);
  }, []);

  useEffect(() => {
    if (interactionCount >= 4 && !exerciseDone) {
      setExerciseDone(true);
      onExerciseComplete();
    }
  }, [interactionCount, exerciseDone, onExerciseComplete]);

  const selectedStage = STAGES.find((s) => s.id === selected);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-3 p-4">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        ML CI/CD Pipeline
      </h4>

      <div className="w-full max-w-sm">
        <svg className="w-full" viewBox="0 0 400 60" aria-hidden="true">
          {STAGES.map((_, i) => {
            if (i >= STAGES.length - 1) return null;
            const x1 = 30 + i * 56;
            const x2 = x1 + 56;
            const status = stageStatus[STAGES[i].id] || 'idle';
            const color = status === 'fail' ? 'rgba(239,68,68,0.5)' : status === 'pass' ? 'rgba(34,197,94,0.5)' : 'rgba(74,106,255,0.2)';
            return (
              <g key={`line-${i}`}>
                <line x1={x1} y1={30} x2={x2} y2={30} stroke={color} strokeWidth="2" strokeDasharray={status === 'idle' ? '4 4' : 'none'} />
                {i === animatingStage && (
                  <circle r="3" fill="hsl(228 100% 64%)">
                    <animateMotion dur="1s" repeatCount="indefinite" path={`M${x1},30 L${x2},30`} />
                    <animate attributeName="opacity" values="0;1;1;0" dur="1s" repeatCount="indefinite" />
                  </circle>
                )}
              </g>
            );
          })}
        </svg>

        <div className="flex justify-between -mt-2">
          {STAGES.map((stage) => {
            const Icon = stage.icon;
            const status = stageStatus[stage.id] || 'idle';
            const isSelected = selected === stage.id;
            return (
              <div key={stage.id} className="flex flex-col items-center gap-1">
                <motion.button
                  onClick={() => handleClick(stage.id)}
                  className={[
                    'w-10 h-10 rounded-lg flex items-center justify-center border transition-colors',
                    isSelected ? 'ring-1 ring-primary/50' : '',
                    status === 'pass' ? 'bg-green-500/15 border-green-500/40' :
                    status === 'fail' ? 'bg-red-500/15 border-red-500/40' :
                    'bg-primary/10 border-border',
                  ].join(' ')}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={stage.label}
                >
                  <Icon className="w-4 h-4 text-foreground" />
                </motion.button>
                <span className="text-[9px] text-muted-foreground">{stage.label}</span>
                <button
                  onClick={() => toggleStatus(stage.id)}
                  className="text-muted-foreground hover:text-foreground"
                  aria-label={`Toggle ${stage.label} status`}
                >
                  {status === 'pass' ? <CheckCircle2 className="w-3 h-3 text-green-400" /> :
                   status === 'fail' ? <XCircle className="w-3 h-3 text-red-400" /> :
                   <div className="w-3 h-3 rounded-full border border-muted-foreground/30" />}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {selectedStage && (
          <motion.div
            key={selectedStage.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="glass-panel rounded-lg p-3 max-w-xs text-center"
          >
            <p className="text-sm font-semibold text-foreground mb-1">{selectedStage.label}</p>
            <p className="text-xs text-muted-foreground leading-relaxed">{selectedStage.desc}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-3 text-[10px] text-muted-foreground/60">
        <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-400" /> Pass</span>
        <span className="flex items-center gap-1"><XCircle className="w-3 h-3 text-red-400" /> Fail</span>
        <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full border border-muted-foreground/30" /> Idle</span>
      </div>

      {!exerciseDone && (
        <p className="text-[10px] text-muted-foreground/50">Click stages & toggle status ({interactionCount}/4)</p>
      )}
      {exerciseDone && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] text-primary/60">
          Exercise complete
        </motion.p>
      )}
    </div>
  );
}
