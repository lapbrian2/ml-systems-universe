'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Cpu, HardDrive, BatteryMedium, Check, X } from 'lucide-react';

interface Props {
  activeSection: number;
  onExerciseComplete: () => void;
}

const MODELS = [
  { name: 'MobileNet v2', memoryMB: 14, cpuCores: 1, batteryMw: 120 },
  { name: 'TinyBERT', memoryMB: 60, cpuCores: 2, batteryMw: 250 },
  { name: 'EfficientNet-B0', memoryMB: 20, cpuCores: 1, batteryMw: 180 },
  { name: 'YOLOv5-nano', memoryMB: 8, cpuCores: 1, batteryMw: 95 },
  { name: 'Whisper-tiny', memoryMB: 75, cpuCores: 2, batteryMw: 300 },
  { name: 'DistilGPT-2', memoryMB: 250, cpuCores: 4, batteryMw: 500 },
];

function Gauge({ value, max, label, icon: Icon, color }: {
  value: number; max: number; label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}) {
  const pct = Math.min((value / max) * 100, 100);
  const isOver = value > max;
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between text-[10px]">
        <span className="flex items-center gap-1 text-muted-foreground">
          <Icon className="w-3 h-3" /> {label}
        </span>
        <span className={isOver ? 'text-red-400 font-bold' : 'text-foreground'}>
          {value}/{max}
        </span>
      </div>
      <div className="h-2 rounded-full bg-muted/30 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: isOver ? 'rgb(239,68,68)' : color }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  );
}

export default function DeviceResourceAllocator({ activeSection, onExerciseComplete }: Props) {
  void activeSection;
  const [memory, setMemory] = useState(128);
  const [cpuCores, setCpuCores] = useState(2);
  const [battery, setBattery] = useState(400);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [interactions, setInteractions] = useState(0);
  const [exerciseDone, setExerciseDone] = useState(false);

  const usedMemory = MODELS.filter((m) => selected.has(m.name)).reduce((s, m) => s + m.memoryMB, 0);
  const usedCpu = MODELS.filter((m) => selected.has(m.name)).reduce((s, m) => s + m.cpuCores, 0);
  const usedBattery = MODELS.filter((m) => selected.has(m.name)).reduce((s, m) => s + m.batteryMw, 0);

  const toggleModel = useCallback((name: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name); else next.add(name);
      return next;
    });
    setInteractions((c) => c + 1);
  }, []);

  const handleSlider = useCallback(() => {
    setInteractions((c) => c + 1);
  }, []);

  useEffect(() => {
    if (interactions >= 4 && !exerciseDone) {
      setExerciseDone(true);
      onExerciseComplete();
    }
  }, [interactions, exerciseDone, onExerciseComplete]);

  return (
    <div className="w-full h-full flex flex-col gap-3 p-4 overflow-y-auto">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground text-center">
        Edge Device Resource Allocator
      </h4>

      <div className="space-y-3">
        <div>
          <label className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span className="flex items-center gap-1"><HardDrive className="w-3 h-3" /> Memory</span>
            <span className="text-foreground font-mono">{memory} MB</span>
          </label>
          <input type="range" min={32} max={512} step={16} value={memory}
            onChange={(e) => { setMemory(Number(e.target.value)); handleSlider(); }}
            className="w-full accent-blue-500 h-1"
          />
        </div>
        <div>
          <label className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span className="flex items-center gap-1"><Cpu className="w-3 h-3" /> CPU Cores</span>
            <span className="text-foreground font-mono">{cpuCores}</span>
          </label>
          <input type="range" min={1} max={8} step={1} value={cpuCores}
            onChange={(e) => { setCpuCores(Number(e.target.value)); handleSlider(); }}
            className="w-full accent-blue-500 h-1"
          />
        </div>
        <div>
          <label className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span className="flex items-center gap-1"><BatteryMedium className="w-3 h-3" /> Battery Budget</span>
            <span className="text-foreground font-mono">{battery} mW</span>
          </label>
          <input type="range" min={100} max={1000} step={50} value={battery}
            onChange={(e) => { setBattery(Number(e.target.value)); handleSlider(); }}
            className="w-full accent-blue-500 h-1"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Gauge value={usedMemory} max={memory} label="Memory" icon={HardDrive} color="rgb(59,130,246)" />
        <Gauge value={usedCpu} max={cpuCores} label="CPU" icon={Cpu} color="rgb(168,85,247)" />
        <Gauge value={usedBattery} max={battery} label="Battery" icon={BatteryMedium} color="rgb(34,197,94)" />
      </div>

      <div className="space-y-1">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Models</p>
        {MODELS.map((model) => {
          const fits = model.memoryMB <= memory && model.cpuCores <= cpuCores && model.batteryMw <= battery;
          const isSelected = selected.has(model.name);
          return (
            <motion.button
              key={model.name}
              onClick={() => toggleModel(model.name)}
              className={[
                'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left border text-xs transition-colors',
                isSelected ? 'bg-primary/15 border-primary/40' : 'bg-transparent border-border/50',
                !fits ? 'opacity-50' : '',
              ].join(' ')}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className={[
                'w-4 h-4 rounded border flex items-center justify-center',
                isSelected ? 'bg-primary/30 border-primary/50' : 'border-border',
              ].join(' ')}>
                {isSelected && <Check className="w-3 h-3 text-primary" />}
              </div>
              <span className="flex-1 text-foreground">{model.name}</span>
              {fits ? (
                <Check className="w-3 h-3 text-green-400" />
              ) : (
                <X className="w-3 h-3 text-red-400" />
              )}
              <span className="text-muted-foreground/60 font-mono">{model.memoryMB}MB</span>
            </motion.button>
          );
        })}
      </div>

      {!exerciseDone && (
        <p className="text-[10px] text-muted-foreground/50 text-center">Adjust sliders & select models ({interactions}/4)</p>
      )}
      {exerciseDone && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] text-primary/60 text-center">
          Exercise complete
        </motion.p>
      )}
    </div>
  );
}
