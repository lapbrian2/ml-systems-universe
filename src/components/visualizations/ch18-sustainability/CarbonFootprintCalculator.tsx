'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Leaf, Zap, TreePine } from 'lucide-react';

interface Props {
  activeSection: number;
  onExerciseComplete: () => void;
}

const GPU_TYPES = [
  { name: 'NVIDIA T4', tdpW: 70 },
  { name: 'NVIDIA V100', tdpW: 300 },
  { name: 'NVIDIA A100', tdpW: 400 },
  { name: 'NVIDIA H100', tdpW: 700 },
  { name: 'Google TPU v4', tdpW: 275 },
];

const REGIONS = [
  { name: 'US Average', kgCO2PerKwh: 0.42 },
  { name: 'EU Average', kgCO2PerKwh: 0.28 },
  { name: 'France (Nuclear)', kgCO2PerKwh: 0.06 },
  { name: 'India', kgCO2PerKwh: 0.72 },
  { name: 'Norway (Hydro)', kgCO2PerKwh: 0.02 },
];

const COMPARISONS = [
  { label: 'NYC-London flight', kgCO2: 500 },
  { label: 'Car (10,000 mi/yr)', kgCO2: 4600 },
  { label: 'Smartphone (1 yr)', kgCO2: 70 },
  { label: 'Streaming (1 yr)', kgCO2: 36 },
];

export default function CarbonFootprintCalculator({ activeSection, onExerciseComplete }: Props) {
  void activeSection;
  const [gpuIdx, setGpuIdx] = useState(2);
  const [hours, setHours] = useState(24);
  const [regionIdx, setRegionIdx] = useState(0);
  const [interactions, setInteractions] = useState(0);
  const [exerciseDone, setExerciseDone] = useState(false);

  const interact = useCallback(() => {
    setInteractions((c) => c + 1);
  }, []);

  const gpu = GPU_TYPES[gpuIdx];
  const region = REGIONS[regionIdx];

  const results = useMemo(() => {
    const pue = 1.1;
    const kwh = (gpu.tdpW / 1000) * hours * pue;
    const co2Kg = kwh * region.kgCO2PerKwh;
    const treeYears = co2Kg / 21;
    return { kwh, co2Kg, treeYears };
  }, [gpu, hours, region]);

  const maxComparison = Math.max(...COMPARISONS.map((c) => c.kgCO2), results.co2Kg);

  useEffect(() => {
    if (interactions >= 3 && !exerciseDone) {
      setExerciseDone(true);
      onExerciseComplete();
    }
  }, [interactions, exerciseDone, onExerciseComplete]);

  return (
    <div className="w-full h-full flex flex-col gap-3 p-4 overflow-y-auto">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground text-center flex items-center justify-center gap-1">
        <Leaf className="w-3 h-3" /> Carbon Footprint Calculator
      </h4>

      {/* Inputs */}
      <div className="space-y-2">
        <div>
          <label className="text-[10px] text-muted-foreground mb-1 block">GPU Type</label>
          <select
            value={gpuIdx}
            onChange={(e) => { setGpuIdx(Number(e.target.value)); interact(); }}
            className="w-full h-7 text-xs bg-muted/20 border border-border rounded px-2 text-foreground"
          >
            {GPU_TYPES.map((g, i) => (
              <option key={g.name} value={i}>{g.name} ({g.tdpW}W)</option>
            ))}
          </select>
        </div>

        <div>
          <label className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
            <span>Training Hours</span>
            <span className="text-foreground font-mono">{hours}h</span>
          </label>
          <input
            type="range" min={1} max={720} step={1} value={hours}
            onChange={(e) => { setHours(Number(e.target.value)); interact(); }}
            className="w-full accent-green-500 h-1"
          />
        </div>

        <div>
          <label className="text-[10px] text-muted-foreground mb-1 block">Electricity Grid</label>
          <select
            value={regionIdx}
            onChange={(e) => { setRegionIdx(Number(e.target.value)); interact(); }}
            className="w-full h-7 text-xs bg-muted/20 border border-border rounded px-2 text-foreground"
          >
            {REGIONS.map((r, i) => (
              <option key={r.name} value={i}>{r.name} ({r.kgCO2PerKwh} kg/kWh)</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-3 gap-2">
        <div className="glass-panel rounded-lg p-2 text-center">
          <Zap className="w-4 h-4 text-amber-400 mx-auto mb-1" />
          <p className="text-sm font-mono text-foreground">{results.kwh.toFixed(1)}</p>
          <p className="text-[9px] text-muted-foreground">kWh</p>
        </div>
        <div className="glass-panel rounded-lg p-2 text-center">
          <Leaf className="w-4 h-4 text-green-400 mx-auto mb-1" />
          <p className="text-sm font-mono text-foreground">{results.co2Kg.toFixed(1)}</p>
          <p className="text-[9px] text-muted-foreground">kg CO2</p>
        </div>
        <div className="glass-panel rounded-lg p-2 text-center">
          <TreePine className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
          <p className="text-sm font-mono text-foreground">{results.treeYears.toFixed(2)}</p>
          <p className="text-[9px] text-muted-foreground">tree-years</p>
        </div>
      </div>

      {/* Comparison bars */}
      <div className="space-y-1.5">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">vs. Common Activities</p>
        <div className="space-y-1">
          <div>
            <div className="flex justify-between text-[9px] mb-0.5">
              <span className="text-primary font-semibold">Your Training</span>
              <span className="text-muted-foreground font-mono">{results.co2Kg.toFixed(1)} kg</span>
            </div>
            <div className="h-2.5 rounded-full bg-muted/30 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-primary/60"
                animate={{ width: `${Math.min((results.co2Kg / maxComparison) * 100, 100)}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
          {COMPARISONS.map((comp) => (
            <div key={comp.label}>
              <div className="flex justify-between text-[9px] mb-0.5">
                <span className="text-muted-foreground">{comp.label}</span>
                <span className="text-muted-foreground/60 font-mono">{comp.kgCO2} kg</span>
              </div>
              <div className="h-2.5 rounded-full bg-muted/30 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-muted-foreground/20"
                  animate={{ width: `${(comp.kgCO2 / maxComparison) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {!exerciseDone && (
        <p className="text-[10px] text-muted-foreground/50 text-center">Adjust parameters ({interactions}/3)</p>
      )}
      {exerciseDone && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] text-primary/60 text-center">
          Exercise complete
        </motion.p>
      )}
    </div>
  );
}
