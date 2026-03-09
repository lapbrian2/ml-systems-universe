/**
 * Spatial-to-Generation Pipeline
 *
 * This is the translator between your 3D world and the generative model.
 * Instead of relying on lossy text prompts, it extracts hard geometric,
 * lighting, and compositional data from the Three.js scene and converts
 * it into structured inputs:
 *
 *   Three.js Scene → Camera matrix, light vectors, depth map, normals
 *                  → Structured prompt architecture
 *                  → ControlNet conditioning images (depth, normals, canny)
 *                  → GPU server payload
 *
 * The generative model becomes a renderer, not an imaginer.
 */

import * as THREE from 'three'

export interface SceneSnapshot {
  camera: CameraData
  lights: LightData[]
  composition: CompositionData
  depth: string | null         // base64 depth map for ControlNet
  normals: string | null       // base64 normal map for ControlNet
  timestamp: number
}

export interface CameraData {
  position: { x: number; y: number; z: number }
  rotation: { x: number; y: number; z: number }
  fov: number
  aspect: number
  lookAt: { x: number; y: number; z: number }
  // Derived descriptors for prompt architecture
  angle: string       // 'low-angle' | 'eye-level' | 'high-angle' | 'birds-eye'
  distance: string    // 'extreme-close-up' | 'close-up' | 'medium' | 'wide' | 'establishing'
  perspective: string // 'frontal' | 'three-quarter' | 'profile' | 'rear'
}

export interface LightData {
  type: 'directional' | 'point' | 'spot' | 'ambient'
  color: string        // hex
  intensity: number
  position?: { x: number; y: number; z: number }
  direction?: { x: number; y: number; z: number }
  // Derived
  descriptor: string   // 'harsh overhead' | 'soft diffused' | 'dramatic side-lit' etc.
}

export interface CompositionData {
  ruleOfThirds: { x: number; y: number }  // Where the focal point sits on the grid
  depth: 'shallow' | 'medium' | 'deep'
  mood: string                              // Derived from lighting + camera
  spatialDensity: number                    // How much of the frame is occupied
}

export interface GenerationInputs {
  structuredPrompt: string
  negativePrompt: string
  controlImages: {
    depth?: string     // base64
    normals?: string   // base64
    canny?: string     // base64
  }
  parameters: {
    width: number
    height: number
    steps: number
    guidance_scale: number
    controlnet_conditioning_scale: number
    seed?: number
  }
}

