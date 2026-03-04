'use client';

import {
  useState,
  useRef,
  useCallback,
  useEffect,
  useMemo,
  Suspense,
} from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Line } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, Minus, Plus, ChevronDown } from 'lucide-react';

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

interface LossSurface3DProps {
  activeSection: number;
  onExerciseComplete: () => void;
}

type Optimizer = 'sgd' | 'adam';

const OPTIMIZER_OPTIONS: { value: Optimizer; label: string }[] = [
  { value: 'sgd', label: 'SGD' },
  { value: 'adam', label: 'Adam' },
];

/* -------------------------------------------------------------------------- */
/*  Loss function & gradient                                                  */
/* -------------------------------------------------------------------------- */

function lossFn(x: number, z: number): number {
  return (
    Math.sin(x * 0.8) * Math.cos(z * 0.8) * 2.0 +
    0.5 * Math.sin(x * 1.5 + 1.0) * Math.sin(z * 1.5) +
    0.08 * (x * x + z * z)
  );
}

function gradient(x: number, z: number): [number, number] {
  const eps = 0.01;
  const dx = (lossFn(x + eps, z) - lossFn(x - eps, z)) / (2.0 * eps);
  const dz = (lossFn(x, z + eps) - lossFn(x, z - eps)) / (2.0 * eps);
  return [dx, dz];
}

/* -------------------------------------------------------------------------- */
/*  Adam state                                                                */
/* -------------------------------------------------------------------------- */

interface AdamState {
  m: [number, number];
  v: [number, number];
  t: number;
}

function createAdamState(): AdamState {
  return { m: [0, 0], v: [0, 0], t: 0 };
}

function adamStep(
  pos: [number, number],
  grad: [number, number],
  lr: number,
  state: AdamState,
): { newPos: [number, number]; newState: AdamState } {
  const beta1 = 0.9;
  const beta2 = 0.999;
  const epsilon = 1e-8;
  const t = state.t + 1;

  const m: [number, number] = [
    beta1 * state.m[0] + (1 - beta1) * grad[0],
    beta1 * state.m[1] + (1 - beta1) * grad[1],
  ];
  const v: [number, number] = [
    beta2 * state.v[0] + (1 - beta2) * grad[0] * grad[0],
    beta2 * state.v[1] + (1 - beta2) * grad[1] * grad[1],
  ];

  const mHat: [number, number] = [
    m[0] / (1 - Math.pow(beta1, t)),
    m[1] / (1 - Math.pow(beta1, t)),
  ];
  const vHat: [number, number] = [
    v[0] / (1 - Math.pow(beta2, t)),
    v[1] / (1 - Math.pow(beta2, t)),
  ];

  const newPos: [number, number] = [
    pos[0] - lr * mHat[0] / (Math.sqrt(vHat[0]) + epsilon),
    pos[1] - lr * mHat[1] / (Math.sqrt(vHat[1]) + epsilon),
  ];

  return { newPos, newState: { m, v, t } };
}

/* -------------------------------------------------------------------------- */
/*  Surface mesh                                                              */
/* -------------------------------------------------------------------------- */

const SURFACE_RANGE = 5;
const SURFACE_SEGMENTS = 64;

function SurfaceMesh() {
  const meshRef = useRef<THREE.Mesh>(null);

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(
      SURFACE_RANGE * 2,
      SURFACE_RANGE * 2,
      SURFACE_SEGMENTS,
      SURFACE_SEGMENTS,
    );

    const posAttr = geo.attributes.position;
    const colors: number[] = [];

    let minY = Infinity;
    let maxY = -Infinity;

    // First pass: displace vertices
    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const z = posAttr.getY(i); // PlaneGeometry lies in XY, we rotate later
      const y = lossFn(x, z);
      posAttr.setZ(i, y);
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }

    // Second pass: color by height
    for (let i = 0; i < posAttr.count; i++) {
      const y = posAttr.getZ(i);
      const t = (y - minY) / (maxY - minY + 0.001);

      // Blue (low/valley) -> Purple (mid) -> Orange/Red (high/peak)
      const r = 0.1 + t * 0.75;
      const g = 0.15 + (1 - Math.abs(t - 0.4)) * 0.25;
      const b = 0.7 - t * 0.45;
      colors.push(r, g, b);
    }

    geo.setAttribute(
      'color',
      new THREE.Float32BufferAttribute(colors, 3),
    );
    geo.computeVertexNormals();

    return geo;
  }, []);

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      rotation={[-Math.PI / 2, 0, 0]}
      receiveShadow
    >
      <meshStandardMaterial
        vertexColors
        side={THREE.DoubleSide}
        transparent
        opacity={0.85}
        wireframe={false}
        roughness={0.6}
        metalness={0.1}
      />
    </mesh>
  );
}

