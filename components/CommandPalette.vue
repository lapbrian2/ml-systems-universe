<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import {
  Search,
  BookOpen,
  Hash,
  BookMarked,
  ArrowRight,
  Command,
} from 'lucide-vue-next'
import { CHAPTERS } from '~/data/chapters'
import { getChapterContent, loadAllChapterContent } from '~/data/content'

// ── Types ──────────────────────────────────────────────────────────────────
interface SearchResult {
  id: string
  type: 'chapter' | 'section' | 'glossary'
  title: string
  subtitle: string
  slug: string
  hash?: string
  icon: typeof BookOpen
}

// ── State ──────────────────────────────────────────────────────────────────
const isOpen = ref(false)
const query = ref('')
const debouncedQuery = ref('')
const selectedIndex = ref(0)
let debounceTimer: ReturnType<typeof setTimeout> | null = null
const inputRef = ref<HTMLInputElement | null>(null)
const resultsRef = ref<HTMLDivElement | null>(null)
const contentLoaded = ref(false)

// Lazy-load all chapter content when palette first opens
watch(isOpen, async (open) => {
  if (open && !contentLoaded.value) {
    try {
      await loadAllChapterContent()
    } catch { /* search will work with whatever loaded */ }
    contentLoaded.value = true
  }
})

// ── Build search index ─────────────────────────────────────────────────────
const searchIndex = computed<SearchResult[]>(() => {
  // Re-evaluate when content finishes loading
  const _loaded = contentLoaded.value
  const items: SearchResult[] = []

  for (const chapter of CHAPTERS) {
    // Add chapter itself
    items.push({
      id: `ch-${chapter.id}`,
      type: 'chapter',
      title: `Ch ${chapter.number}: ${chapter.title}`,
      subtitle: chapter.description.length > 90
        ? chapter.description.slice(0, 90) + '...'
        : chapter.description,
      slug: chapter.slug,
      icon: BookOpen,
    })

    // Load content for sections and glossary
    const content = getChapterContent(chapter.id)
    if (!content) continue

    for (const section of content.sections) {
      items.push({
        id: `sec-${section.id}`,
        type: 'section',
        title: section.heading,
        subtitle: `Ch ${chapter.number}: ${chapter.title}`,
        slug: chapter.slug,
        hash: section.id,
        icon: Hash,
      })
    }

    for (const term of content.glossary) {
      items.push({
        id: `gl-${chapter.id}-${term.term}`,
        type: 'glossary',
        title: term.term,
        subtitle: term.definition.length > 80
          ? term.definition.slice(0, 80) + '...'
          : term.definition,
        slug: chapter.slug,
        hash: `glossary`,
        icon: BookMarked,
      })
    }
  }

  return items
})

// Debounce query input by 150ms
watch(query, (val) => {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    debouncedQuery.value = val
  }, 150)
})

// ── Filtered results ───────────────────────────────────────────────────────
const MAX_RESULTS = 10

const results = computed<SearchResult[]>(() => {
  const q = debouncedQuery.value.toLowerCase().trim()
  if (!q) return []

  const tokens = q.split(/\s+/).filter(Boolean)

  const scored: { item: SearchResult; score: number }[] = []

  for (const item of searchIndex.value) {
    const titleLower = item.title.toLowerCase()
    const subtitleLower = item.subtitle.toLowerCase()
    const combined = titleLower + ' ' + subtitleLower

    // Every token must match somewhere in title or subtitle
    const allMatch = tokens.every(t => combined.includes(t))
    if (!allMatch) continue

    // Scoring: title match is worth more; exact-start matches are best
    let score = 0
    for (const t of tokens) {
      if (titleLower.startsWith(t)) score += 10
      else if (titleLower.includes(t)) score += 5
      if (subtitleLower.includes(t)) score += 1
    }

    // Boost chapters, then sections, then glossary
    if (item.type === 'chapter') score += 3
    else if (item.type === 'section') score += 1

    scored.push({ item, score })
  }

  scored.sort((a, b) => b.score - a.score)
  return scored.slice(0, MAX_RESULTS).map(s => s.item)
})

// ── Group results by type ──────────────────────────────────────────────────
interface ResultGroup {
  label: string
  items: SearchResult[]
}

