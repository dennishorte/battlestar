<template>
  <ModalBase id="agricola-action-space" scrollable>
    <template #header>{{ actionName }}</template>

    <template #footer>
      <button
        v-if="canChooseAction"
        class="btn btn-success"
        data-bs-dismiss="modal"
        @click="chooseAction"
      >
        Choose This Action
      </button>
      <button class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
    </template>

    <div v-if="action" class="action-details">
      <!-- Action Type Badge -->
      <div class="action-badge" :class="actionTypeBadgeClass">
        {{ actionTypeBadge }}
      </div>

      <!-- Description -->
      <div class="action-description">
        {{ action.description }}
      </div>

      <!-- Card Action Space Owner -->
      <div class="owner-section" v-if="action.cardProvided && action.ownerName">
        <span class="owner-label">Owned by:</span>
        <span class="owner-name">{{ action.ownerName }}</span>
      </div>

      <!-- Accumulated Resources (for accumulating actions) -->
      <div class="accumulated-section" v-if="isAccumulating && accumulatedAmount > 0">
        <div class="accumulated-label">Currently Available:</div>
        <div class="accumulated-value">
          <span class="accumulated-icon">{{ accumulatedIcon }}</span>
          <span class="accumulated-count">{{ accumulatedAmount }}</span>
          <span class="accumulated-resource">{{ accumulatedResourceName }}</span>
        </div>
      </div>

      <!-- Accumulation Rate -->
      <div class="accumulation-rate" v-if="isAccumulating && action.accumulates">
        <span class="rate-label">Accumulates:</span>
        <span class="rate-value">{{ accumulationRateText }}</span>
      </div>

      <!-- Gives Resources -->
      <div class="gives-section" v-if="action.gives">
        <span class="gives-label">Gives:</span>
        <span class="gives-value">{{ givesText }}</span>
      </div>

      <!-- Abilities -->
      <div class="abilities-section" v-if="hasAbilities">
        <div class="abilities-title">Abilities:</div>
        <ul class="abilities-list">
          <li v-if="action.allowsRoomBuilding">Build 1 room (5 building material + 2 reed)</li>
          <li v-if="action.allowsStableBuilding">Build 1 stable (2 wood)</li>
          <li v-if="action.allowsPlowing">Plow 1 field</li>
          <li v-if="action.allowsSowing">Sow seeds on fields</li>
          <li v-if="action.allowsBaking">Bake bread (requires oven)</li>
          <li v-if="action.allowsFencing">Build fences (1 wood each)</li>
          <li v-if="action.allowsFamilyGrowth && action.requiresRoom !== false">Grow family (requires empty room)</li>
          <li v-if="action.allowsFamilyGrowth && action.requiresRoom === false">Grow family (no room needed)</li>
          <li v-if="action.allowsRenovation">Renovate house: costs 1 reed + 1 clay/stone per room</li>
          <li v-if="action.allowsMajorImprovement">Build major improvement</li>
          <li v-if="action.allowsMinorImprovement">Build minor improvement</li>
          <li v-if="action.allowsOccupation">Play occupation card</li>
          <li v-if="action.startsPlayer">Become starting player</li>
          <li v-if="action.allowsResourceChoice">Choose from: {{ resourceChoiceText }}</li>
          <li v-if="action.allowsHouseBuilding">Build rooms (5 building material + 2 reed each)</li>
          <li v-if="action.allowsAnimalMarket">Choose: Sheep (+1 food) or Cattle (costs 1 food)</li>
          <li v-if="action.allowsFarmSupplies">Optional: Take 1 grain (pay 1 food) and/or Plow 1 field (pay 1 food)</li>
          <li v-if="action.allowsBuildingSupplies">Take 1 food + choose (1 reed or 1 stone) + choose (1 wood or 1 clay)</li>
          <li v-if="action.allowsCorral">Take 1 animal you don't have (sheep → boar → cattle)</li>
          <li v-if="action.allowsSideJob">Build 1 stable (1 wood) + optional bake bread</li>
        </ul>
      </div>

      <!-- Linked Space Info -->
      <div class="linked-section" v-if="hasLinkedSpace">
        <div class="linked-badge">
          <span class="linked-icon">🔗</span>
          <span>Linked with: <strong>{{ linkedSpaceName }}</strong></span>
        </div>
        <div class="linked-explanation">
          When this action is used, {{ linkedSpaceName }} becomes blocked for the rest of the round.
        </div>
      </div>

      <!-- Min Round Restriction -->
      <div class="restriction-section" v-if="action.minRound">
        <div class="restriction-badge">
          Available from Round {{ action.minRound }}
        </div>
      </div>

      <!-- Occupied Status -->
      <div class="occupied-section" v-if="isOccupied">
        <div class="occupied-badge">
          <span class="worker" :style="workerStyle" />
          <span>Occupied by {{ occupiedBy }}</span>
        </div>
      </div>

      <!-- Blocked Status -->
      <div class="blocked-section" v-if="isBlocked">
        <div class="blocked-badge">
          <span class="blocked-icon">⛔</span>
          <span>Blocked by linked space: <strong>{{ blockedByName }}</strong></span>
        </div>
      </div>

      <!-- Cannot choose message -->
      <div class="cannot-choose" v-if="isOccupied && isPlayerTurn">
        <em>This action space is already occupied</em>
      </div>
      <div class="cannot-choose" v-else-if="isBlocked && isPlayerTurn">
        <em>This action space is blocked because its linked partner was used this round</em>
      </div>
    </div>

    <div v-else class="action-not-found">
      Action not found: {{ actionId }}
    </div>
  </ModalBase>