/** Wireframe overlay for depth perception */
function SurfaceWireframe() {
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(
      SURFACE_RANGE * 2,
      SURFACE_RANGE * 2,
      24,
      24,
    );
    const posAttr = geo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const z = posAttr.getY(i);
      posAttr.setZ(i, lossFn(x, z));
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <mesh geometry={geometry} rotation={[-Math.PI / 2, 0, 0]}>
      <meshBasicMaterial
        wireframe
        color="#4a6aff"
        transparent
        opacity={0.06}
      />
    </mesh>
  );
}

/* -------------------------------------------------------------------------- */
/*  Gradient descent ball                                                     */
/* -------------------------------------------------------------------------- */

const INITIAL_POS: [number, number] = [3.5, 3.5];
const BALL_RADIUS = 0.12;
const TRAIL_MAX = 400;

interface GradientBallProps {
  isRunning: boolean;
  lr: number;
  optimizer: Optimizer;
  position: [number, number];
  onPositionUpdate: (pos: [number, number]) => void;
  trail: THREE.Vector3[];
  onTrailUpdate: (trail: THREE.Vector3[]) => void;
  adamState: AdamState;
  onAdamStateUpdate: (state: AdamState) => void;
}

function GradientBall({
  isRunning,
  lr,
  optimizer,
  position,
  onPositionUpdate,
  trail,
  onTrailUpdate,
  adamState,
  onAdamStateUpdate,
}: GradientBallProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const frameCountRef = useRef(0);

  useFrame(() => {
    if (!meshRef.current) return;

    // Update ball visual position
    const y = lossFn(position[0], position[1]);
    meshRef.current.position.set(position[0], y + BALL_RADIUS + 0.02, position[1]);

    if (!isRunning) return;

    // Throttle: update every 3rd frame for smoother animation
    frameCountRef.current += 1;
    if (frameCountRef.current % 3 !== 0) return;

    const [gx, gz] = gradient(position[0], position[1]);

    let newX: number;
    let newZ: number;

    if (optimizer === 'adam') {
      const { newPos, newState } = adamStep(
        position,
        [gx, gz],
        lr,
        adamState,
      );
      newX = newPos[0];
      newZ = newPos[1];
      onAdamStateUpdate(newState);
    } else {
      // SGD
      newX = position[0] - lr * gx;
      newZ = position[1] - lr * gz;
    }

    // Clamp to surface range
    newX = Math.max(-SURFACE_RANGE, Math.min(SURFACE_RANGE, newX));
    newZ = Math.max(-SURFACE_RANGE, Math.min(SURFACE_RANGE, newZ));

    const newY = lossFn(newX, newZ);
    onPositionUpdate([newX, newZ]);

    // Update trail
    const newTrail = [
      ...trail,
      new THREE.Vector3(newX, newY + BALL_RADIUS + 0.01, newZ),
    ];
    if (newTrail.length > TRAIL_MAX) {
      newTrail.splice(0, newTrail.length - TRAIL_MAX);
    }
    onTrailUpdate(newTrail);
  });

  const y = lossFn(position[0], position[1]);

  return (
    <mesh
      ref={meshRef}
      position={[position[0], y + BALL_RADIUS + 0.02, position[1]]}
      castShadow
    >
      <sphereGeometry args={[BALL_RADIUS, 16, 16]} />
      <meshStandardMaterial
        color="#ff6040"
        emissive="#ff4020"
        emissiveIntensity={0.6}
        roughness={0.3}
        metalness={0.4}
      />
    </mesh>
  );
}