const groupedResults = computed<ResultGroup[]>(() => {
  const groups: Record<string, ResultGroup> = {}
  const order: string[] = []

  for (const item of results.value) {
    const label =
      item.type === 'chapter' ? 'Chapters'
        : item.type === 'section' ? 'Sections'
          : 'Glossary Terms'
    if (!groups[label]) {
      groups[label] = { label, items: [] }
      order.push(label)
    }
    groups[label].items.push(item)
  }

  return order.map(k => groups[k])
})

// Flat list for keyboard navigation indexing
const flatResults = computed(() => results.value)

// ── Keyboard navigation ────────────────────────────────────────────────────
function onArrowDown() {
  if (selectedIndex.value < flatResults.value.length - 1) {
    selectedIndex.value++
    scrollToSelected()
  }
}

function onArrowUp() {
  if (selectedIndex.value > 0) {
    selectedIndex.value--
    scrollToSelected()
  }
}

function scrollToSelected() {
  nextTick(() => {
    const container = resultsRef.value
    if (!container) return
    const el = container.querySelector(`[data-index="${selectedIndex.value}"]`) as HTMLElement
    if (el) {
      el.scrollIntoView({ block: 'nearest' })
    }
  })
}

function onEnter() {
  const item = flatResults.value[selectedIndex.value]
  if (item) navigate(item)
}

function navigate(item: SearchResult) {
  const path = item.hash
    ? `/chapter/${item.slug}#${item.hash}`
    : `/chapter/${item.slug}`
  close()
  navigateTo(path)
}

// ── Open / close ───────────────────────────────────────────────────────────
function open() {
  isOpen.value = true
  query.value = ''
  selectedIndex.value = 0
  nextTick(() => {
    inputRef.value?.focus()
  })
}

function close() {
  isOpen.value = false
  query.value = ''
  selectedIndex.value = 0
}

// Reset selection when query changes
watch(query, () => {
  selectedIndex.value = 0
})

// ── Global keyboard listener ───────────────────────────────────────────────
function onGlobalKeydown(e: KeyboardEvent) {
  // Cmd+K / Ctrl+K to toggle
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault()
    if (isOpen.value) {
      close()
    } else {
      open()
    }
  }

  // Escape to close
  if (e.key === 'Escape' && isOpen.value) {
    e.preventDefault()
    close()
  }
}

onMounted(() => {
  document.addEventListener('keydown', onGlobalKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onGlobalKeydown)
})

