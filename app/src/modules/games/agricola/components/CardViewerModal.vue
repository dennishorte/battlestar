<template>
  <ModalBase id="agricola-card-viewer" scrollable>
    <template #header>{{ cardTitle }}</template>

    <div v-if="card" class="card-details">
      <div class="card-header" :class="cardTypeClass">
        <span class="card-name">{{ card.name }}</span>
        <span class="card-type">{{ cardTypeLabel }}</span>
      </div>

      <!-- Cost -->
      <div class="card-cost" v-if="card.cost">
        <span class="cost-label">Cost:</span>
        <span v-for="(amount, resource) in card.cost" :key="resource" class="cost-item">
          {{ amount }} {{ resourceIcon(resource) }}
        </span>
      </div>

      <!-- Prerequisites -->
      <div class="card-prereqs" v-if="card.prereqs">
        <span class="prereqs-label">Requires:</span>
        <span class="prereqs-text">{{ formatPrereqs(card.prereqs) }}</span>
      </div>

      <!-- Victory Points -->
      <div class="card-vp" v-if="card.victoryPoints">
        <span class="vp-value">{{ card.victoryPoints }}</span>
        <span class="vp-label">Victory Points</span>
      </div>

      <!-- Category -->
      <div class="card-category" v-if="card.category">
        <span class="category-label">Category:</span>
        <span class="category-value">{{ card.category }}</span>
      </div>

      <!-- Card Text -->
      <div class="card-text" v-if="card.text">
        <template v-if="Array.isArray(card.text)">
          <p v-for="(line, index) in card.text" :key="index" class="text-line">{{ line }}</p>
        </template>
        <template v-else>
          {{ card.text }}
        </template>
      </div>

      <!-- Alternate Cost (for upgrades like Cooking Hearth) -->
      <div class="card-alternate-cost" v-if="card.alternateCost">
        <span class="alternate-cost-label">Or:</span>
        <span class="alternate-cost-value">{{ card.alternateCost }}</span>
      </div>

      <!-- Abilities -->
      <div class="card-abilities" v-if="hasAbilities">
        <div class="abilities-title">Abilities:</div>
        <ul class="abilities-list">
          <li v-if="card.gives">
            Gives: {{ formatGives(card.gives) }}
          </li>
          <li v-if="card.bonus">
            Bonus: {{ formatBonus(card.bonus) }}
          </li>
          <li v-if="card.passiveEffect">
            {{ card.passiveEffect }}
          </li>
        </ul>
      </div>

      <!-- Player count -->
      <div class="card-player-count" v-if="card.playerCount">
        <span class="player-count-label">Players:</span>
        <span class="player-count-value">{{ card.playerCount }}+</span>
      </div>
    </div>

    <div v-else class="card-not-found">
      Card not found: {{ cardId }}
    </div>

    <template #footer>
      <button class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
    </template>
  </ModalBase>
</template>

