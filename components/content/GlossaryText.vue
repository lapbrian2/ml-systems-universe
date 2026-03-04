<script setup lang="ts">
import { computed } from 'vue'
import type { GlossaryTerm } from '~/types/chapter'

const props = defineProps<{
  text: string
  terms: GlossaryTerm[]
}>()

interface TextSegment {
  type: 'text' | 'term'
  value: string
  term?: string
  definition?: string
}

const segments = computed<TextSegment[]>(() => {
  if (!props.terms || props.terms.length === 0) {
    return [{ type: 'text', value: props.text }]
  }

  // Build a case-insensitive regex matching all glossary terms.
  // Sort by length descending so longer terms match first (e.g., "ML Systems" before "ML").
  const sorted = [...props.terms]
    .filter(t => t.term.length > 0)
    .sort((a, b) => b.term.length - a.term.length)
  if (sorted.length === 0) return [{ type: 'text', value: props.text }]
  const escaped = sorted.map((t) => t.term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  const pattern = new RegExp(`(${escaped.join('|')})`, 'gi')

  // Map lowercase term to its glossary entry for fast lookup.
  const termMap = new Map<string, GlossaryTerm>()
  for (const t of props.terms) {
    termMap.set(t.term.toLowerCase(), t)
  }

  const result: TextSegment[] = []
  const matched = new Set<string>() // Only highlight first occurrence of each term
  let lastIndex = 0

  const source = props.text
  let match: RegExpExecArray | null

  // Reset regex state
  pattern.lastIndex = 0

  while ((match = pattern.exec(source)) !== null) {
    const termKey = match[1].toLowerCase()

    // Only highlight the first occurrence of each term per paragraph
    if (matched.has(termKey)) {
      // Advance lastIndex past the duplicate to avoid text duplication
      continue
    }
    matched.add(termKey)

    const entry = termMap.get(termKey)
    if (!entry) continue

    // Push preceding plain text
    if (match.index > lastIndex) {
      result.push({ type: 'text', value: source.slice(lastIndex, match.index) })
    }

    // Push the matched term (preserve original casing from text)
    result.push({
      type: 'term',
      value: match[1],
      term: entry.term,
      definition: entry.definition,
    })

    lastIndex = match.index + match[1].length
  }

  // Push remaining text
  if (lastIndex < source.length) {
    result.push({ type: 'text', value: source.slice(lastIndex) })
  }

  return result.length > 0 ? result : [{ type: 'text', value: props.text }]
})
</script>

<template>
  <template v-for="(seg, i) in segments" :key="i">
    <GlossaryTooltip
      v-if="seg.type === 'term'"
      :term="seg.term!"
      :definition="seg.definition!"
    >
      {{ seg.value }}
    </GlossaryTooltip>
    <template v-else>{{ seg.value }}</template>
  </template>
</template>
