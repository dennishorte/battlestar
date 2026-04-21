<template>
  <ModalBase id="dune-rules-reference">
    <template #header>Rules Reference</template>

    <div class="rules-reference">
      <input
        ref="searchInput"
        v-model="searchQuery"
        class="form-control form-control-sm search-input"
        type="text"
        placeholder="Search rules..."
      />

      <div v-if="filteredRules.length === 0" class="no-results">No matching rules found.</div>
      <div
        v-for="rule in filteredRules"
        :key="rule.id"
        class="accordion-item"
      >
        <div class="accordion-header" @click="toggle(rule.id)">
          <span class="expand-icon">{{ expanded[rule.id] ? '\u25BE' : '\u25B8' }}</span>
          <span class="rule-number">{{ rule.number }}.</span>
          <span class="rule-title">{{ rule.title }}</span>
        </div>
        <div v-if="expanded[rule.id]" class="accordion-body">
          <div class="rule-content">
            <template v-for="(block, bi) in parseContent(rule.content)" :key="bi">
              <div v-if="block.type === 'h3'" class="md-h3">{{ block.text }}</div>
              <div v-else-if="block.type === 'bullet'" class="md-bullet">{{ block.text }}</div>
              <div v-else-if="block.type === 'numbered'" class="md-numbered">
                <span class="numbered-num">{{ block.num }}.</span> {{ block.text }}
              </div>
              <p v-else class="md-para">{{ block.text }}</p>
            </template>
          </div>
          <div v-if="rule.relatedTopics.length > 0" class="related-topics">
            <span class="related-label">Related:</span>
            <span
              v-for="topic in rule.relatedTopics"
              :key="topic"
              class="related-link"
              @click="searchQuery = topic"
            >{{ topic }}</span>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <button class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
    </template>
  </ModalBase>
</template>


<script>
import ModalBase from '@/components/ModalBase.vue'
import { dune } from 'battlestar-common'
const res = dune.res

export default {
  name: 'DuneRulesModal',

  components: { ModalBase },

  inject: ['ui'],

  data() {
    return {
      searchQuery: '',
      expanded: {},
    }
  },

  computed: {
    filteredRules() {
      return res.searchLivingRules(this.searchQuery)
    },
  },

  watch: {
    'ui.modals.rulesReference.filter'(filter) {
      if (filter) {
        this.searchQuery = filter
        this.ui.modals.rulesReference.filter = null
      }
    },

    searchQuery() {
      this.expanded = {}
      if (this.filteredRules.length === 1) {
        this.expanded[this.filteredRules[0].id] = true
      }
    },
  },

  methods: {
    toggle(id) {
      this.expanded = { ...this.expanded, [id]: !this.expanded[id] }
    },

    parseContent(text) {
      if (!text) {
        return []
      }
      const blocks = []
      for (const line of text.split('\n')) {
        const trimmed = line.trimEnd()
        if (!trimmed) {
          continue
        }
        if (trimmed.startsWith('### ')) {
          blocks.push({ type: 'h3', text: trimmed.slice(4) })
        }
        else if (/^\d+\. /.test(trimmed)) {
          const match = trimmed.match(/^(\d+)\. (.*)/)
          blocks.push({ type: 'numbered', num: match[1], text: match[2] })
        }
        else if (trimmed.startsWith('- ')) {
          blocks.push({ type: 'bullet', text: trimmed.slice(2) })
        }
        else {
          const last = blocks[blocks.length - 1]
          if (last && last.type === 'para') {
            last.text += ' ' + trimmed
          }
          else {
            blocks.push({ type: 'para', text: trimmed })
          }
        }
      }
      return blocks
    },
  },
}
</script>


<style scoped>
.rules-reference {
  font-size: .85em;
  max-height: 70vh;
  overflow-y: auto;
}

.search-input {
  position: sticky;
  top: 0;
  z-index: 1;
  margin-bottom: .5em;
}

.no-results {
  text-align: center;
  color: #888;
  padding: 2em;
  font-style: italic;
}

.accordion-item {
  border: 1px solid #d4c8b4;
  border-radius: .25em;
  margin-bottom: .25em;
  overflow: hidden;
}

.accordion-header {
  display: flex;
  align-items: baseline;
  gap: .35em;
  padding: .4em .6em;
  cursor: pointer;
  background: #f5f0e8;
  user-select: none;
}

.accordion-header:hover {
  background: #efe8db;
}

.expand-icon {
  font-size: .8em;
  color: #8a7a62;
  width: 1em;
  flex-shrink: 0;
}

.rule-number {
  color: #8b6914;
  font-weight: 600;
  flex-shrink: 0;
}

.rule-title {
  font-weight: 600;
  color: #2c2416;
}

.accordion-body {
  padding: .5em .75em;
  border-top: 1px solid #d4c8b4;
  line-height: 1.5;
  color: #3a3024;
}

.md-h3 {
  font-weight: 700;
  font-size: 1.05em;
  margin-top: .75em;
  margin-bottom: .25em;
  color: #2c2416;
}

.md-bullet {
  padding-left: 1em;
  margin-bottom: .35em;
  position: relative;
}

.md-bullet::before {
  content: '\2022';
  position: absolute;
  left: 0;
  color: #8a7a62;
}

.md-numbered {
  padding-left: 1.5em;
  margin-bottom: .35em;
  position: relative;
}

.numbered-num {
  position: absolute;
  left: 0;
  color: #8b6914;
  font-weight: 600;
}

.md-para {
  margin-bottom: .35em;
}

.related-topics {
  margin-top: .75em;
  padding-top: .5em;
  border-top: 1px solid #d4c8b4;
  display: flex;
  flex-wrap: wrap;
  gap: .35em;
  align-items: center;
}

.related-label {
  color: #8a7a62;
  font-size: .85em;
}

.related-link {
  font-size: .85em;
  color: #8b6914;
  cursor: pointer;
  padding: .1em .4em;
  border-radius: .2em;
  background: #f5f0e8;
}

.related-link:hover {
  background: #efe8db;
}

:deep(.modal-dialog) {
  max-width: 700px;
}
</style>
