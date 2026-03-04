'use client';

import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Minus, Plus, ChevronDown } from 'lucide-react';

/* -------------------------------------------------------------------------- */
/*  Types & Constants                                                         */
/* -------------------------------------------------------------------------- */

interface NeuralNetworkPlaygroundProps {
  activeSection: number;
  onExerciseComplete: () => void;
}

type Activation = 'relu' | 'sigmoid' | 'tanh';

const ACTIVATION_OPTIONS: { value: Activation; label: string }[] = [
  { value: 'relu', label: 'ReLU' },
  { value: 'sigmoid', label: 'Sigmoid' },
  { value: 'tanh', label: 'Tanh' },
];

const INPUT_NEURONS = 2;
const OUTPUT_NEURONS = 1;

const NEURON_RADIUS = 14;
const LAYER_GAP_X = 100;
const NEURON_GAP_Y = 44;

const PRIMARY_COLOR = 'hsl(228 100% 64%)';

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

/** Build the full layer structure: [input, ...hidden, output] */
function buildLayers(
  hiddenCount: number,
  neuronsPerLayer: number,
): number[] {
  const layers: number[] = [INPUT_NEURONS];
  for (let i = 0; i < hiddenCount; i++) {
    layers.push(neuronsPerLayer);
  }
  layers.push(OUTPUT_NEURONS);
  return layers;
}

/** Position neurons in a centered column. Returns {cx, cy}[] for each neuron in a layer. */
function layoutNeurons(
  layers: number[],
  width: number,
  height: number,
): { cx: number; cy: number }[][] {
  const totalLayerWidth = (layers.length - 1) * LAYER_GAP_X;
  const startX = (width - totalLayerWidth) / 2;

  return layers.map((count, li) => {
    const x = startX + li * LAYER_GAP_X;
    const totalHeight = (count - 1) * NEURON_GAP_Y;
    const startY = (height - totalHeight) / 2;

    return Array.from({ length: count }, (_, ni) => ({
      cx: x,
      cy: startY + ni * NEURON_GAP_Y,
    }));
  });
}

/** Pseudo-random weight for a connection (deterministic from indices). */
function pseudoWeight(li: number, ni: number, nj: number): number {
  const seed = (li * 97 + ni * 31 + nj * 17) % 200;
  return (seed - 100) / 100; // -1..1
}

/** Map a weight -1..1 to a color (blue for negative, orange for positive). */
function weightColor(w: number): string {
  if (w >= 0) {
    const alpha = 0.15 + w * 0.55;
    return `rgba(74, 106, 255, ${alpha})`;
  }
  const alpha = 0.15 + Math.abs(w) * 0.55;
  return `rgba(255, 140, 60, ${alpha})`;
}

