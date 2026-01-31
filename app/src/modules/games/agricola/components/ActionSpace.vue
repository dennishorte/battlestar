<template>
  <div
    class="action-space"
    :class="{ occupied, selectable: isSelectable, selected: isSelected, clickable: true }"
    @click="handleClick"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <div class="action-content">
      <span class="worker" v-if="occupied" :style="workerStyle" />
      <div class="action-name">{{ action.name }}</div>

      <!-- Accumulated resources -->
      <div class="accumulated" v-if="showAccumulated">
        <span class="accumulated-icon">{{ accumulatedIcon }}</span>
        <span class="accumulated-count">{{ accumulatedAmount }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { agricola } from 'battlestar-common'

const res = agricola.res

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

  inject: ['actor', 'bus', 'game', 'ui'],

  props: {
    actionId: {
      type: String,
      required: true,
    },
  },

  computed: {
    action() {
      return res.getActionById(this.actionId) || { name: this.actionId, description: '', type: 'instant' }
    },

    accumulatedResource() {
      // Extract resource type from the accumulates object
      if (this.action?.accumulates) {
        return Object.keys(this.action.accumulates)[0]
      }
      return null
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
      return RESOURCE_ICONS[this.accumulatedResource] || '📦'
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
      // Always show the action space modal on click
      this.ui.fn.showActionSpace(this.actionId)
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
  padding: .3em .4em;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: .25em;
  cursor: pointer;
  transition: all 0.15s ease;
}

.action-space.clickable:hover {
  border-color: #aaa;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
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
  align-items: center;
  gap: .3em;
}

.action-name {
  font-weight: 500;
  font-size: .85em;
}

.accumulated {
  display: flex;
  align-items: center;
  gap: .25em;
  margin-left: auto;
  background-color: #fff3e0;
  padding: 0 .35em;
  border-radius: .25em;
  border: 1px solid #ffcc80;
  font-size: .85em;
}

.accumulated-icon {
  font-size: 1em;
}

.accumulated-count {
  font-weight: bold;
  color: #e65100;
}

.worker {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 1px solid #333;
  flex-shrink: 0;
}
</style>