// ── Highlight matching text ────────────────────────────────────────────────
function highlightMatch(text: string): string {
  const q = query.value.toLowerCase().trim()
  if (!q) return escapeHtml(text)

  const tokens = q.split(/\s+/).filter(Boolean)
  let result = escapeHtml(text)

  for (const token of tokens) {
    const escapedToken = escapeRegExp(token)
    const regex = new RegExp(`(${escapedToken})`, 'gi')
    result = result.replace(regex, '<mark class="cp-highlight">$1</mark>')
  }

  return result
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// ── Type badge labels ──────────────────────────────────────────────────────
function typeBadge(type: SearchResult['type']): string {
  switch (type) {
    case 'chapter': return 'Chapter'
    case 'section': return 'Section'
    case 'glossary': return 'Term'
  }
}

// ── Track flat index across groups ─────────────────────────────────────────
function getFlatIndex(item: SearchResult): number {
  return flatResults.value.indexOf(item)
}

// ── Detect platform for shortcut hint ──────────────────────────────────────
const isMac = ref(false)
onMounted(() => {
  isMac.value = navigator.platform?.toLowerCase().includes('mac')
    || navigator.userAgent?.toLowerCase().includes('mac')
})
</script>

<template>
  <!-- Keyboard shortcut hint (fixed, bottom-right) -->
  <button
    class="cp-hint-badge"
    :aria-label="`Open command palette (${isMac ? 'Cmd' : 'Ctrl'}+K)`"
    @click="open"
  >
    <Command :size="13" :stroke-width="2" />
    <span>K</span>
  </button>

  <!-- Overlay -->
  <Teleport to="body">
    <Transition name="cp-overlay">
      <div
        v-if="isOpen"
        class="cp-overlay"
        @mousedown.self="close"
      >
        <Transition name="cp-panel" appear>
          <div
            v-if="isOpen"
            class="cp-panel"
            role="dialog"
            aria-label="Command palette"
            aria-modal="true"
          >
            <!-- Search input -->
            <div class="cp-input-wrapper">
              <Search class="cp-input-icon" :size="18" :stroke-width="2" />
              <input
                ref="inputRef"
                v-model="query"
                type="text"
                class="cp-input"
                placeholder="Search chapters, sections, glossary..."
                autocomplete="off"
                spellcheck="false"
                @keydown.down.prevent="onArrowDown"
                @keydown.up.prevent="onArrowUp"
                @keydown.enter.prevent="onEnter"
              />
              <div class="cp-input-hint">
                <kbd class="cp-kbd">esc</kbd>
              </div>
            </div>

            <!-- Results -->
            <div ref="resultsRef" class="cp-results">
              <!-- Empty state: no query -->
              <div v-if="!query.trim()" class="cp-empty">
                <BookOpen :size="28" :stroke-width="1.5" class="cp-empty-icon" />
                <span class="cp-empty-text">Search across 21 chapters, sections, and glossary terms</span>
              </div>

              <!-- Empty state: no results -->
              <div v-else-if="results.length === 0" class="cp-empty">
                <Search :size="28" :stroke-width="1.5" class="cp-empty-icon" />
                <span class="cp-empty-text">No results for "<span class="cp-empty-query">{{ query }}</span>"</span>
              </div>

              <!-- Grouped results -->
              <template v-else>
                <div
                  v-for="group in groupedResults"
                  :key="group.label"
                  class="cp-group"
                >
                  <div class="cp-group-label">{{ group.label }}</div>
                  <button
                    v-for="item in group.items"
                    :key="item.id"
                    :data-index="getFlatIndex(item)"
                    class="cp-result"
                    :class="{ 'cp-result--active': getFlatIndex(item) === selectedIndex }"
                    @click="navigate(item)"
                    @mouseenter="selectedIndex = getFlatIndex(item)"
                  >
                    <div class="cp-result-icon">
                      <component :is="item.icon" :size="16" :stroke-width="2" />
                    </div>
                    <div class="cp-result-body">
                      <span class="cp-result-title" v-html="highlightMatch(item.title)" />
                      <span class="cp-result-subtitle" v-html="highlightMatch(item.subtitle)" />
                    </div>
                    <span class="cp-result-badge">{{ typeBadge(item.type) }}</span>
                    <ArrowRight
                      class="cp-result-arrow"
                      :size="14"
                      :stroke-width="2"
                    />
                  </button>
                </div>
              </template>
            </div>

            <!-- Footer -->
            <div class="cp-footer">
              <span class="cp-footer-hint">
                <kbd class="cp-kbd">&uarr;</kbd>
                <kbd class="cp-kbd">&darr;</kbd>
                <span>navigate</span>
              </span>
              <span class="cp-footer-hint">
                <kbd class="cp-kbd">&crarr;</kbd>
                <span>open</span>
              </span>
              <span class="cp-footer-hint">
                <kbd class="cp-kbd">esc</kbd>
                <span>close</span>
              </span>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* ── Hint badge (bottom-right corner) ─────────────────────────── */
.cp-hint-badge {
  position: fixed;
  bottom: 1.25rem;
  right: 1.25rem;
  z-index: 90;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.4rem 0.65rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(5, 7, 15, 0.85);
  backdrop-filter: blur(12px);
  color: rgba(255, 255, 255, 0.45);
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.72rem;
  font-weight: 500;
  letter-spacing: 0.02em;
  cursor: pointer;
  transition: all 0.2s ease;
}
.cp-hint-badge:hover {
  border-color: rgba(20, 184, 166, 0.4);
  color: rgba(255, 255, 255, 0.7);
  background: rgba(5, 7, 15, 0.95);
  box-shadow: 0 0 20px rgba(20, 184, 166, 0.08);
}

/* ── Overlay ──────────────────────────────────────────────────── */
.cp-overlay {
  position: fixed;
  inset: 0;
  z-index: 300;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: min(18vh, 160px);
  background: rgba(5, 7, 15, 0.8);
  backdrop-filter: blur(20px);
}

/* ── Panel ────────────────────────────────────────────────────── */
.cp-panel {
  width: 100%;
  max-width: 640px;
  margin: 0 1rem;
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(10, 13, 25, 0.96);
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.03),
    0 24px 80px rgba(0, 0, 0, 0.6),
    0 0 60px rgba(20, 184, 166, 0.04);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* ── Input ────────────────────────────────────────────────────── */
.cp-input-wrapper {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.9rem 1.15rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}
.cp-input-icon {
  flex-shrink: 0;
  color: rgba(255, 255, 255, 0.35);
}
.cp-input {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  color: rgba(255, 255, 255, 0.92);
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  font-weight: 400;
  letter-spacing: -0.01em;
  caret-color: #14b8a6;
}
.cp-input::placeholder {
  color: rgba(255, 255, 255, 0.28);
}
.cp-input-hint {
  flex-shrink: 0;
}

/* ── Results area ─────────────────────────────────────────────── */
.cp-results {
  max-height: 380px;
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.08) transparent;
}
.cp-results::-webkit-scrollbar {
  width: 4px;
}
.cp-results::-webkit-scrollbar-track {
  background: transparent;
}
.cp-results::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 2px;
}

