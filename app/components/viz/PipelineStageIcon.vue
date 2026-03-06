<script setup lang="ts">
defineProps<{
  icon: string
  scale?: number
}>()
</script>

<template>
  <g :transform="scale ? `scale(${scale})` : undefined">
    <!-- Database icon -->
    <g v-if="icon === 'database'">
      <ellipse cx="18" cy="8" rx="14" ry="5" fill="none" stroke="currentColor" stroke-width="1.5" />
      <path d="M 4 8 v 10 c 0 2.8 6.3 5 14 5 s 14 -2.2 14 -5 V 8" fill="none" stroke="currentColor" stroke-width="1.5" />
      <path d="M 4 14 c 0 2.8 6.3 5 14 5 s 14 -2.2 14 -5" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.5" />
    </g>
    <!-- Filter icon -->
    <g v-else-if="icon === 'filter'">
      <path d="M 3 4 h 30 l -10 12 v 8 l -10 4 v -12 Z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
    </g>
    <!-- Layers icon -->
    <g v-else-if="icon === 'layers'">
      <path d="M 18 4 L 2 13 L 18 22 L 34 13 Z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
      <path d="M 2 18 L 18 27 L 34 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" opacity="0.6" />
      <path d="M 2 23 L 18 32 L 34 23" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" opacity="0.35" />
    </g>
    <!-- Brain icon -->
    <g v-else-if="icon === 'brain'">
      <circle cx="18" cy="16" r="12" fill="none" stroke="currentColor" stroke-width="1.5" />
      <path d="M 18 4 v 24" fill="none" stroke="currentColor" stroke-width="1" opacity="0.4" />
      <path d="M 10 8 Q 14 16 10 24" fill="none" stroke="currentColor" stroke-width="1" opacity="0.5" />
      <path d="M 26 8 Q 22 16 26 24" fill="none" stroke="currentColor" stroke-width="1" opacity="0.5" />
      <circle cx="13" cy="12" r="1.5" fill="currentColor" opacity="0.6" />
      <circle cx="23" cy="12" r="1.5" fill="currentColor" opacity="0.6" />
      <circle cx="13" cy="20" r="1.5" fill="currentColor" opacity="0.6" />
      <circle cx="23" cy="20" r="1.5" fill="currentColor" opacity="0.6" />
    </g>
    <!-- Chart icon -->
    <g v-else-if="icon === 'chart'">
      <rect x="4" y="18" width="6" height="10" rx="1" fill="currentColor" opacity="0.4" />
      <rect x="14" y="10" width="6" height="18" rx="1" fill="currentColor" opacity="0.6" />
      <rect x="24" y="4" width="6" height="24" rx="1" fill="currentColor" opacity="0.8" />
      <line x1="2" y1="30" x2="34" y2="30" stroke="currentColor" stroke-width="1.5" opacity="0.3" />
    </g>
    <!-- Rocket icon -->
    <g v-else-if="icon === 'rocket'">
      <path d="M 18 4 C 12 10 10 18 10 26 L 18 22 L 26 26 C 26 18 24 10 18 4 Z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
      <circle cx="18" cy="15" r="2.5" fill="none" stroke="currentColor" stroke-width="1.5" />
      <path d="M 10 26 L 6 30" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity="0.5" />
      <path d="M 26 26 L 30 30" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity="0.5" />
    </g>
    <!-- Pulse icon -->
    <g v-else-if="icon === 'pulse'">
      <polyline points="2,18 10,18 14,6 18,28 22,12 26,18 34,18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
    </g>
    <!-- Target icon -->
    <g v-else-if="icon === 'target'">
      <circle cx="18" cy="16" r="14" fill="none" stroke="currentColor" stroke-width="1.5" />
      <circle cx="18" cy="16" r="8" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.6" />
      <circle cx="18" cy="16" r="2.5" fill="currentColor" opacity="0.8" />
    </g>
    <!-- Loop icon -->
    <g v-else-if="icon === 'loop'">
      <path d="M 10 8 A 10 10 0 1 1 10 24" fill="none" stroke="currentColor" stroke-width="1.5" />
      <polyline points="6,20 10,24 14,20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </g>
    <!-- Git icon -->
    <g v-else-if="icon === 'git'">
      <circle cx="18" cy="8" r="3" fill="none" stroke="currentColor" stroke-width="1.5" />
      <circle cx="18" cy="24" r="3" fill="none" stroke="currentColor" stroke-width="1.5" />
      <line x1="18" y1="11" x2="18" y2="21" stroke="currentColor" stroke-width="1.5" />
    </g>
    <!-- Fallback: circle -->
    <g v-else>
      <circle cx="18" cy="16" r="12" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.5" />
    </g>
  </g>
</template>