function weightWidth(w: number): number {
  return 0.5 + Math.abs(w) * 2;
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export default function NeuralNetworkPlayground({
  // activeSection drives highlighting in scrollytelling layouts;
  // this playground is user-driven so the prop is accepted but unused.
  activeSection,
  onExerciseComplete,
}: NeuralNetworkPlaygroundProps) {
  void activeSection;
  const [hiddenLayers, setHiddenLayers] = useState(2);
  const [neuronsPerLayer, setNeuronsPerLayer] = useState(4);
  const [activation, setActivation] = useState<Activation>('relu');
  const [isAnimating, setIsAnimating] = useState(false);
  const [animLayer, setAnimLayer] = useState(-1);
  const [exerciseDone, setExerciseDone] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const animTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* --- Derived layout --------------------------------------------------- */
  const layers = useMemo(
    () => buildLayers(hiddenLayers, neuronsPerLayer),
    [hiddenLayers, neuronsPerLayer],
  );

  const svgWidth = Math.max(320, (layers.length - 1) * LAYER_GAP_X + 80);
  const maxNeurons = Math.max(...layers);
  const svgHeight = Math.max(180, (maxNeurons - 1) * NEURON_GAP_Y + 60);

  const positions = useMemo(
    () => layoutNeurons(layers, svgWidth, svgHeight),
    [layers, svgWidth, svgHeight],
  );

  /* --- Exercise completion ---------------------------------------------- */
  const markInteracted = useCallback(() => {
    if (!hasInteracted) {
      setHasInteracted(true);
    }
  }, [hasInteracted]);

  useEffect(() => {
    if (hasInteracted && !exerciseDone) {
      setExerciseDone(true);
      onExerciseComplete();
    }
  }, [hasInteracted, exerciseDone, onExerciseComplete]);

  /* --- Controls --------------------------------------------------------- */
  const changeHiddenLayers = useCallback(
    (delta: number) => {
      setHiddenLayers((prev) => Math.min(4, Math.max(1, prev + delta)));
      markInteracted();
    },
    [markInteracted],
  );

  const changeNeurons = useCallback(
    (delta: number) => {
      setNeuronsPerLayer((prev) => Math.min(6, Math.max(2, prev + delta)));
      markInteracted();
    },
    [markInteracted],
  );

  const changeActivation = useCallback(
    (act: Activation) => {
      setActivation(act);
      setShowDropdown(false);
      markInteracted();
    },
    [markInteracted],
  );

  /* --- Forward pass animation ------------------------------------------- */
  const runForwardPass = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setAnimLayer(0);
    markInteracted();

    let current = 0;
    const step = () => {
      current += 1;
      if (current >= layers.length) {
        setAnimLayer(-1);
        setIsAnimating(false);
        return;
      }
      setAnimLayer(current);
      animTimerRef.current = setTimeout(step, 350);
    };
    animTimerRef.current = setTimeout(step, 350);
  }, [isAnimating, layers.length, markInteracted]);

  useEffect(() => {
    return () => {
      if (animTimerRef.current) clearTimeout(animTimerRef.current);
    };
  }, []);

  /* --- Activation label mapping ----------------------------------------- */
  const activationLabel = ACTIVATION_OPTIONS.find(
    (o) => o.value === activation,
  )?.label;

  /* --- Layer labels ------------------------------------------------------ */
  const layerLabels = useMemo(() => {
    const labels: string[] = ['Input'];
    for (let i = 0; i < hiddenLayers; i++) {
      labels.push(`Hidden ${i + 1}`);
    }
    labels.push('Output');
    return labels;
  }, [hiddenLayers]);

  /* --- Render ----------------------------------------------------------- */
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-3 p-4">
      {/* Title */}
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Neural Network
      </h4>

      {/* SVG Visualization */}
      <div className="w-full flex-1 min-h-0 flex items-center justify-center overflow-hidden">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full max-h-full"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label={`Neural network with ${INPUT_NEURONS} input neurons, ${hiddenLayers} hidden layers of ${neuronsPerLayer} neurons, and ${OUTPUT_NEURONS} output neuron`}
        >
          {/* Connections */}
          {positions.map((layerPos, li) => {
            if (li >= positions.length - 1) return null;
            const nextLayerPos = positions[li + 1];
            return layerPos.map((from, ni) =>
              nextLayerPos.map((to, nj) => {
                const w = pseudoWeight(li, ni, nj);
                return (
                  <line
                    key={`c-${li}-${ni}-${nj}`}
                    x1={from.cx}
                    y1={from.cy}
                    x2={to.cx}
                    y2={to.cy}
                    stroke={weightColor(w)}
                    strokeWidth={weightWidth(w)}
                  />
                );
              }),
            );
          })}

          {/* Layer labels */}
          {positions.map((layerPos, li) => {
            const x = layerPos[0]?.cx ?? 0;
            return (
              <text
                key={`label-${li}`}
                x={x}
                y={16}
                textAnchor="middle"
                className="fill-muted-foreground"
                style={{ fontSize: '8px', fontFamily: 'monospace' }}
              >
                {layerLabels[li]}
              </text>
            );
          })}

          {/* Neurons */}
          {positions.map((layerPos, li) =>
            layerPos.map((pos, ni) => {
              const isAnimated = animLayer === li;
              const isInput = li === 0;
              const isOutput = li === layers.length - 1;
              return (
                <g key={`n-${li}-${ni}`}>
                  {/* Glow behind animated neurons */}
                  {isAnimated && (
                    <circle
                      cx={pos.cx}
                      cy={pos.cy}
                      r={NEURON_RADIUS + 6}
                      fill="none"
                      stroke={PRIMARY_COLOR}
                      strokeWidth="2"
                      opacity="0.4"
                    >
                      <animate
                        attributeName="opacity"
                        values="0.4;0.1;0.4"
                        dur="0.7s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  )}
                  {/* Neuron circle */}
                  <circle
                    cx={pos.cx}
                    cy={pos.cy}
                    r={NEURON_RADIUS}
                    fill={
                      isAnimated
                        ? 'rgba(74, 106, 255, 0.3)'
                        : isInput
                          ? 'rgba(74, 106, 255, 0.1)'
                          : isOutput
                            ? 'rgba(74, 200, 130, 0.12)'
                            : 'rgba(74, 106, 255, 0.06)'
                    }
                    stroke={
                      isAnimated
                        ? PRIMARY_COLOR
                        : isInput
                          ? 'rgba(74, 106, 255, 0.35)'
                          : isOutput
                            ? 'rgba(74, 200, 130, 0.35)'
                            : 'rgba(74, 106, 255, 0.2)'
                    }
                    strokeWidth="1.5"
                  />
                  {/* Label inside neuron */}
                  <text
                    x={pos.cx}
                    y={pos.cy + 3}
                    textAnchor="middle"
                    className="fill-muted-foreground"
                    style={{ fontSize: '7px', fontFamily: 'monospace' }}
                  >
                    {isInput
                      ? `x${ni + 1}`
                      : isOutput
                        ? 'y'
                        : `h${ni + 1}`}
                  </text>
                </g>
              );
            }),
          )}

          {/* Activation function label on hidden layers */}
          {positions.slice(1, -1).map((layerPos, hi) => {
            const x = layerPos[0]?.cx ?? 0;
            const maxY = Math.max(...layerPos.map((p) => p.cy));
            return (
              <text
                key={`act-${hi}`}
                x={x}
                y={maxY + NEURON_RADIUS + 14}
                textAnchor="middle"
                className="fill-primary/50"
                style={{ fontSize: '7px', fontFamily: 'monospace' }}
              >
                {activation}
              </text>
            );
          })}
        </svg>
      </div>

      {/* Forward pass button */}
      <motion.button
        onClick={runForwardPass}
        disabled={isAnimating}
        className={[
          'flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-medium',
          'border transition-colors',
          isAnimating
            ? 'border-primary/20 text-muted-foreground cursor-wait'
            : 'border-primary/30 text-primary hover:bg-primary/10',
        ].join(' ')}
        whileHover={isAnimating ? {} : { scale: 1.04 }}
        whileTap={isAnimating ? {} : { scale: 0.96 }}
        aria-label="Run forward pass animation"
      >
        <Play className="w-3 h-3" />
        {isAnimating ? 'Propagating...' : 'Forward Pass'}
      </motion.button>

      {/* Controls */}
      <div className="glass-panel rounded-lg p-3 w-full max-w-xs space-y-3">
        {/* Hidden layers */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Hidden layers</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => changeHiddenLayers(-1)}
              disabled={hiddenLayers <= 1}
              className="w-6 h-6 rounded flex items-center justify-center border border-border hover:bg-muted/50 disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Remove hidden layer"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="text-sm font-mono text-foreground w-4 text-center">
              {hiddenLayers}
            </span>
            <button
              onClick={() => changeHiddenLayers(1)}
              disabled={hiddenLayers >= 4}
              className="w-6 h-6 rounded flex items-center justify-center border border-border hover:bg-muted/50 disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Add hidden layer"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Neurons per layer */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Neurons / layer</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => changeNeurons(-1)}
              disabled={neuronsPerLayer <= 2}
              className="w-6 h-6 rounded flex items-center justify-center border border-border hover:bg-muted/50 disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Decrease neurons per layer"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="text-sm font-mono text-foreground w-4 text-center">
              {neuronsPerLayer}
            </span>
            <button
              onClick={() => changeNeurons(1)}
              disabled={neuronsPerLayer >= 6}
              className="w-6 h-6 rounded flex items-center justify-center border border-border hover:bg-muted/50 disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Increase neurons per layer"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Activation function */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Activation</span>
          <div className="relative">
            <button
              onClick={() => setShowDropdown((prev) => !prev)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-border text-xs font-mono text-foreground hover:bg-muted/50"
              aria-haspopup="listbox"
              aria-expanded={showDropdown}
            >
              {activationLabel}
              <ChevronDown className="w-3 h-3 text-muted-foreground" />
            </button>
            <AnimatePresence>
              {showDropdown && (
                <motion.ul
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  role="listbox"
                  className="absolute right-0 top-full mt-1 glass-panel rounded-md overflow-hidden z-20 min-w-[80px]"
                >
                  {ACTIVATION_OPTIONS.map((opt) => (
                    <li
                      key={opt.value}
                      role="option"
                      aria-selected={opt.value === activation}
                      className={[
                        'px-3 py-1.5 text-xs font-mono cursor-pointer transition-colors',
                        opt.value === activation
                          ? 'bg-primary/15 text-primary'
                          : 'text-foreground hover:bg-muted/50',
                      ].join(' ')}
                      onClick={() => changeActivation(opt.value)}
                    >
                      {opt.label}
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Exercise hint */}
      {!exerciseDone && (
        <p className="text-[10px] text-muted-foreground/50">
          Adjust any control to complete this exercise
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
