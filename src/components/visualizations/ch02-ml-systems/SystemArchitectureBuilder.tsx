'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Database,
  Brain,
  Shield,
  BarChart3,
  Monitor,
  Smartphone,
  RotateCcw,
} from 'lucide-react';

interface SystemArchitectureBuilderProps {
  activeSection: number;
  onExerciseComplete: () => void;
}

const BLOCKS = [
  { id: 'data-store', label: 'Data Store', icon: Database, color: 'rgba(74,106,255,0.6)' },
  { id: 'feature-store', label: 'Feature Store', icon: BarChart3, color: 'rgba(34,197,94,0.6)' },
  { id: 'model-server', label: 'Model Server', icon: Brain, color: 'rgba(168,85,247,0.6)' },
  { id: 'api-gateway', label: 'API Gateway', icon: Shield, color: 'rgba(249,115,22,0.6)' },
  { id: 'monitor', label: 'Monitor', icon: Monitor, color: 'rgba(236,72,153,0.6)' },
  { id: 'client', label: 'Client', icon: Smartphone, color: 'rgba(14,165,233,0.6)' },
] as const;

const GRID_COLS = 3;
const GRID_ROWS = 3;
const GRID_SLOTS = GRID_COLS * GRID_ROWS;

const CONNECTIONS: [string, string][] = [
  ['data-store', 'feature-store'],
  ['feature-store', 'model-server'],
  ['model-server', 'api-gateway'],
  ['api-gateway', 'client'],
  ['monitor', 'model-server'],
  ['monitor', 'api-gateway'],
  ['data-store', 'model-server'],
];

export default function SystemArchitectureBuilder({
  activeSection,
  onExerciseComplete,
}: SystemArchitectureBuilderProps) {
  void activeSection;

  const [grid, setGrid] = useState<(string | null)[]>(Array(GRID_SLOTS).fill(null));
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [exerciseDone, setExerciseDone] = useState(false);
  const [placedCount, setPlacedCount] = useState(0);

  const placedBlocks = new Set(grid.filter(Boolean));

  const handleSlotClick = useCallback((slotIndex: number) => {
    if (!selectedBlock) {
      // If clicking an occupied slot, remove it
      setGrid((prev) => {
        if (prev[slotIndex]) {
          const next = [...prev];
          next[slotIndex] = null;
          return next;
        }
        return prev;
      });
      return;
    }

    setGrid((prev) => {
      const next = [...prev];
      // Remove block from previous position
      const prevIndex = next.indexOf(selectedBlock);
      if (prevIndex !== -1) next[prevIndex] = null;
      // Place at new position (replace if occupied)
      next[slotIndex] = selectedBlock;
      return next;
    });
    setSelectedBlock(null);
  }, [selectedBlock]);

  useEffect(() => {
    const count = grid.filter(Boolean).length;
    setPlacedCount(count);
    if (count >= 4 && !exerciseDone) {
      setExerciseDone(true);
      onExerciseComplete();
    }
  }, [grid, exerciseDone, onExerciseComplete]);

  const handleReset = useCallback(() => {
    setGrid(Array(GRID_SLOTS).fill(null));
    setSelectedBlock(null);
  }, []);

  // Calculate positions for connection lines
  const getSlotCenter = (slotIndex: number) => {
    const col = slotIndex % GRID_COLS;
    const row = Math.floor(slotIndex / GRID_COLS);
    return { x: col * 90 + 45, y: row * 80 + 40 };
  };

  const activeConnections = CONNECTIONS.filter(
    ([a, b]) => placedBlocks.has(a) && placedBlocks.has(b),
  );

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-3 p-4">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        System Architecture Builder
      </h4>

      {/* Block palette */}
      <div className="flex flex-wrap gap-1.5 justify-center max-w-xs">
        {BLOCKS.map((block) => {
          const Icon = block.icon;
          const isPlaced = placedBlocks.has(block.id);
          const isSelected = selectedBlock === block.id;
          return (
            <motion.button
              key={block.id}
              onClick={() => setSelectedBlock(isSelected ? null : block.id)}
              className={[
                'flex items-center gap-1.5 px-2 py-1.5 rounded-md text-[10px] font-medium border transition-colors',
                isSelected
                  ? 'border-primary/50 bg-primary/15 text-foreground ring-1 ring-primary/30'
                  : isPlaced
                    ? 'border-border/30 bg-muted/20 text-muted-foreground/50'
                    : 'border-border bg-muted/40 text-foreground hover:bg-muted/60',
              ].join(' ')}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              aria-label={`Select ${block.label} block`}
            >
              <Icon className="w-3 h-3" />
              {block.label}
            </motion.button>
          );
        })}
      </div>

      {/* Grid area */}
      <div className="relative glass-panel rounded-lg p-4">
        {/* SVG connections */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox={`0 0 ${GRID_COLS * 90} ${GRID_ROWS * 80}`}
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          {activeConnections.map(([a, b]) => {
            const idxA = grid.indexOf(a);
            const idxB = grid.indexOf(b);
            if (idxA === -1 || idxB === -1) return null;
            const posA = getSlotCenter(idxA);
            const posB = getSlotCenter(idxB);
            return (
              <line
                key={`${a}-${b}`}
                x1={posA.x}
                y1={posA.y}
                x2={posB.x}
                y2={posB.y}
                stroke="rgba(74,106,255,0.35)"
                strokeWidth="2"
                strokeDasharray="4 3"
              />
            );
          })}
        </svg>

        {/* Grid slots */}
        <div
          className="grid gap-2 relative z-10"
          style={{ gridTemplateColumns: `repeat(${GRID_COLS}, 80px)` }}
        >
          {Array.from({ length: GRID_SLOTS }).map((_, i) => {
            const blockId = grid[i];
            const block = BLOCKS.find((b) => b.id === blockId);
            const Icon = block?.icon;
            return (
              <motion.button
                key={i}
                onClick={() => handleSlotClick(i)}
                className={[
                  'w-20 h-16 rounded-md border-2 border-dashed flex flex-col items-center justify-center gap-1 transition-colors',
                  block
                    ? 'border-primary/30 bg-primary/10'
                    : selectedBlock
                      ? 'border-primary/20 bg-primary/5 hover:bg-primary/10 cursor-pointer'
                      : 'border-border/30 bg-muted/10',
                ].join(' ')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label={block ? `Slot ${i + 1}: ${block.label}` : `Empty slot ${i + 1}`}
              >
                <AnimatePresence mode="wait">
                  {block && Icon && (
                    <motion.div
                      key={block.id}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      className="flex flex-col items-center gap-0.5"
                    >
                      <Icon className="w-4 h-4 text-primary" />
                      <span className="text-[8px] font-medium text-foreground">
                        {block.label}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Reset + status */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleReset}
          className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Reset grid"
        >
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
        <span className="text-[10px] text-muted-foreground">
          {activeConnections.length} connection{activeConnections.length !== 1 ? 's' : ''} active
        </span>
      </div>

      {/* Exercise hint */}
      {!exerciseDone && (
        <p className="text-[10px] text-muted-foreground/50">
          Place at least 4 blocks to complete ({placedCount}/4)
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
