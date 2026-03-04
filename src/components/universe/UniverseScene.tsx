'use client';

import { useState, useMemo, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';

import StarField from './StarField';
import ChapterNode from './ChapterNode';
import ConnectionLines from './ConnectionLines';
import CameraController from './CameraController';

import { CHAPTERS } from '@/data/chapters';
import { PARTS } from '@/data/chapters/parts';
import { CHAPTER_DEPENDENCIES } from '@/data/chapters/dependencies';
import { PART_CENTERS } from '@/lib/constants';
import { getChapterPosition } from '@/lib/3d-math';
import { useProgressStore } from '@/lib/progress-store';
import type { ChapterMeta } from '@/types/chapter';

interface UniverseSceneProps {
  onChapterSelect: (chapter: ChapterMeta) => void;
}

export default function UniverseScene({ onChapterSelect }: UniverseSceneProps) {
  const [selectedChapter, setSelectedChapter] = useState<ChapterMeta | null>(null);
  const getChapterState = useProgressStore((s) => s.getChapterState);
  const getProgress = useProgressStore((s) => s.getProgress);

  // Compute positions for all chapters
  const chapterPositions = useMemo(() => {
    const positions: Record<string, [number, number, number]> = {};

    for (const part of PARTS) {
      const center = PART_CENTERS[part.id];
      if (!center) continue;

      part.chapters.forEach((chId, index) => {
        positions[chId] = getChapterPosition(index, center, part.chapters.length);
      });
    }

    return positions;
  }, []);

  // Connection lines data
  const chapterPositionList = useMemo(
    () =>
      CHAPTERS.map((ch) => ({
        id: ch.id,
        position: chapterPositions[ch.id] ?? [0, 0, 0] as [number, number, number],
      })),
    [chapterPositions]
  );

  const handleChapterSelect = useCallback(
    (chapter: ChapterMeta) => {
      setSelectedChapter(chapter);
      onChapterSelect(chapter);
    },
    [onChapterSelect]
  );

  const handleFlyComplete = useCallback(() => {
    // Camera arrived at destination; could trigger additional UI here
  }, []);

  // Camera target: fly to selected chapter position, or null for auto-orbit
  const cameraTarget = selectedChapter
    ? chapterPositions[selectedChapter.id] ?? null
    : null;

  return (
    <Canvas
      camera={{ position: [0, 5, 45], fov: 60, near: 0.1, far: 300 }}
      style={{ background: '#05070f' }}
      gl={{ antialias: true, alpha: false }}
      onPointerMissed={() => setSelectedChapter(null)}
    >
      {/* Fog for depth */}
      <fogExp2 attach="fog" color="#05070f" density={0.015} />

      {/* Lighting */}
      <ambientLight color="#1a2050" intensity={1.5} />
      <pointLight position={[0, 10, 10]} color="#4a6aff" intensity={2} distance={60} />
      <pointLight position={[-10, -5, 5]} color="#00c896" intensity={1.5} distance={50} />

      {/* Background */}
      <StarField />

      {/* Chapter nodes */}
      {CHAPTERS.map((chapter) => {
        const pos = chapterPositions[chapter.id];
        if (!pos) return null;

        const state = getChapterState(chapter.id);
        const progress = getProgress(chapter.id);
        const phases = progress.phases;
        const completionPercent =
          ((phases.read ? 1 : 0) +
            (phases.exercise ? 1 : 0) +
            (phases.quiz.passed ? 1 : 0)) /
          3;

        return (
          <ChapterNode
            key={chapter.id}
            chapter={chapter}
            position={pos}
            state={state}
            completionPercent={completionPercent}
            onSelect={handleChapterSelect}
          />
        );
      })}

      {/* Dependency connections */}
      <ConnectionLines
        chapters={chapterPositionList}
        dependencies={CHAPTER_DEPENDENCIES}
      />

      {/* Camera controls */}
      <CameraController
        target={cameraTarget}
        lookAt={[0, 0, 0]}
        onFlyComplete={handleFlyComplete}
      />

      {/* Post-processing effects */}
      <EffectComposer>
        <Bloom
          luminanceThreshold={0.3}
          luminanceSmoothing={0.9}
          intensity={0.6}
          blendFunction={BlendFunction.ADD}
        />
        <ChromaticAberration
          offset={new THREE.Vector2(0.0005, 0.0005)}
          blendFunction={BlendFunction.NORMAL}
          radialModulation={false}
          modulationOffset={0}
        />
      </EffectComposer>
    </Canvas>
  );
}
