<script setup lang="ts">
/**
 * GalleryArtVolume — Volumetric Art Display
 *
 * Takes the GPU server's output (generated image + depth → point cloud)
 * and renders it as an interactive 3D particle volume.
 *
 * This is the component that turns flat generative art into an
 * Anadol-like data sculpture. The point cloud floats in space,
 * responds to hand gestures via force fields, and can be
 * walked around in the museum installation.
 *
 * Props:
 *   pointCloudData - base64 packed buffer from GPU server
 *   pointCount     - number of points
 *   bounds         - spatial bounds for camera framing
 */

import * as THREE from 'three'
import { useForceFields } from '~/composables/gallery/useForceFields'
import { useMotionTracking } from '~/composables/gallery/useMotionTracking'

import fluidVertexShader from '~/assets/shaders/fluid-particles.vert?raw'
import fluidFragmentShader from '~/assets/shaders/fluid-particles.frag?raw'

const props = defineProps<{
  scene: THREE.Scene
  pointCloudData: string | null
  pointCount: number
  bounds: { min: number[]; max: number[] } | null
}>()

const emit = defineEmits<{
  ready: []
}>()

const forceFields = useForceFields()
const motion = useMotionTracking()

let pointsMesh: THREE.Points | null = null
let shaderMaterial: THREE.ShaderMaterial | null = null

/**
 * Decode the base64 point cloud buffer and create the Three.js geometry.
 */
function loadPointCloud(data: string, count: number): THREE.Points {
  // Decode base64 → ArrayBuffer
  const binary = atob(data)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  const buffer = new Float32Array(bytes.buffer)

  // Deinterleave: [x,y,z,r,g,b, x,y,z,r,g,b, ...]
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const restoreSpeeds = new Float32Array(count)
  const velocities = new Float32Array(count * 3)

  for (let i = 0; i < count; i++) {
    const src = i * 6
    const dst = i * 3

    positions[dst] = buffer[src]!         // x
    positions[dst + 1] = buffer[src + 1]! // y
    positions[dst + 2] = buffer[src + 2]! // z

    colors[dst] = buffer[src + 3]!     // r
    colors[dst + 1] = buffer[src + 4]! // g
    colors[dst + 2] = buffer[src + 5]! // b

    // Random restore speed per particle (organic feel)
    restoreSpeeds[i] = 0.02 + Math.random() * 0.08

    // Initialize velocities to zero
    velocities[dst] = 0
    velocities[dst + 1] = 0
    velocities[dst + 2] = 0
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geometry.setAttribute('aRestoreSpeed', new THREE.BufferAttribute(restoreSpeeds, 1))
  geometry.setAttribute('aVelocity', new THREE.BufferAttribute(velocities, 3))

  // Create shader material with force field uniforms
  const uniforms = forceFields.createUniforms()

  shaderMaterial = new THREE.ShaderMaterial({
    vertexShader: fluidVertexShader,
    fragmentShader: fluidFragmentShader,
    uniforms,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
  })

  const points = new THREE.Points(geometry, shaderMaterial)
  return points
}

/**
 * Frame update — called from parent's render loop.
 */
function update(delta: number, elapsed: number) {
  if (!shaderMaterial) return

  // Update time uniform
  shaderMaterial.uniforms.uTime!.value = elapsed

  // Map hand tracking to force fields
  if (motion.tracking.palmCenter) {
    const world = motion.toWorldCoordinates(motion.tracking.palmCenter)
    forceFields.updateFromTracking(world, motion.tracking.gesture, 0)
  }
  else {
    forceFields.updateFromTracking(null, null, 0)
  }

  // Apply force fields to shader
  forceFields.applyToMaterial(shaderMaterial, delta)
}

// Watch for new point cloud data
watch(
  () => props.pointCloudData,
  (data) => {
    if (!data || props.pointCount === 0) return

    // Remove old mesh
    if (pointsMesh) {
      props.scene.remove(pointsMesh)
      pointsMesh.geometry.dispose()
    }

    // Create new volumetric display
    pointsMesh = loadPointCloud(data, props.pointCount)

    // Position at eye height
    pointsMesh.position.set(0, 1.6, 0)

    props.scene.add(pointsMesh)
    emit('ready')
  },
)

onUnmounted(() => {
  if (pointsMesh) {
    props.scene.remove(pointsMesh)
    pointsMesh.geometry.dispose()
    shaderMaterial?.dispose()
  }
})

defineExpose({ update })
</script>

<template>
  <!-- Renderless component — all rendering happens in Three.js -->
  <slot />
</template>
