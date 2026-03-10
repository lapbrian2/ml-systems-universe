/**
 * Point Cloud Utilities
 *
 * Shared decoder for base64-packed point cloud data from the GPU server.
 * Used by both GalleryArtVolume and GalleryCanvas.
 */

import * as THREE from 'three'

/**
 * Decode a base64-packed interleaved point cloud buffer into a Three.js Points mesh.
 *
 * The buffer format is interleaved Float32: [x, y, z, r, g, b, x, y, z, r, g, b, ...]
 * Each point is 6 floats (24 bytes).
 */
export function decodePointCloud(
  data: string,
  count: number,
): { positions: Float32Array; colors: Float32Array; restoreSpeeds: Float32Array } {
  const binary = atob(data)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  const buffer = new Float32Array(bytes.buffer)

  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const restoreSpeeds = new Float32Array(count)

  for (let i = 0; i < count; i++) {
    const src = i * 6
    const dst = i * 3
    positions[dst] = buffer[src]!
    positions[dst + 1] = buffer[src + 1]!
    positions[dst + 2] = buffer[src + 2]!
    colors[dst] = buffer[src + 3]!
    colors[dst + 1] = buffer[src + 4]!
    colors[dst + 2] = buffer[src + 5]!
    restoreSpeeds[i] = 0.02 + Math.random() * 0.08
  }

  return { positions, colors, restoreSpeeds }
}

/**
 * Build a Three.js Points mesh from decoded point cloud data with fluid shader.
 */
export function createPointCloudMesh(
  data: string,
  count: number,
  vertexShader: string,
  fragmentShader: string,
  uniforms: Record<string, THREE.IUniform>,
): THREE.Points {
  const { positions, colors, restoreSpeeds } = decodePointCloud(data, count)

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geometry.setAttribute('aRestoreSpeed', new THREE.BufferAttribute(restoreSpeeds, 1))
  geometry.setAttribute('aVelocity', new THREE.BufferAttribute(new Float32Array(count * 3), 3))

  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
  })

  return new THREE.Points(geometry, material)
}
