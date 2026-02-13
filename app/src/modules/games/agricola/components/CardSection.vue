<template>
  <div class="card-section" v-if="cards.length > 0 || alwaysShow">
    <div class="section-header" @click="toggleExpand">
      <span class="section-title">{{ title }}</span>
      <span class="section-count">({{ cards.length }})</span>
      <span class="expand-icon">{{ expanded ? '▼' : '▶' }}</span>
    </div>
    <div class="card-list" v-if="expanded && cards.length > 0">
      <div
        v-for="(cardId, index) in sortedCards"
        :key="cardId"
        class="card-drag-wrapper"
        :class="{
          'drag-over-above': sortable && dragOverIndex === index && dragPosition === 'above',
          'drag-over-below': sortable && dragOverIndex === index && dragPosition === 'below',
          'dragging': sortable && dragIndex === index,
        }"
        :draggable="sortable"
        @dragstart="onDragStart($event, index)"
        @dragover="onDragOver($event, index)"
        @dragleave="onDragLeave"
        @drop="onDrop($event, index)"
        @dragend="onDragEnd"
      >
        <AgricolaCardChip
          :cardId="cardId"
          :player="player"
        />
      </div>
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
    player: {
      type: Object,
      default: null,
    },
    persistKey: {
      type: String,
      default: null,
    },
    sortable: {
      type: Boolean,
      default: false,
    },
    cardOrder: {
      type: Array,
      default: () => [],
    },
  },

  emits: ['reorder'],

  data() {
    return {
      expanded: this.getInitialExpanded(),
      dragIndex: null,
      dragOverIndex: null,
      dragPosition: null,
    }
  },

  computed: {
    sortedCards() {
      if (!this.sortable || this.cardOrder.length === 0) {
        return this.cards
      }

      const ordered = []
      // Add cards in saved order (filtering out stale IDs)
      for (const id of this.cardOrder) {
        if (this.cards.includes(id)) {
          ordered.push(id)
        }
      }
      // Append newly drawn cards not in the saved order
      for (const id of this.cards) {
        if (!this.cardOrder.includes(id)) {
          ordered.push(id)
        }
      }
      return ordered
    },
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

    onDragStart(event, index) {
      if (!this.sortable) {
        return
      }
      this.dragIndex = index
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.setData('text/plain', index.toString())
    },

    onDragOver(event, index) {
      if (!this.sortable || this.dragIndex === null) {
        return
      }
      event.preventDefault()
      event.dataTransfer.dropEffect = 'move'

      const rect = event.currentTarget.getBoundingClientRect()
      const midY = rect.top + rect.height / 2
      this.dragOverIndex = index
      this.dragPosition = event.clientY < midY ? 'above' : 'below'
    },

    onDragLeave() {
      this.dragOverIndex = null
      this.dragPosition = null
    },

    onDrop(event, index) {
      event.preventDefault()
      if (!this.sortable || this.dragIndex === null) {
        return
      }

      const fromIndex = this.dragIndex
      let toIndex = index
      if (this.dragPosition === 'below') {
        toIndex += 1
      }

      // Adjust target if moving forward
      if (fromIndex < toIndex) {
        toIndex -= 1
      }

      if (fromIndex !== toIndex) {
        const newOrder = [...this.sortedCards]
        const [moved] = newOrder.splice(fromIndex, 1)
        newOrder.splice(toIndex, 0, moved)
        this.$emit('reorder', newOrder)
      }

      this.dragIndex = null
      this.dragOverIndex = null
      this.dragPosition = null
    },

    onDragEnd() {
      this.dragIndex = null
      this.dragOverIndex = null
      this.dragPosition = null
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

.card-drag-wrapper {
  border-top: 2px solid transparent;
  border-bottom: 2px solid transparent;
  transition: border-color 0.1s;
}

.card-drag-wrapper[draggable="true"] {
  cursor: grab;
}

.card-drag-wrapper[draggable="true"]:active {
  cursor: grabbing;
}

.card-drag-wrapper.dragging {
  opacity: 0.4;
}

.card-drag-wrapper.drag-over-above {
  border-top-color: #1976d2;
}

.card-drag-wrapper.drag-over-below {
  border-bottom-color: #1976d2;
}

.empty-message {
  padding: .25em .5em;
  color: #999;
  font-style: italic;
  font-size: .85em;
}
</style>
