// Mock Nuxt auto-imports for testing
import { ref, onUnmounted } from 'vue'

export { ref, onUnmounted }

export function useState<T>(key: string, init: () => T) {
  return ref(init())
}

export function useHead(_options: Record<string, unknown>) {
  // no-op in tests
}

export function useNuxtApp() {
  return { $lenis: undefined }
}
