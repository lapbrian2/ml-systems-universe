<script setup lang="ts">
defineProps<{
  headers: string[]
  rows: string[][]
  caption?: string
}>()
</script>

<template>
  <div class="my-4">
    <!-- Scrollable wrapper -->
    <div class="overflow-x-auto rounded-lg border border-white/[0.06]">
      <table class="w-full text-sm">
        <caption v-if="caption" class="sr-only">{{ caption }}</caption>
        <!-- Header -->
        <thead>
          <tr class="bg-primary/10">
            <th
              v-for="(header, hIdx) in headers"
              :key="hIdx"
              scope="col"
              class="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-primary whitespace-nowrap"
            >
              {{ header }}
            </th>
          </tr>
        </thead>

        <!-- Body -->
        <tbody>
          <tr
            v-for="(row, rIdx) in rows"
            :key="rIdx"
            :class="[
              'border-t border-white/[0.04] transition-colors',
              rIdx % 2 === 0 ? 'bg-white/[0.01]' : 'bg-white/[0.03]',
            ]"
          >
            <td
              v-for="(cell, cIdx) in row"
              :key="cIdx"
              class="px-4 py-2.5 text-white/55"
            >
              {{ cell }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Caption -->
    <p
      v-if="caption"
      class="mt-2 text-xs text-white/35 italic text-center"
    >
      {{ caption }}
    </p>
  </div>
</template>
