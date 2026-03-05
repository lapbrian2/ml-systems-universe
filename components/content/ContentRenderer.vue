<script setup lang="ts">
import { ref } from 'vue'
import type { ContentBlock, GlossaryTerm } from '~/types/chapter'
import { useScrollReveal } from '~/composables/useScrollReveal'

defineProps<{
  blocks: ContentBlock[]
  glossary?: GlossaryTerm[]
}>()

const containerRef = ref<HTMLElement | null>(null)

useScrollReveal(() => containerRef.value)
</script>

<template>
  <div ref="containerRef" class="content-blocks space-y-5">
    <template v-for="(block, idx) in blocks" :key="idx">
      <!-- Paragraph -->
      <p
        v-if="block.type === 'paragraph'"
        class="reveal-text text-[15px] leading-[1.8] text-white/60 tracking-[0.005em]"
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

      <!-- Code: Python gets interactive playground, others get static display -->
      <CodePlayground
        v-else-if="block.type === 'code' && (block.language === 'python' || block.language === 'py')"
        :code="block.code"
      />
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

      <!-- Interactive Equation -->
      <InteractiveEquation
        v-else-if="block.type === 'interactive-equation'"
        :latex="block.latex"
        :variables="block.variables"
        :compute-result="block.computeResult"
        :result-label="block.resultLabel"
      />

      <!-- Mini Viz -->
      <MiniViz
        v-else-if="block.type === 'mini-viz'"
        :viz-type="block.vizType"
        :config="block.config"
      />

      <!-- Stat -->
      <AnimatedStat
        v-else-if="block.type === 'stat'"
        :value="block.value"
        :suffix="block.suffix"
        :prefix="block.prefix"
        :label="block.label"
      />

      <!-- Inline Check -->
      <InlineCheck
        v-else-if="block.type === 'inline-check'"
        :question="block.question"
        :options="block.options"
        :correct-index="block.correctIndex"
        :explanation="block.explanation"
        :hint="block.hint"
      />

      <!-- Aha Annotation -->
      <p
        v-else-if="block.type === 'aha'"
        class="reveal-text text-[15px] leading-[1.8] text-white/60 tracking-[0.005em]"
      >
        <AhaAnnotation
          :highlight="block.highlight"
          :explanation="block.explanation"
          :analogy="block.analogy"
        />
      </p>

      <!-- Parameter Playground -->
      <ParameterPlayground
        v-else-if="block.type === 'playground'"
        :title="block.title"
        :description="block.description"
        :parameters="block.parameters"
        :compute-fn="block.computeFn"
        :chart-type="block.chartType"
      />
    </template>
  </div>
</template>
