'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, ChevronDown } from 'lucide-react';

interface MLPerfDashboardProps {
  activeSection: number;
  onExerciseComplete: () => void;
}

type BenchCategory = 'training' | 'inference';

interface BenchmarkEntry {
  model: string;
  hardware: string;
  throughput: number;
  unit: string;
}

const TRAINING_DATA: BenchmarkEntry[] = [
  { model: 'ResNet-50', hardware: 'A100 x8', throughput: 12800, unit: 'img/s' },
  { model: 'ResNet-50', hardware: 'H100 x8', throughput: 24300, unit: 'img/s' },
  { model: 'ResNet-50', hardware: 'TPU v4 x8', throughput: 19500, unit: 'img/s' },
  { model: 'BERT-Large', hardware: 'A100 x8', throughput: 380, unit: 'seq/s' },
  { model: 'BERT-Large', hardware: 'H100 x8', throughput: 720, unit: 'seq/s' },
  { model: 'BERT-Large', hardware: 'TPU v4 x8', throughput: 550, unit: 'seq/s' },
  { model: 'RetinaNet', hardware: 'A100 x8', throughput: 640, unit: 'img/s' },
  { model: 'RetinaNet', hardware: 'H100 x8', throughput: 1150, unit: 'img/s' },
  { model: 'DLRM', hardware: 'A100 x8', throughput: 2100000, unit: 'samples/s' },
  { model: 'DLRM', hardware: 'H100 x8', throughput: 3800000, unit: 'samples/s' },
];

const INFERENCE_DATA: BenchmarkEntry[] = [
  { model: 'ResNet-50', hardware: 'A100', throughput: 42000, unit: 'img/s' },
  { model: 'ResNet-50', hardware: 'H100', throughput: 68000, unit: 'img/s' },
  { model: 'ResNet-50', hardware: 'CPU (Xeon)', throughput: 3200, unit: 'img/s' },
  { model: 'ResNet-50', hardware: 'Edge (Jetson)', throughput: 850, unit: 'img/s' },
  { model: 'BERT-Large', hardware: 'A100', throughput: 5400, unit: 'seq/s' },
  { model: 'BERT-Large', hardware: 'H100', throughput: 9200, unit: 'seq/s' },
  { model: 'BERT-Large', hardware: 'CPU (Xeon)', throughput: 420, unit: 'seq/s' },
  { model: 'RetinaNet', hardware: 'A100', throughput: 1800, unit: 'img/s' },
  { model: 'RetinaNet', hardware: 'H100', throughput: 3100, unit: 'img/s' },
  { model: 'DLRM', hardware: 'A100', throughput: 580000, unit: 'samples/s' },
  { model: 'DLRM', hardware: 'H100', throughput: 1020000, unit: 'samples/s' },
];

const HARDWARE_COLORS: Record<string, string> = {
  'A100 x8': 'rgba(34,197,94,0.6)',
  'H100 x8': 'rgba(74,106,255,0.6)',
  'TPU v4 x8': 'rgba(168,85,247,0.6)',
  'A100': 'rgba(34,197,94,0.6)',
  'H100': 'rgba(74,106,255,0.6)',
  'CPU (Xeon)': 'rgba(249,115,22,0.6)',
  'Edge (Jetson)': 'rgba(236,72,153,0.6)',
};