<script>
import ModalBase from '@/components/ModalBase.vue'
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
  name: 'CardViewerModal',

  components: {
    ModalBase,
  },

  inject: ['game', 'ui'],

  computed: {
    cardId() {
      return this.ui.modals?.cardViewer?.cardId || ''
    },

    cardType() {
      return this.ui.modals?.cardViewer?.cardType || 'unknown'
    },

    card() {
      if (!this.cardId) {
        return null
      }

      // Get card from res module (occupations and minor improvements)
      const card = res.getCardById(this.cardId)
      if (card) {
        return card
      }

      // Try major improvements
      const majorImp = res.getMajorImprovementById(this.cardId)
      if (majorImp) {
        return majorImp
      }

      // Fallback - return minimal card info
      return {
        id: this.cardId,
        name: this.formatCardName(this.cardId),
      }
    },

    cardTitle() {
      return this.card ? this.card.name : 'Card Details'
    },

    cardTypeClass() {
      return `card-type-${this.cardType}`
    },

    cardTypeLabel() {
      switch (this.cardType) {
        case 'occupation': return 'Occupation'
        case 'minor': return 'Minor Improvement'
        case 'major': return 'Major Improvement'
        default: return ''
      }
    },

    hasAbilities() {
      return this.card && (this.card.gives || this.card.bonus || this.card.passiveEffect)
    },
  },

  methods: {
    resourceIcon(resource) {
      return RESOURCE_ICONS[resource] || resource
    },

    formatCardName(cardId) {
      return cardId
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    },

    formatPrereqs(prereqs) {
      const parts = []
      if (prereqs.occupations !== undefined) {
        if (prereqs.occupations === 0) {
          parts.push('No occupations played')
        }
        else if (prereqs.occupationsExact) {
          parts.push(`Exactly ${prereqs.occupations} occupations`)
        }
        else if (prereqs.occupationsAtMost) {
          parts.push(`At most ${prereqs.occupations} occupations`)
        }
        else {
          parts.push(`${prereqs.occupations}+ occupations`)
        }
      }
      if (prereqs.minorImprovements !== undefined) {
        parts.push(`${prereqs.minorImprovements}+ minor improvements`)
      }
      if (prereqs.grainFields !== undefined) {
        parts.push(`${prereqs.grainFields}+ grain fields`)
      }
      if (prereqs.vegetableFields !== undefined) {
        parts.push(`${prereqs.vegetableFields}+ vegetable fields`)
      }
      if (prereqs.sheep !== undefined) {
        parts.push(`${prereqs.sheep}+ sheep`)
      }
      if (prereqs.clay !== undefined) {
        parts.push(`${prereqs.clay}+ clay`)
      }
      if (prereqs.houseType !== undefined) {
        const types = Array.isArray(prereqs.houseType)
          ? prereqs.houseType.join(' or ')
          : prereqs.houseType
        parts.push(`${types} house`)
      }
      if (prereqs.allFarmyardUsed) {
        parts.push('All farmyard spaces used')
      }
      if (prereqs.personOnFishing) {
        parts.push('Person on fishing space')
      }
      return parts.join(', ') || 'None'
    },

    formatGives(gives) {
      return Object.entries(gives)
        .map(([resource, amount]) => `${amount} ${this.resourceIcon(resource)}`)
        .join(', ')
    },

    formatBonus(bonus) {
      if (typeof bonus === 'string') {
        return bonus
      }
      return JSON.stringify(bonus)
    },
  },
}
</script>

<style scoped>
.card-details {
  padding: .5em;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: .5em .75em;
  border-radius: .25em;
  margin-bottom: .75em;
}

.card-header.card-type-occupation {
  background-color: #fff3e0;
  border: 2px solid #ff9800;
}

.card-header.card-type-minor {
  background-color: #e3f2fd;
  border: 2px solid #2196f3;
}

.card-header.card-type-major {
  background-color: #fce4ec;
  border: 2px solid #e91e63;
}

.card-name {
  font-weight: bold;
  font-size: 1.1em;
}

.card-type {
  font-size: .85em;
  color: #666;
}

.card-cost,
.card-prereqs,
.card-player-count {
  margin-bottom: .5em;
  font-size: .95em;
}

.cost-label,
.prereqs-label,
.player-count-label {
  font-weight: 600;
  color: #555;
  margin-right: .35em;
}

.cost-item {
  margin-right: .5em;
}

.card-vp {
  display: inline-flex;
  align-items: center;
  gap: .35em;
  background-color: #e8f5e9;
  padding: .25em .5em;
  border-radius: .25em;
  margin-bottom: .75em;
}

.vp-value {
  font-size: 1.3em;
  font-weight: bold;
  color: #2e7d32;
}

.vp-label {
  font-size: .85em;
  color: #388e3c;
}

.card-category {
  margin-bottom: .5em;
  font-size: .9em;
}

.category-label {
  font-weight: 600;
  color: #555;
  margin-right: .35em;
}

.category-value {
  color: #666;
  font-style: italic;
}

.card-text {
  background-color: #f5f5f5;
  padding: .75em;
  border-radius: .25em;
  margin-bottom: .75em;
  color: #333;
  line-height: 1.4;
}

.card-text .text-line {
  margin: 0 0 .5em 0;
}

.card-text .text-line:last-child {
  margin-bottom: 0;
}

.card-alternate-cost {
  margin-bottom: .5em;
  font-size: .95em;
}

.alternate-cost-label {
  font-weight: 600;
  color: #555;
  margin-right: .35em;
}

.alternate-cost-value {
  color: #666;
  font-style: italic;
}

.card-abilities {
  margin-bottom: .5em;
}

.abilities-title {
  font-weight: 600;
  color: #555;
  margin-bottom: .25em;
}

.abilities-list {
  margin: 0;
  padding-left: 1.5em;
}

.abilities-list li {
  margin-bottom: .25em;
}

.card-not-found {
  padding: 1em;
  color: #999;
  font-style: italic;
  text-align: center;
}
</style>
