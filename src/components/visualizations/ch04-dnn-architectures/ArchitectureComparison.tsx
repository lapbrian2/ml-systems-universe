'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, ArrowRight } from 'lucide-react';

interface ArchitectureComparisonProps {
  activeSection: number;
  onExerciseComplete: () => void;
}

type ArchType = 'cnn' | 'rnn' | 'transformer';

interface ArchInfo {
  id: ArchType;
  name: string;
  inputShape: string;
  layers: { name: string; color: string }[];
  params: string;
  paramCount: number;
  useCase: string;
  description: string;
}

const ARCHITECTURES: ArchInfo[] = [
  {
    id: 'cnn',
    name: 'CNN',
    inputShape: '224x224x3 image',
    layers: [
      { name: 'Conv2D 64', color: 'rgba(74,106,255,0.4)' },
      { name: 'MaxPool', color: 'rgba(74,106,255,0.25)' },
      { name: 'Conv2D 128', color: 'rgba(74,106,255,0.5)' },
      { name: 'MaxPool', color: 'rgba(74,106,255,0.25)' },
      { name: 'Conv2D 256', color: 'rgba(74,106,255,0.6)' },
      { name: 'Flatten', color: 'rgba(168,85,247,0.3)' },
      { name: 'Dense 512', color: 'rgba(34,197,94,0.4)' },
      { name: 'Dense 10', color: 'rgba(34,197,94,0.5)' },
    ],
    params: '25.6M',
    paramCount: 25600000,
    useCase: 'Image classification, object detection',
    description: 'Convolutional layers extract spatial features hierarchically.',
  },
  {
    id: 'rnn',
    name: 'RNN / LSTM',
    inputShape: 'Seq length x 128 embedding',
    layers: [
      { name: 'Embedding', color: 'rgba(249,115,22,0.4)' },
      { name: 'LSTM 256', color: 'rgba(249,115,22,0.5)' },
      { name: 'LSTM 256', color: 'rgba(249,115,22,0.5)' },
      { name: 'Dropout', color: 'rgba(249,115,22,0.25)' },
      { name: 'Dense 128', color: 'rgba(34,197,94,0.4)' },
      { name: 'Dense 1', color: 'rgba(34,197,94,0.5)' },
    ],
    params: '4.2M',
    paramCount: 4200000,
    useCase: 'Text classification, time series',
    description: 'Recurrent cells process sequences step-by-step with hidden state.',
  },
  {
    id: 'transformer',
    name: 'Transformer',
    inputShape: 'Seq length x 768 tokens',
    layers: [
      { name: 'Token Embed', color: 'rgba(168,85,247,0.35)' },
      { name: 'Pos Encode', color: 'rgba(168,85,247,0.25)' },
      { name: 'Multi-Head Attn', color: 'rgba(168,85,247,0.55)' },
      { name: 'Feed Forward', color: 'rgba(168,85,247,0.45)' },
      { name: 'Multi-Head Attn', color: 'rgba(168,85,247,0.55)' },
      { name: 'Feed Forward', color: 'rgba(168,85,247,0.45)' },
      { name: 'Layer Norm', color: 'rgba(168,85,247,0.3)' },
      { name: 'Classifier', color: 'rgba(34,197,94,0.5)' },
    ],
    params: '110M',
    paramCount: 110000000,
    useCase: 'NLP, multimodal, generative AI',
    description: 'Self-attention captures global dependencies in parallel.',
  },
];

export default function ArchitectureComparison({
  activeSection,
  onExerciseComplete,
}: ArchitectureComparisonProps) {
  void activeSection;

  const [selected, setSelected] = useState<ArchType>('cnn');
  const [visitedTabs, setVisitedTabs] = useState<Set<ArchType>>(() => new Set<ArchType>(['cnn']));
  const [exerciseDone, setExerciseDone] = useState(false);
  const [animatedParams, setAnimatedParams] = useState(0);

  const arch = ARCHITECTURES.find((a) => a.id === selected)!;

  const handleTabClick = useCallback((id: ArchType) => {
    setSelected(id);
    setVisitedTabs((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  // Animated parameter counter
  useEffect(() => {
    setAnimatedParams(0);
    const target = arch.paramCount;
    const steps = 30;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setAnimatedParams(target);
        clearInterval(timer);
      } else {
        setAnimatedParams(Math.floor(current));
      }
    }, 25);
    return () => clearInterval(timer);
  }, [arch.paramCount]);

  useEffect(() => {
    if (visitedTabs.size >= 3 && !exerciseDone) {
      setExerciseDone(true);
      onExerciseComplete();
    }
  }, [visitedTabs.size, exerciseDone, onExerciseComplete]);

  const formatParams = (n: number) => {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
    return String(n);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-3 p-4">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        DNN Architectures
      </h4>

      {/* Tab bar */}
      <div className="flex gap-1 glass-panel rounded-lg p-1">
        {ARCHITECTURES.map((a) => (
          <motion.button
            key={a.id}
            onClick={() => handleTabClick(a.id)}
            className={[
              'px-3 py-1.5 rounded-md text-xs font-medium transition-colors',
              selected === a.id
                ? 'bg-primary/15 text-primary border border-primary/30'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/30 border border-transparent',
            ].join(' ')}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {a.name}
          </motion.button>
        ))}
      </div>

      {/* Architecture display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selected}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="glass-panel rounded-lg p-4 w-full max-w-xs space-y-3"
        >
          {/* Input shape */}
          <div className="text-center">
            <span className="text-[10px] text-muted-foreground">Input:</span>{' '}
            <span className="text-xs font-mono text-foreground">{arch.inputShape}</span>
          </div>

          {/* Layer diagram */}
          <div className="flex flex-col gap-1">
            {arch.layers.map((layer, i) => (
              <motion.div
                key={`${selected}-${i}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-2"
              >
                <div
                  className="h-6 rounded flex items-center px-2 flex-1"
                  style={{ backgroundColor: layer.color }}
                >
                  <Layers className="w-3 h-3 text-foreground/70 mr-1.5 flex-shrink-0" />
                  <span className="text-[10px] font-mono text-foreground">{layer.name}</span>
                </div>
                {i < arch.layers.length - 1 && (
                  <ArrowRight className="w-3 h-3 text-muted-foreground/40 flex-shrink-0" />
                )}
              </motion.div>
            ))}
          </div>

          {/* Param counter */}
          <div className="text-center border-t border-border pt-2">
            <div className="text-lg font-mono font-bold text-primary">
              {formatParams(animatedParams)}
            </div>
            <div className="text-[10px] text-muted-foreground">parameters</div>
          </div>

          {/* Use case */}
          <div className="text-center">
            <p className="text-[10px] text-muted-foreground">{arch.description}</p>
            <p className="text-xs font-medium text-foreground/80 mt-1">{arch.useCase}</p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Exercise hint */}
      {!exerciseDone && (
        <p className="text-[10px] text-muted-foreground/50">
          View all 3 architectures to complete ({visitedTabs.size}/3)
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