/* ── Empty state ──────────────────────────────────────────────── */
.cp-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
  padding: 2.5rem 1.5rem;
}
.cp-empty-icon {
  color: rgba(255, 255, 255, 0.15);
}
.cp-empty-text {
  color: rgba(255, 255, 255, 0.55);
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  text-align: center;
  line-height: 1.5;
}
.cp-empty-query {
  color: rgba(255, 255, 255, 0.55);
}

/* ── Result group ─────────────────────────────────────────────── */
.cp-group {
  padding: 0.35rem 0;
}
.cp-group-label {
  padding: 0.5rem 1.15rem 0.35rem;
  color: rgba(255, 255, 255, 0.3);
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

/* ── Individual result ────────────────────────────────────────── */
.cp-result {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.6rem 1.15rem;
  border: none;
  background: none;
  cursor: pointer;
  text-align: left;
  transition: background 0.12s ease;
}
.cp-result--active {
  background: rgba(20, 184, 166, 0.06);
}
.cp-result-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.45);
  transition: all 0.12s ease;
}
.cp-result--active .cp-result-icon {
  background: rgba(20, 184, 166, 0.1);
  border-color: rgba(20, 184, 166, 0.2);
  color: #14b8a6;
}
.cp-result-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}
.cp-result-title {
  color: rgba(255, 255, 255, 0.88);
  font-family: 'Inter', sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.cp-result-subtitle {
  color: rgba(255, 255, 255, 0.50);
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.cp-result-badge {
  flex-shrink: 0;
  padding: 0.15rem 0.5rem;
  border-radius: 0.35rem;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.50);
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.62rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.cp-result--active .cp-result-badge {
  background: rgba(20, 184, 166, 0.08);
  border-color: rgba(20, 184, 166, 0.15);
  color: rgba(20, 184, 166, 0.7);
}
.cp-result-arrow {
  flex-shrink: 0;
  color: rgba(255, 255, 255, 0);
  transition: all 0.15s ease;
}
.cp-result--active .cp-result-arrow {
  color: rgba(20, 184, 166, 0.5);
  transform: translateX(2px);
}

/* ── Highlight marks ──────────────────────────────────────────── */
:deep(.cp-highlight) {
  background: rgba(20, 184, 166, 0.18);
  color: #14b8a6;
  border-radius: 2px;
  padding: 0 1px;
}

/* ── Keyboard hints ───────────────────────────────────────────── */
.cp-kbd {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.3rem;
  height: 1.25rem;
  padding: 0 0.3rem;
  border-radius: 0.25rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.04);
  color: rgba(255, 255, 255, 0.35);
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.62rem;
  font-weight: 500;
  line-height: 1;
}

/* ── Footer ───────────────────────────────────────────────────── */
.cp-footer {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 0.6rem 1.15rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}
.cp-footer-hint {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  color: rgba(255, 255, 255, 0.25);
  font-family: 'Inter', sans-serif;
  font-size: 0.7rem;
}

/* ── Transitions ──────────────────────────────────────────────── */
.cp-overlay-enter-active {
  transition: opacity 0.2s ease;
}
.cp-overlay-leave-active {
  transition: opacity 0.15s ease;
}
.cp-overlay-enter-from,
.cp-overlay-leave-to {
  opacity: 0;
}

.cp-panel-enter-active {
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}
.cp-panel-leave-active {
  transition: all 0.12s ease-in;
}
.cp-panel-enter-from {
  opacity: 0;
  transform: scale(0.96) translateY(-8px);
}
.cp-panel-leave-to {
  opacity: 0;
  transform: scale(0.98) translateY(-4px);
}
</style>
