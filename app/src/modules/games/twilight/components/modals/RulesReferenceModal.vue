<template>
  <ModalBase id="twilight-rules-reference">
    <template #header>Rules Reference</template>

    <div class="rules-reference">
      <input
        ref="searchInput"
        v-model="searchQuery"
        class="form-control form-control-sm search-input"
        type="text"
        placeholder="Search rules, FAQ, errata..."
      />

      <div class="tab-bar">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="tab-btn"
          :class="{ active: activeTab === tab.id }"
          @click="activeTab = tab.id"
        >
          {{ tab.label }}
          <span class="tab-count">{{ tab.count }}</span>
        </button>
      </div>

      <!-- Rules Tab -->
      <div v-if="activeTab === 'rules'" class="tab-content">
        <div v-if="filteredRules.length === 0" class="no-results">No matching rules found.</div>
        <div
          v-for="rule in filteredRules"
          :key="rule.id"
          class="accordion-item"
        >
          <div class="accordion-header" @click="toggle(rule.id)">
            <span class="expand-icon">{{ expanded[rule.id] ? '\u25BE' : '\u25B8' }}</span>
            <span class="rule-number" v-if="rule.number">{{ rule.number }}.</span>
            <span class="rule-title">{{ rule.title }}</span>
          </div>
          <div v-if="expanded[rule.id]" class="accordion-body">
            <div class="rule-content">
              <template v-for="(block, bi) in parseContent(rule.content)" :key="bi">
                <div v-if="block.type === 'h2'" class="md-h2">{{ block.text }}</div>
                <div v-else-if="block.type === 'subitem'" class="md-subitem">
                  <span class="subitem-letter">{{ block.letter }}.</span> {{ block.text }}
                </div>
                <div v-else-if="block.type === 'bullet'" class="md-bullet">{{ block.text }}</div>
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

      <!-- FAQ Tab -->
      <div v-if="activeTab === 'faq'" class="tab-content">
        <div v-if="filteredFaq.length === 0" class="no-results">No matching FAQ entries found.</div>
        <div
          v-for="(entry, i) in filteredFaq"
          :key="'faq-' + i"
          class="accordion-item"
        >
          <div class="accordion-header" @click="toggle('faq-' + i)">
            <span class="expand-icon">{{ expanded['faq-' + i] ? '\u25BE' : '\u25B8' }}</span>
            <span class="faq-question">{{ entry.question }}</span>
          </div>
          <div v-if="expanded['faq-' + i]" class="accordion-body">
            <div class="faq-answer">{{ entry.answer }}</div>
          </div>
        </div>
      </div>

      <!-- Errata Tab -->
      <div v-if="activeTab === 'errata'" class="tab-content">
        <div v-if="filteredErrata.length === 0" class="no-results">No matching errata found.</div>
        <div
          v-for="(entry, i) in filteredErrata"
          :key="'errata-' + i"
          class="errata-item"
        >
          <div class="errata-card-name">{{ entry.card }}</div>
          <div class="errata-text">{{ entry.text }}</div>
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
import { twilight } from 'battlestar-common'
const res = twilight.res

export default {
  name: 'RulesReferenceModal',

  components: { ModalBase },

  inject: ['ui'],

  data() {
    return {
      searchQuery: '',
      activeTab: 'rules',
      expanded: {},
    }
  },

  computed: {
    allRules() {
      return res.getAllLivingRules()
    },

    allFaq() {
      return res.getAllFaq()
    },

    allErrata() {
      return res.getAllErrata()
    },

    filteredRules() {
      return res.searchLivingRules(this.searchQuery)
    },

    filteredFaq() {
      return res.searchFaq(this.searchQuery)
    },

    filteredErrata() {
      return res.searchErrata(this.searchQuery)
    },

    tabs() {
      return [
        { id: 'rules', label: 'Rules', count: this.filteredRules.length },
        { id: 'faq', label: 'FAQ', count: this.filteredFaq.length },
        { id: 'errata', label: 'Errata', count: this.filteredErrata.length },
      ]
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
      // Collapse all when search changes
      this.expanded = {}
      // If search narrows to 1 rule, auto-expand it
      if (this.activeTab === 'rules' && this.filteredRules.length === 1) {
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
        if (trimmed.startsWith('## ')) {
          blocks.push({ type: 'h2', text: trimmed.slice(3) })
        }
        else if (/^ {4}- ([a-z])\. /.test(trimmed)) {
          const match = trimmed.match(/^ {4}- ([a-z])\. (.*)/)
          blocks.push({ type: 'subitem', letter: match[1], text: match[2] })
        }
        else if (trimmed.startsWith('- ')) {
          blocks.push({ type: 'bullet', text: trimmed.slice(2) })
        }
        else {
          // Merge consecutive paragraph lines
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

.tab-bar {
  display: flex;
  gap: .25em;
  margin-bottom: .5em;
  border-bottom: 1px solid #dee2e6;
  padding-bottom: .25em;
}

.tab-btn {
  background: none;
  border: none;
  padding: .25em .75em;
  font-size: .9em;
  color: #666;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  border-radius: 0;
}

.tab-btn.active {
  color: #0d6efd;
  border-bottom-color: #0d6efd;
  font-weight: 600;
}

.tab-btn:hover:not(.active) {
  color: #333;
}

.tab-count {
  font-size: .8em;
  color: #999;
  margin-left: .25em;
}

.tab-content {
  min-height: 200px;
}

.no-results {
  text-align: center;
  color: #888;
  padding: 2em;
  font-style: italic;
}

.accordion-item {
  border: 1px solid #e9ecef;
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
  background: #f8f9fa;
  user-select: none;
}

.accordion-header:hover {
  background: #e9ecef;
}

.expand-icon {
  font-size: .8em;
  color: #888;
  width: 1em;
  flex-shrink: 0;
}

.rule-number {
  color: #0d6efd;
  font-weight: 600;
  flex-shrink: 0;
}

.rule-title {
  font-weight: 600;
}

.faq-question {
  font-weight: 600;
  font-size: .95em;
}

.accordion-body {
  padding: .5em .75em;
  border-top: 1px solid #e9ecef;
  line-height: 1.5;
}

.md-h2 {
  font-weight: 700;
  font-size: 1.05em;
  margin-top: .75em;
  margin-bottom: .25em;
  color: #333;
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
  color: #888;
}

.md-subitem {
  padding-left: 2em;
  margin-bottom: .2em;
  color: #555;
}

.subitem-letter {
  color: #0d6efd;
  font-weight: 600;
  margin-right: .25em;
}

.md-para {
  margin-bottom: .35em;
}

.faq-answer {
  color: #444;
}

.related-topics {
  margin-top: .75em;
  padding-top: .5em;
  border-top: 1px solid #e9ecef;
  display: flex;
  flex-wrap: wrap;
  gap: .35em;
  align-items: center;
}

.related-label {
  color: #888;
  font-size: .85em;
}

.related-link {
  font-size: .85em;
  color: #0d6efd;
  cursor: pointer;
  padding: .1em .4em;
  border-radius: .2em;
  background: #e7f1ff;
}

.related-link:hover {
  background: #cfe2ff;
}

.errata-item {
  padding: .5em .75em;
  border: 1px solid #e9ecef;
  border-radius: .25em;
  margin-bottom: .25em;
}

.errata-card-name {
  font-weight: 700;
  margin-bottom: .25em;
}

.errata-text {
  color: #444;
  line-height: 1.4;
}

:deep(.modal-dialog) {
  max-width: 700px;
}
</style>
