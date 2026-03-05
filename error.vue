<script setup lang="ts">
import { ArrowLeft, AlertTriangle } from 'lucide-vue-next'

const props = defineProps<{
  error: {
    statusCode: number
    statusMessage?: string
    message?: string
  }
}>()

const is404 = computed(() => props.error.statusCode === 404)

function handleError() {
  clearError({ redirect: '/' })
}
</script>

<template>
  <div class="min-h-screen bg-[#05070f] flex items-center justify-center px-6">
    <div class="text-center max-w-md">
      <div
        class="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
        :class="is404 ? 'bg-amber-500/10' : 'bg-red-500/10'"
      >
        <AlertTriangle class="w-8 h-8" :class="is404 ? 'text-amber-400' : 'text-red-400'" />
      </div>

      <p class="text-6xl font-mono font-bold text-white/15 mb-2">
        {{ error.statusCode }}
      </p>

      <h1 class="text-xl font-display font-bold text-white mb-3">
        {{ is404 ? 'Page Not Found' : 'Something Went Wrong' }}
      </h1>

      <p class="text-sm text-white/50 leading-relaxed mb-8">
        {{
          is404
            ? 'The chapter or page you are looking for does not exist. It may have been moved or removed.'
            : error.message || 'An unexpected error occurred. Please try again.'
        }}
      </p>

      <button
        class="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-white/[0.06] border border-white/10 hover:bg-white/[0.1] transition-colors duration-200"
        @click="handleError"
      >
        <ArrowLeft class="w-4 h-4" />
        Back to Home
      </button>
    </div>
  </div>
</template>
