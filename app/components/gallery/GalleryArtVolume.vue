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
import { createPointCloudMesh } from '~/composables/gallery/usePointCloud'

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
    const uniforms = forceFields.createUniforms()
    pointsMesh = createPointCloudMesh(data, props.pointCount, fluidVertexShader, fluidFragmentShader, uniforms)
    shaderMaterial = pointsMesh.material as THREE.ShaderMaterial

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
