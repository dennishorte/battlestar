<template>
  <OffCanvas id="notes-off-canvas" ref="offcanvas">
    <template #header>Notes</template>

    <div class="notes-container">
      <textarea
        v-model="noteText"
        placeholder="Write your notes here..."
        :class="{ 'over-limit': isOverLimit }"
        @input="handleInput"
        @keydown.ctrl.s.prevent="saveNow"
        @keydown.meta.s.prevent="saveNow"
      />

      <div class="notes-footer">
        <div class="footer-left">
          <span class="save-status" :class="statusClass">{{ statusText }}</span>
          <span class="char-count" :class="{ 'over-limit': isOverLimit }">
            {{ charCount }} / {{ charLimit }}
          </span>
        </div>
        <button @click="saveNow" :disabled="!hasUnsavedChanges">Save</button>
      </div>
    </div>

    <div
      class="toggle"
      data-bs-toggle="offcanvas"
      data-bs-target="#notes-off-canvas"
    >
      <span class="toggle-label">Notes</span>
    </div>
  </OffCanvas>
</template>


<script>
import OffCanvas from '@/components/OffCanvas.vue'
import axiosWrapper from '@/util/axiosWrapper.js'


const CHAR_LIMIT = 10000

export default {
  name: 'NotesOffCanvas',

  components: {
    OffCanvas,
  },

  inject: ['game'],

  data() {
    return {
      noteText: '',
      savedText: '',
      saveStatus: 'saved',
      hasLoaded: false,
      debounceTimer: null,
    }
  },

  computed: {
    charLimit() {
      return CHAR_LIMIT
    },

    charCount() {
      return this.noteText.length
    },

    isOverLimit() {
      return this.charCount > CHAR_LIMIT
    },

    hasUnsavedChanges() {
      return this.noteText !== this.savedText
    },

    statusText() {
      if (this.saveStatus === 'saving') {
        return 'Saving...'
      }
      if (this.saveStatus === 'unsaved') {
        return 'Unsaved changes'
      }
      return 'Saved'
    },

    statusClass() {
      return `status-${this.saveStatus}`
    },
  },

  methods: {
    handleInput() {
      this.saveStatus = 'unsaved'

      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer)
      }

      // Don't auto-save if over limit
      if (this.isOverLimit) {
        return
      }

      this.debounceTimer = setTimeout(() => {
        this.saveNotes()
      }, 2000)
    },

    async saveNow() {
      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer)
        this.debounceTimer = null
      }

      // Warn before saving if over limit
      if (this.isOverLimit) {
        const overBy = this.charCount - CHAR_LIMIT
        const confirmed = confirm(
          `Your notes exceed the ${CHAR_LIMIT} character limit by ${overBy} characters. ` +
          `Saving will truncate your notes. Continue?`
        )
        if (!confirmed) {
          return
        }
      }

      await this.saveNotes()
    },

    async saveNotes() {
      if (!this.hasUnsavedChanges) {
        return
      }

      this.saveStatus = 'saving'

      try {
        await axiosWrapper.post('/api/game/notes/save', {
          gameId: this.game._id,
          notes: this.noteText,
        })

        // Server truncates to CHAR_LIMIT, so savedText reflects what was actually saved
        this.savedText = this.noteText.slice(0, CHAR_LIMIT)
        this.saveStatus = 'saved'
      }
      catch (err) {
        console.error('Error saving notes:', err)
        this.saveStatus = 'unsaved'
      }
    },

    async fetchNotes() {
      if (this.hasLoaded) {
        return
      }

      try {
        const response = await axiosWrapper.post('/api/game/notes/fetch', {
          gameId: this.game._id,
        })

        this.noteText = response.notes || ''
        this.savedText = this.noteText
        this.hasLoaded = true
      }
      catch (err) {
        console.error('Error fetching notes:', err)
      }
    },

    onOffcanvasShow() {
      this.fetchNotes()
    },
  },

  mounted() {
    const offcanvasEl = this.$refs.offcanvas.$el
    offcanvasEl.addEventListener('show.bs.offcanvas', this.onOffcanvasShow)
  },

  beforeUnmount() {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer)
    }

    const offcanvasEl = this.$refs.offcanvas?.$el
    if (offcanvasEl) {
      offcanvasEl.removeEventListener('show.bs.offcanvas', this.onOffcanvasShow)
    }
  },
}
</script>


<style scoped>
.notes-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

textarea {
  flex: 1;
  width: 100%;
  resize: none;
  padding: 0.5em;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-family: inherit;
  font-size: 0.9em;
}

textarea:focus {
  outline: none;
  border-color: #666;
}

textarea.over-limit {
  border-color: #dc3545;
  background-color: #fff5f5;
}

textarea.over-limit:focus {
  border-color: #dc3545;
}

.notes-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5em;
  padding-top: 0.5em;
  border-top: 1px solid #eee;
}

.footer-left {
  display: flex;
  flex-direction: column;
  gap: 0.15em;
}

.save-status {
  font-size: 0.8em;
}

.char-count {
  font-size: 0.75em;
  color: #666;
}

.char-count.over-limit {
  color: #dc3545;
  font-weight: bold;
}

.status-saved {
  color: #28a745;
}

.status-saving {
  color: #ffc107;
}

.status-unsaved {
  color: #dc3545;
}

button {
  padding: 0.25em 0.75em;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #f8f9fa;
  cursor: pointer;
}

button:hover:not(:disabled) {
  background: #e9ecef;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.toggle {
  position: absolute;
  visibility: visible;
  width: 20px;
  height: 100px;
  right: -20px;
  bottom: 25px;
  background-color: rgba(0, 0, 0, .5);
  border-radius: 0 8px 8px 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toggle-label {
  writing-mode: vertical-rl;
  text-orientation: mixed;
  font-size: 0.75em;
  color: white;
  padding: 0.25em 0;
}

#notes-off-canvas :deep(.offcanvas-body) {
  display: flex;
  flex-direction: column;
}
</style>
