'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Network } from 'lucide-react';

interface Props {
  activeSection: number;
  onExerciseComplete: () => void;
}

interface Node {
  id: string;
  label: string;
  color: string;
}

interface Edge {
  from: string;
  to: string;
}

const NODES: Node[] = [
  { id: 'training', label: 'Training', color: 'rgb(59,130,246)' },
  { id: 'inference', label: 'Inference', color: 'rgb(59,130,246)' },
  { id: 'data', label: 'Data', color: 'rgb(34,197,94)' },
  { id: 'models', label: 'Models', color: 'rgb(168,85,247)' },
  { id: 'optimization', label: 'Optimization', color: 'rgb(245,158,11)' },
  { id: 'hardware', label: 'Hardware', color: 'rgb(239,68,68)' },
  { id: 'deployment', label: 'Deployment', color: 'rgb(6,182,212)' },
  { id: 'security', label: 'Security', color: 'rgb(239,68,68)' },
  { id: 'fairness', label: 'Fairness', color: 'rgb(168,85,247)' },
  { id: 'monitoring', label: 'Monitoring', color: 'rgb(6,182,212)' },
  { id: 'frameworks', label: 'Frameworks', color: 'rgb(34,197,94)' },
  { id: 'efficiency', label: 'Efficiency', color: 'rgb(245,158,11)' },
  { id: 'sustainability', label: 'Sustainability', color: 'rgb(34,197,94)' },
  { id: 'benchmarks', label: 'Benchmarks', color: 'rgb(245,158,11)' },
  { id: 'applications', label: 'Applications', color: 'rgb(59,130,246)' },
];

const EDGES: Edge[] = [
  { from: 'data', to: 'training' },
  { from: 'training', to: 'models' },
  { from: 'models', to: 'inference' },
  { from: 'models', to: 'optimization' },
  { from: 'optimization', to: 'efficiency' },
  { from: 'optimization', to: 'hardware' },
  { from: 'hardware', to: 'training' },
  { from: 'hardware', to: 'inference' },
  { from: 'inference', to: 'deployment' },
  { from: 'deployment', to: 'monitoring' },
  { from: 'deployment', to: 'security' },
  { from: 'monitoring', to: 'training' },
  { from: 'models', to: 'fairness' },
  { from: 'frameworks', to: 'training' },
  { from: 'frameworks', to: 'models' },
  { from: 'training', to: 'sustainability' },
  { from: 'hardware', to: 'benchmarks' },
  { from: 'benchmarks', to: 'efficiency' },
  { from: 'deployment', to: 'applications' },
  { from: 'fairness', to: 'applications' },
];

const CX = 175;
const CY = 145;
const RADIUS = 120;

export default function KnowledgeMap({ activeSection, onExerciseComplete }: Props) {
  void activeSection;
  const [selected, setSelected] = useState<string | null>(null);
  const [viewed, setViewed] = useState<Set<string>>(new Set());
  const [exerciseDone, setExerciseDone] = useState(false);

  const positions = useMemo(() => {
    const pos: Record<string, { x: number; y: number }> = {};
    NODES.forEach((node, i) => {
      const angle = (i / NODES.length) * Math.PI * 2 - Math.PI / 2;
      pos[node.id] = {
        x: CX + Math.cos(angle) * RADIUS,
        y: CY + Math.sin(angle) * RADIUS,
      };
    });
    return pos;
  }, []);

  const connectedNodes = useMemo(() => {
    if (!selected) return new Set<string>();
    const connected = new Set<string>();
    connected.add(selected);
    EDGES.forEach((e) => {
      if (e.from === selected) connected.add(e.to);
      if (e.to === selected) connected.add(e.from);
    });
    return connected;
  }, [selected]);

  const handleClick = useCallback((id: string) => {
    setSelected((prev) => (prev === id ? null : id));
    setViewed((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  useEffect(() => {
    if (viewed.size >= 4 && !exerciseDone) {
      setExerciseDone(true);
      onExerciseComplete();
    }
  }, [viewed.size, exerciseDone, onExerciseComplete]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-2 p-4">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
        <Network className="w-3 h-3" /> Knowledge Map
      </h4>

      <div className="w-full max-w-sm">
        <svg viewBox="0 0 350 290" className="w-full" aria-label="Knowledge graph connecting ML concepts">
          {/* Edges */}
          {EDGES.map((edge) => {
            const from = positions[edge.from];
            const to = positions[edge.to];
            const isHighlighted = selected && (connectedNodes.has(edge.from) && connectedNodes.has(edge.to));
            const isSelected = selected !== null;
            return (
              <line
                key={`${edge.from}-${edge.to}`}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={isHighlighted ? 'rgba(74,106,255,0.5)' : 'rgba(74,106,255,0.1)'}
                strokeWidth={isHighlighted ? 1.5 : 0.5}
                opacity={isSelected && !isHighlighted ? 0.2 : 1}
              />
            );
          })}
          {/* Nodes */}
          {NODES.map((node) => {
            const pos = positions[node.id];
            const isSelected = selected === node.id;
            const isConnected = connectedNodes.has(node.id);
            const hasSelection = selected !== null;
            const dimmed = hasSelection && !isConnected;
            return (
              <g
                key={node.id}
                className="cursor-pointer"
                onClick={() => handleClick(node.id)}
                opacity={dimmed ? 0.2 : 1}
              >
                {isSelected && (
                  <circle cx={pos.x} cy={pos.y} r="18" fill="none" stroke={node.color} strokeWidth="1" opacity={0.3}>
                    <animate attributeName="r" values="18;22;18" dur="1.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.3;0;0.3" dur="1.5s" repeatCount="indefinite" />
                  </circle>
                )}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={isSelected ? 14 : isConnected ? 12 : 10}
                  fill={`${node.color}30`}
                  stroke={isSelected ? node.color : `${node.color}60`}
                  strokeWidth={isSelected ? 2 : 1}
                />
                <text
                  x={pos.x}
                  y={pos.y + 1}
                  fontSize="6.5"
                  fill="white"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontFamily="system-ui"
                  fontWeight={isSelected ? 'bold' : 'normal'}
                  className="pointer-events-none select-none"
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {selected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <p className="text-xs text-foreground font-semibold">
            {NODES.find((n) => n.id === selected)?.label}
          </p>
          <p className="text-[10px] text-muted-foreground">
            Connected to: {EDGES.filter((e) => e.from === selected || e.to === selected)
              .map((e) => e.from === selected ? e.to : e.from)
              .map((id) => NODES.find((n) => n.id === id)?.label)
              .join(', ')}
          </p>
        </motion.div>
      )}

      {!exerciseDone && (
        <p className="text-[10px] text-muted-foreground/50">Click nodes to explore ({viewed.size}/4)</p>
      )}
      {exerciseDone && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] text-primary/60">
          Exercise complete
        </motion.p>
      )}
    </div>
  );
}
