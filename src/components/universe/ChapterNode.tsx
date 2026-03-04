'use client';

import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import type { ChapterMeta } from '@/types/chapter';
import type { ChapterState } from '@/types/progress';
import { PART_MAP } from '@/data/chapters/parts';

interface ChapterNodeProps {
  chapter: ChapterMeta;
  position: [number, number, number];
  state: ChapterState;
  completionPercent: number;
  onSelect: (chapter: ChapterMeta) => void;
}

const EMISSIVE_INTENSITY: Record<ChapterState, number> = {
  locked: 0.1,
  available: 0.3,
  'in-progress': 0.5,
  completed: 0.9,
};

export default function ChapterNode({
  chapter,
  position,
  state,
  completionPercent,
  onSelect,
}: ChapterNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const part = PART_MAP[chapter.partId];
  const partColor = new THREE.Color(part?.color ?? '#4a6aff');

  // Normalize estimated time (20-45 min) to scale (0.8-1.2)
  const baseScale = useMemo(() => {
    const min = 20;
    const max = 45;
    const clamped = Math.max(min, Math.min(max, chapter.estimatedMinutes));
    return 0.8 + ((clamped - min) / (max - min)) * 0.4;
  }, [chapter.estimatedMinutes]);

  const isLocked = state === 'locked';
  const isCompleted = state === 'completed';

  useFrame(({ clock }) => {
    if (!meshRef.current) return;

    const t = clock.getElapsedTime();
    const offset = chapter.number * 0.7; // phase offset per chapter

    // Gentle floating
    meshRef.current.position.y = position[1] + Math.sin(t * 0.8 + offset) * 0.15;

    // Slow rotation
    meshRef.current.rotation.y = t * 0.3 + offset;
    meshRef.current.rotation.x = Math.sin(t * 0.2 + offset) * 0.1;

    // Scale animation on hover
    const targetScale = hovered ? baseScale * 1.25 : baseScale;
    const currentScale = meshRef.current.scale.x;
    const newScale = currentScale + (targetScale - currentScale) * 0.1;
    meshRef.current.scale.setScalar(newScale);

    // Glow ring rotation
    if (glowRef.current) {
      glowRef.current.rotation.z = t * 0.5 + offset;
      glowRef.current.position.y = meshRef.current.position.y;
    }
  });

  // Emissive intensity: base from state, boosted on hover, modulated by completion
  const emissiveIntensity = useMemo(() => {
    const base = EMISSIVE_INTENSITY[state];
    const completionBoost = completionPercent * 0.3;
    return base + completionBoost;
  }, [state, completionPercent]);

  const hoverIntensity = hovered ? 0.4 : 0;

  return (
    <group position={[position[0], 0, position[2]]}>
      {/* Main icosahedron node */}
      <mesh
        ref={meshRef}
        position={[0, position[1], 0]}
        onClick={(e) => {
          e.stopPropagation();
          if (!isLocked) onSelect(chapter);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = isLocked ? 'not-allowed' : 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
      >
        <icosahedronGeometry args={[0.6, 1]} />
        <meshStandardMaterial
          color={isLocked ? '#1a1e3a' : partColor}
          emissive={partColor}
          emissiveIntensity={emissiveIntensity + hoverIntensity}
          wireframe={isLocked}
          transparent
          opacity={isLocked ? 0.3 : 0.9}
          roughness={0.3}
          metalness={0.6}
        />

        {/* Chapter number label */}
        <Html
          position={[0, 1.1, 0]}
          center
          distanceFactor={15}
          style={{ pointerEvents: 'none' }}
        >
          <div
            style={{
              color: isLocked ? 'rgba(255,255,255,0.25)' : part?.color ?? '#4a6aff',
              fontSize: '11px',
              fontWeight: 700,
              fontFamily: 'system-ui, sans-serif',
              textAlign: 'center',
              whiteSpace: 'nowrap',
              textShadow: `0 0 8px ${part?.color ?? '#4a6aff'}44`,
              userSelect: 'none',
            }}
          >
            {chapter.number}
          </div>
        </Html>
      </mesh>

      {/* Glow ring around node */}
      {!isLocked && (
        <mesh
          ref={glowRef}
          position={[0, position[1], 0]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <torusGeometry args={[0.9, 0.02, 8, 32]} />
          <meshBasicMaterial
            color={partColor}
            transparent
            opacity={isCompleted ? 0.6 : hovered ? 0.35 : 0.12}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* Completion ring for in-progress chapters */}
      {state === 'in-progress' && completionPercent > 0 && (
        <mesh
          position={[0, position[1], 0]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <torusGeometry
            args={[1.1, 0.015, 8, 32, completionPercent * Math.PI * 2]}
          />
          <meshBasicMaterial
            color={partColor}
            transparent
            opacity={0.5}
            depthWrite={false}
          />
        </mesh>
      )}
    </group>
  );
}
