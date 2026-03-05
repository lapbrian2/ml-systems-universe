<script setup lang="ts">
import { ref, computed, onBeforeUnmount, nextTick } from 'vue'
import { Play, RotateCcw, Copy, Check, Terminal, Loader2, Square, ChevronDown, ChevronUp } from 'lucide-vue-next'

const props = defineProps<{
  code: string
  partColor?: string
}>()

// State
const editableCode = ref(props.code)
const output = ref('')
const isLoading = ref(false)
const isRunning = ref(false)
const hasRun = ref(false)
const copied = ref(false)
const showOutput = ref(false)
let copyTimeout: ReturnType<typeof setTimeout> | null = null

// Global Pyodide cache (shared across all CodePlayground instances)
let pyodidePromise: Promise<unknown> | null = null

function getPyodide(): Promise<unknown> {
  if (pyodidePromise) return pyodidePromise

  pyodidePromise = new Promise((resolve, reject) => {
    const win = window as unknown as Record<string, unknown>

    // Check if already loaded
    if (win.loadPyodide) {
      ;(win.loadPyodide as () => Promise<unknown>)()
        .then(resolve)
        .catch(reject)
      return
    }

    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/pyodide/v0.27.1/full/pyodide.js'
    script.integrity = 'sha256-6wvt8h4MiiNneB+ZGz3GvXRP6IBZmfM4s2j1okjMgRc='
    script.crossOrigin = 'anonymous'
    script.onload = () => {
      ;(win.loadPyodide as () => Promise<unknown>)()
        .then(resolve)
        .catch(reject)
    }
    script.onerror = () => {
      pyodidePromise = null
      reject(new Error('Failed to load Pyodide from CDN'))
    }
    document.head.appendChild(script)
  })

  return pyodidePromise
}

