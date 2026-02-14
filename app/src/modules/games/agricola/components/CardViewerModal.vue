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
      <div class="card-vp" v-if="cardVictoryPoints">
        <span class="vp-value">{{ cardVictoryPoints }}</span>
        <span class="vp-label">Victory Points</span>
      </div>

      <!-- Category -->
      <div class="card-category" v-if="card.category">
        <span class="category-label">Category:</span>
        <span class="category-value">{{ card.category }}</span>
      </div>

      <!-- Card Text -->
      <div class="card-text" v-if="card.text || card.passLeft">
        <template v-if="Array.isArray(card.text)">
          <p v-for="(line, index) in card.text" :key="index" class="text-line">{{ line }}</p>
        </template>
        <template v-else-if="card.text">
          <p class="text-line">{{ card.text }}</p>
        </template>
        <p v-if="card.passLeft" class="text-line pass-left">(Pass this card to the player on your left after you play it.)</p>
      </div>

      <!-- Card Runtime State -->
      <div v-if="hasCardState" class="card-state">
        <div class="state-title">Current State:</div>

        <!-- Resources on card -->
        <div v-if="cardResources.length > 0" class="state-resources">
          <span class="state-label">On card:</span>
          <span v-for="res in cardResources" :key="res.type" class="state-resource">
            {{ res.amount }} {{ res.icon }}
          </span>
        </div>

        <!-- Pile contents -->
        <div v-if="pileContents.length > 0" class="state-pile">
          <span class="state-label">Pile (top first):</span>
          <span class="pile-items">
            <span v-for="(item, index) in [...pileContents].reverse()" :key="index" class="pile-item">
              {{ resourceIcon(item) }}
            </span>
          </span>
        </div>

        <!-- Used status -->
        <div v-if="isUsed" class="state-used">
          <span class="used-indicator">✓ Already used this game</span>
        </div>
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

    cardVictoryPoints() {
      // Minor improvements use 'vps', major improvements use 'victoryPoints'
      return this.card?.vps ?? this.card?.victoryPoints ?? null
    },

    // Get card instance from game (has runtime state)
    cardInstance() {
      if (!this.game?.cards?.byId || !this.cardId) {
        return null
      }
      try {
        return this.game.cards.byId(this.cardId)
      }
      catch {
        return null
      }
    },

    // Get runtime definition
    runtimeDefinition() {
      return this.cardInstance?.definition || null
    },

    // Resources stored on card
    cardResources() {
      if (!this.card || !this.cardId) {
        return []
      }
      const def = this.runtimeDefinition
      const resources = []

      // Check for storedResource pattern (e.g., Whale Oil, Cubbyhole)
      // These cards have storedResource: "food" and store amount in game.cardState(id).stored
      if (this.card?.storedResource) {
        const cardState = this.getCardState()
        const stored = cardState?.stored || 0
        if (stored > 0) {
          resources.push({
            type: this.card.storedResource,
            amount: stored,
            icon: this.resourceIcon(this.card.storedResource),
          })
        }
      }

      // Check for resources stored directly on definition (legacy pattern)
      if (def) {
        const types = ['food', 'wood', 'clay', 'stone', 'reed', 'grain', 'vegetables']
        for (const type of types) {
          if (typeof def[type] === 'number' && def[type] > 0) {
            resources.push({ type, amount: def[type], icon: this.resourceIcon(type) })
          }
        }
      }

      return resources
    },

    isUsed() {
      // Check cardState first (newer pattern)
      const cardState = this.getCardState()
      if (cardState?.used !== undefined) {
        return cardState.used === true
      }
      // Fall back to definition (legacy pattern)
      return this.runtimeDefinition?.used === true
    },

    pileContents() {
      // Check cardState first (newer pattern)
      const cardState = this.getCardState()
      if (cardState?.pile) {
        return cardState.pile
      }
      // Fall back to definition (legacy pattern)
      return this.runtimeDefinition?.pile || []
    },

    // Check if card has any state data in game.cardState
    hasCardStateData() {
      if (!this.card || !this.cardId) {
        return false
      }
      const cardState = this.getCardState()
      if (!cardState) {
        return false
      }
      // Check for common state properties
      return cardState.stored !== undefined || cardState.pile !== undefined || cardState.used !== undefined
    },

    hasCardState() {
      if (!this.card || !this.cardId) {
        return false
      }
      return this.cardResources.length > 0 || this.pileContents.length > 0 || this.isUsed || this.hasCardStateData
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

      // --- Occupation checks ---
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
      if (prereqs.exactlyOccupations !== undefined) {
        parts.push(`Exactly ${prereqs.exactlyOccupations} occupations`)
      }
      if (prereqs.occupationsAtMost !== undefined && prereqs.occupations === undefined) {
        parts.push(`At most ${prereqs.occupationsAtMost} occupations`)
      }
      if (prereqs.noOccupations) {
        parts.push('No occupations played')
      }
      if (prereqs.occupationsInHand !== undefined) {
        parts.push(`${prereqs.occupationsInHand}+ occupations in hand`)
      }

      // --- Improvement checks ---
      if (prereqs.minorImprovements !== undefined) {
        parts.push(`${prereqs.minorImprovements}+ minor improvements`)
      }
      if (prereqs.improvements !== undefined) {
        parts.push(`${prereqs.improvements}+ improvements`)
      }
      if (prereqs.majorImprovements !== undefined) {
        parts.push(`${prereqs.majorImprovements}+ major improvements`)
      }
      if (prereqs.bakingImprovement) {
        parts.push('Baking improvement')
      }
      if (prereqs.cookingImprovement) {
        parts.push('Cooking improvement')
      }
      if (prereqs.hasFireplaceAndCookingHearth) {
        parts.push('Fireplace and Cooking Hearth')
      }
      if (prereqs.returnFireplaceOrCookingHearth) {
        parts.push('Return Fireplace or Cooking Hearth')
      }
      if (prereqs.hasPotteryOrUpgrade) {
        parts.push('Pottery or upgrade')
      }
      if (prereqs.majorImprovement !== undefined) {
        parts.push(`Has ${prereqs.majorImprovement}`)
      }

      // --- Field checks ---
      if (prereqs.fields !== undefined) {
        parts.push(`${prereqs.fields}+ fields`)
      }
      if (prereqs.fieldsExactly !== undefined) {
        parts.push(`Exactly ${prereqs.fieldsExactly} fields`)
      }
      if (prereqs.fieldsInLShape) {
        parts.push('Fields in L-shape')
      }
      if (prereqs.grainFields !== undefined) {
        parts.push(`${prereqs.grainFields}+ grain fields`)
      }
      if (prereqs.vegetableFields !== undefined) {
        parts.push(`${prereqs.vegetableFields}+ vegetable fields`)
      }
      if (prereqs.plantedFields !== undefined) {
        parts.push(`${prereqs.plantedFields}+ planted fields`)
      }
      if (prereqs.emptyFields !== undefined) {
        parts.push(`${prereqs.emptyFields}+ empty fields`)
      }
      if (prereqs.unplantedFields !== undefined) {
        parts.push(`${prereqs.unplantedFields}+ unplanted fields`)
      }
      if (prereqs.noFields) {
        parts.push('No fields')
      }
      if (prereqs.noGrainFields) {
        parts.push('No grain fields')
      }

      // --- Pasture and stable checks ---
      if (prereqs.pastures !== undefined) {
        if (prereqs.pasturesExact) {
          parts.push(`Exactly ${prereqs.pastures} pastures`)
        }
        else {
          parts.push(`${prereqs.pastures}+ pastures`)
        }
      }
      if (prereqs.stables !== undefined) {
        parts.push(`${prereqs.stables}+ stables`)
      }
      if (prereqs.fences !== undefined) {
        parts.push(`${prereqs.fences}+ fences`)
      }
      if (prereqs.fencesInSupply !== undefined) {
        parts.push(`${prereqs.fencesInSupply}+ fences in supply`)
      }
      if (prereqs.fencedStables !== undefined) {
        parts.push(`${prereqs.fencedStables}+ fenced stables`)
      }

      // --- Room checks ---
      if (prereqs.rooms !== undefined) {
        parts.push(`${prereqs.rooms}+ rooms`)
      }
      if (prereqs.roomCount !== undefined) {
        if (prereqs.roomCountExact) {
          parts.push(`Exactly ${prereqs.roomCount} rooms`)
        }
        else {
          parts.push(`${prereqs.roomCount}+ rooms`)
        }
      }
      if (prereqs.houseType !== undefined) {
        const types = Array.isArray(prereqs.houseType)
          ? prereqs.houseType.join(' or ')
          : prereqs.houseType
        parts.push(`${types} house`)
      }

      // --- Animal checks ---
      if (prereqs.sheep !== undefined) {
        parts.push(`${prereqs.sheep}+ sheep`)
      }
      if (prereqs.sheepExactly !== undefined) {
        parts.push(`Exactly ${prereqs.sheepExactly} sheep`)
      }
      if (prereqs.boar !== undefined) {
        parts.push(`${prereqs.boar}+ boar`)
      }
      if (prereqs.cattle !== undefined) {
        parts.push(`${prereqs.cattle}+ cattle`)
      }
      if (prereqs.animals !== undefined) {
        parts.push(`${prereqs.animals}+ animals`)
      }
      if (prereqs.animalTypes !== undefined) {
        parts.push(`${prereqs.animalTypes}+ animal types`)
      }
      if (prereqs.allAnimalTypes) {
        parts.push('All animal types')
      }
      if (prereqs.noAnimals) {
        parts.push('No animals')
      }
      if (prereqs.noSheep) {
        parts.push('No sheep')
      }

      // --- Resource checks ---
      if (prereqs.clay !== undefined) {
        parts.push(`${prereqs.clay}+ clay`)
      }
      if (prereqs.grain !== undefined) {
        parts.push(`${prereqs.grain}+ grain`)
      }
      if (prereqs.reed !== undefined) {
        parts.push(`${prereqs.reed}+ reed`)
      }
      if (prereqs.stone !== undefined) {
        parts.push(`${prereqs.stone}+ stone`)
      }
      if (prereqs.noGrain) {
        parts.push('No grain')
      }
      if (prereqs.buildingResourcesInSupply !== undefined) {
        parts.push(`${prereqs.buildingResourcesInSupply}+ building resources`)
      }
      if (prereqs.woodGteRound) {
        parts.push('Wood \u2265 round')
      }

      // --- Farmyard checks ---
      if (prereqs.allFarmyardUsed) {
        parts.push('All farmyard spaces used')
      }
      if (prereqs.unusedFarmyard !== undefined) {
        parts.push(`${prereqs.unusedFarmyard}+ unused farmyard spaces`)
      }
      if (prereqs.unusedFarmyardAtMost !== undefined) {
        parts.push(`At most ${prereqs.unusedFarmyardAtMost} unused farmyard spaces`)
      }
      if (prereqs.pastureSpacesGteRound) {
        parts.push('Pasture spaces \u2265 round')
      }
      if (prereqs.roundsLeftGreaterThanUnusedSpaces) {
        parts.push('Rounds left > unused spaces')
      }

      // --- People checks ---
      if (prereqs.maxPeople !== undefined) {
        parts.push(`At most ${prereqs.maxPeople} people`)
      }
      if (prereqs.exactlyAdults !== undefined) {
        parts.push(`Exactly ${prereqs.exactlyAdults} adults`)
      }
      if (prereqs.noPeopleInHouse) {
        parts.push('No people in house')
      }
      if (prereqs.personOnFishing) {
        parts.push('Person on fishing space')
      }
      if (prereqs.personOnAction !== undefined) {
        parts.push(`Person on ${prereqs.personOnAction}`)
      }
      if (prereqs.personYetToPlace) {
        parts.push('Person yet to place')
      }

      // --- Round checks ---
      if (prereqs.maxRound !== undefined) {
        parts.push(`Round ${prereqs.maxRound} or earlier`)
      }
      if (prereqs.minRound !== undefined) {
        parts.push(`Round ${prereqs.minRound}+`)
      }
      if (prereqs.roundIn !== undefined) {
        parts.push(`Round ${prereqs.roundIn.join(' or ')}`)
      }

      // --- Card count checks ---
      if (prereqs.cardsInPlay !== undefined) {
        parts.push(`${prereqs.cardsInPlay}+ cards in play`)
      }
      if (prereqs.maxCardsInPlay !== undefined) {
        parts.push(`At most ${prereqs.maxCardsInPlay} cards in play`)
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

.card-text .pass-left {
  font-style: italic;
  color: #666;
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

.card-state {
  background-color: #fff8e1;
  border: 1px solid #ffca28;
  border-radius: .25em;
  padding: .5em;
  margin-bottom: .75em;
}

.state-title {
  font-weight: 600;
  color: #f57f17;
  margin-bottom: .35em;
  font-size: .9em;
}

.state-resources,
.state-pile {
  margin-bottom: .35em;
}

.state-label {
  font-weight: 500;
  color: #555;
  margin-right: .35em;
}

.state-resource {
  margin-right: .5em;
}

.pile-items {
  display: inline-flex;
  gap: .25em;
}

.pile-item {
  background-color: #fff;
  border: 1px solid #ddd;
  padding: .1em .25em;
  border-radius: .15em;
}

.state-used .used-indicator {
  color: #666;
  font-style: italic;
}
</style>
