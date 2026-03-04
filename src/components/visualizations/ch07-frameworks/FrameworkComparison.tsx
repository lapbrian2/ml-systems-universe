'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';

interface FrameworkComparisonProps {
  activeSection: number;
  onExerciseComplete: () => void;
}

interface Framework {
  id: string;
  name: string;
  color: string;
  scores: Record<string, number>;
}

const DIMENSIONS = ['Ease of Use', 'Performance', 'Community', 'Production', 'Research'];

const FRAMEWORKS: Framework[] = [
  {
    id: 'pytorch',
    name: 'PyTorch',
    color: 'rgba(234,88,12,0.7)',
    scores: { 'Ease of Use': 90, 'Performance': 85, 'Community': 95, 'Production': 80, 'Research': 98 },
  },
  {
    id: 'tensorflow',
    name: 'TensorFlow',
    color: 'rgba(74,106,255,0.7)',
    scores: { 'Ease of Use': 70, 'Performance': 90, 'Community': 90, 'Production': 95, 'Research': 75 },
  },
  {
    id: 'jax',
    name: 'JAX',
    color: 'rgba(34,197,94,0.7)',
    scores: { 'Ease of Use': 55, 'Performance': 95, 'Community': 60, 'Production': 50, 'Research': 92 },
  },
];

export default function FrameworkComparison({
  activeSection,
  onExerciseComplete,
}: FrameworkComparisonProps) {
  void activeSection;

  const [highlighted, setHighlighted] = useState<string | null>(null);
  const [clickedFrameworks, setClickedFrameworks] = useState<Set<string>>(new Set());
  const [exerciseDone, setExerciseDone] = useState(false);

  const handleFrameworkClick = useCallback((id: string) => {
    setHighlighted((prev) => (prev === id ? null : id));
    setClickedFrameworks((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  useEffect(() => {
    if (clickedFrameworks.size >= 3 && !exerciseDone) {
      setExerciseDone(true);
      onExerciseComplete();
    }
  }, [clickedFrameworks.size, exerciseDone, onExerciseComplete]);

  // Radar chart SVG math
  const cx = 130;
  const cy = 120;
  const radius = 85;
  const angleStep = (2 * Math.PI) / DIMENSIONS.length;

  const getPoint = useCallback(
    (dimIndex: number, value: number) => {
      const angle = -Math.PI / 2 + dimIndex * angleStep;
      const r = (value / 100) * radius;
      return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
    },
    [angleStep],
  );

  const polygonPoints = useMemo(
    () =>
      FRAMEWORKS.map((fw) => ({
        id: fw.id,
        points: DIMENSIONS.map((dim, i) => {
          const pt = getPoint(i, fw.scores[dim]);
          return `${pt.x},${pt.y}`;
        }).join(' '),
      })),
    [getPoint],
  );

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-3 p-4">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Framework Comparison
      </h4>

      {/* Radar chart */}
      <div className="glass-panel rounded-lg p-2 w-full max-w-xs">
        <svg viewBox="0 0 260 240" className="w-full" preserveAspectRatio="xMidYMid meet">
          {/* Grid circles */}
          {[20, 40, 60, 80, 100].map((pct) => {
            const r = (pct / 100) * radius;
            return (
              <circle
                key={`grid-${pct}`}
                cx={cx}
                cy={cy}
                r={r}
                fill="none"
                stroke="rgba(74,106,255,0.08)"
                strokeWidth="1"
              />
            );
          })}

          {/* Axis lines and labels */}
          {DIMENSIONS.map((dim, i) => {
            const end = getPoint(i, 100);
            const labelPt = getPoint(i, 118);
            return (
              <g key={dim}>
                <line
                  x1={cx}
                  y1={cy}
                  x2={end.x}
                  y2={end.y}
                  stroke="rgba(74,106,255,0.12)"
                  strokeWidth="1"
                />
                <text
                  x={labelPt.x}
                  y={labelPt.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-muted-foreground"
                  style={{ fontSize: '7px', fontFamily: 'monospace' }}
                >
                  {dim}
                </text>
              </g>
            );
          })}

          {/* Framework polygons */}
          {polygonPoints.map((poly) => {
            const fw = FRAMEWORKS.find((f) => f.id === poly.id)!;
            const isHighlighted = highlighted === fw.id;
            const isDimmed = highlighted !== null && !isHighlighted;
            return (
              <motion.polygon
                key={poly.id}
                points={poly.points}
                fill={fw.color.replace('0.7', isDimmed ? '0.05' : '0.15')}
                stroke={fw.color.replace('0.7', isDimmed ? '0.15' : '0.7')}
                strokeWidth={isHighlighted ? 2.5 : 1.5}
                animate={{
                  opacity: isDimmed ? 0.3 : 1,
                  strokeWidth: isHighlighted ? 2.5 : 1.5,
                }}
                transition={{ duration: 0.2 }}
              />
            );
          })}

          {/* Data points */}
          {FRAMEWORKS.map((fw) => {
            const isDimmed = highlighted !== null && highlighted !== fw.id;
            return DIMENSIONS.map((dim, i) => {
              const pt = getPoint(i, fw.scores[dim]);
              return (
                <motion.circle
                  key={`${fw.id}-${dim}`}
                  cx={pt.x}
                  cy={pt.y}
                  r={3}
                  fill={fw.color}
                  animate={{ opacity: isDimmed ? 0.2 : 1 }}
                  transition={{ duration: 0.2 }}
                />
              );
            });
          })}
        </svg>
      </div>

      {/* Framework selector buttons */}
      <div className="flex gap-2">
        {FRAMEWORKS.map((fw) => {
          const isHighlighted = highlighted === fw.id;
          return (
            <motion.button
              key={fw.id}
              onClick={() => handleFrameworkClick(fw.id)}
              className={[
                'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors',
                isHighlighted
                  ? 'border-primary/40 bg-primary/10 text-foreground'
                  : 'border-border text-muted-foreground hover:text-foreground hover:bg-muted/30',
              ].join(' ')}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              aria-pressed={isHighlighted}
            >
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: fw.color }}
              />
              {fw.name}
            </motion.button>
          );
        })}
      </div>

      {/* Score details when highlighted */}
      {highlighted && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel rounded-lg p-3 w-full max-w-xs"
        >
          <div className="space-y-1.5">
            {DIMENSIONS.map((dim) => {
              const fw = FRAMEWORKS.find((f) => f.id === highlighted)!;
              const score = fw.scores[dim];
              return (
                <div key={dim} className="flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground w-16 flex-shrink-0">
                    {dim}
                  </span>
                  <div className="flex-1 h-2 bg-muted/20 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: fw.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${score}%` }}
                      transition={{ duration: 0.4, delay: 0.05 }}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-foreground w-6 text-right">
                    {score}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Exercise hint */}
      {!exerciseDone && (
        <p className="text-[10px] text-muted-foreground/50">
          Click all 3 frameworks to compare ({clickedFrameworks.size}/3)
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