</template>

<script>
import ModalBase from '@/components/ModalBase.vue'
import { agricola } from 'battlestar-common'

const res = agricola.res

const RESOURCE_ICONS = {
  wood: '🪵',
  clay: '🧱',
  reed: '🌿',
  stone: '🪨',
  food: '🍞',
  grain: '🌾',
  vegetables: '🥕',
  sheep: '🐑',
  boar: '🐗',
  cattle: '🐄',
}

const RESOURCE_NAMES = {
  wood: 'Wood',
  clay: 'Clay',
  reed: 'Reed',
  stone: 'Stone',
  food: 'Food',
  grain: 'Grain',
  vegetables: 'Vegetables',
  sheep: 'Sheep',
  boar: 'Wild Boar',
  cattle: 'Cattle',
}

export default {
  name: 'ActionSpaceModal',

  components: {
    ModalBase,
  },

  inject: ['actor', 'bus', 'game', 'ui'],

  computed: {
    actionId() {
      return this.ui.modals?.actionSpace?.actionId || ''
    },

    action() {
      if (!this.actionId) {
        return null
      }
      const action = res.getActionById(this.actionId)
      if (action) {
        return action
      }

      const state = this.game.state.actionSpaces?.[this.actionId]
      if (state?.cardProvided) {
        return {
          name: state.name,
          description: state.description,
          type: 'card-provided',
          cardProvided: true,
          ownerName: state.ownerName,
        }
      }
      return null
    },

    actionName() {
      return this.action ? this.action.name : 'Action Details'
    },

    actionDisplayName() {
      return this.action ? this.action.name : ''
    },

    actionState() {
      return this.game.state.actionSpaces?.[this.actionId] || {}
    },

    isAccumulating() {
      return this.action?.type === 'accumulating'
    },

    actionTypeBadge() {
      if (this.action?.cardProvided) {
        return 'Card Action Space'
      }
      if (this.isAccumulating) {
        return 'Accumulating'
      }
      if (this.action?.stage) {
        return `Stage ${this.action.stage}`
      }
      return 'Base Action'
    },

    actionTypeBadgeClass() {
      if (this.action?.cardProvided) {
        return 'badge-card'
      }
      if (this.isAccumulating) {
        return 'badge-accumulating'
      }
      if (this.action?.stage) {
        return 'badge-stage'
      }
      return 'badge-base'
    },

    accumulatedAmount() {
      return this.actionState.accumulated || 0
    },

    accumulatedResource() {
      if (!this.action?.accumulates) {
        return null
      }
      return Object.keys(this.action.accumulates)[0]
    },

    accumulatedIcon() {
      return RESOURCE_ICONS[this.accumulatedResource] || '📦'
    },

    accumulatedResourceName() {
      return RESOURCE_NAMES[this.accumulatedResource] || this.accumulatedResource
    },

    accumulationRateText() {
      if (!this.action?.accumulates) {
        return ''
      }
      const entries = Object.entries(this.action.accumulates)
      return entries.map(([resource, amount]) => {
        return `+${amount} ${RESOURCE_NAMES[resource] || resource} per round`
      }).join(', ')
    },

    givesText() {
      if (!this.action?.gives) {
        return ''
      }
      const entries = Object.entries(this.action.gives)
      return entries.map(([resource, amount]) => {
        const icon = RESOURCE_ICONS[resource] || ''
        return `${amount} ${icon} ${RESOURCE_NAMES[resource] || resource}`
      }).join(', ')
    },

    hasAbilities() {
      if (!this.action) {
        return false
      }
      return this.action.allowsRoomBuilding ||
             this.action.allowsStableBuilding ||
             this.action.allowsPlowing ||
             this.action.allowsSowing ||
             this.action.allowsBaking ||
             this.action.allowsFencing ||
             this.action.allowsFamilyGrowth ||
             this.action.allowsRenovation ||
             this.action.allowsMajorImprovement ||
             this.action.allowsMinorImprovement ||
             this.action.allowsOccupation ||
             this.action.startsPlayer ||
             this.action.allowsResourceChoice ||
             this.action.allowsHouseBuilding ||
             this.action.allowsAnimalMarket ||
             this.action.allowsFarmSupplies ||
             this.action.allowsBuildingSupplies ||
             this.action.allowsCorral ||
             this.action.allowsSideJob
    },

    resourceChoiceText() {
      if (!this.action?.allowsResourceChoice) {
        return ''
      }
      return this.action.allowsResourceChoice.map(r => RESOURCE_NAMES[r] || r).join(', ')
    },

    isOccupied() {
      return Boolean(this.actionState.occupiedBy)
    },

    occupiedBy() {
      return this.actionState.occupiedBy || ''
    },

    isBlocked() {
      return Boolean(this.actionState.blockedBy)
    },

    blockedBy() {
      return this.actionState.blockedBy || ''
    },

    blockedByName() {
      if (!this.blockedBy) {
        return ''
      }
      const blockedByAction = res.getActionById(this.blockedBy)
      return blockedByAction ? blockedByAction.name : this.blockedBy
    },

    hasLinkedSpace() {
      return Boolean(this.action?.linkedWith)
    },

    linkedSpaceName() {
      if (!this.action?.linkedWith) {
        return ''
      }
      const linkedAction = res.getActionById(this.action.linkedWith)
      return linkedAction ? linkedAction.name : this.action.linkedWith
    },

    occupiedByPlayer() {
      if (!this.occupiedBy) {
        return null
      }
      return this.game.players.byName(this.occupiedBy)
    },

    workerStyle() {
      if (this.occupiedByPlayer) {
        return { backgroundColor: this.occupiedByPlayer.color }
      }
      return { backgroundColor: '#666' }
    },

    waitingRequest() {
      return this.game.getWaiting(this.game.players.byName(this.actor.name))
    },

    isPlayerTurn() {
      const waiting = this.waitingRequest
      if (!waiting) {
        return false
      }
      // Check title directly on waiting or in selectors[0]
      const title = waiting.title || (waiting.selectors && waiting.selectors[0]?.title)
      return title === 'Choose an action'
    },

    canChooseAction() {
      if (!this.action || !this.isPlayerTurn || this.isOccupied || this.isBlocked) {
        return false
      }

      const waiting = this.waitingRequest
      if (!waiting) {
        return false
      }

      // Get choices from waiting directly or from selectors[0]
      const choices = waiting.choices || (waiting.selectors && waiting.selectors[0]?.choices) || []

      // Use display name for matching (handles duplicate action names like "Lessons A", "Lessons B")
      const displayNameLower = this.actionDisplayName.toLowerCase()

      return choices.some(choice => {
        const choiceLower = (choice.title || choice).toLowerCase()
        // Match by display name (exact or prefix match for accumulated amounts like "Lessons A (3)")
        return choiceLower === displayNameLower || choiceLower.startsWith(displayNameLower)
      })
    },
  },

  methods: {
    chooseAction() {
      // Emit the selection using display name (handles duplicate action names)
      // Use prefix matching to handle accumulated amounts like "Lessons A (3)"
      this.bus.emit('user-select-option', {
        actor: this.actor,
        optionName: this.actionDisplayName,
        opts: { prefix: true },
      })

      // Trigger the submit after a short delay to ensure selection is registered
      setTimeout(() => {
        this.bus.emit('click-choose-selected-option')
      }, 50)
    },
  },
}
</script>

