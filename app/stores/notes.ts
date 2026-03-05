import { defineStore } from 'pinia'

export interface Note {
  id: string;
  chapterId: string;
  sectionId: string;
  text: string;
  selectedText?: string; // text that was highlighted
  createdAt: string;
  updatedAt: string;
}

export const useNotesStore = defineStore('notes', {
  state: () => ({
    notes: {} as Record<string, Note>, // keyed by note.id
  }),

  getters: {
    getNotesForChapter: (state) => (chapterId: string): Note[] => {
      return Object.values(state.notes)
        .filter(n => n.chapterId === chapterId)
        .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    },

    getNotesForSection: (state) => (chapterId: string, sectionId: string): Note[] => {
      return Object.values(state.notes)
        .filter(n => n.chapterId === chapterId && n.sectionId === sectionId)
        .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    },

    getNoteCount: (state): number => {
      return Object.keys(state.notes).length
    },

    getAllNotes: (state): Note[] => {
      return Object.values(state.notes)
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    },
  },

  actions: {
    addNote(chapterId: string, sectionId: string, text: string, selectedText?: string) {
      const id = `note-${crypto.randomUUID()}`
      const now = new Date().toISOString()
      this.notes[id] = {
        id,
        chapterId,
        sectionId,
        text,
        selectedText,
        createdAt: now,
        updatedAt: now,
      }
      return id
    },

    updateNote(id: string, text: string) {
      if (this.notes[id]) {
        this.notes[id].text = text
        this.notes[id].updatedAt = new Date().toISOString()
      }
    },

    deleteNote(id: string) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete this.notes[id]
    },

    exportAsMarkdown(chapterId?: string): string {
      const notes = chapterId
        ? this.getNotesForChapter(chapterId)
        : this.getAllNotes

      if (notes.length === 0) return '# My Notes\n\nNo notes yet.'

      let md = '# My ML Systems Notes\n\n'
      let currentChapter = ''

      for (const note of notes) {
        if (note.chapterId !== currentChapter) {
          currentChapter = note.chapterId
          md += `## ${note.chapterId}\n\n`
        }
        if (note.selectedText) {
          md += `> ${note.selectedText}\n\n`
        }
        md += `${note.text}\n\n`
        md += `---\n\n`
      }

      return md
    },
  },

  persist: true,
})
