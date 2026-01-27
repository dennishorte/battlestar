<template>
  <div
    class="action-space"
    :class="{ occupied, selectable: isSelectable, selected: isSelected }"
    @click="handleClick"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    :title="action.description"
  >
    <div class="action-content">
      <div class="action-name">{{ action.name }}</div>

      <!-- Accumulated resources -->
      <div class="accumulated" v-if="showAccumulated">
        <span class="accumulated-icon">{{ accumulatedIcon }}</span>
        <span class="accumulated-count">{{ accumulatedAmount }}</span>
      </div>
    </div>

    <!-- Occupied indicator -->
    <div class="occupant" v-if="occupied">
      <span class="worker" :style="workerStyle" />
      <span class="occupant-name">{{ occupiedBy }}</span>
    </div>
  </div>
</template>

<script>
// Action definitions (matching actionSpaces.js)
const ACTION_DEFINITIONS = {
  // Base actions
  'build-room-stable': { name: 'Build Room/Stable', description: 'Build 1 room and/or 1 stable', type: 'instant' },
  'starting-player': { name: 'Starting Player', description: 'Become starting player + 1 food', type: 'instant' },
  'take-grain': { name: 'Take 1 Grain', description: 'Take 1 grain', type: 'instant' },
  'plow-field': { name: 'Plow 1 Field', description: 'Plow 1 field', type: 'instant' },
  'occupation': { name: '1 Occupation', description: 'Play 1 occupation card', type: 'instant' },
  'day-laborer': { name: 'Day Laborer', description: 'Take 2 food', type: 'instant' },
  'take-wood': { name: 'Take Wood', description: 'Take accumulated wood', type: 'accumulating', resource: 'wood' },
  'take-clay': { name: 'Take Clay', description: 'Take accumulated clay', type: 'accumulating', resource: 'clay' },
  'take-reed': { name: 'Take Reed', description: 'Take accumulated reed', type: 'accumulating', resource: 'reed' },
  'fishing': { name: 'Fishing', description: 'Take accumulated food', type: 'accumulating', resource: 'food' },

  // Round cards
  'sow-bake': { name: 'Sow/Bake Bread', description: 'Sow seeds and/or bake bread', type: 'instant' },
  'take-sheep': { name: 'Take Sheep', description: 'Take accumulated sheep', type: 'accumulating', resource: 'sheep' },
  'fencing': { name: 'Fencing', description: 'Build fences', type: 'instant' },
  'major-minor-improvement': { name: 'Major/Minor Improvement', description: 'Build improvement', type: 'instant' },
  'family-growth-minor': { name: 'Family Growth + Minor', description: 'Grow family + optional improvement', type: 'instant' },
  'take-stone-1': { name: 'Take Stone', description: 'Take accumulated stone', type: 'accumulating', resource: 'stone' },
  'renovation-improvement': { name: 'Renovation + Improvement', description: 'Renovate + optional improvement', type: 'instant' },
  'take-vegetable': { name: 'Take 1 Vegetable', description: 'Take 1 vegetable', type: 'instant' },
  'take-boar': { name: 'Take Wild Boar', description: 'Take accumulated boar', type: 'accumulating', resource: 'boar' },
  'take-cattle': { name: 'Take Cattle', description: 'Take accumulated cattle', type: 'accumulating', resource: 'cattle' },
  'take-stone-2': { name: 'Take Stone', description: 'Take accumulated stone', type: 'accumulating', resource: 'stone' },
  'family-growth-urgent': { name: 'Family Growth (No Room)', description: 'Grow family without room', type: 'instant' },
  'plow-sow': { name: 'Plow and/or Sow', description: 'Plow field and/or sow', type: 'instant' },
  'renovation-fencing': { name: 'Renovation/Fencing', description: 'Renovate and/or fence', type: 'instant' },

  // 3+ player actions
  'take-1-building-resource': { name: '1 Building Resource', description: 'Take 1 wood, clay, reed, or stone', type: 'instant' },
  'clay-pit': { name: 'Clay Pit', description: 'Take accumulated clay', type: 'accumulating', resource: 'clay' },
  'take-3-wood': { name: 'Take 3 Wood', description: 'Take 3 wood', type: 'instant' },
  'resource-market': { name: 'Resource Market', description: 'Take 2 different building resources', type: 'instant' },

  // 4+ player actions
  'copse': { name: 'Copse', description: 'Take accumulated wood', type: 'accumulating', resource: 'wood' },
  'take-2-wood': { name: 'Take 2 Wood', description: 'Take 2 wood', type: 'instant' },
}

