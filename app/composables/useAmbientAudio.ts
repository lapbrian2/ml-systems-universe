import { ref } from 'vue'

// ── Shared singleton state ────────────────────────────────────────────
const isPlaying = ref(false)
const volume = ref(0.3)

let audioCtx: AudioContext | null = null
let masterGain: GainNode | null = null
let oscillators: OscillatorNode[] = []
let noiseSource: AudioBufferSourceNode | null = null
let noiseGain: GainNode | null = null
let initialized = false
let fadeTimeout: ReturnType<typeof setTimeout> | null = null

// Persist state to localStorage
function persistState() {
  if (!import.meta.client) return
  try {
    localStorage.setItem('ambient-audio-playing', JSON.stringify(isPlaying.value))
    localStorage.setItem('ambient-audio-volume', JSON.stringify(volume.value))
  } catch {
    // localStorage unavailable
  }
}

function restoreState() {
  if (!import.meta.client) return
  try {
    const savedPlaying = localStorage.getItem('ambient-audio-playing')
    const savedVolume = localStorage.getItem('ambient-audio-volume')
    if (savedPlaying !== null) {
      const parsed = JSON.parse(savedPlaying)
      if (typeof parsed === 'boolean') isPlaying.value = parsed
    }
    if (savedVolume !== null) {
      const parsed = JSON.parse(savedVolume)
      if (typeof parsed === 'number' && parsed >= 0 && parsed <= 1) volume.value = parsed
    }
  } catch {
    // localStorage unavailable
  }
}

// Check prefers-reduced-motion
function prefersReducedMotion(): boolean {
  if (!import.meta.client) return true
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// Create a white noise buffer filtered to low frequencies
function createFilteredNoise(ctx: AudioContext): { source: AudioBufferSourceNode; gain: GainNode } {
  const bufferSize = ctx.sampleRate * 2 // 2 seconds of noise
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1
  }

  const source = ctx.createBufferSource()
  source.buffer = buffer
  source.loop = true

  // Low-pass filter to get a soft rumble
  const filter = ctx.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = 120
  filter.Q.value = 0.7

  const gain = ctx.createGain()
  gain.gain.value = 0

  source.connect(filter)
  filter.connect(gain)

  return { source, gain }
}

function createOscillators(ctx: AudioContext, master: GainNode): OscillatorNode[] {
  const frequencies = [63, 98, 147, 185]
  const gains = [0.08, 0.06, 0.04, 0.03]

  return frequencies.map((freq, i) => {
    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = freq

    const oscGain = ctx.createGain()
    oscGain.gain.value = gains[i]

    osc.connect(oscGain)
    oscGain.connect(master)
    osc.start()

    return osc
  })
}

function init() {
  if (!import.meta.client || initialized) return
  restoreState()

  // If prefers-reduced-motion and user hasn't explicitly enabled, disable
  if (prefersReducedMotion() && !localStorage.getItem('ambient-audio-playing')) {
    isPlaying.value = false
  }

  initialized = true
}

function ensureAudioContext() {
  if (!import.meta.client) return false
  if (audioCtx && audioCtx.state !== 'closed') return true

  try {
    audioCtx = new AudioContext()
    masterGain = audioCtx.createGain()
    masterGain.gain.value = 0 // Start silent, fade in
    masterGain.connect(audioCtx.destination)

    // Create oscillators
    oscillators = createOscillators(audioCtx, masterGain)

    // Create filtered noise
    const noise = createFilteredNoise(audioCtx)
    noiseSource = noise.source
    noiseGain = noise.gain
    noiseGain.connect(masterGain)
    noiseSource.start()

    return true
  } catch {
    return false
  }
}

function fadeIn() {
  if (!audioCtx || !masterGain) return
  if (fadeTimeout) clearTimeout(fadeTimeout)

  // Resume context if suspended (autoplay policy)
  if (audioCtx.state === 'suspended') {
    audioCtx.resume()
  }

  const now = audioCtx.currentTime
  masterGain.gain.cancelScheduledValues(now)
  masterGain.gain.setValueAtTime(masterGain.gain.value, now)
  masterGain.gain.linearRampToValueAtTime(volume.value, now + 1)

  // Set noise gain proportionally
  if (noiseGain) {
    noiseGain.gain.cancelScheduledValues(now)
    noiseGain.gain.setValueAtTime(noiseGain.gain.value, now)
    noiseGain.gain.linearRampToValueAtTime(0.12, now + 1)
  }
}

