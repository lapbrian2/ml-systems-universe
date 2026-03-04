<script setup lang="ts">
import type { ContentBlock, GlossaryTerm } from '~/types/chapter'

defineProps<{
  blocks: ContentBlock[]
  glossary?: GlossaryTerm[]
}>()
</script>

<template>
  <div class="content-blocks space-y-5">
    <template v-for="(block, idx) in blocks" :key="idx">
      <!-- Paragraph -->
      <p
        v-if="block.type === 'paragraph'"
        class="text-[14.5px] leading-[1.85] text-white/60 tracking-[0.005em]"
      >
        <GlossaryText
          v-if="glossary && glossary.length > 0"
          :text="block.text"
          :terms="glossary"
        />
        <template v-else>{{ block.text }}</template>
      </p>

      <!-- Heading -->
      <h2
        v-else-if="block.type === 'heading' && block.level === 2"
        class="font-display text-lg font-semibold text-white mt-8 mb-3"
      >
        {{ block.text }}
      </h2>
      <h3
        v-else-if="block.type === 'heading' && block.level === 3"
        class="font-display text-base font-semibold text-white/90 mt-6 mb-2"
      >
        {{ block.text }}
      </h3>

      <!-- Callout -->
      <CalloutBox
        v-else-if="block.type === 'callout'"
        :variant="block.variant"
        :title="block.title"
        :text="block.text"
      />

      <!-- Figure -->
      <FigureBlock
        v-else-if="block.type === 'figure'"
        :src="block.src"
        :caption="block.caption"
        :alt="block.alt"
        :number="block.number"
        :component="block.component"
      />

      <!-- Code -->
      <CodeBlock
        v-else-if="block.type === 'code'"
        :language="block.language"
        :code="block.code"
        :caption="block.caption"
      />

      <!-- Table -->
      <DataTable
        v-else-if="block.type === 'table'"
        :headers="block.headers"
        :rows="block.rows"
        :caption="block.caption"
      />

      <!-- List -->
      <component
        v-else-if="block.type === 'list'"
        :is="block.ordered ? 'ol' : 'ul'"
        :class="[
          'pl-5 space-y-1.5 text-sm leading-[1.8] text-white/65',
          block.ordered ? 'list-decimal' : 'list-disc',
        ]"
      >
        <li
          v-for="(item, liIdx) in block.items"
          :key="liIdx"
          class="pl-1 marker:text-white/25"
        >
          {{ item }}
        </li>
      </component>

      <!-- Quote -->
      <QuoteBlock
        v-else-if="block.type === 'quote'"
        :text="block.text"
        :attribution="block.attribution"
      />

      <!-- Definition -->
      <DefinitionBox
        v-else-if="block.type === 'definition'"
        :term="block.term"
        :definition="block.definition"
      />

      <!-- Equation -->
      <EquationBlock
        v-else-if="block.type === 'equation'"
        :latex="block.latex"
        :label="block.label"
      />
    </template>
  </div>
</template>
