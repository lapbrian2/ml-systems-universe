<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue'
import { Target, Trophy, Clock, ChevronRight, RotateCcw } from 'lucide-vue-next'

const props = defineProps<{
  title: string
  description: string
  color: string
  isComplete: boolean
  timeLimit?: number // seconds, optional
}>()

const emit = defineEmits<{
  start: []
  reset: []
}>()

const isActive = ref(false)
const elapsed = ref(0)
let timer: ReturnType<typeof setInterval> | null = null

const formattedTime = computed(() => {
  const m = Math.floor(elapsed.value / 60)
  const s = elapsed.value % 60
  return `${m}:${String(s).padStart(2, '0')}`
})

const timeUp = computed(() =>
  props.timeLimit ? elapsed.value >= props.timeLimit : false
)

function start() {
  isActive.value = true
  elapsed.value = 0
  if (timer) clearInterval(timer)
  timer = setInterval(() => {
    if (props.timeLimit && elapsed.value + 1 >= props.timeLimit) {
      elapsed.value = props.timeLimit
      clearInterval(timer!)
      timer = null
    } else {
      elapsed.value++
    }
  }, 1000)
  emit('start')
}

function reset() {
  isActive.value = false
  elapsed.value = 0
  if (timer) {
    clearInterval(timer)
    timer = null
  }
  emit('reset')
}
watch(() => props.isComplete, (done) => {
  if (done && timer) {
    clearInterval(timer)
    timer = null
  }
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
})
</script>

<template>
  <div
    class="challenge"
    :class="{ 'challenge--active': isActive, 'challenge--complete': isComplete }"
  >
    <!-- Inactive state: show challenge prompt -->
    <template v-if="!isActive && !isComplete">
      <div class="challenge__prompt">
        <Target class="w-4 h-4 flex-shrink-0" :style="{ color }" />
        <div class="challenge__info">
          <span class="challenge__title">Challenge: {{ title }}</span>
          <span class="challenge__desc">{{ description }}</span>
        </div>
        <button
          class="challenge__btn"
          :style="{ backgroundColor: `${color}15`, color, borderColor: `${color}30` }"
          @click="start"
        >
          Start <ChevronRight class="w-3 h-3" />
        </button>
      </div>
    </template>

    <!-- Active state: show timer and objective -->
    <template v-else-if="isActive && !isComplete">
      <div class="challenge__active">
        <Target class="w-3.5 h-3.5 animate-pulse" :style="{ color }" />
        <span class="challenge__objective">{{ description }}</span>
        <span class="challenge__timer" :class="{ 'challenge__timer--warn': timeUp }">
          <Clock class="w-3 h-3" />
          {{ formattedTime }}
          <span v-if="timeLimit" class="text-white/20"> / {{ Math.floor(timeLimit / 60) }}:{{ String(timeLimit % 60).padStart(2, '0') }}</span>
        </span>
      </div>
    </template>

    <!-- Complete state -->
    <template v-else>
      <div class="challenge__done">
        <Trophy class="w-4 h-4 text-amber-400" />
        <div class="challenge__info">
          <span class="challenge__title" :style="{ color }">Challenge Complete!</span>
          <span class="challenge__desc">Solved in {{ formattedTime }}</span>
        </div>
        <button
          class="challenge__btn-reset"
          @click="reset"
        >
          <RotateCcw class="w-3 h-3" /> Try Again
        </button>
      </div>
    </template>
  </div>
</template>

<style scoped>
.challenge {
  display: flex;
  padding: 8px 12px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.04);
  transition: all 0.3s ease;
}
.challenge--active {
  border-color: rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
}
.challenge--complete {
  border-color: rgba(245, 158, 11, 0.2);
  background: rgba(245, 158, 11, 0.05);
}
.challenge__prompt, .challenge__active, .challenge__done {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
}
.challenge__info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
}
.challenge__title {
  font-size: 11px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
  font-family: 'Syne', sans-serif;
}
.challenge__desc {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.35);
}
.challenge__objective {
  flex: 1;
  font-size: 10px;
  color: rgba(255, 255, 255, 0.5);
  font-style: italic;
}
.challenge__timer {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-family: 'JetBrains Mono', monospace;
  color: rgba(255, 255, 255, 0.4);
}
.challenge__timer--warn {
  color: #ff6b6b;
}
.challenge__btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 600;
  border: 1px solid;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;
}
.challenge__btn:hover { filter: brightness(1.2); }
.challenge__btn-reset {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 10px;
  color: rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.04);
  border: none;
  cursor: pointer;
  transition: color 0.2s ease;
}
.challenge__btn-reset:hover { color: rgba(255, 255, 255, 0.6); }
</style>
