<template>
  <div class="card-section" v-if="cards.length > 0 || alwaysShow">
    <div class="section-header" @click="toggleExpand">
      <span class="section-title">{{ title }}</span>
      <span class="section-count">({{ cards.length }})</span>
      <span class="expand-icon">{{ expanded ? '▼' : '▶' }}</span>
    </div>
    <div class="card-list" v-if="expanded && cards.length > 0">
      <AgricolaCardChip
        v-for="cardId in cards"
        :key="cardId"
        :cardId="cardId"
      />
    </div>
    <div class="empty-message" v-else-if="expanded && cards.length === 0">
      None
    </div>
  </div>
</template>

<script>
import AgricolaCardChip from './AgricolaCardChip.vue'

export default {
  name: 'CardSection',

  components: {
    AgricolaCardChip,
  },

  props: {
    title: {
      type: String,
      required: true,
    },
    cards: {
      type: Array,
      default: () => [],
    },
    alwaysShow: {
      type: Boolean,
      default: false,
    },
    startExpanded: {
      type: Boolean,
      default: true,
    },
    persistKey: {
      type: String,
      default: null,
    },
  },

  data() {
    return {
      expanded: this.getInitialExpanded(),
    }
  },

  methods: {
    getInitialExpanded() {
      if (this.persistKey) {
        const stored = window.localStorage.getItem(this.persistKey)
        if (stored !== null) {
          return stored === 'true'
        }
      }
      return this.startExpanded
    },

    toggleExpand() {
      this.expanded = !this.expanded
      if (this.persistKey) {
        window.localStorage.setItem(this.persistKey, this.expanded.toString())
      }
    },
  },
}
</script>


<style scoped>
.card-section {
  margin-bottom: .5em;
}

.section-header {
  display: flex;
  align-items: center;
  gap: .35em;
  padding: .35em .5em;
  background-color: #f5f5f5;
  border-radius: .25em;
  cursor: pointer;
  user-select: none;
}

.section-header:hover {
  background-color: #eeeeee;
}

.section-title {
  font-weight: 600;
  font-size: .9em;
}

.section-count {
  color: #666;
  font-size: .85em;
}

.expand-icon {
  margin-left: auto;
  font-size: .7em;
  color: #888;
}

.card-list {
  display: flex;
  flex-direction: column;
  gap: 1px;
  padding: .25em .5em;
}

.empty-message {
  padding: .25em .5em;
  color: #999;
  font-style: italic;
  font-size: .85em;
}
</style>
