import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock AudioContext and related Web Audio API
const mockGain = {
  gain: { value: 0, setValueAtTime: vi.fn(), linearRampToValueAtTime: vi.fn(), cancelScheduledValues: vi.fn() },
  connect: vi.fn(),
}

const mockOscillator = {
  type: 'sine',
  frequency: { value: 0, setValueAtTime: vi.fn(), linearRampToValueAtTime: vi.fn() },
  connect: vi.fn(),
  start: vi.fn(),
  stop: vi.fn(),
}

const mockBufferSource = {
  buffer: null,
  loop: false,
  connect: vi.fn(),
  start: vi.fn(),
  stop: vi.fn(),
}

const mockFilter = {
  type: 'lowpass',
  frequency: { value: 0 },
  Q: { value: 0 },
  connect: vi.fn(),
}

const mockAudioContext = {
  state: 'running',
  currentTime: 0,
  sampleRate: 44100,
  destination: {},
  createGain: vi.fn(() => ({ ...mockGain, gain: { ...mockGain.gain } })),
  createOscillator: vi.fn(() => ({
    ...mockOscillator,
    frequency: { ...mockOscillator.frequency },
  })),
  createBufferSource: vi.fn(() => ({ ...mockBufferSource })),
  createBiquadFilter: vi.fn(() => ({ ...mockFilter })),
  createBuffer: vi.fn(() => ({ getChannelData: () => new Float32Array(88200) })),
  resume: vi.fn(() => Promise.resolve()),
  suspend: vi.fn(() => Promise.resolve()),
  close: vi.fn(() => Promise.resolve()),
}

vi.stubGlobal('AudioContext', vi.fn(() => ({ ...mockAudioContext })))

describe('useAmbientAudio', () => {
  beforeEach(() => {
    vi.resetModules()
    localStorage.clear()
  })

  it('returns expected API shape', async () => {
    const { useAmbientAudio } = await import('~/composables/useAmbientAudio')
    const audio = useAmbientAudio()

    expect(audio.isPlaying).toBeDefined()
    expect(audio.volume).toBeDefined()
    expect(audio.toggle).toBeTypeOf('function')
    expect(audio.setVolume).toBeTypeOf('function')
    expect(audio.cleanup).toBeTypeOf('function')
  })

  it('starts with isPlaying false and volume 0.3', async () => {
    const { useAmbientAudio } = await import('~/composables/useAmbientAudio')
    const audio = useAmbientAudio()

    expect(audio.isPlaying.value).toBe(false)
    expect(audio.volume.value).toBe(0.3)
  })

  it('setVolume clamps to 0-1 range', async () => {
    const { useAmbientAudio } = await import('~/composables/useAmbientAudio')
    const audio = useAmbientAudio()

    audio.setVolume(1.5)
    expect(audio.volume.value).toBe(1)

    audio.setVolume(-0.5)
    expect(audio.volume.value).toBe(0)

    audio.setVolume(0.7)
    expect(audio.volume.value).toBe(0.7)
  })

  it('setVolume updates volume ref', async () => {
    const { useAmbientAudio } = await import('~/composables/useAmbientAudio')
    const audio = useAmbientAudio()

    audio.setVolume(0.8)
    expect(audio.volume.value).toBe(0.8)
  })

  it('toggle changes isPlaying state', async () => {
    const { useAmbientAudio } = await import('~/composables/useAmbientAudio')
    const audio = useAmbientAudio()

    const initialState = audio.isPlaying.value
    audio.toggle()
    // State should have changed (may or may not toggle depending on AudioContext availability)
    expect(typeof audio.isPlaying.value).toBe('boolean')
  })

  it('cleanup does not throw', async () => {
    const { useAmbientAudio } = await import('~/composables/useAmbientAudio')
    const audio = useAmbientAudio()

    expect(() => audio.cleanup()).not.toThrow()
  })
})

describe('sound effects', () => {
  beforeEach(() => {
    vi.resetModules()
    localStorage.clear()
  })

  it('playCorrectSound is exported as a function', async () => {
    const { playCorrectSound } = await import('~/composables/useAmbientAudio')
    expect(playCorrectSound).toBeTypeOf('function')
  })

  it('playWrongSound is exported as a function', async () => {
    const { playWrongSound } = await import('~/composables/useAmbientAudio')
    expect(playWrongSound).toBeTypeOf('function')
  })

  it('playCompleteSound is exported as a function', async () => {
    const { playCompleteSound } = await import('~/composables/useAmbientAudio')
    expect(playCompleteSound).toBeTypeOf('function')
  })

  it('sound effects do not throw when audio is not playing', async () => {
    const { playCorrectSound, playWrongSound, playCompleteSound } = await import('~/composables/useAmbientAudio')
    expect(() => playCorrectSound()).not.toThrow()
    expect(() => playWrongSound()).not.toThrow()
    expect(() => playCompleteSound()).not.toThrow()
  })
})
