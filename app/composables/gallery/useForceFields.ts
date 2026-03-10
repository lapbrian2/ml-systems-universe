/**
 * Force Field System
 *
 * Maps hand tracking positions into physics-like force fields that
 * the fluid particle shader responds to. Each hand becomes an
 * attractor or repeller depending on gesture:
 *
 *   open palm  → repeller (pushes particles away — Anadol "wake" effect)
 *   fist       → attractor (pulls particles inward — gathering)
 *   pinch      → strong attractor (condenses into tight cluster)
 *   point      → directional jet (pushes in pointing direction)
 *
 * The shader reads these as uniform vec3 positions + strength + radius.
 */

import * as THREE from 'three'
import type { Gesture } from '~/composables/gallery/useMotionTracking'

export interface ForceField {
  position: THREE.Vector3
  strength: number    // Negative = repel, positive = attract
  radius: number
  active: boolean
}

export function useForceFields() {
  const fields = reactive<ForceField[]>([
    { position: new THREE.Vector3(), strength: 0, radius: 3.0, active: false },
    { position: new THREE.Vector3(), strength: 0, radius: 3.0, active: false },
  ])

  const disturbance = ref(0) // 0–1 global disturbance level

  // Smoothed disturbance for shader (prevents jarring transitions)
  const smoothDisturbance = ref(0)
  const SMOOTH_FACTOR = 0.08

  /**
   * Update force fields from hand tracking data.
   */
  function updateFromTracking(
    palmCenter: { x: number; y: number; z: number } | null,
    gesture: Gesture | null,
    handIndex: number = 0,
  ) {
    const field = fields[handIndex]
    if (!field) return

    if (!palmCenter) {
      field.active = false
      field.strength = 0
      return
    }

    field.active = true
    field.position.set(palmCenter.x, palmCenter.y, palmCenter.z)

    // Map gesture to force behavior
    switch (gesture) {
      case 'open':
        // Repeller — the "data wake" effect
        field.strength = -2.5
        field.radius = 3.5
        break
      case 'fist':
        // Attractor — gathering effect
        field.strength = 1.8
        field.radius = 2.5
        break
      case 'pinch':
        // Strong attractor — condensing
        field.strength = 4.0
        field.radius = 1.5
        break
      case 'point':
        // Directional push (weaker, wider)
        field.strength = -1.5
        field.radius = 4.0
        break
      default:
        field.strength = -1.0
        field.radius = 2.0
    }
  }

  /**
   * Apply force field uniforms to a shader material.
   * Call this each frame in the render loop.
   */
  function applyToMaterial(material: THREE.ShaderMaterial, _delta: number) {
    // Calculate global disturbance from active fields
    const targetDisturbance = fields.some(f => f.active) ? 1.0 : 0.0
    smoothDisturbance.value += (targetDisturbance - smoothDisturbance.value) * SMOOTH_FACTOR
    disturbance.value = smoothDisturbance.value

    material.uniforms.uDisturbance!.value = smoothDisturbance.value

    // Field 0
    if (fields[0]) {
      material.uniforms.uForcePosition0!.value.copy(fields[0].position)
      material.uniforms.uForceStrength0!.value = fields[0].active ? fields[0].strength : 0
      material.uniforms.uForceRadius0!.value = fields[0].radius
    }

    // Field 1
    if (fields[1]) {
      material.uniforms.uForcePosition1!.value.copy(fields[1].position)
      material.uniforms.uForceStrength1Pad!.value.x = fields[1].active ? fields[1].strength : 0
      material.uniforms.uForceStrength1Pad!.value.y = fields[1].radius
    }
  }

  /**
   * Create the full set of uniforms for the fluid particle shader.
   */
  function createUniforms(): Record<string, THREE.IUniform> {
    return {
      uTime: { value: 0 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      uBaseSize: { value: 4.0 },
      uDisturbance: { value: 0 },

      uForcePosition0: { value: new THREE.Vector3() },
      uForceStrength0: { value: 0 },
      uForceRadius0: { value: 3.0 },

      uForcePosition1: { value: new THREE.Vector3() },
      uForceStrength1Pad: { value: new THREE.Vector3(0, 3.0, 0) },

      uGlowColor: { value: new THREE.Color(0.4, 0.2, 0.8) }, // Purple glow
      uGlowIntensity: { value: 0.5 },
    }
  }

  return {
    fields,
    disturbance: readonly(disturbance),
    updateFromTracking,
    applyToMaterial,
    createUniforms,
  }
}
