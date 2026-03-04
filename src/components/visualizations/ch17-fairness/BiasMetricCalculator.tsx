'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Scale, AlertTriangle } from 'lucide-react';

interface Props {
  activeSection: number;
  onExerciseComplete: () => void;
}

interface ConfusionMatrix {
  tp: number;
  fp: number;
  tn: number;
  fn: number;
}

const THRESHOLD = 0.1;

function NumberInput({ label, value, onChange }: {
  label: string; value: number; onChange: (v: number) => void;
}) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="text-[9px] text-muted-foreground">{label}</span>
      <input
        type="number"
        min={0}
        max={999}
        value={value}
        onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))}
        className="w-14 h-7 text-center text-xs font-mono bg-muted/20 border border-border rounded text-foreground"
      />
    </div>
  );
}

function MetricBar({ label, valueA, valueB, threshold, description }: {
  label: string; valueA: number; valueB: number; threshold: number; description: string;
}) {
  const diff = Math.abs(valueA - valueB);
  const violation = diff > threshold;
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-muted-foreground">{label}</span>
        {violation && <AlertTriangle className="w-3 h-3 text-amber-400" />}
      </div>
      <div className="flex gap-2 items-center">
        <div className="flex-1">
          <div className="flex justify-between text-[9px] text-muted-foreground/60 mb-0.5">
            <span>Group A</span>
            <span>{isFinite(valueA) ? (valueA * 100).toFixed(1) + '%' : 'N/A'}</span>
          </div>
          <div className="h-2 rounded-full bg-muted/30 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-blue-500/70"
              animate={{ width: `${isFinite(valueA) ? valueA * 100 : 0}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
        <div className="flex-1">
          <div className="flex justify-between text-[9px] text-muted-foreground/60 mb-0.5">
            <span>Group B</span>
            <span>{isFinite(valueB) ? (valueB * 100).toFixed(1) + '%' : 'N/A'}</span>
          </div>
          <div className="h-2 rounded-full bg-muted/30 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-purple-500/70"
              animate={{ width: `${isFinite(valueB) ? valueB * 100 : 0}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-[8px] text-muted-foreground/50">{description}</span>
        <span className={`text-[9px] font-mono ${violation ? 'text-amber-400' : 'text-green-400'}`}>
          diff: {isFinite(diff) ? (diff * 100).toFixed(1) : '--'}%
        </span>
      </div>
    </div>
  );
}

export default function BiasMetricCalculator({ activeSection, onExerciseComplete }: Props) {
  void activeSection;
  const [groupA, setGroupA] = useState<ConfusionMatrix>({ tp: 80, fp: 10, tn: 85, fn: 25 });
  const [groupB, setGroupB] = useState<ConfusionMatrix>({ tp: 60, fp: 25, tn: 70, fn: 45 });
  const [interactions, setInteractions] = useState(0);
  const [exerciseDone, setExerciseDone] = useState(false);

  const interact = useCallback(() => {
    setInteractions((c) => c + 1);
  }, []);

  const metrics = useMemo(() => {
    const posRateA = (groupA.tp + groupA.fp) / (groupA.tp + groupA.fp + groupA.tn + groupA.fn);
    const posRateB = (groupB.tp + groupB.fp) / (groupB.tp + groupB.fp + groupB.tn + groupB.fn);
    const tprA = groupA.tp / (groupA.tp + groupA.fn);
    const tprB = groupB.tp / (groupB.tp + groupB.fn);
    const ppvA = groupA.tp / (groupA.tp + groupA.fp);
    const ppvB = groupB.tp / (groupB.tp + groupB.fp);
    return {
      demographicParity: { a: posRateA, b: posRateB },
      equalOpportunity: { a: tprA, b: tprB },
      predictiveParity: { a: ppvA, b: ppvB },
    };
  }, [groupA, groupB]);

  const violations = useMemo(() => {
    let count = 0;
    if (Math.abs(metrics.demographicParity.a - metrics.demographicParity.b) > THRESHOLD) count++;
    if (Math.abs(metrics.equalOpportunity.a - metrics.equalOpportunity.b) > THRESHOLD) count++;
    if (Math.abs(metrics.predictiveParity.a - metrics.predictiveParity.b) > THRESHOLD) count++;
    return count;
  }, [metrics]);

  useEffect(() => {
    if (interactions >= 3 && !exerciseDone) {
      setExerciseDone(true);
      onExerciseComplete();
    }
  }, [interactions, exerciseDone, onExerciseComplete]);

  const updateGroup = (group: 'A' | 'B', key: keyof ConfusionMatrix, value: number) => {
    if (group === 'A') setGroupA((prev) => ({ ...prev, [key]: value }));
    else setGroupB((prev) => ({ ...prev, [key]: value }));
    interact();
  };

  return (
    <div className="w-full h-full flex flex-col gap-3 p-4 overflow-y-auto">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground text-center flex items-center justify-center gap-1">
        <Scale className="w-3 h-3" /> Fairness Metric Calculator
      </h4>

      {/* Group A */}
      <div className="glass-panel rounded-lg p-2">
        <p className="text-[10px] font-semibold text-blue-400 mb-1">Group A — Confusion Matrix</p>
        <div className="grid grid-cols-4 gap-1">
          <NumberInput label="TP" value={groupA.tp} onChange={(v) => updateGroup('A', 'tp', v)} />
          <NumberInput label="FP" value={groupA.fp} onChange={(v) => updateGroup('A', 'fp', v)} />
          <NumberInput label="TN" value={groupA.tn} onChange={(v) => updateGroup('A', 'tn', v)} />
          <NumberInput label="FN" value={groupA.fn} onChange={(v) => updateGroup('A', 'fn', v)} />
        </div>
      </div>

      {/* Group B */}
      <div className="glass-panel rounded-lg p-2">
        <p className="text-[10px] font-semibold text-purple-400 mb-1">Group B — Confusion Matrix</p>
        <div className="grid grid-cols-4 gap-1">
          <NumberInput label="TP" value={groupB.tp} onChange={(v) => updateGroup('B', 'tp', v)} />
          <NumberInput label="FP" value={groupB.fp} onChange={(v) => updateGroup('B', 'fp', v)} />
          <NumberInput label="TN" value={groupB.tn} onChange={(v) => updateGroup('B', 'tn', v)} />
          <NumberInput label="FN" value={groupB.fn} onChange={(v) => updateGroup('B', 'fn', v)} />
        </div>
      </div>

      {/* Metrics */}
      <div className="space-y-3">
        <MetricBar
          label="Demographic Parity"
          valueA={metrics.demographicParity.a}
          valueB={metrics.demographicParity.b}
          threshold={THRESHOLD}
          description="P(Y_hat=1) equal across groups"
        />
        <MetricBar
          label="Equal Opportunity"
          valueA={metrics.equalOpportunity.a}
          valueB={metrics.equalOpportunity.b}
          threshold={THRESHOLD}
          description="TPR equal across groups"
        />
        <MetricBar
          label="Predictive Parity"
          valueA={metrics.predictiveParity.a}
          valueB={metrics.predictiveParity.b}
          threshold={THRESHOLD}
          description="PPV equal across groups"
        />
      </div>

      {/* Summary */}
      <div className={`text-center text-xs py-1.5 rounded-lg ${violations > 0 ? 'bg-amber-500/10 text-amber-400' : 'bg-green-500/10 text-green-400'}`}>
        {violations > 0 ? `${violations} fairness violation${violations > 1 ? 's' : ''} detected (threshold: ${THRESHOLD * 100}%)` : 'All metrics within fairness threshold'}
      </div>

      {!exerciseDone && (
        <p className="text-[10px] text-muted-foreground/50 text-center">Adjust confusion matrix values ({interactions}/3)</p>
      )}
      {exerciseDone && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] text-primary/60 text-center">
          Exercise complete
        </motion.p>
      )}
    </div>
  );
}
