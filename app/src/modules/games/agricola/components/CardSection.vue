<template>
  <div class="card-section" v-if="cards.length > 0 || alwaysShow">
    <div class="section-header" @click="toggleExpand">
      <span class="section-title">{{ title }}</span>
      <span class="section-count">({{ cards.length }})</span>
      <span class="expand-icon">{{ expanded ? '▼' : '▶' }}</span>
    </div>
    <div class="card-list" v-if="expanded && cards.length > 0">
      <div
        v-for="cardId in cards"
        :key="cardId"
        class="card-item"
        :class="cardTypeClass"
        @click="showCardDetails(cardId)"
      >
        {{ formatCardName(cardId) }}
      </div>
    </div>
    <div class="empty-message" v-else-if="expanded && cards.length === 0">
      None
    </div>
  </div>
</template>

<script>
export default {
  name: 'CardSection',

  inject: ['ui'],

  props: {
    title: {
      type: String,
      required: true,
    },
    cards: {
      type: Array,
      default: () => [],
    },
    cardType: {
      type: String,
      default: 'default', // 'occupation', 'minor', 'major'
    },
    alwaysShow: {
      type: Boolean,
      default: false,
    },
    startExpanded: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      expanded: this.startExpanded,
    }
  },

  computed: {
    cardTypeClass() {
      return `card-type-${this.cardType}`
    },
  },

  methods: {
    toggleExpand() {
      this.expanded = !this.expanded
    },

    formatCardName(cardId) {
      // Convert kebab-case to Title Case
      return cardId
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    },

    showCardDetails(cardId) {
      if (this.ui?.fn?.showCard) {
        this.ui.fn.showCard(cardId, this.cardType)
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
  padding: .25em .5em;
}

.card-item {
  padding: .25em .5em;
  margin-bottom: .15em;
  border-radius: .2em;
  font-size: .85em;
  cursor: pointer;
  transition: background-color 0.1s;
}

.card-item:hover {
  filter: brightness(0.95);
}

/* Card type specific colors */
.card-item.card-type-occupation {
  background-color: #fff3e0;
  border-left: 3px solid #ff9800;
}

.card-item.card-type-minor {
  background-color: #e3f2fd;
  border-left: 3px solid #2196f3;
}

.card-item.card-type-major {
  background-color: #fce4ec;
  border-left: 3px solid #e91e63;
}

.card-item.card-type-default {
  background-color: #f5f5f5;
  border-left: 3px solid #9e9e9e;
}

.card-item.card-type-hand {
  background-color: #e8f5e9;
  border-left: 3px solid #4caf50;
}

.empty-message {
  padding: .25em .5em;
  color: #999;
  font-style: italic;
  font-size: .85em;
}
</style>
