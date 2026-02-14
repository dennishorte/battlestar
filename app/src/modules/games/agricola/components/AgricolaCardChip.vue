<template>
  <div class="agricola-card-chip-wrapper" :class="{ expanded: localExpanded }">
    <div class="agricola-card-chip" :class="[cardTypeClass, { unplayable, used: isUsed }]" @click.stop="showDetails">
      <span
        v-if="cardText"
        class="expand-chevron"
        :class="{ open: localExpanded }"
        @click.stop="toggleExpand"
      >▶</span>
      <span class="card-name">{{ displayName }}</span>

      <span class="card-cost" v-if="costText">{{ costText }}</span>
      <span v-if="hasPrereqs" class="prereqs-marker">*</span>
      <span class="card-vp" v-if="victoryPoints">{{ victoryPoints }}VP</span>
    </div>

    <!-- Card state section (below main chip) -->
    <div v-if="hasCardState" class="card-state-section" :class="cardTypeClass">
      <!-- Resources on card -->
      <div v-if="cardResources.length > 0" class="state-resources">
        <span class="state-label">On card:</span>
        <span v-for="res in cardResources" :key="res.type" class="resource-badge">
          {{ res.amount }}{{ RESOURCE_ICONS[res.type] }}
        </span>
      </div>

      <!-- Pile indicator -->
      <div v-if="pileContents.length > 0" class="state-pile">
        <span class="state-label">Pile:</span>
        <span class="pile-badge" :title="pileTooltip">
          📦{{ pileContents.length }}
        </span>
        <span class="pile-preview" :title="pileTooltip">
          <span v-for="(item, index) in pilePreview" :key="index" class="pile-item-icon">
            {{ RESOURCE_ICONS[item] || item }}
          </span>
          <span v-if="pileContents.length > pilePreview.length" class="pile-more">...</span>
        </span>
      </div>

      <!-- Animals on card -->
      <div v-if="cardAnimals" class="state-animals">
        <span class="state-label">Animals:</span>
        <span v-if="cardAnimals.sheep > 0" class="animal-badge">🐑{{ cardAnimals.sheep }}</span>
        <span v-if="cardAnimals.boar > 0" class="animal-badge">🐗{{ cardAnimals.boar }}</span>
        <span v-if="cardAnimals.cattle > 0" class="animal-badge">🐄{{ cardAnimals.cattle }}</span>
      </div>

      <!-- Used indicator -->
      <div v-if="isUsed" class="state-used">
        <span class="used-badge" title="Already used">✓ Used</span>
      </div>

      <!-- Custom state properties -->
      <div v-if="customState" class="state-custom">
        <template v-if="customState.useCount !== undefined">
          <span class="state-label">Uses:</span>
          <span class="custom-badge">{{ customState.useCount }}/4</span>
        </template>
        <template v-if="customState.storedFences !== undefined">
          <span class="state-label">Fences:</span>
          <span class="custom-badge">🪵{{ customState.storedFences }}</span>
        </template>
        <template v-if="customState.hasRoom !== undefined">
          <span class="state-label">Room:</span>
          <span class="custom-badge">{{ customState.hasRoom ? '✓' : '✗' }}</span>
        </template>
        <template v-if="customState.activeRound !== undefined">
          <span class="state-label">Active:</span>
          <span class="custom-badge">R{{ customState.activeRound }}</span>
        </template>
        <template v-if="customState.resourcePairsCount !== undefined">
          <span class="state-label">Pairs:</span>
          <span class="custom-badge">{{ customState.resourcePairsCount }}</span>
        </template>
        <template v-if="customState.placedGoodsCount !== undefined">
          <span class="state-label">Goods:</span>
          <span class="custom-badge">{{ customState.placedGoodsCount }}</span>
        </template>
        <template v-if="customState.boar !== undefined">
          <span class="state-label">Boar:</span>
          <span class="custom-badge">🐗{{ customState.boar }}</span>
        </template>
      </div>
    </div>

    <div v-if="localExpanded && cardText" class="card-description" :class="cardTypeClass">
      <div v-for="(line, i) in cardTextLines" :key="i" class="card-text-line">{{ line }}</div>
    </div>
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
    initialExpanded: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['toggle-expand'],

  data() {
    return {
      localExpanded: this.initialExpanded,
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

    cardText() {
      return this.card?.text || null
    },

    cardTextLines() {
      if (!this.cardText) {
        return []
      }
      if (Array.isArray(this.cardText)) {
        return this.cardText
      }
      return [this.cardText]
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
      const cardState = this.getCardState()
      const resources = []

      // Check for storedResource pattern (e.g., Whale Oil, Cubbyhole)
      // These cards have storedResource: "food" and store amount in game.cardState(id).stored
      if (this.card?.storedResource) {
        const stored = cardState?.stored || 0
        if (stored > 0) {
          resources.push({
            type: this.card.storedResource,
            amount: stored,
          })
        }
      }

      // Check for resources stored in cardState (Pattern 2: Direct Resource Properties)
      if (cardState) {
        const types = ['food', 'wood', 'clay', 'stone', 'reed', 'grain', 'vegetables']
        for (const type of types) {
          if (typeof cardState[type] === 'number' && cardState[type] > 0) {
            resources.push({ type, amount: cardState[type] })
          }
        }
      }

      // Check for resources stored directly on definition (legacy pattern - should not be needed)
      if (def) {
        const types = ['food', 'wood', 'clay', 'stone', 'reed', 'grain', 'vegetables']
        for (const type of types) {
          if (typeof def[type] === 'number' && def[type] > 0) {
            resources.push({ type, amount: def[type] })
          }
        }
      }

      return resources
    },

    // Animals stored on this card
    cardAnimals() {
      if (!this.player || !this.player.cardAnimals) {
        return null
      }
      const animals = this.player.cardAnimals[this.cardId]
      if (!animals) {
        return null
      }
      const total = (animals.sheep || 0) + (animals.boar || 0) + (animals.cattle || 0)
      if (total === 0) {
        return null
      }
      return animals
    },

    // Custom state properties that need special display
    customState() {
      const cardState = this.getCardState()
      const custom = {}

      if (cardState) {
        // Collector: useCount
        if (this.cardId === 'collector-c104' && cardState.useCount !== undefined) {
          custom.useCount = cardState.useCount
        }

        // Ash Trees: storedFences
        if (this.cardId === 'ash-trees-e074' && cardState.storedFences !== undefined) {
          custom.storedFences = cardState.storedFences
        }

        // Mason: hasRoom
        if (this.cardId === 'mason-c087' && cardState.hasRoom !== undefined) {
          custom.hasRoom = cardState.hasRoom
        }

        // Carter: activeRound
        if (this.cardId === 'carter-e088' && cardState.activeRound !== undefined) {
          custom.activeRound = cardState.activeRound
        }

        // Workshop Assistant: resourcePairs count
        if (this.cardId === 'workshop-assistant-c146' && cardState.resourcePairs) {
          custom.resourcePairsCount = cardState.resourcePairs.length
        }

        // Emissary: placedGoods count
        if (this.cardId === 'emissary-d124' && cardState.placedGoods) {
          custom.placedGoodsCount = cardState.placedGoods.length
        }

        // Mud Wallower: boar count (stored in cardState, not cardAnimals)
        if (this.cardId === 'mud-wallower-c148' && cardState.boar !== undefined && cardState.boar > 0) {
          custom.boar = cardState.boar
        }
      }

      return Object.keys(custom).length > 0 ? custom : null
    },

    // Check if card has been used (one-time use)
    isUsed() {
      // Check cardState first (newer pattern)
      const cardState = this.getCardState()
      if (cardState?.used !== undefined) {
        return cardState.used === true
      }
      // Fall back to definition (legacy pattern)
      return this.runtimeDefinition?.used === true
    },

    // Get pile contents if card has a pile
    pileContents() {
      // Check cardState first (newer pattern)
      const cardState = this.getCardState()
      if (cardState?.pile) {
        return cardState.pile
      }
      // Fall back to definition (legacy pattern)
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

    // Check if card has any state to display
    hasCardState() {
      return this.cardResources.length > 0 || this.pileContents.length > 0 || this.isUsed || this.customState !== null || this.cardAnimals !== null
    },

    // Preview of pile contents (top 3 items)
    pilePreview() {
      if (this.pileContents.length === 0) {
        return []
      }
      // Show top 3 items (from end of array, since pile is bottom-to-top)
      return [...this.pileContents].slice(-3).reverse()
    },
  },

  methods: {
    // Get card state from game.state._cardState
    getCardState() {
      if (!this.game?.state?._cardState || !this.cardId) {
        return null
      }
      return this.game.state._cardState[this.cardId] || null
    },

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

    toggleExpand() {
      this.localExpanded = !this.localExpanded
      this.$emit('toggle-expand', this.cardId, this.localExpanded)
    },
  },
}
</script>

<style scoped>
.agricola-card-chip-wrapper {
  width: 100%;
}

.agricola-card-chip {
  display: flex;
  align-items: center;
  gap: .35em;
  padding: .15em .4em;
  border-radius: .2em .2em 0 0;
  font-size: .85em;
  cursor: pointer;
  transition: filter 0.1s;
  white-space: nowrap;
  width: 100%;
  margin-bottom: 0;
}

.agricola-card-chip:hover {
  filter: brightness(0.92);
}

.expand-chevron {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: .55em;
  color: #888;
  transition: transform 0.15s;
  flex-shrink: 0;
  width: 1em;
  cursor: pointer;
  padding: .2em;
}

.expand-chevron:hover {
  color: #444;
}

.expand-chevron.open {
  transform: rotate(90deg);
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

/* Card state section (below main chip) - styled like a drawer */
.card-state-section {
  padding: .25em .5em .25em 1.8em;
  font-size: .75em;
  display: flex;
  flex-direction: column;
  gap: .25em;
  border-radius: 0 0 0 .2em;
  margin-left: .5em;
}

.card-state-section.card-type-occupation {
  background-color: #fff8f0;
}

.card-state-section.card-type-minor {
  background-color: #f0f7fd;
}

.card-state-section.card-type-major {
  background-color: #fdf0f3;
}

.card-state-section.card-type-unknown {
  background-color: #fafafa;
}

.state-resources,
.state-pile,
.state-animals,
.state-used,
.state-custom {
  display: flex;
  align-items: center;
  gap: .3em;
  flex-wrap: wrap;
}

.state-label {
  font-size: .85em;
  color: #666;
  font-weight: 500;
}

.resource-badge {
  background-color: rgba(255, 215, 0, 0.3);
  padding: .1em .25em;
  border-radius: .15em;
  font-size: .9em;
}

.pile-badge {
  font-size: .85em;
  background-color: rgba(139, 69, 19, 0.2);
  padding: .1em .25em;
  border-radius: .15em;
  cursor: help;
}

.pile-preview {
  display: flex;
  align-items: center;
  gap: .15em;
  cursor: help;
}

.pile-item-icon {
  font-size: .9em;
}

.pile-more {
  color: #888;
  font-size: .8em;
}

.used-badge {
  font-size: .85em;
  color: #888;
  background-color: rgba(0, 0, 0, 0.1);
  padding: .1em .25em;
  border-radius: .15em;
}

.animal-badge {
  font-size: .85em;
  background-color: rgba(76, 175, 80, 0.2);
  color: #2e7d32;
  padding: .1em .25em;
  border-radius: .15em;
  font-weight: 500;
}

.custom-badge {
  font-size: .85em;
  background-color: rgba(156, 39, 176, 0.15);
  color: #7b1fa2;
  padding: .1em .25em;
  border-radius: .15em;
  font-weight: 500;
}

/* Card description area */
.card-description {
  padding: .3em .5em .3em 1.6em;
  font-size: .78em;
  line-height: 1.35;
  color: #444;
  white-space: normal;
  border-left: 3px solid transparent;
}

.card-description.card-type-occupation {
  background-color: #fff8f0;
  border-left-color: #ff9800;
}

.card-description.card-type-minor {
  background-color: #f0f7fd;
  border-left-color: #2196f3;
}

.card-description.card-type-major {
  background-color: #fdf0f3;
  border-left-color: #e91e63;
}

.card-description.card-type-unknown {
  background-color: #fafafa;
  border-left-color: #9e9e9e;
}

.card-text-line + .card-text-line {
  margin-top: .3em;
}
</style>