function fadeOut(): Promise<void> {
  return new Promise((resolve) => {
    if (!audioCtx || !masterGain) {
      resolve()
      return
    }

    const now = audioCtx.currentTime
    masterGain.gain.cancelScheduledValues(now)
    masterGain.gain.setValueAtTime(masterGain.gain.value, now)
    masterGain.gain.linearRampToValueAtTime(0, now + 1)

    if (noiseGain) {
      noiseGain.gain.cancelScheduledValues(now)
      noiseGain.gain.setValueAtTime(noiseGain.gain.value, now)
      noiseGain.gain.linearRampToValueAtTime(0, now + 1)
    }

    fadeTimeout = setTimeout(() => {
      if (audioCtx && audioCtx.state !== 'closed') {
        audioCtx.suspend()
      }
      resolve()
    }, 1050)
  })
}

function toggle() {
  if (!import.meta.client) return

  if (!isPlaying.value) {
    // Turning on
    const ok = ensureAudioContext()
    if (!ok) return
    isPlaying.value = true
    fadeIn()
  } else {
    // Turning off
    isPlaying.value = false
    fadeOut()
  }
  persistState()
}

function setVolume(v: number) {
  volume.value = Math.max(0, Math.min(1, v))

  if (audioCtx && masterGain && isPlaying.value) {
    const now = audioCtx.currentTime
    masterGain.gain.cancelScheduledValues(now)
    masterGain.gain.setValueAtTime(masterGain.gain.value, now)
    masterGain.gain.linearRampToValueAtTime(volume.value, now + 0.1)
  }

  persistState()
}

function cleanup() {
  if (fadeTimeout) clearTimeout(fadeTimeout)

  oscillators.forEach((osc) => {
    try { osc.stop() } catch { /* already stopped */ }
  })
  oscillators = []

  if (noiseSource) {
    try { noiseSource.stop() } catch { /* already stopped */ }
    noiseSource = null
  }

  if (audioCtx && audioCtx.state !== 'closed') {
    audioCtx.close()
  }
  audioCtx = null
  masterGain = null
  noiseGain = null
  initialized = false
}

// ── Interaction sound effects ─────────────────────────────────────────

function getEffectContext(): AudioContext | null {
  if (!import.meta.client || !isPlaying.value) return null
  // Reuse the ambient context or create a temporary one
  if (audioCtx && audioCtx.state === 'running') return audioCtx
  return null
}

export function playCorrectSound() {
  const ctx = getEffectContext()
  if (!ctx) return

  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(200, ctx.currentTime)
  osc.frequency.linearRampToValueAtTime(400, ctx.currentTime + 0.15)
  gain.gain.setValueAtTime(0.15, ctx.currentTime)
  gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.15)
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + 0.15)
}

export function playWrongSound() {
  const ctx = getEffectContext()
  if (!ctx) return

  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(300, ctx.currentTime)
  osc.frequency.linearRampToValueAtTime(150, ctx.currentTime + 0.2)
  gain.gain.setValueAtTime(0.12, ctx.currentTime)
  gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.2)
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + 0.2)
}

export function playCompleteSound() {
  const ctx = getEffectContext()
  if (!ctx) return

  // Note 1: C5 (523.25 Hz)
  const osc1 = ctx.createOscillator()
  const gain1 = ctx.createGain()
  osc1.type = 'sine'
  osc1.frequency.value = 523.25
  gain1.gain.setValueAtTime(0.12, ctx.currentTime)
  gain1.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3)
  osc1.connect(gain1)
  gain1.connect(ctx.destination)
  osc1.start(ctx.currentTime)
  osc1.stop(ctx.currentTime + 0.3)

  // Note 2: E5 (659.25 Hz), delayed by 300ms
  const osc2 = ctx.createOscillator()
  const gain2 = ctx.createGain()
  osc2.type = 'sine'
  osc2.frequency.value = 659.25
  gain2.gain.setValueAtTime(0, ctx.currentTime)
  gain2.gain.setValueAtTime(0.12, ctx.currentTime + 0.3)
  gain2.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6)
  osc2.connect(gain2)
  gain2.connect(ctx.destination)
  osc2.start(ctx.currentTime)
  osc2.stop(ctx.currentTime + 0.6)
}

// ── Composable export ─────────────────────────────────────────────────
export function useAmbientAudio() {
  init()

  return {
    isPlaying,
    volume,
    toggle,
    setVolume,
    cleanup,
  }
}
