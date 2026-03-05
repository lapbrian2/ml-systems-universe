<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  StickyNote,
  Plus,
  Trash2,
  Download,
  X,
  PenLine,
} from 'lucide-vue-next'
import { useNotesStore } from '~/stores/notes'

const props = defineProps<{
  chapterId: string
  sectionId: string
  partColor: string
}>()

const notesStore = useNotesStore()
const isOpen = ref(false)
const newNoteText = ref('')
const editingId = ref<string | null>(null)
const editText = ref('')

const sectionNotes = computed(() =>
  notesStore.getNotesForSection(props.chapterId, props.sectionId)
)

const chapterNoteCount = computed(() =>
  notesStore.getNotesForChapter(props.chapterId).length
)

function addNote() {
  const text = newNoteText.value.trim()
  if (!text) return
  notesStore.addNote(props.chapterId, props.sectionId, text)
  newNoteText.value = ''
}

function startEdit(note: { id: string; text: string }) {
  editingId.value = note.id
  editText.value = note.text
}

function saveEdit() {
  if (editingId.value && editText.value.trim()) {
    notesStore.updateNote(editingId.value, editText.value.trim())
  }
  editingId.value = null
  editText.value = ''
}

function deleteNote(id: string) {
  notesStore.deleteNote(id)
  if (editingId.value === id) {
    editingId.value = null
  }
}

function exportNotes() {
  const md = notesStore.exportAsMarkdown(props.chapterId)
  const blob = new Blob([md], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${props.chapterId}-notes.md`
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <div class="relative">
    <!-- Toggle button -->
    <button
      class="flex items-center gap-1 text-[10px] px-2 py-1 rounded transition-colors"
      :class="isOpen ? 'bg-white/[0.06] text-white/60' : 'text-white/25 hover:text-white/45'"
      :aria-label="`Notes for this section (${sectionNotes.length})`"
      @click="isOpen = !isOpen"
    >
      <StickyNote class="w-3 h-3" />
      <span v-if="sectionNotes.length > 0">{{ sectionNotes.length }}</span>
    </button>

    <!-- Notes panel (dropdown) -->
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-1"
      leave-active-class="transition-all duration-150 ease-in"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <div
        v-if="isOpen"
        class="absolute top-8 right-0 z-30 w-72 max-h-80 glass-panel--floating rounded-xl border border-white/[0.06] shadow-xl overflow-hidden"
      >
        <!-- Header -->
        <div class="flex items-center justify-between px-3 py-2 border-b border-white/[0.06]">
          <span class="text-[10px] font-semibold text-white/50">Section Notes</span>
          <div class="flex items-center gap-1">
            <button
              v-if="chapterNoteCount > 0"
              class="p-1 rounded text-white/25 hover:text-white/50 transition-colors"
              aria-label="Export notes as Markdown"
              @click="exportNotes"
            >
              <Download class="w-3 h-3" />
            </button>
            <button
              class="p-1 rounded text-white/25 hover:text-white/50 transition-colors"
              aria-label="Close notes panel"
              @click="isOpen = false"
            >
              <X class="w-3 h-3" />
            </button>
          </div>
        </div>

        <!-- Notes list -->
        <div class="overflow-y-auto max-h-48 p-2 space-y-2">
          <div v-if="sectionNotes.length === 0" class="py-4 text-center">
            <PenLine class="w-4 h-4 text-white/15 mx-auto mb-1" />
            <p class="text-[10px] text-white/25">No notes yet. Add one below.</p>
          </div>

          <div
            v-for="note in sectionNotes"
            :key="note.id"
            class="group rounded-lg bg-white/[0.02] p-2.5 border border-white/[0.04]"
          >
            <template v-if="editingId === note.id">
              <textarea
                v-model="editText"
                class="w-full bg-transparent text-xs text-white/70 resize-none outline-none min-h-[40px]"
                @keydown.enter.meta="saveEdit"
                @keydown.escape="editingId = null"
              />
              <div class="flex justify-end gap-1 mt-1">
                <button class="text-[9px] text-white/30 hover:text-white/50" @click="editingId = null">Cancel</button>
                <button class="text-[9px] text-primary" @click="saveEdit">Save</button>
              </div>
            </template>
            <template v-else>
              <p class="text-xs text-white/60 leading-relaxed whitespace-pre-wrap">{{ note.text }}</p>
              <div class="flex justify-end gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  class="p-0.5 text-white/20 hover:text-white/40"
                  aria-label="Edit note"
                  @click="startEdit(note)"
                >
                  <PenLine class="w-2.5 h-2.5" />
                </button>
                <button
                  class="p-0.5 text-white/20 hover:text-red-400"
                  aria-label="Delete note"
                  @click="deleteNote(note.id)"
                >
                  <Trash2 class="w-2.5 h-2.5" />
                </button>
              </div>
            </template>
          </div>
        </div>

        <!-- Add note -->
        <div class="p-2 border-t border-white/[0.06]">
          <div class="flex gap-1.5">
            <input
              v-model="newNoteText"
              class="flex-1 bg-white/[0.03] border border-white/[0.06] rounded-lg px-2.5 py-1.5 text-xs text-white/70 placeholder-white/20 outline-none focus:border-primary/30"
              placeholder="Add a note..."
              @keydown.enter="addNote"
            />
            <button
              class="px-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              :disabled="!newNoteText.trim()"
              aria-label="Add note"
              @click="addNote"
            >
              <Plus class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