const RESOURCE_ICONS = {
  wood: '🪵',
  clay: '🧱',
  reed: '🌾',
  stone: '🪨',
  food: '🍞',
  grain: '🌾',
  vegetables: '🥕',
  sheep: '🐑',
  boar: '🐗',
  cattle: '🐄',
}

export default {
  name: 'ActionSpace',

  inject: ['actor', 'bus', 'game'],

  props: {
    actionId: {
      type: String,
      required: true,
    },
  },

  computed: {
    action() {
      return ACTION_DEFINITIONS[this.actionId] || { name: this.actionId, description: '', type: 'instant' }
    },

    actionState() {
      return this.game.state.actionSpaces[this.actionId] || {}
    },

    occupied() {
      return Boolean(this.actionState.occupiedBy)
    },

    occupiedBy() {
      return this.actionState.occupiedBy || ''
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

    showAccumulated() {
      return this.action.type === 'accumulating' && this.accumulatedAmount > 0
    },

    accumulatedAmount() {
      return this.actionState.accumulated || 0
    },

    accumulatedIcon() {
      return RESOURCE_ICONS[this.action.resource] || '📦'
    },

    isSelectable() {
      // Check if this action is in the current player's available choices
      const waiting = this.game.getWaiting(this.game.players.byName(this.actor.name))
      if (!waiting || !waiting.selectors || !waiting.selectors[0]) {
        return false
      }

      const selector = waiting.selectors[0]
      if (selector.title !== 'Choose an action') {
        return false
      }

      const choices = selector.choices || []
      return choices.some(choice => {
        const choiceLower = (choice.title || choice).toLowerCase()
        const actionLower = this.action.name.toLowerCase()
        return choiceLower.includes(actionLower) || actionLower.includes(choiceLower)
      })
    },

    isSelected() {
      // Could track mouse hover or selection state
      return false
    },
  },

  methods: {
    handleClick() {
      if (this.isSelectable) {
        this.bus.emit('user-select-option', {
          actor: this.actor,
          optionName: this.action.name,
          opts: { prefix: true },
        })
      }
    },

    handleMouseEnter() {
      if (this.isSelectable) {
        this.bus.emit('waiting-mouse-entered', {
          optionName: this.action.name,
        })
      }
    },

    handleMouseLeave() {
      if (this.isSelectable) {
        this.bus.emit('waiting-mouse-exited', {
          optionName: this.action.name,
        })
      }
    },
  },
}
</script>

<style scoped>
.action-space {
  display: flex;
  flex-direction: column;
  padding: .5em;
  margin-bottom: .35em;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: .25em;
  cursor: default;
  transition: all 0.15s ease;
}

.action-space.selectable {
  cursor: pointer;
  border-color: #4CAF50;
  background-color: #e8f5e9;
}

.action-space.selectable:hover {
  background-color: #c8e6c9;
  border-color: #2E7D32;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.action-space.occupied {
  background-color: #f5f5f5;
  opacity: 0.8;
}

.action-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.action-name {
  font-weight: 500;
  font-size: .9em;
}

.accumulated {
  display: flex;
  align-items: center;
  gap: .25em;
  background-color: #fff3e0;
  padding: .15em .4em;
  border-radius: .25em;
  border: 1px solid #ffcc80;
}

.accumulated-icon {
  font-size: 1em;
}

.accumulated-count {
  font-weight: bold;
  color: #e65100;
}

.occupant {
  display: flex;
  align-items: center;
  gap: .35em;
  margin-top: .35em;
  padding-top: .35em;
  border-top: 1px dashed #ddd;
  font-size: .8em;
  color: #666;
}

.worker {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 1px solid #333;
}

.occupant-name {
  font-style: italic;
}
</style>
