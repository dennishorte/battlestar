<template>
  <div class="agricola-card-chip" :class="cardTypeClass" @click.stop="showDetails">
    <span class="card-name">{{ displayName }}</span>
    <span class="card-cost" v-if="costText">{{ costText }}</span>
    <span class="card-vp" v-if="victoryPoints">{{ victoryPoints }}VP</span>
  </div>
</template>

<script>
import { agricola } from 'battlestar-common'

const res = agricola.res

const RESOURCE_ICONS = {
  food: '🍞',
  wood: '🪵',
  clay: '🧱',
  stone: '🪨',
  reed: '🌿',
  grain: '🌾',
  vegetables: '🥕',
  sheep: '🐑',
  boar: '🐗',
  cattle: '🐄',
}

export default {
  name: 'AgricolaCardChip',

  inject: ['ui'],

  props: {
    cardId: {
      type: String,
      required: true,
    },
    cardType: {
      type: String,
      default: null, // 'occupation', 'minor', 'major' - auto-detected if null
    },
  },

  computed: {
    card() {
      // Try to get the card from the res module
      let card = res.getCardById(this.cardId)
      if (card) {
        return card
      }

      // Try major improvements
      card = res.getMajorImprovementById(this.cardId)
      if (card) {
        return { ...card, type: 'major' }
      }

      // Fallback - return minimal info
      return {
        id: this.cardId,
        name: this.formatCardName(this.cardId),
      }
    },

    actualCardType() {
      if (this.cardType) {
        return this.cardType
      }
      if (this.card && this.card.type) {
        return this.card.type
      }
      // Check if it's a major improvement by trying to look it up
      if (res.getMajorImprovementById(this.cardId)) {
        return 'major'
      }
      return 'unknown'
    },

    cardTypeClass() {
      return `card-type-${this.actualCardType}`
    },

    displayName() {
      return this.card?.name || this.formatCardName(this.cardId)
    },

    victoryPoints() {
      return this.card?.victoryPoints || null
    },

    costText() {
      const cost = this.card?.cost
      if (!cost) {
        return ''
      }

      const entries = Object.entries(cost)
      if (entries.length === 0) {
        return ''
      }

      return entries
        .map(([resource, amount]) => `${amount}${RESOURCE_ICONS[resource] || resource}`)
        .join(' ')
    },
  },

  methods: {
    formatCardName(cardId) {
      return cardId
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    },

    showDetails() {
      if (this.ui?.fn?.showCard) {
        this.ui.fn.showCard(this.cardId, this.actualCardType)
      }
    },
  },
}
</script>

<style scoped>
.agricola-card-chip {
  display: flex;
  align-items: center;
  gap: .35em;
  padding: .15em .4em;
  border-radius: .2em;
  font-size: .85em;
  cursor: pointer;
  transition: filter 0.1s;
  white-space: nowrap;
  width: 100%;
}

.agricola-card-chip:hover {
  filter: brightness(0.92);
}

.card-name {
  flex: 1;
}

.card-cost {
  font-size: .8em;
  color: #555;
  margin-left: auto;
}

.card-vp {
  font-size: .75em;
  font-weight: 600;
  color: #1b5e20;
  background-color: rgba(200, 230, 201, 0.7);
  padding: .1em .3em;
  border-radius: .2em;
}

/* Card type specific colors */
.agricola-card-chip.card-type-occupation {
  background-color: #fff3e0;
  border-left: 3px solid #ff9800;
}

.agricola-card-chip.card-type-minor {
  background-color: #e3f2fd;
  border-left: 3px solid #2196f3;
}

.agricola-card-chip.card-type-major {
  background-color: #fce4ec;
  border-left: 3px solid #e91e63;
}

.agricola-card-chip.card-type-unknown {
  background-color: #f5f5f5;
  border-left: 3px solid #9e9e9e;
}
</style>
