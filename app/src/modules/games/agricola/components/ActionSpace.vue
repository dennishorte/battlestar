<template>
  <div
    class="action-space"
    :class="{
      compact,
      occupied: !compact && occupied,
      blocked: !compact && isBlocked,
      'not-yet-available': !compact && notYetAvailable,
      selectable: !compact && isSelectable,
      selected: isSelected,
      clickable: true
    }"
    @click="handleClick"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <div class="action-content">
      <span class="worker" v-if="!compact && occupied" :style="workerStyle" />
      <span class="blocked-icon" v-if="!compact && isBlocked" title="Blocked by linked space">⛔</span>
      <div class="action-name">{{ action.name }}</div>

      <!-- Round restriction indicator -->
      <span class="round-restriction" v-if="!compact && notYetAvailable" :title="'Available from round ' + action.minRound">
        R{{ action.minRound }}+
      </span>

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
  reed: '🌿',
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
    compact: {
      type: Boolean,
      default: false,
    },
    accumulatedOverride: {
      type: Number,
      default: null,
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

    isBlocked() {
      return Boolean(this.actionState.blockedBy)
    },

    currentRound() {
      return this.game.state.round || 1
    },

    notYetAvailable() {
      if (!this.action?.minRound) {
        return false
      }
      return this.currentRound < this.action.minRound
    },

    blockedBy() {
      return this.actionState.blockedBy || ''
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

    linkedSpaceTooltip() {
      return `Linked with: ${this.linkedSpaceName}`
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
      if (this.accumulatedOverride !== null) {
        return this.accumulatedOverride
      }
      return this.actionState.accumulated || 0
    },

    accumulatedIcon() {
      return RESOURCE_ICONS[this.accumulatedResource] || '📦'
    },

    actionDisplayName() {
      return this.action ? this.action.name : ''
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

      // Use display name for matching (handles duplicate action names)
      const displayNameLower = this.actionDisplayName.toLowerCase()

      const choices = selector.choices || []
      return choices.some(choice => {
        const choiceLower = (choice.title || choice).toLowerCase()
        // Match by display name (exact or prefix match for accumulated amounts)
        return choiceLower === displayNameLower || choiceLower.startsWith(displayNameLower)
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
  overflow: hidden;
  min-width: 0;
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

.action-space.blocked {
  background-color: #ffebee;
  border-color: #ef9a9a;
  opacity: 0.7;
}

.action-space.not-yet-available {
  background-color: #f0f0f0;
  border-color: #ccc;
  opacity: 0.5;
}

.action-space.not-yet-available .action-name {
  color: #999;
}

.action-content {
  display: flex;
  align-items: center;
  gap: .3em;
  overflow: hidden;
  min-width: 0;
}

.action-name {
  font-weight: 500;
  font-size: .85em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
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

.blocked-icon {
  font-size: .75em;
  flex-shrink: 0;
}

.round-restriction {
  font-size: .7em;
  color: #666;
  background-color: #e0e0e0;
  padding: .1em .3em;
  border-radius: .2em;
  margin-left: auto;
  flex-shrink: 0;
}

/* Compact mode (for selector chips) */
.action-space.compact {
  background-color: #efebe9;
  border: none;
  border-left: 3px solid #8d6e63;
  padding: .15em .4em;
}

.action-space.compact:hover {
  filter: brightness(0.92);
  box-shadow: none;
}
</style>
