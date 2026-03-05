<script setup lang="ts">
import { ref, computed } from 'vue'
import { Copy, Check, Terminal } from 'lucide-vue-next'

const props = defineProps<{
  language: string
  code: string
  caption?: string
}>()

const copied = ref(false)
let copyTimeout: ReturnType<typeof setTimeout> | null = null

function copyCode() {
  if (!navigator.clipboard) return
  navigator.clipboard.writeText(props.code).then(() => {
    copied.value = true
    if (copyTimeout) clearTimeout(copyTimeout)
    copyTimeout = setTimeout(() => { copied.value = false }, 2000)
  }).catch(() => {})
}

// Lightweight syntax highlighting
const highlighted = computed(() => highlightCode(props.code, props.language))

function highlightCode(code: string, lang: string): string {
  const escaped = escapeHtml(code)

  if (lang === 'python' || lang === 'py') return highlightPython(escaped)
  if (lang === 'javascript' || lang === 'js' || lang === 'typescript' || lang === 'ts') return highlightJS(escaped)
  if (lang === 'bash' || lang === 'shell' || lang === 'sh') return highlightBash(escaped)
  if (lang === 'yaml' || lang === 'yml') return highlightYaml(escaped)
  return escaped
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function highlightPython(code: string): string {
  // Order matters: comments first, then strings, then keywords
  return code
    // Comments
    .replace(/(#.*)$/gm, '<span class="tok-comment">$1</span>')
    // Triple-quoted strings
    .replace(/(&#39;&#39;&#39;[\s\S]*?&#39;&#39;&#39;|&quot;&quot;&quot;[\s\S]*?&quot;&quot;&quot;)/g, '<span class="tok-string">$1</span>')
    // Strings
    .replace(/(f?(?:&quot;(?:[^&]|&(?!quot;))*&quot;|&#39;(?:[^&]|&(?!#39;))*&#39;))/g, '<span class="tok-string">$1</span>')
    // Decorators
    .replace(/^(\s*)(@\w+)/gm, '$1<span class="tok-decorator">$2</span>')
    // Numbers
    .replace(/\b(\d+\.?\d*(?:e[+-]?\d+)?)\b/gi, '<span class="tok-number">$1</span>')
    // Keywords
    .replace(/\b(def|class|return|if|elif|else|for|while|import|from|as|try|except|finally|raise|with|yield|lambda|pass|break|continue|and|or|not|in|is|None|True|False|self|async|await|global|nonlocal|assert|del|print)\b/g, '<span class="tok-keyword">$1</span>')
    // Built-in functions
    .replace(/\b(len|range|enumerate|zip|map|filter|list|dict|set|tuple|int|float|str|bool|type|isinstance|super|property|staticmethod|classmethod|print|input|open|sorted|reversed|min|max|sum|any|all|abs|round)\b/g, '<span class="tok-builtin">$1</span>')
}

function highlightJS(code: string): string {
  return code
    .replace(/(\/\/.*)$/gm, '<span class="tok-comment">$1</span>')
    .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="tok-comment">$1</span>')
    .replace(/((?:`(?:[^`\\]|\\.)*`)|(?:&quot;(?:[^&\\]|\\.)*&quot;)|(?:&#39;(?:[^&\\]|\\.)*&#39;))/g, '<span class="tok-string">$1</span>')
    .replace(/\b(\d+\.?\d*(?:e[+-]?\d+)?)\b/gi, '<span class="tok-number">$1</span>')
    .replace(/\b(const|let|var|function|return|if|else|for|while|class|extends|import|export|from|default|new|this|async|await|try|catch|finally|throw|typeof|instanceof|null|undefined|true|false|yield|of|in|switch|case|break|continue)\b/g, '<span class="tok-keyword">$1</span>')
    .replace(/\b(console|Math|Array|Object|String|Number|Promise|Map|Set|JSON|Date|Error|RegExp|Symbol|parseInt|parseFloat|setTimeout|setInterval|fetch|require)\b/g, '<span class="tok-builtin">$1</span>')
}

function highlightBash(code: string): string {
  return code
    .replace(/(#.*)$/gm, '<span class="tok-comment">$1</span>')
    .replace(/((?:&quot;(?:[^&\\]|\\.)*&quot;)|(?:&#39;(?:[^&\\]|\\.)*&#39;))/g, '<span class="tok-string">$1</span>')
    .replace(/\b(\d+\.?\d*)\b/g, '<span class="tok-number">$1</span>')
    .replace(/\b(sudo|apt|npm|pip|curl|wget|git|docker|cd|ls|mkdir|rm|cp|mv|cat|echo|export|source|chmod|chown|grep|sed|awk|find|tar|ssh|scp|kill|ps|top|df|du)\b/g, '<span class="tok-keyword">$1</span>')
    .replace(/(\$\w+)/g, '<span class="tok-variable">$1</span>')
}

function highlightYaml(code: string): string {
  return code
    .replace(/(#.*)$/gm, '<span class="tok-comment">$1</span>')
    .replace(/((?:&quot;(?:[^&\\]|\\.)*&quot;)|(?:&#39;(?:[^&\\]|\\.)*&#39;))/g, '<span class="tok-string">$1</span>')
    .replace(/^(\s*[\w.-]+)(:)/gm, '<span class="tok-keyword">$1</span>$2')
    .replace(/\b(true|false|null|yes|no)\b/gi, '<span class="tok-builtin">$1</span>')
    .replace(/\b(\d+\.?\d*)\b/g, '<span class="tok-number">$1</span>')
}
</script>

<template>
  <div class="my-5">
    <div class="code-block group">
      <!-- Top bar -->
      <div class="code-block__header">
        <div class="flex items-center gap-2">
          <Terminal class="w-3 h-3 text-white/20" />
          <span class="code-block__lang" :style="{ color: `${language === 'python' ? '#a855f7' : language === 'bash' ? '#22c55e' : '#f0a500'}` }">
            {{ language }}
          </span>
        </div>

        <button
          class="code-block__copy"
          :aria-label="copied ? 'Copied to clipboard' : 'Copy code'"
          @click="copyCode()"
        >
          <span class="flex items-center gap-1.5">
            <Check v-if="copied" class="w-3 h-3 text-accent-green" />
            <Copy v-else class="w-3 h-3" />
            <span>{{ copied ? 'Copied!' : 'Copy' }}</span>
          </span>
        </button>
      </div>

      <!-- Code area with line numbers -->
      <div class="overflow-x-auto">
        <pre class="code-block__pre"><code v-html="highlighted"></code></pre>
      </div>
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

<style>
/* Syntax token colors - cosmic dark theme */
.tok-keyword { color: #c792ea; font-weight: 500; }
.tok-string { color: #c3e88d; }
.tok-comment { color: #546e7a; font-style: italic; }
.tok-number { color: #f78c6c; }
.tok-builtin { color: #82aaff; }
.tok-decorator { color: #ffcb6b; }
.tok-variable { color: #89ddff; }
</style>
