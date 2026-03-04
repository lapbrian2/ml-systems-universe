'use client';

import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { lerp } from '@/lib/3d-math';

interface CameraControllerProps {
  target: [number, number, number] | null;
  lookAt: [number, number, number];
  onFlyComplete?: () => void;
}

export default function CameraController({
  target,
  lookAt,
  onFlyComplete,
}: CameraControllerProps) {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { camera } = useThree();
  const flyProgressRef = useRef(0);
  const isFlyingRef = useRef(false);
  const flyStartPosRef = useRef<[number, number, number]>([0, 0, 0]);

  // When a new target is set, begin the fly-to animation
  useEffect(() => {
    if (target) {
      flyProgressRef.current = 0;
      isFlyingRef.current = true;
      flyStartPosRef.current = [
        camera.position.x,
        camera.position.y,
        camera.position.z,
      ];
    } else {
      isFlyingRef.current = false;
    }
  }, [target, camera]);

  useFrame(() => {
    if (!isFlyingRef.current || !target || !controlsRef.current) return;

    flyProgressRef.current += 0.018; // ~60 frames to complete
    const t = Math.min(flyProgressRef.current, 1);
    // Ease-in-out cubic
    const eased = t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const start = flyStartPosRef.current;

    // Fly to a position offset from the target (slightly above and in front)
    const dest: [number, number, number] = [
      target[0] + 3,
      target[1] + 2,
      target[2] + 8,
    ];

    camera.position.x = lerp(start[0], dest[0], eased);
    camera.position.y = lerp(start[1], dest[1], eased);
    camera.position.z = lerp(start[2], dest[2], eased);

    // Smoothly update orbit controls target to look at the chapter
    controlsRef.current.target.x = lerp(
      controlsRef.current.target.x,
      target[0],
      eased * 0.5 + 0.02
    );
    controlsRef.current.target.y = lerp(
      controlsRef.current.target.y,
      target[1],
      eased * 0.5 + 0.02
    );
    controlsRef.current.target.z = lerp(
      controlsRef.current.target.z,
      target[2],
      eased * 0.5 + 0.02
    );

    controlsRef.current.update();

    if (t >= 1) {
      isFlyingRef.current = false;
      onFlyComplete?.();
    }
  });

  const isAutoOrbit = target === null;

  return (
    <OrbitControls
      ref={controlsRef}
      target={lookAt}
      enableDamping
      dampingFactor={0.05}
      enablePan={false}
      minDistance={5}
      maxDistance={80}
      autoRotate={isAutoOrbit}
      autoRotateSpeed={0.3}
      makeDefault
    />
  );
}
