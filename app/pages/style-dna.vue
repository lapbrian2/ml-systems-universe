<script setup lang="ts">
import { ArrowLeft, Dna } from 'lucide-vue-next'
import { useStyleDNA } from '~/composables/useStyleDNA'

useHead({ title: 'Style DNA | ML Systems Universe' })
useSeoMeta({
  title: 'Style DNA | ML Systems Universe',
  ogTitle: 'Your Learning Style DNA — ML Systems Universe',
  description: 'Discover your unique ML learning fingerprint based on your progress, quiz performance, and engagement patterns.',
  ogDescription: 'Discover your unique ML learning fingerprint based on your progress, quiz performance, and engagement patterns.',
})

const { profile, hasActivity } = useStyleDNA()
</script>

<template>
  <div id="main-content" class="min-h-screen bg-cosmic-bg">
    <!-- Back link -->
    <div class="fixed top-3 left-4 z-50">
      <NuxtLink
        to="/"
        class="flex items-center gap-1.5 text-xs text-white/50 hover:text-white/70 transition-colors"
        aria-label="Back to home"
      >
        <ArrowLeft class="w-3.5 h-3.5" />
        <span class="hidden sm:inline">Home</span>
      </NuxtLink>
    </div>

    <main class="max-w-2xl mx-auto px-6 py-16 lg:py-24">
      <!-- Page header -->
      <div class="text-center mb-10">
        <div class="flex items-center justify-center gap-2 mb-4">
          <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Dna class="w-5 h-5 text-primary" />
          </div>
        </div>
        <h1 class="font-display text-3xl lg:text-4xl font-bold tracking-tight text-white mb-3">
          Style DNA
        </h1>
        <p class="text-sm text-white/50 max-w-md mx-auto leading-relaxed">
          Your unique learning fingerprint — derived from chapters read, quizzes taken, time invested, and engagement patterns across all six parts.
        </p>
      </div>

      <!-- Profile or empty state -->
      <ClientOnly>
        <template v-if="hasActivity">
          <StyleDNACard :profile="profile" :animate="true" />
        </template>

        <template v-else>
          <div class="glass-panel rounded-2xl p-10 text-center">
            <div class="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
              <Dna class="w-8 h-8 text-primary/40" />
            </div>
            <h2 class="text-lg font-semibold text-white/70 mb-2">No Activity Yet</h2>
            <p class="text-sm text-white/45 max-w-sm mx-auto leading-relaxed mb-6">
              Start reading chapters, completing exercises, and taking quizzes to build your Style DNA profile.
            </p>
            <NuxtLink
              to="/chapter/introduction"
              class="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium bg-primary/10 text-primary border border-primary/20 hover:bg-primary/15 transition-colors"
            >
              Begin Chapter 1
            </NuxtLink>
          </div>
        </template>

        <template #fallback>
          <div class="flex items-center justify-center py-20">
            <div class="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        </template>
      </ClientOnly>
    </main>
  </div>
</template>
