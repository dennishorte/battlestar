<template>
  <div class="agricola-card-chip" :class="[cardTypeClass, { unplayable, used: isUsed }]" @click.stop="showDetails">
    <span class="card-name">{{ displayName }}</span>

    <!-- Resources on card -->
    <span v-if="cardResources.length > 0" class="card-resources">
      <span v-for="res in cardResources" :key="res.type" class="resource-badge">
        {{ res.amount }}{{ RESOURCE_ICONS[res.type] }}
      </span>
    </span>

    <!-- Pile indicator -->
    <span v-if="pileContents.length > 0" class="pile-badge" :title="pileTooltip">
      📦{{ pileContents.length }}
    </span>

    <!-- Used indicator -->
    <span v-if="isUsed" class="used-badge" title="Already used">✓</span>

    <span class="card-cost" v-if="costText">{{ costText }}</span>
    <span v-if="hasPrereqs" class="prereqs-marker">*</span>
    <span class="card-vp" v-if="victoryPoints">{{ victoryPoints }}VP</span>
  </div>
</template>

<script>
import { agricola } from 'battlestar-common'

const res = agricola.res

export default {
  name: 'AgricolaCardChip',

  inject: ['ui', 'game'],

  props: {
    cardId: {
      type: String,
      required: true,
    },
    cardType: {
      type: String,
      default: null, // 'occupation', 'minor', 'major' - auto-detected if null
    },
    player: {
      type: Object,
      default: null,
    },
  },

  data() {
    return {
      RESOURCE_ICONS: {
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
      },
    }
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
      // Cards use 'vps' field, major improvements use 'victoryPoints'
      return this.card?.vps ?? this.card?.victoryPoints ?? null
    },

    hasPrereqs() {
      return !!this.card?.prereqs
    },

    unplayable() {
      if (!this.player) {
        return false
      }
      // Only check playability for cards in the player's hand
      if (!this.player.hand || !this.player.hand.includes(this.cardId)) {
        return false
      }
      try {
        return !this.player.canPlayCard(this.cardId)
      }
      catch {
        return false
      }
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
        .map(([resource, amount]) => `${amount}${this.RESOURCE_ICONS[resource] || resource}`)
        .join(' ')
    },

    // Get card instance from game (has runtime state)
    cardInstance() {
      if (!this.game?.cards?.byId) {
        return null
      }
      try {
        return this.game.cards.byId(this.cardId)
      }
      catch {
        return null
      }
    },

    // Get runtime definition (with state like food, used, pile)
    runtimeDefinition() {
      return this.cardInstance?.definition || null
    },

    // Resources stored on this card
    cardResources() {
      const def = this.runtimeDefinition
      if (!def) {
        return []
      }

      const resources = []
      const types = ['food', 'wood', 'clay', 'stone', 'reed', 'grain', 'vegetables']
      for (const type of types) {
        if (typeof def[type] === 'number' && def[type] > 0) {
          resources.push({ type, amount: def[type] })
        }
      }
      return resources
    },

    // Check if card has been used (one-time use)
    isUsed() {
      return this.runtimeDefinition?.used === true
    },

    // Get pile contents if card has a pile
    pileContents() {
      return this.runtimeDefinition?.pile || []
    },

    // Tooltip for pile contents
    pileTooltip() {
      if (this.pileContents.length === 0) {
        return ''
      }
      const items = [...this.pileContents].reverse()
        .map(item => this.RESOURCE_ICONS[item] || item)
        .join(' ')
      return `Pile (top first): ${items}`
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
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-cost {
  font-size: .8em;
  color: #555;
  margin-left: auto;
}

.prereqs-marker {
  color: #c62828;
  font-weight: bold;
  margin-left: .1em;
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

.agricola-card-chip.unplayable {
  opacity: 0.5;
}

.agricola-card-chip.used {
  opacity: 0.7;
}

.card-resources {
  display: flex;
  gap: .1em;
  font-size: .75em;
}

.resource-badge {
  background-color: rgba(255, 215, 0, 0.3);
  padding: 0 .15em;
  border-radius: .15em;
}

.pile-badge {
  font-size: .7em;
  background-color: rgba(139, 69, 19, 0.2);
  padding: 0 .2em;
  border-radius: .15em;
  cursor: help;
}

.used-badge {
  font-size: .65em;
  color: #888;
  background-color: rgba(0, 0, 0, 0.1);
  padding: 0 .15em;
  border-radius: .15em;
}
</style>
