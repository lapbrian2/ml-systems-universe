'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info } from 'lucide-react';

interface EfficiencyFrontierProps {
  activeSection: number;
  onExerciseComplete: () => void;
}

interface ModelPoint {
  id: string;
  name: string;
  params: number;       // millions
  accuracy: number;     // percentage
  category: string;
  pareto: boolean;
  description: string;
}

const MODELS: ModelPoint[] = [
  { id: 'tinybert', name: 'TinyBERT', params: 14.5, accuracy: 83, category: 'NLP', pareto: true, description: '4-layer distilled BERT. 7.5x smaller, 9.4x faster inference.' },
  { id: 'distilbert', name: 'DistilBERT', params: 66, accuracy: 87, category: 'NLP', pareto: true, description: '6-layer distilled BERT. 40% smaller with 97% of performance.' },
  { id: 'bert', name: 'BERT-base', params: 110, accuracy: 90, category: 'NLP', pareto: false, description: '12-layer bidirectional transformer. Foundational NLP model.' },
  { id: 'mobilenet', name: 'MobileNetV3', params: 5.4, accuracy: 75, category: 'Vision', pareto: true, description: 'Lightweight CNN designed for mobile and edge devices.' },
  { id: 'efficientnet', name: 'EfficientNet-B0', params: 5.3, accuracy: 77, category: 'Vision', pareto: true, description: 'Compound-scaled CNN. Best accuracy/size ratio at launch.' },
  { id: 'resnet', name: 'ResNet-50', params: 25.6, accuracy: 80, category: 'Vision', pareto: false, description: 'Classic deep residual network. Widely used baseline.' },
  { id: 'vit', name: 'ViT-B/16', params: 86, accuracy: 85, category: 'Vision', pareto: false, description: 'Vision Transformer. Patch-based image classification.' },
  { id: 'gpt2', name: 'GPT-2', params: 124, accuracy: 88, category: 'NLP', pareto: true, description: '12-layer autoregressive transformer. 1.5B version available.' },
];

