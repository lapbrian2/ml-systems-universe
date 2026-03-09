/**
 * Gallery Scene Composable
 *
 * Manages the core Three.js scene for the museum installation:
 * - Scene, camera, renderer lifecycle
 * - Responsive resize handling
 * - Render loop with GSAP ticker integration
 * - Post-processing pipeline
 */

import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js'

export interface GallerySceneContext {
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
  renderer: THREE.WebGLRenderer
  composer: EffectComposer
  clock: THREE.Clock
  canvas: HTMLCanvasElement
}

export function useGalleryScene() {
  const context = shallowRef<GallerySceneContext | null>(null)
  const isReady = ref(false)
  const fps = ref(0)
  const frameCallbacks: Array<(delta: number, elapsed: number) => void> = []

  let animationId: number | null = null

  function init(canvas: HTMLCanvasElement): GallerySceneContext {
    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x000000, 0.015)

    // Camera — wide FOV for immersive museum projection
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    )
    camera.position.set(0, 1.6, 5) // Eye-height for standing viewer

    // Renderer — high quality for museum display
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2
    renderer.outputColorSpace = THREE.SRGBColorSpace

    // Post-processing
    const composer = new EffectComposer(renderer)
    composer.addPass(new RenderPass(scene, camera))

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.8, // strength
      0.4, // radius
      0.85, // threshold
    )
    composer.addPass(bloomPass)

    const fxaaPass = new ShaderPass(FXAAShader)
    fxaaPass.uniforms['resolution'].value.set(
      1 / window.innerWidth,
      1 / window.innerHeight,
    )
    composer.addPass(fxaaPass)

    // Ambient lighting — dark gallery mood
    const ambient = new THREE.AmbientLight(0x111122, 0.3)
    scene.add(ambient)

    const clock = new THREE.Clock()

    const ctx: GallerySceneContext = { scene, camera, renderer, composer, clock, canvas }
    context.value = ctx
    isReady.value = true

    return ctx
  }

  function onFrame(callback: (delta: number, elapsed: number) => void) {
    frameCallbacks.push(callback)
  }

  function startLoop() {
    const ctx = context.value
    if (!ctx) return

    let frameCount = 0
    let lastFpsTime = performance.now()

    function loop() {
      animationId = requestAnimationFrame(loop)
      const delta = ctx.clock.getDelta()
      const elapsed = ctx.clock.getElapsedTime()

      // Run all registered frame callbacks
      for (const cb of frameCallbacks) {
        cb(delta, elapsed)
      }

      ctx.composer.render()

      // FPS counter
      frameCount++
      const now = performance.now()
      if (now - lastFpsTime >= 1000) {
        fps.value = frameCount
        frameCount = 0
        lastFpsTime = now
      }
    }

    loop()
  }

  function stopLoop() {
    if (animationId !== null) {
      cancelAnimationFrame(animationId)
      animationId = null
    }
  }

  function handleResize() {
    const ctx = context.value
    if (!ctx) return

    const w = window.innerWidth
    const h = window.innerHeight

    ctx.camera.aspect = w / h
    ctx.camera.updateProjectionMatrix()
    ctx.renderer.setSize(w, h)
    ctx.composer.setSize(w, h)
  }

  function dispose() {
    stopLoop()
    const ctx = context.value
    if (!ctx) return

    ctx.renderer.dispose()
    ctx.scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.geometry.dispose()
        if (Array.isArray(obj.material)) {
          obj.material.forEach(m => m.dispose())
        }
        else {
          obj.material.dispose()
        }
      }
    })
    frameCallbacks.length = 0
    context.value = null
    isReady.value = false
  }

  return {
    context: readonly(context),
    isReady: readonly(isReady),
    fps: readonly(fps),
    init,
    onFrame,
    startLoop,
    stopLoop,
    handleResize,
    dispose,
  }
}
