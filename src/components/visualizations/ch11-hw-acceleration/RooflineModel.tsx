'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Info } from 'lucide-react';

interface RooflineModelProps {
  activeSection: number;
  onExerciseComplete: () => void;
}

interface HardwarePoint {
  id: string;
  name: string;
  peakGflops: number;
  memBandwidthGBs: number;
  opIntensity: number;     // FLOPS/Byte
  achievedGflops: number;
  color: string;
  description: string;
}

const HARDWARE: HardwarePoint[] = [
  {
    id: 'cpu',
    name: 'CPU (Xeon)',
    peakGflops: 200,
    memBandwidthGBs: 50,
    opIntensity: 2,
    achievedGflops: 80,
    color: 'rgba(74,106,255,0.7)',
    description: 'Intel Xeon server CPU. Good for general compute, limited by memory bandwidth for large models.',
  },
  {
    id: 'gpu',
    name: 'GPU (A100)',
    peakGflops: 19500,
    memBandwidthGBs: 2039,
    opIntensity: 32,
    achievedGflops: 15000,
    color: 'rgba(34,197,94,0.7)',
    description: 'NVIDIA A100 80GB. Top-tier training GPU with 2 TB/s HBM2e bandwidth.',
  },
  {
    id: 'tpu',
    name: 'TPU v4',
    peakGflops: 27500,
    memBandwidthGBs: 1200,
    opIntensity: 64,
    achievedGflops: 22000,
    color: 'rgba(168,85,247,0.7)',
    description: 'Google TPU v4. Optimized for dense matrix operations and large batch training.',
  },
  {
    id: 'edge',
    name: 'Edge NPU',
    peakGflops: 15,
    memBandwidthGBs: 8,
    opIntensity: 1,
    achievedGflops: 8,
    color: 'rgba(249,115,22,0.7)',
    description: 'Mobile/edge neural processing unit. Low power, limited throughput, ideal for inference.',
  },
];