<style scoped>
.action-details {
  padding: .5em;
}

.action-badge {
  display: inline-block;
  padding: .25em .75em;
  border-radius: 1em;
  font-size: .85em;
  font-weight: 500;
  margin-bottom: .75em;
}

.badge-base {
  background-color: #e3f2fd;
  color: #1565c0;
}

.badge-accumulating {
  background-color: #fff3e0;
  color: #e65100;
}

.badge-stage {
  background-color: #f3e5f5;
  color: #7b1fa2;
}

.badge-card {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.owner-section {
  margin-bottom: .75em;
  font-size: .95em;
}

.owner-label {
  font-weight: 600;
  color: #555;
  margin-right: .35em;
}

.owner-name {
  color: #2e7d32;
  font-weight: 500;
}

.action-description {
  font-size: 1em;
  color: #333;
  margin-bottom: 1em;
  line-height: 1.4;
}

.accumulated-section {
  background-color: #fff8e1;
  border: 1px solid #ffcc80;
  border-radius: .5em;
  padding: .75em;
  margin-bottom: 1em;
}

.accumulated-label {
  font-size: .85em;
  color: #666;
  margin-bottom: .25em;
}

.accumulated-value {
  display: flex;
  align-items: center;
  gap: .5em;
  font-size: 1.2em;
}

.accumulated-icon {
  font-size: 1.5em;
}

.accumulated-count {
  font-weight: bold;
  color: #e65100;
  font-size: 1.3em;
}

.accumulated-resource {
  color: #555;
}

.accumulation-rate {
  margin-bottom: .75em;
  font-size: .9em;
}

.rate-label {
  font-weight: 600;
  color: #555;
  margin-right: .35em;
}

.rate-value {
  color: #666;
}

.gives-section {
  margin-bottom: .75em;
  font-size: .95em;
}

.gives-label {
  font-weight: 600;
  color: #555;
  margin-right: .35em;
}

.gives-value {
  color: #2e7d32;
}

.abilities-section {
  margin-bottom: 1em;
}

.abilities-title {
  font-weight: 600;
  color: #555;
  margin-bottom: .25em;
}

.abilities-list {
  margin: 0;
  padding-left: 1.5em;
  color: #444;
}

.abilities-list li {
  margin-bottom: .25em;
}

.linked-section {
  background-color: #e8eaf6;
  border: 1px solid #9fa8da;
  border-radius: .5em;
  padding: .75em;
  margin-bottom: 1em;
}

.linked-badge {
  display: flex;
  align-items: center;
  gap: .5em;
  font-size: .95em;
  color: #3949ab;
}

.linked-icon {
  font-size: 1.1em;
}

.linked-explanation {
  font-size: .85em;
  color: #5c6bc0;
  margin-top: .5em;
  font-style: italic;
}

.restriction-section {
  margin-bottom: 1em;
}

.restriction-badge {
  display: inline-block;
  padding: .25em .75em;
  background-color: #fff3e0;
  border: 1px solid #ffcc80;
  border-radius: .5em;
  color: #e65100;
  font-size: .9em;
}

.blocked-section {
  margin-bottom: 1em;
}

.blocked-badge {
  display: inline-flex;
  align-items: center;
  gap: .5em;
  background-color: #ffebee;
  border: 1px solid #ef9a9a;
  padding: .5em .75em;
  border-radius: .5em;
  color: #c62828;
}

.blocked-icon {
  font-size: 1em;
}

.occupied-section {
  margin-bottom: 1em;
}

.occupied-badge {
  display: inline-flex;
  align-items: center;
  gap: .5em;
  background-color: #ffebee;
  border: 1px solid #ef9a9a;
  padding: .5em .75em;
  border-radius: .5em;
  color: #c62828;
}

.worker {
  display: inline-block;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 1px solid #333;
}

.cannot-choose {
  margin-top: 1em;
  padding: .75em;
  text-align: center;
  color: #999;
  background-color: #f5f5f5;
  border-radius: .25em;
}

.action-not-found {
  padding: 1em;
  color: #999;
  font-style: italic;
  text-align: center;
}
</style>