/* -------------------------------------------------------------------------- */
/*  Trail line                                                                */
/* -------------------------------------------------------------------------- */

function TrailLine({ trail }: { trail: THREE.Vector3[] }) {
  if (trail.length < 2) return null;

  const points = trail.map((v) => [v.x, v.y, v.z] as [number, number, number]);

  return (
    <Line
      points={points}
      color="#ff6040"
      lineWidth={1.5}
      transparent
      opacity={0.6}
    />
  );
}

/* -------------------------------------------------------------------------- */
/*  Scene lighting & camera                                                   */
/* -------------------------------------------------------------------------- */

function SceneLights() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 8, 5]} intensity={0.8} castShadow />
      <pointLight position={[-4, 6, -4]} intensity={0.3} color="#4a6aff" />
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  3D Scene wrapper                                                          */
/* -------------------------------------------------------------------------- */

interface SceneContentProps {
  isRunning: boolean;
  lr: number;
  optimizer: Optimizer;
  position: [number, number];
  onPositionUpdate: (pos: [number, number]) => void;
  trail: THREE.Vector3[];
  onTrailUpdate: (trail: THREE.Vector3[]) => void;
  adamState: AdamState;
  onAdamStateUpdate: (state: AdamState) => void;
}

function SceneContent(props: SceneContentProps) {
  return (
    <>
      <SceneLights />
      <PerspectiveCamera makeDefault position={[7, 6, 7]} fov={50} />
      <OrbitControls
        enablePan={false}
        enableZoom
        minDistance={5}
        maxDistance={15}
        minPolarAngle={0.3}
        maxPolarAngle={Math.PI / 2.2}
        autoRotate
        autoRotateSpeed={0.3}
      />
      <SurfaceMesh />
      <SurfaceWireframe />
      <GradientBall
        isRunning={props.isRunning}
        lr={props.lr}
        optimizer={props.optimizer}
        position={props.position}
        onPositionUpdate={props.onPositionUpdate}
        trail={props.trail}
        onTrailUpdate={props.onTrailUpdate}
        adamState={props.adamState}
        onAdamStateUpdate={props.onAdamStateUpdate}
      />
      <TrailLine trail={props.trail} />
      {/* Grid floor for spatial reference */}
      <gridHelper
        args={[SURFACE_RANGE * 2, 10, '#1a2040', '#1a2040']}
        position={[0, -3, 0]}
      />
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main component                                                            */
/* -------------------------------------------------------------------------- */

export default function LossSurface3D({
  activeSection,
  onExerciseComplete,
}: LossSurface3DProps) {
  void activeSection;
  const [lr, setLr] = useState(0.15);
  const [optimizer, setOptimizer] = useState<Optimizer>('sgd');
  const [isRunning, setIsRunning] = useState(false);
  const [position, setPosition] = useState<[number, number]>(INITIAL_POS);
  const [trail, setTrail] = useState<THREE.Vector3[]>([]);
  const [adamState, setAdamState] = useState<AdamState>(createAdamState());
  const [exerciseDone, setExerciseDone] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  /* --- Exercise completion --------------------------------------------- */
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

  /* --- Controls -------------------------------------------------------- */
  const changeLr = useCallback(
    (delta: number) => {
      setLr((prev) => {
        const next = Math.round((prev + delta) * 100) / 100;
        return Math.max(0.01, Math.min(1.0, next));
      });
      markInteracted();
    },
    [markInteracted],
  );

  const changeOptimizer = useCallback(
    (opt: Optimizer) => {
      setOptimizer(opt);
      setShowDropdown(false);
      // Reset Adam state when switching
      setAdamState(createAdamState());
      markInteracted();
    },
    [markInteracted],
  );

  const handlePlay = useCallback(() => {
    setIsRunning((prev) => !prev);
    markInteracted();
  }, [markInteracted]);

  const handleReset = useCallback(() => {
    setIsRunning(false);
    setPosition(INITIAL_POS);
    setTrail([]);
    setAdamState(createAdamState());
    markInteracted();
  }, [markInteracted]);

  /* --- Current loss value ---------------------------------------------- */
  const currentLoss = lossFn(position[0], position[1]).toFixed(3);

  /* --- Optimizer label ------------------------------------------------- */
  const optimizerLabel = OPTIMIZER_OPTIONS.find(
    (o) => o.value === optimizer,
  )?.label;

  return (
    <div className="w-full h-full flex flex-col gap-2 p-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Loss Landscape
        </h4>
        <span className="text-[10px] font-mono text-muted-foreground/70">
          loss: {currentLoss}
        </span>
      </div>

      {/* 3D Canvas */}
      <div className="flex-1 min-h-0 rounded-lg overflow-hidden border border-border/50 bg-[#050810]">
        <Suspense
          fallback={
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          }
        >
          <Canvas
            dpr={[1, 1.5]}
            gl={{
              antialias: true,
              alpha: false,
              powerPreference: 'default',
            }}
            style={{ background: '#050810' }}
          >
            <SceneContent
              isRunning={isRunning}
              lr={lr}
              optimizer={optimizer}
              position={position}
              onPositionUpdate={setPosition}
              trail={trail}
              onTrailUpdate={setTrail}
              adamState={adamState}
              onAdamStateUpdate={setAdamState}
            />
          </Canvas>
        </Suspense>
      </div>

      {/* Playback controls */}
      <div className="flex items-center justify-center gap-2">
        <motion.button
          onClick={handlePlay}
          className={[
            'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors',
            isRunning
              ? 'border-orange-500/30 text-orange-400 hover:bg-orange-500/10'
              : 'border-primary/30 text-primary hover:bg-primary/10',
          ].join(' ')}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          aria-label={isRunning ? 'Pause gradient descent' : 'Start gradient descent'}
        >
          <Play className="w-3 h-3" />
          {isRunning ? 'Pause' : 'Descend'}
        </motion.button>
        <motion.button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border border-border text-muted-foreground hover:bg-muted/50 transition-colors"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          aria-label="Reset ball position"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </motion.button>
      </div>

      {/* Parameter controls */}
      <div className="glass-panel rounded-lg p-3 space-y-3">
        {/* Learning rate */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Learning rate</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => changeLr(-0.05)}
              disabled={lr <= 0.01}
              className="w-6 h-6 rounded flex items-center justify-center border border-border hover:bg-muted/50 disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Decrease learning rate"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="text-sm font-mono text-foreground w-10 text-center">
              {lr.toFixed(2)}
            </span>
            <button
              onClick={() => changeLr(0.05)}
              disabled={lr >= 1.0}
              className="w-6 h-6 rounded flex items-center justify-center border border-border hover:bg-muted/50 disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Increase learning rate"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Optimizer */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Optimizer</span>
          <div className="relative">
            <button
              onClick={() => setShowDropdown((prev) => !prev)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-border text-xs font-mono text-foreground hover:bg-muted/50"
              aria-haspopup="listbox"
              aria-expanded={showDropdown}
            >
              {optimizerLabel}
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
                  className="absolute right-0 bottom-full mb-1 glass-panel rounded-md overflow-hidden z-20 min-w-[70px]"
                >
                  {OPTIMIZER_OPTIONS.map((opt) => (
                    <li
                      key={opt.value}
                      role="option"
                      aria-selected={opt.value === optimizer}
                      className={[
                        'px-3 py-1.5 text-xs font-mono cursor-pointer transition-colors',
                        opt.value === optimizer
                          ? 'bg-primary/15 text-primary'
                          : 'text-foreground hover:bg-muted/50',
                      ].join(' ')}
                      onClick={() => changeOptimizer(opt.value)}
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
        <p className="text-[10px] text-muted-foreground/50 text-center">
          Adjust controls or start descent to complete this exercise
        </p>
      )}
      {exerciseDone && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[10px] text-primary/60 text-center"
        >
          Exercise complete
        </motion.p>
      )}
    </div>
  );
}