export default function MLPerfDashboard({
  activeSection,
  onExerciseComplete,
}: MLPerfDashboardProps) {
  void activeSection;

  const [category, setCategory] = useState<BenchCategory>('training');
  const [selectedModel, setSelectedModel] = useState<string>('ResNet-50');
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [interactionCount, setInteractionCount] = useState(0);
  const [exerciseDone, setExerciseDone] = useState(false);

  const interact = useCallback(() => {
    setInteractionCount((c) => c + 1);
  }, []);

  useEffect(() => {
    if (interactionCount >= 3 && !exerciseDone) {
      setExerciseDone(true);
      onExerciseComplete();
    }
  }, [interactionCount, exerciseDone, onExerciseComplete]);

  const data = category === 'training' ? TRAINING_DATA : INFERENCE_DATA;
  const models = useMemo(() => [...new Set(data.map((d) => d.model))], [data]);

  const filteredData = useMemo(
    () => data.filter((d) => d.model === selectedModel),
    [data, selectedModel],
  );

  const maxThroughput = useMemo(
    () => Math.max(...filteredData.map((d) => d.throughput), 1),
    [filteredData],
  );

  const formatThroughput = (val: number) => {
    if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M`;
    if (val >= 1_000) return `${(val / 1_000).toFixed(1)}K`;
    return String(val);
  };

  const handleCategoryChange = useCallback(
    (cat: BenchCategory) => {
      setCategory(cat);
      // Reset to first model of new category
      const newData = cat === 'training' ? TRAINING_DATA : INFERENCE_DATA;
      const firstModel = [...new Set(newData.map((d) => d.model))][0];
      setSelectedModel(firstModel);
      interact();
    },
    [interact],
  );

  const handleModelSelect = useCallback(
    (model: string) => {
      setSelectedModel(model);
      setShowModelDropdown(false);
      interact();
    },
    [interact],
  );

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-3 p-4">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        MLPerf Dashboard
      </h4>

      {/* Category toggle */}
      <div className="flex gap-1 glass-panel rounded-lg p-1">
        {(['training', 'inference'] as BenchCategory[]).map((cat) => (
          <motion.button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={[
              'px-3 py-1.5 rounded-md text-xs font-medium transition-colors capitalize',
              category === cat
                ? 'bg-primary/15 text-primary border border-primary/30'
                : 'text-muted-foreground hover:text-foreground border border-transparent',
            ].join(' ')}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {cat}
          </motion.button>
        ))}
      </div>

      {/* Model selector */}
      <div className="relative">
        <button
          onClick={() => {
            setShowModelDropdown((p) => !p);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border text-xs font-mono text-foreground hover:bg-muted/50"
          aria-haspopup="listbox"
          aria-expanded={showModelDropdown}
        >
          <BarChart3 className="w-3 h-3 text-muted-foreground" />
          {selectedModel}
          <ChevronDown className="w-3 h-3 text-muted-foreground" />
        </button>
        <AnimatePresence>
          {showModelDropdown && (
            <motion.ul
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              role="listbox"
              className="absolute left-0 top-full mt-1 glass-panel rounded-md overflow-hidden z-20 min-w-[140px]"
            >
              {models.map((m) => (
                <li
                  key={m}
                  role="option"
                  aria-selected={m === selectedModel}
                  className={[
                    'px-3 py-1.5 text-xs font-mono cursor-pointer transition-colors',
                    m === selectedModel
                      ? 'bg-primary/15 text-primary'
                      : 'text-foreground hover:bg-muted/50',
                  ].join(' ')}
                  onClick={() => handleModelSelect(m)}
                >
                  {m}
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      {/* Bar chart */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${category}-${selectedModel}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="glass-panel rounded-lg p-3 w-full max-w-xs space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
              Throughput Comparison
            </span>
            <span className="text-[9px] text-muted-foreground font-mono">
              {filteredData[0]?.unit ?? ''}
            </span>
          </div>

          <div className="space-y-2">
            {filteredData.map((entry, i) => (
              <motion.div
                key={entry.hardware}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-2"
              >
                <span className="text-[10px] text-muted-foreground w-20 flex-shrink-0 truncate">
                  {entry.hardware}
                </span>
                <div className="flex-1 h-5 bg-muted/15 rounded overflow-hidden">
                  <motion.div
                    className="h-full rounded flex items-center px-1.5"
                    style={{
                      backgroundColor: HARDWARE_COLORS[entry.hardware] ?? 'rgba(74,106,255,0.4)',
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${(entry.throughput / maxThroughput) * 100}%` }}
                    transition={{ duration: 0.5, delay: i * 0.08, ease: 'easeOut' }}
                  >
                    <span className="text-[8px] font-mono text-foreground whitespace-nowrap">
                      {formatThroughput(entry.throughput)}
                    </span>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredData.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-4">
              No data available for this combination.
            </p>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Hardware legend */}
      <div className="flex flex-wrap gap-2 justify-center">
        {Object.entries(HARDWARE_COLORS)
          .filter(([hw]) => filteredData.some((d) => d.hardware === hw))
          .map(([hw, color]) => (
            <div key={hw} className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-[8px] text-muted-foreground">{hw}</span>
            </div>
          ))}
      </div>

      {/* Exercise hint */}
      {!exerciseDone && (
        <p className="text-[10px] text-muted-foreground/50">
          Switch views and models to explore ({interactionCount}/3)
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