export function useSpatialPipeline() {
  const lastSnapshot = ref<SceneSnapshot | null>(null)

  // Offscreen renderers for control images
  let depthRenderer: THREE.WebGLRenderer | null = null
  let depthMaterial: THREE.ShaderMaterial | null = null
  let normalMaterial: THREE.MeshNormalMaterial | null = null

  function initOffscreenRenderers() {
    depthRenderer = new THREE.WebGLRenderer({ antialias: false, alpha: false })
    depthRenderer.setSize(512, 512)

    depthMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying float vDepth;
        void main() {
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          vDepth = -mvPosition.z;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying float vDepth;
        uniform float uNear;
        uniform float uFar;
        void main() {
          float depth = (vDepth - uNear) / (uFar - uNear);
          depth = clamp(depth, 0.0, 1.0);
          gl_FragColor = vec4(vec3(1.0 - depth), 1.0);
        }
      `,
      uniforms: {
        uNear: { value: 0.1 },
        uFar: { value: 50.0 },
      },
    })

    normalMaterial = new THREE.MeshNormalMaterial()
  }

  /**
   * Capture a full snapshot of the current scene state.
   */
  function captureSnapshot(
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
  ): SceneSnapshot {
    const cameraData = extractCameraData(camera)
    const lights = extractLights(scene)
    const composition = analyzeComposition(camera, scene)

    // Render control images
    const depth = renderDepthMap(scene, camera)
    const normals = renderNormalMap(scene, camera)

    const snapshot: SceneSnapshot = {
      camera: cameraData,
      lights,
      composition,
      depth,
      normals,
      timestamp: Date.now(),
    }

    lastSnapshot.value = snapshot
    return snapshot
  }

  /**
   * Convert a scene snapshot into structured generation inputs.
   * This is the core translation — 3D math → generation parameters.
   */
  function toGenerationInputs(
    snapshot: SceneSnapshot,
    stylePrefix: string = '',
  ): GenerationInputs {
    const { camera, lights, composition } = snapshot

    // Build structured prompt from spatial data (not vibes — hard geometry)
    const promptParts: string[] = []

    if (stylePrefix) promptParts.push(stylePrefix)

    // Camera → cinematic framing language
    promptParts.push(`${camera.angle} shot`)
    promptParts.push(`${camera.distance} framing`)
    promptParts.push(`${camera.perspective} view`)

    // Lighting → precise descriptors
    for (const light of lights) {
      if (light.type !== 'ambient') {
        promptParts.push(light.descriptor)
      }
    }

    // Composition → mood and spatial feel
    promptParts.push(composition.mood)
    promptParts.push(`${composition.depth} depth of field`)

    const structuredPrompt = promptParts.filter(Boolean).join(', ')

    const negativePrompt = [
      'blurry', 'low quality', 'distorted', 'watermark', 'text',
      'oversaturated', 'flat lighting',
    ].join(', ')

    // Determine ControlNet strength based on scene complexity
    const controlStrength = composition.spatialDensity > 0.5 ? 0.85 : 0.65

    return {
      structuredPrompt,
      negativePrompt,
      controlImages: {
        depth: snapshot.depth ?? undefined,
        normals: snapshot.normals ?? undefined,
      },
      parameters: {
        width: 512,
        height: 512,
        steps: 35,
        guidance_scale: 8.5,
        controlnet_conditioning_scale: controlStrength,
      },
    }
  }

  // ─── Extraction Functions ─────────────────────────────────────

  function extractCameraData(camera: THREE.PerspectiveCamera): CameraData {
    const pos = camera.position
    const rot = camera.rotation

    // Calculate look-at direction
    const dir = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion)
    const lookAt = pos.clone().add(dir.multiplyScalar(10))

    // Derive angle descriptor from pitch
    const pitch = rot.x * (180 / Math.PI)
    let angle: string
    if (pitch < -30) angle = 'birds-eye'
    else if (pitch < -10) angle = 'high-angle'
    else if (pitch > 20) angle = 'low-angle'
    else angle = 'eye-level'

    // Derive distance from camera Z position
    const distFromOrigin = pos.length()
    let distance: string
    if (distFromOrigin < 1.5) distance = 'extreme-close-up'
    else if (distFromOrigin < 3) distance = 'close-up'
    else if (distFromOrigin < 6) distance = 'medium'
    else if (distFromOrigin < 12) distance = 'wide'
    else distance = 'establishing'

    // Derive perspective from yaw
    const yaw = Math.abs(rot.y * (180 / Math.PI)) % 360
    let perspective: string
    if (yaw < 20 || yaw > 340) perspective = 'frontal'
    else if (yaw < 70) perspective = 'three-quarter'
    else if (yaw < 110) perspective = 'profile'
    else perspective = 'rear'

    return {
      position: { x: pos.x, y: pos.y, z: pos.z },
      rotation: { x: rot.x, y: rot.y, z: rot.z },
      fov: camera.fov,
      aspect: camera.aspect,
      lookAt: { x: lookAt.x, y: lookAt.y, z: lookAt.z },
      angle,
      distance,
      perspective,
    }
  }

  function extractLights(scene: THREE.Scene): LightData[] {
    const lights: LightData[] = []

    scene.traverse((obj) => {
      if (obj instanceof THREE.AmbientLight) {
        lights.push({
          type: 'ambient',
          color: `#${obj.color.getHexString()}`,
          intensity: obj.intensity,
          descriptor: obj.intensity < 0.3 ? 'dark moody ambient' : 'soft ambient fill',
        })
      }
      else if (obj instanceof THREE.DirectionalLight) {
        const dir = obj.position.clone().normalize()
        lights.push({
          type: 'directional',
          color: `#${obj.color.getHexString()}`,
          intensity: obj.intensity,
          position: { x: obj.position.x, y: obj.position.y, z: obj.position.z },
          direction: { x: dir.x, y: dir.y, z: dir.z },
          descriptor: describeDirectionalLight(dir, obj.intensity),
        })
      }
      else if (obj instanceof THREE.PointLight) {
        lights.push({
          type: 'point',
          color: `#${obj.color.getHexString()}`,
          intensity: obj.intensity,
          position: { x: obj.position.x, y: obj.position.y, z: obj.position.z },
          descriptor: obj.intensity > 2 ? 'harsh point light' : 'soft localized glow',
        })
      }
      else if (obj instanceof THREE.SpotLight) {
        lights.push({
          type: 'spot',
          color: `#${obj.color.getHexString()}`,
          intensity: obj.intensity,
          position: { x: obj.position.x, y: obj.position.y, z: obj.position.z },
          descriptor: 'focused spotlight beam',
        })
      }
    })

    return lights
  }

  function describeDirectionalLight(dir: THREE.Vector3, intensity: number): string {
    const parts: string[] = []

    if (intensity > 2) parts.push('harsh')
    else if (intensity > 0.8) parts.push('strong')
    else parts.push('soft')

    // Side
    if (Math.abs(dir.x) > 0.6) parts.push('side-lit')
    else if (dir.y > 0.6) parts.push('overhead')
    else if (dir.y < -0.3) parts.push('uplight')
    else if (dir.z > 0.6) parts.push('backlit')
    else parts.push('front-lit')

    return parts.join(' ')
  }

  function analyzeComposition(
    camera: THREE.PerspectiveCamera,
    scene: THREE.Scene,
  ): CompositionData {
    // Estimate spatial density by counting visible objects
    let objectCount = 0
    scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh) objectCount++
    })
    const spatialDensity = Math.min(objectCount / 20, 1)

    // Derive depth from camera FOV + distance
    const depthLevel = camera.fov < 35 ? 'shallow' : camera.fov < 60 ? 'medium' : 'deep'

    // Derive mood from lighting
    const lights = extractLights(scene)
    const totalIntensity = lights.reduce((sum, l) => sum + l.intensity, 0)
    let mood: string
    if (totalIntensity < 0.5) mood = 'dark and mysterious'
    else if (totalIntensity < 1.5) mood = 'moody and atmospheric'
    else if (totalIntensity < 3) mood = 'balanced and cinematic'
    else mood = 'bright and ethereal'

    // Rule of thirds focal point (simplified — center of mass of meshes)
    const focal = { x: 0.5, y: 0.4 } // Default slightly above center

    return { ruleOfThirds: focal, depth: depthLevel, mood, spatialDensity }
  }

  // ─── ControlNet Image Rendering ───────────────────────────────

  function renderDepthMap(
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
  ): string | null {
    if (!depthRenderer || !depthMaterial) return null

    // Override all materials with depth material
    const originalMaterials = new Map<THREE.Mesh, THREE.Material | THREE.Material[]>()
    scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        originalMaterials.set(obj, obj.material)
        obj.material = depthMaterial!
      }
    })

    depthMaterial.uniforms.uNear.value = camera.near
    depthMaterial.uniforms.uFar.value = camera.far

    depthRenderer.render(scene, camera)
    const dataUrl = depthRenderer.domElement.toDataURL('image/png')

    // Restore original materials
    originalMaterials.forEach((mat, mesh) => {
      mesh.material = mat
    })

    return dataUrl
  }

  function renderNormalMap(
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
  ): string | null {
    if (!depthRenderer || !normalMaterial) return null

    const originalMaterials = new Map<THREE.Mesh, THREE.Material | THREE.Material[]>()
    scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        originalMaterials.set(obj, obj.material)
        obj.material = normalMaterial!
      }
    })

    depthRenderer.render(scene, camera)
    const dataUrl = depthRenderer.domElement.toDataURL('image/png')

    originalMaterials.forEach((mat, mesh) => {
      mesh.material = mat
    })

    return dataUrl
  }

  function dispose() {
    depthRenderer?.dispose()
    depthMaterial?.dispose()
    normalMaterial?.dispose()
  }

  return {
    lastSnapshot: readonly(lastSnapshot),
    initOffscreenRenderers,
    captureSnapshot,
    toGenerationInputs,
    dispose,
  }
}
