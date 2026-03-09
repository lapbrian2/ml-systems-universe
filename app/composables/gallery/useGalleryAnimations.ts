/**
 * Gallery Animations Composable
 *
 * GSAP-powered animation orchestration for the museum installation.
 * Manages timelines for:
 * - Scene transitions (idle → active → generating → reveal)
 * - Particle system morphing
 * - Camera movement choreography
 * - Generated art reveal sequences
 */

import gsap from 'gsap'
import type * as THREE from 'three'

export type GalleryState = 'loading' | 'idle' | 'tracking' | 'generating' | 'reveal' | 'cooldown'

export function useGalleryAnimations() {
  const state = ref<GalleryState>('loading')
  const masterTimeline = shallowRef<gsap.core.Timeline | null>(null)

  function initTimeline() {
    masterTimeline.value = gsap.timeline({ paused: true })
    return masterTimeline.value
  }

  /**
   * Idle state — ambient floating animation.
   * Particles drift, lights pulse softly, camera breathes.
   */
  function playIdle(particles: THREE.Points, camera: THREE.PerspectiveCamera) {
    state.value = 'idle'

    // Gentle camera breathing
    gsap.to(camera.position, {
      y: '+=0.15',
      duration: 4,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    })

    // Particle rotation drift
    gsap.to(particles.rotation, {
      y: '+=6.283', // Full rotation
      duration: 120,
      ease: 'none',
      repeat: -1,
    })

    // Subtle scale pulse
    gsap.to(particles.scale, {
      x: 1.05,
      y: 1.05,
      z: 1.05,
      duration: 6,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    })
  }

  /**
   * Tracking state — visitor detected, scene responds to movement.
   */
  function playTracking(
    particles: THREE.Points,
    targetPosition: { x: number; y: number; z: number },
  ) {
    state.value = 'tracking'

    gsap.to(particles.rotation, {
      x: targetPosition.y * 0.5,
      y: targetPosition.x * 0.5,
      duration: 0.8,
      ease: 'power2.out',
      overwrite: true,
    })
  }

  /**
   * Generating state — GPU is crunching, show anticipation animation.
   */
  function playGenerating(particles: THREE.Points): gsap.core.Timeline {
    state.value = 'generating'

    const tl = gsap.timeline()

    // Particles contract inward
    tl.to(particles.scale, {
      x: 0.3,
      y: 0.3,
      z: 0.3,
      duration: 1.2,
      ease: 'power3.in',
    })

    // Fast spin while processing
    tl.to(particles.rotation, {
      y: '+=12.566', // 2 full rotations
      duration: 2,
      ease: 'power1.inOut',
    }, '<')

    return tl
  }

  /**
   * Reveal state — GPU result arrived, dramatically display the generated art.
   */
  function playReveal(
    artMesh: THREE.Mesh,
    particles: THREE.Points,
    camera: THREE.PerspectiveCamera,
  ): gsap.core.Timeline {
    state.value = 'reveal'

    const tl = gsap.timeline()

    // Particles explode outward
    tl.to(particles.scale, {
      x: 2.5,
      y: 2.5,
      z: 2.5,
      duration: 0.6,
      ease: 'back.out(2)',
    })

    // Art fades in from transparent
    tl.fromTo(
      artMesh.material,
      { opacity: 0 },
      { opacity: 1, duration: 1.5, ease: 'power2.out' },
      '-=0.3',
    )

    // Camera pushes in for dramatic close-up
    tl.to(camera.position, {
      z: 2.5,
      duration: 2,
      ease: 'power2.inOut',
    }, '<')

    // Hold for viewing
    tl.to({}, { duration: 8 })

    // Slow fade and pull back to idle
    tl.to(artMesh.material, {
      opacity: 0,
      duration: 2,
      ease: 'power2.in',
    })

    tl.to(camera.position, {
      z: 5,
      duration: 2,
      ease: 'power2.inOut',
      onComplete: () => {
        state.value = 'cooldown'
        gsap.delayedCall(3, () => {
          state.value = 'idle'
        })
      },
    }, '<')

    return tl
  }

  function killAll() {
    gsap.killTweensOf('*')
    masterTimeline.value?.kill()
  }

  return {
    state: readonly(state),
    initTimeline,
    playIdle,
    playTracking,
    playGenerating,
    playReveal,
    killAll,
  }
}