// Syntax highlighting (reuse from CodeBlock patterns)
const highlighted = computed(() => highlightPython(escapeHtml(editableCode.value)))

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function highlightPython(code: string): string {
  return code
    .replace(/(#.*)$/gm, '<span class="tok-comment">$1</span>')
    .replace(/(&#39;&#39;&#39;[\s\S]*?&#39;&#39;&#39;|&quot;&quot;&quot;[\s\S]*?&quot;&quot;&quot;)/g, '<span class="tok-string">$1</span>')
    .replace(/(f?(?:&quot;(?:[^&]|&(?!quot;))*&quot;|&#39;(?:[^&]|&(?!#39;))*&#39;))/g, '<span class="tok-string">$1</span>')
    .replace(/^(\s*)(@\w+)/gm, '$1<span class="tok-decorator">$2</span>')
    .replace(/\b(\d+\.?\d*(?:e[+-]?\d+)?)\b/gi, '<span class="tok-number">$1</span>')
    .replace(/\b(def|class|return|if|elif|else|for|while|import|from|as|try|except|finally|raise|with|yield|lambda|pass|break|continue|and|or|not|in|is|None|True|False|self|async|await|global|nonlocal|assert|del|print)\b/g, '<span class="tok-keyword">$1</span>')
    .replace(/\b(len|range|enumerate|zip|map|filter|list|dict|set|tuple|int|float|str|bool|type|isinstance|super|property|staticmethod|classmethod|print|input|open|sorted|reversed|min|max|sum|any|all|abs|round)\b/g, '<span class="tok-builtin">$1</span>')
}

async function runCode() {
  if (isRunning.value) return

  isLoading.value = true
  isRunning.value = true
  output.value = ''
  showOutput.value = true
  hasRun.value = true

  try {
    const pyodide = await getPyodide() as Record<string, unknown>
    isLoading.value = false

    // Collect stdout/stderr via Pyodide's built-in capture
    const outputLines: string[] = []
    const errorLines: string[] = []

    // Use Pyodide's setStdout/setStderr for reliable capture
    const setStdout = pyodide.setStdout as ((opts: { batched: (text: string) => void }) => void) | undefined
    const setStderr = pyodide.setStderr as ((opts: { batched: (text: string) => void }) => void) | undefined

    if (setStdout) {
      setStdout({ batched: (text: string) => outputLines.push(text) })
    }
    if (setStderr) {
      setStderr({ batched: (text: string) => errorLines.push(text) })
    }

    const codeToRun = editableCode.value
    const timeoutMs = 10000
    const runPython = pyodide.runPythonAsync as (code: string) => Promise<unknown>

    // First: try running the code directly
    let result: unknown
    try {
      result = await Promise.race([
        runPython(codeToRun),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Execution timed out after 10 seconds')), timeoutMs)
        ),
      ])
    } catch (runErr: unknown) {
      const msg = runErr instanceof Error ? runErr.message : String(runErr)

      // If it failed due to missing modules, produce a helpful walkthrough
      if (msg.includes('ModuleNotFoundError') || msg.includes('No module named')) {
        const missingMatch = msg.match(/No module named '([^']+)'/)
        const missingLib = missingMatch ? missingMatch[1] : 'unknown'

        // Parse the code to explain what it does
        const lines = codeToRun.split('\n')
        const imports: string[] = []
        const actions: string[] = []

        for (const line of lines) {
          const trimmed = line.trim()
          if (!trimmed || trimmed.startsWith('#')) continue
          if (trimmed.startsWith('import ') || trimmed.startsWith('from ')) {
            imports.push(trimmed)
          } else if (trimmed.includes('=') || trimmed.includes('(')) {
            // Summarize key actions
            const clean = trimmed.replace(/\s*#.*$/, '').trim()
            if (clean.length > 0 && clean.length < 100) {
              actions.push(clean)
            }
          }
        }

        outputLines.push(`⚠ This code requires "${missingLib}" which is not available in the browser.`)
        outputLines.push('')
        outputLines.push('📦 To run locally, install:')
        outputLines.push(`   pip install ${imports.map(i => {
          const m = i.match(/(?:import|from)\s+(\w+)/)
          return m ? m[1] : ''
        }).filter(Boolean).filter((v, i, a) => a.indexOf(v) === i).join(' ')}`)
        outputLines.push('')
        outputLines.push('📋 What this code does:')
        const comments = lines
          .filter(l => l.trim().startsWith('#') && !l.trim().startsWith('#!'))
          .map(l => l.trim().replace(/^#+\s*/, ''))
          .filter(c => c.length > 5)
        if (comments.length > 0) {
          comments.slice(0, 8).forEach(c => outputLines.push(`   • ${c}`))
        } else if (actions.length > 0) {
          actions.slice(0, 6).forEach(a => outputLines.push(`   → ${a}`))
        }

        result = undefined
      } else {
        // Other errors: show them
        outputLines.push(msg)
        result = undefined
      }
    }

    let finalOutput = ''
    if (outputLines.length > 0) finalOutput += outputLines.join('\n')
    if (errorLines.length > 0) finalOutput += (finalOutput ? '\n' : '') + errorLines.join('\n')
    if (result !== undefined && result !== null && outputLines.length === 0) {
      finalOutput += (finalOutput ? '\n' : '') + String(result)
    }

    output.value = finalOutput || '(No output — add print() statements to see results)'
  } catch (err: unknown) {
    isLoading.value = false
    const message = err instanceof Error ? err.message : String(err)
    output.value = message
  } finally {
    isRunning.value = false
  }
}

function resetCode() {
  editableCode.value = props.code
  output.value = ''
  hasRun.value = false
  showOutput.value = false
}

function copyCode() {
  if (!navigator.clipboard) return
  navigator.clipboard.writeText(editableCode.value).then(() => {
    copied.value = true
    if (copyTimeout) clearTimeout(copyTimeout)
    copyTimeout = setTimeout(() => { copied.value = false }, 2000)
  }).catch(() => {})
}

function handleTab(e: KeyboardEvent) {
  const target = e.target as HTMLTextAreaElement
  e.preventDefault()
  const start = target.selectionStart
  const end = target.selectionEnd
  editableCode.value = editableCode.value.substring(0, start) + '    ' + editableCode.value.substring(end)
  nextTick(() => {
    target.selectionStart = target.selectionEnd = start + 4
  })
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Tab') {
    handleTab(e)
  } else if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    e.preventDefault()
    runCode()
  }
}

// Line count for gutter
const lineCount = computed(() => editableCode.value.split('\n').length)

const accentColor = computed(() => props.partColor || '#a855f7')

onBeforeUnmount(() => {
  if (copyTimeout) clearTimeout(copyTimeout)
})
</script>

<template>
  <ClientOnly>
    <div class="my-5">
      <div class="playground overflow-hidden">
        <!-- Header bar -->
        <div class="playground__header">
          <div class="flex items-center gap-2">
            <Terminal class="w-3 h-3 text-white/20" />
            <span class="playground__lang" :style="{ color: accentColor }">
              python
            </span>
            <span class="playground__badge">interactive</span>
          </div>

          <div class="flex items-center gap-1.5">
            <!-- Copy button -->
            <button
              class="playground__btn"
              :aria-label="copied ? 'Copied to clipboard' : 'Copy code'"
              @click="copyCode()"
            >
              <Check v-if="copied" class="w-3 h-3 text-green-400" />
              <Copy v-else class="w-3 h-3" />
              <span class="hidden sm:inline">{{ copied ? 'Copied!' : 'Copy' }}</span>
            </button>

            <!-- Reset button -->
            <button
              class="playground__btn"
              aria-label="Reset code to original"
              :disabled="editableCode === code && !hasRun"
              @click="resetCode()"
            >
              <RotateCcw class="w-3 h-3" />
              <span class="hidden sm:inline">Reset</span>
            </button>

            <!-- Run button -->
            <button
              class="playground__run"
              :style="{ '--accent': accentColor }"
              :disabled="isRunning"
              aria-label="Run Python code (Ctrl+Enter)"
              @click="runCode()"
            >
              <Loader2 v-if="isLoading" class="w-3.5 h-3.5 animate-spin" />
              <Square v-else-if="isRunning" class="w-3 h-3" />
              <Play v-else class="w-3.5 h-3.5" />
              <span>{{ isLoading ? 'Loading...' : isRunning ? 'Running' : 'Run' }}</span>
            </button>
          </div>
        </div>

        <!-- Editor area -->
        <div class="playground__editor">
          <!-- Line numbers -->
          <div class="playground__gutter" aria-hidden="true">
            <div v-for="n in lineCount" :key="n" class="playground__line-num">{{ n }}</div>
          </div>

          <!-- Editable textarea (on top, invisible) -->
          <textarea
            v-model="editableCode"
            class="playground__textarea"
            spellcheck="false"
            autocomplete="off"
            autocorrect="off"
            autocapitalize="off"
            wrap="off"
            aria-label="Python code editor. Press Ctrl+Enter to run."
            @keydown="handleKeydown"
          />

          <!-- Highlighted display (behind textarea) -->
          <pre class="playground__display"><code v-html="highlighted"/></pre>
        </div>

        <div class="playground__hint">
          <kbd>Ctrl</kbd>+<kbd>Enter</kbd> to run
        </div>

        <!-- Output panel -->
        <div v-if="hasRun" class="playground__output-section">
          <button
            class="playground__output-toggle"
            @click="showOutput = !showOutput"
          >
            <div class="flex items-center gap-2">
              <Terminal class="w-3 h-3 text-white/30" />
              <span>Output</span>
            </div>
            <ChevronUp v-if="showOutput" class="w-3.5 h-3.5 text-white/30" />
            <ChevronDown v-else class="w-3.5 h-3.5 text-white/30" />
          </button>

          <div v-if="showOutput" class="playground__output">
            <Loader2 v-if="isRunning && !output" class="w-4 h-4 animate-spin text-white/30 mx-auto" />
            <pre v-else class="playground__output-text" :class="{ 'playground__output-text--error': output.includes('Traceback') || (output.startsWith('Error:') && !output.includes('📋')) }">{{ output }}</pre>
          </div>
        </div>
      </div>
    </div>

    <!-- SSR fallback: show static code block -->
    <template #fallback>
      <div class="my-5">
        <div class="code-block">
          <div class="code-block__header">
            <div class="flex items-center gap-2">
              <Terminal class="w-3 h-3 text-white/20" />
              <span class="code-block__lang" style="color: #a855f7">python</span>
            </div>
          </div>
          <div class="overflow-x-auto">
            <pre class="code-block__pre"><code v-html="highlighted"/></pre>
          </div>
        </div>
      </div>
    </template>
  </ClientOnly>
</template>

<style>
/* ── Playground container ── */
.playground {
  position: relative;
  background: linear-gradient(180deg, #0d1225 0%, #0a0e1a 100%);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  overflow: hidden;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}
.playground:hover {
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3);
}

/* ── Header ── */
.playground__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(255, 255, 255, 0.02);
}
.playground__lang {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.playground__badge {
  font-size: 9px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.05);
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

/* ── Buttons ── */
.playground__btn {
  appearance: none;
  border: none;
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.4);
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 5px;
}
.playground__btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.12);
  color: rgba(255, 255, 255, 0.8);
}
.playground__btn:disabled {
  opacity: 0.3;
  cursor: default;
}

.playground__run {
  appearance: none;
  border: 1px solid color-mix(in srgb, var(--accent, #a855f7) 40%, transparent);
  background: color-mix(in srgb, var(--accent, #a855f7) 15%, transparent);
  color: var(--accent, #a855f7);
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 5px;
}
.playground__run:hover:not(:disabled) {
  background: color-mix(in srgb, var(--accent, #a855f7) 25%, transparent);
  border-color: color-mix(in srgb, var(--accent, #a855f7) 60%, transparent);
}
.playground__run:disabled {
  opacity: 0.6;
  cursor: default;
}

/* ── Editor (layered textarea + highlighted pre) ── */
.playground__editor {
  position: relative;
  display: flex;
  min-height: 80px;
}

.playground__gutter {
  flex-shrink: 0;
  padding: 18px 0 18px 16px;
  width: 40px;
  text-align: right;
  user-select: none;
  pointer-events: none;
}
.playground__line-num {
  font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
  font-size: 11px;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.12);
}

.playground__textarea {
  position: absolute;
  top: 0;
  left: 40px;
  right: 0;
  bottom: 0;
  padding: 18px 18px 18px 12px;
  font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
  font-size: 13px;
  line-height: 1.7;
  color: transparent;
  background: transparent;
  border: none;
  outline: none;
  resize: none;
  caret-color: #c9d1d9;
  white-space: pre;
  overflow-x: auto;
  z-index: 2;
  tab-size: 4;
  -moz-tab-size: 4;
}
.playground__textarea::selection {
  background: rgba(168, 85, 247, 0.25);
}

.playground__display {
  margin: 0;
  padding: 18px 18px 18px 12px;
  flex: 1;
  font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
  font-size: 13px;
  line-height: 1.7;
  color: #c9d1d9;
  white-space: pre;
  word-break: normal;
  word-wrap: normal;
  overflow-x: auto;
  pointer-events: none;
  z-index: 1;
}
.playground__display code {
  font-family: inherit;
}

/* ── Hint ── */
.playground__hint {
  padding: 4px 16px 6px;
  font-size: 10px;
  color: rgba(255, 255, 255, 0.15);
  text-align: right;
  user-select: none;
}
.playground__hint kbd {
  display: inline-block;
  padding: 0 4px;
  font-size: 9px;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 3px;
  color: rgba(255, 255, 255, 0.25);
}

/* ── Output section ── */
.playground__output-section {
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.playground__output-toggle {
  appearance: none;
  border: none;
  background: rgba(255, 255, 255, 0.015);
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.35);
  cursor: pointer;
  transition: background 0.2s ease;
}
.playground__output-toggle:hover {
  background: rgba(255, 255, 255, 0.03);
}

.playground__output {
  padding: 14px 18px;
  background: rgba(0, 0, 0, 0.25);
  min-height: 40px;
}

.playground__output-text {
  margin: 0;
  font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
  font-size: 12px;
  line-height: 1.6;
  color: rgba(195, 232, 141, 0.85);
  white-space: pre-wrap;
  word-break: break-word;
}
.playground__output-text--error {
  color: rgba(248, 113, 113, 0.9);
}
</style>