export default function EfficiencyFrontier({
  activeSection,
  onExerciseComplete,
}: EfficiencyFrontierProps) {
  void activeSection;

  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [clickedModels, setClickedModels] = useState<Set<string>>(new Set());
  const [exerciseDone, setExerciseDone] = useState(false);

  const handlePointClick = useCallback((id: string) => {
    setSelectedModel((prev) => (prev === id ? null : id));
    setClickedModels((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  useEffect(() => {
    if (clickedModels.size >= 3 && !exerciseDone) {
      setExerciseDone(true);
      onExerciseComplete();
    }
  }, [clickedModels.size, exerciseDone, onExerciseComplete]);

  // Chart dimensions (SVG viewBox)
  const chartW = 280;
  const chartH = 200;
  const pad = { top: 20, right: 20, bottom: 30, left: 35 };

  // Logarithmic scale for X (params)
  const xRange = useMemo(() => {
    const minP = Math.min(...MODELS.map((m) => m.params));
    const maxP = Math.max(...MODELS.map((m) => m.params));
    return { min: Math.log10(minP * 0.7), max: Math.log10(maxP * 1.3) };
  }, []);

  const yRange = { min: 70, max: 95 };

  const toSvgX = useCallback(
    (params: number) => {
      const logVal = Math.log10(params);
      const pct = (logVal - xRange.min) / (xRange.max - xRange.min);
      return pad.left + pct * (chartW - pad.left - pad.right);
    },
    [xRange, pad.left, pad.right],
  );

  const toSvgY = useCallback(
    (acc: number) => {
      const pct = (acc - yRange.min) / (yRange.max - yRange.min);
      return chartH - pad.bottom - pct * (chartH - pad.top - pad.bottom);
    },
    [yRange.min, yRange.max, pad.bottom, pad.top],
  );

  // Pareto frontier line
  const paretoModels = useMemo(
    () =>
      MODELS.filter((m) => m.pareto).sort((a, b) => a.params - b.params),
    [],
  );

  const paretoPath = useMemo(
    () =>
      paretoModels
        .map((m, i) => `${i === 0 ? 'M' : 'L'}${toSvgX(m.params)},${toSvgY(m.accuracy)}`)
        .join(' '),
    [paretoModels, toSvgX, toSvgY],
  );

  const selectedInfo = MODELS.find((m) => m.id === selectedModel);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-3 p-4">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Efficiency-Accuracy Frontier
      </h4>

      {/* Scatter plot */}
      <div className="glass-panel rounded-lg p-2 w-full max-w-xs">
        <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full" preserveAspectRatio="xMidYMid meet">
          {/* Grid lines */}
          {[75, 80, 85, 90].map((y) => (
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
                x={pad.left - 4}
                y={toSvgY(y) + 3}
                textAnchor="end"
                className="fill-muted-foreground"
                style={{ fontSize: '6px', fontFamily: 'monospace' }}
              >
                {y}%
              </text>
            </g>
          ))}

          {/* X-axis labels */}
          {[5, 10, 50, 100].map((p) => (
            <text
              key={`x-${p}`}
              x={toSvgX(p)}
              y={chartH - pad.bottom + 12}
              textAnchor="middle"
              className="fill-muted-foreground"
              style={{ fontSize: '6px', fontFamily: 'monospace' }}
            >
              {p}M
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
            Model Size (params)
          </text>
          <text
            x={6}
            y={chartH / 2}
            textAnchor="middle"
            className="fill-muted-foreground"
            style={{ fontSize: '6px' }}
            transform={`rotate(-90, 6, ${chartH / 2})`}
          >
            Accuracy
          </text>

          {/* Pareto frontier line */}
          <motion.path
            d={paretoPath}
            fill="none"
            stroke="rgba(34,197,94,0.5)"
            strokeWidth="2"
            strokeDasharray="4 3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />

          {/* Data points */}
          {MODELS.map((model) => {
            const x = toSvgX(model.params);
            const y = toSvgY(model.accuracy);
            const isSelected = selectedModel === model.id;
            return (
              <g
                key={model.id}
                onClick={() => handlePointClick(model.id)}
                style={{ cursor: 'pointer' }}
              >
                {/* Selection ring */}
                {isSelected && (
                  <circle
                    cx={x}
                    cy={y}
                    r={9}
                    fill="none"
                    stroke="rgba(74,106,255,0.4)"
                    strokeWidth="1.5"
                  />
                )}
                {/* Point */}
                <circle
                  cx={x}
                  cy={y}
                  r={model.pareto ? 5 : 4}
                  fill={model.pareto ? 'rgba(34,197,94,0.6)' : 'rgba(74,106,255,0.4)'}
                  stroke={model.pareto ? 'rgba(34,197,94,0.8)' : 'rgba(74,106,255,0.6)'}
                  strokeWidth="1.5"
                />
                {/* Label */}
                <text
                  x={x}
                  y={y - 8}
                  textAnchor="middle"
                  className="fill-foreground"
                  style={{ fontSize: '5.5px', fontFamily: 'monospace' }}
                >
                  {model.name}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 mt-1">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'rgba(34,197,94,0.6)' }} />
            <span className="text-[8px] text-muted-foreground">Pareto-optimal</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'rgba(74,106,255,0.4)' }} />
            <span className="text-[8px] text-muted-foreground">Sub-optimal</span>
          </div>
        </div>
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
                <p className="text-[10px] text-muted-foreground font-mono">
                  {selectedInfo.params}M params | {selectedInfo.accuracy}% acc | {selectedInfo.category}
                </p>
                <p className="text-[10px] text-muted-foreground mt-1">{selectedInfo.description}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Exercise hint */}
      {!exerciseDone && (
        <p className="text-[10px] text-muted-foreground/50">
          Click 3 models to explore ({clickedModels.size}/3)
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