export default function RooflineModel({
  activeSection,
  onExerciseComplete,
}: RooflineModelProps) {
  void activeSection;

  const [selectedHw, setSelectedHw] = useState<string | null>(null);
  const [clickedHw, setClickedHw] = useState<Set<string>>(new Set());
  const [exerciseDone, setExerciseDone] = useState(false);

  const handlePointClick = useCallback((id: string) => {
    setSelectedHw((prev) => (prev === id ? null : id));
    setClickedHw((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  useEffect(() => {
    if (clickedHw.size >= 3 && !exerciseDone) {
      setExerciseDone(true);
      onExerciseComplete();
    }
  }, [clickedHw.size, exerciseDone, onExerciseComplete]);

  // Chart dimensions
  const chartW = 280;
  const chartH = 200;
  const pad = { top: 20, right: 15, bottom: 30, left: 40 };

  // Log-log scale
  const xLogRange = { min: -0.5, max: 2.5 }; // 0.3 to 300 FLOPS/Byte
  const yLogRange = { min: 0, max: 5 };       // 1 to 100,000 GFLOPS

  const toSvgX = useCallback(
    (opInt: number) => {
      const logVal = Math.log10(Math.max(opInt, 0.1));
      const pct = (logVal - xLogRange.min) / (xLogRange.max - xLogRange.min);
      return pad.left + pct * (chartW - pad.left - pad.right);
    },
    [],
  );

  const toSvgY = useCallback(
    (gflops: number) => {
      const logVal = Math.log10(Math.max(gflops, 1));
      const pct = (logVal - yLogRange.min) / (yLogRange.max - yLogRange.min);
      return chartH - pad.bottom - pct * (chartH - pad.top - pad.bottom);
    },
    [],
  );

  // Roofline for GPU (representative)
  const rooflinePath = useMemo(() => {
    const peakPerf = 19500;
    const bandwidth = 2039;
    const ridgePoint = peakPerf / bandwidth; // op intensity where it transitions
    const points: string[] = [];
    // Memory-bound slope
    for (let x = 0.3; x <= ridgePoint; x *= 1.5) {
      const perf = bandwidth * x;
      points.push(`${points.length === 0 ? 'M' : 'L'}${toSvgX(x)},${toSvgY(perf)}`);
    }
    // Ridge point
    points.push(`L${toSvgX(ridgePoint)},${toSvgY(peakPerf)}`);
    // Compute-bound plateau
    points.push(`L${toSvgX(300)},${toSvgY(peakPerf)}`);
    return points.join(' ');
  }, [toSvgX, toSvgY]);

  const selectedInfo = HARDWARE.find((h) => h.id === selectedHw);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-3 p-4">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Roofline Model
      </h4>

      {/* Plot */}
      <div className="glass-panel rounded-lg p-2 w-full max-w-xs">
        <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full" preserveAspectRatio="xMidYMid meet">
          {/* Grid lines */}
          {[1, 10, 100, 1000, 10000].map((y) => (
            <g key={`grid-y-${y}`}>
              <line
                x1={pad.left}
                y1={toSvgY(y)}
                x2={chartW - pad.right}
                y2={toSvgY(y)}
                stroke="rgba(74,106,255,0.06)"
                strokeWidth="1"
              />
              <text
                x={pad.left - 3}
                y={toSvgY(y) + 2}
                textAnchor="end"
                className="fill-muted-foreground"
                style={{ fontSize: '5.5px', fontFamily: 'monospace' }}
              >
                {y >= 1000 ? `${y / 1000}K` : y}
              </text>
            </g>
          ))}

          {[1, 10, 100].map((x) => (
            <text
              key={`x-${x}`}
              x={toSvgX(x)}
              y={chartH - pad.bottom + 12}
              textAnchor="middle"
              className="fill-muted-foreground"
              style={{ fontSize: '5.5px', fontFamily: 'monospace' }}
            >
              {x}
            </text>
          ))}

          {/* Axis labels */}
          <text
            x={chartW / 2}
            y={chartH - 2}
            textAnchor="middle"
            className="fill-muted-foreground"
            style={{ fontSize: '6px' }}
          >
            Op Intensity (FLOPS/Byte)
          </text>
          <text
            x={6}
            y={chartH / 2}
            textAnchor="middle"
            className="fill-muted-foreground"
            style={{ fontSize: '6px' }}
            transform={`rotate(-90, 6, ${chartH / 2})`}
          >
            GFLOPS
          </text>

          {/* Roofline curve */}
          <path
            d={rooflinePath}
            fill="none"
            stroke="rgba(74,106,255,0.3)"
            strokeWidth="2"
            strokeDasharray="6 3"
          />

          {/* Region labels */}
          <text
            x={toSvgX(0.8)}
            y={toSvgY(5)}
            className="fill-muted-foreground"
            style={{ fontSize: '6px', fontStyle: 'italic' }}
            transform={`rotate(-35, ${toSvgX(0.8)}, ${toSvgY(5)})`}
          >
            Memory-bound
          </text>
          <text
            x={toSvgX(40)}
            y={toSvgY(25000)}
            className="fill-muted-foreground"
            style={{ fontSize: '6px', fontStyle: 'italic' }}
          >
            Compute-bound
          </text>

          {/* Hardware points */}
          {HARDWARE.map((hw) => {
            const x = toSvgX(hw.opIntensity);
            const y = toSvgY(hw.achievedGflops);
            const isSelected = selectedHw === hw.id;
            return (
              <g
                key={hw.id}
                onClick={() => handlePointClick(hw.id)}
                style={{ cursor: 'pointer' }}
              >
                {isSelected && (
                  <circle
                    cx={x}
                    cy={y}
                    r={10}
                    fill="none"
                    stroke={hw.color}
                    strokeWidth="1.5"
                    opacity="0.5"
                  />
                )}
                <circle cx={x} cy={y} r={5} fill={hw.color} stroke={hw.color} strokeWidth="1.5" />
                <text
                  x={x}
                  y={y - 8}
                  textAnchor="middle"
                  className="fill-foreground"
                  style={{ fontSize: '5.5px', fontFamily: 'monospace' }}
                >
                  {hw.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Hardware selector buttons */}
      <div className="flex flex-wrap gap-1.5 justify-center">
        {HARDWARE.map((hw) => (
          <motion.button
            key={hw.id}
            onClick={() => handlePointClick(hw.id)}
            className={[
              'flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium border transition-colors',
              selectedHw === hw.id
                ? 'border-primary/40 bg-primary/10 text-foreground'
                : 'border-border text-muted-foreground hover:text-foreground',
            ].join(' ')}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            <Cpu className="w-3 h-3" />
            {hw.name}
          </motion.button>
        ))}
      </div>

      {/* Detail tooltip */}
      <AnimatePresence mode="wait">
        {selectedInfo && (
          <motion.div
            key={selectedInfo.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="glass-panel rounded-lg p-3 max-w-xs"
          >
            <div className="flex items-start gap-2">
              <Info className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-foreground">{selectedInfo.name}</p>
                <div className="text-[10px] text-muted-foreground font-mono space-y-0.5 mt-1">
                  <p>Peak: {selectedInfo.peakGflops.toLocaleString()} GFLOPS</p>
                  <p>Bandwidth: {selectedInfo.memBandwidthGBs} GB/s</p>
                  <p>Achieved: {selectedInfo.achievedGflops.toLocaleString()} GFLOPS</p>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">{selectedInfo.description}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Exercise hint */}
      {!exerciseDone && (
        <p className="text-[10px] text-muted-foreground/50">
          Click 3 hardware points to explore ({clickedHw.size}/3)
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
