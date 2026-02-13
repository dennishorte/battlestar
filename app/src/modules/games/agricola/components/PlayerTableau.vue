<template>
  <div class="player-tableau">
    <div class="player-header" :style="headerStyle">
      <span class="player-name">{{ player.name }}</span>
      <span class="worker-info">
        <span class="worker-icon">👤</span>
        <span class="worker-count">{{ player.getAvailableWorkers() }}/{{ player.getFamilySize() }}</span>
      </span>
    </div>

    <div class="player-content">
      <!-- Resources -->
      <ResourceBar :player="player" />

      <!-- Animals -->
      <AnimalDisplay :player="player" />

      <!-- Fencing Status (shown during fencing mode) -->
      <div v-if="showFencingStatus" class="fencing-status" :class="fencingStatusClass">
        <div class="fencing-header">
          <span class="fencing-icon">🪵</span>
          <span class="fencing-title">Building Pasture</span>
        </div>
        <div class="fencing-info">
          <template v-if="fencingValidation">
            <span v-if="fencingValidation.valid" class="fencing-valid">
              {{ selectedSpaceCount }} spaces, {{ fencingValidation.fencesNeeded }} wood needed
            </span>
            <span v-else class="fencing-error">
              {{ fencingValidation.error }}
            </span>
          </template>
          <template v-else>
            <span class="fencing-hint">Click spaces to select</span>
          </template>
        </div>
        <div class="fencing-actions">
          <button
            class="btn btn-sm btn-outline-secondary"
            @click="ui.fn.cancelFencing"
          >
            Cancel
          </button>
          <button
            class="btn btn-sm btn-success"
            :disabled="!canConfirmFencing"
            @click="ui.fn.confirmFencing"
          >
            Confirm Pasture
          </button>
        </div>
      </div>

      <!-- Farmyard Grid -->
      <div class="farmyard-container">
        <FarmyardGrid :player="player" />
      </div>

      <!-- Virtual Fields (from cards like Beanfield, Lettuce Patch, etc.) -->
      <div v-if="player.virtualFields && player.virtualFields.length > 0" class="virtual-fields-container">
        <div
          v-for="field in player.virtualFields"
          :key="field.id"
          class="virtual-field-wrapper"
        >
          <div class="virtual-field-label">{{ field.label }}</div>
          <div
            class="virtual-field-cell"
            :class="getVirtualFieldClasses(field)"
            :title="getVirtualFieldTooltip(field)"
            @click="handleVirtualFieldClick(field)"
          >
            <span class="virtual-field-icon" v-if="field.crop">{{ getCropIcon(field.crop) }}</span>
            <span class="virtual-field-empty" v-else>{{ getCropRestrictionLabel(field) }}</span>
            <span class="virtual-field-count" v-if="field.cropCount > 0">
              {{ field.cropCount }}
            </span>
          </div>
        </div>
      </div>

      <!-- Scheduled Resources -->
      <div v-if="hasScheduledItems" class="scheduled-section">
        <div class="scheduled-header">
          <span class="scheduled-icon">📅</span>
          <span class="scheduled-title">Scheduled</span>
        </div>
        <div class="scheduled-items">
          <div
            v-for="item in scheduledItems"
            :key="item.round + '-' + item.type"
            class="scheduled-item"
          >
            <span class="scheduled-round">R{{ item.round }}</span>
            <span class="scheduled-resource">{{ item.icon }} {{ item.amount }} {{ item.label }}</span>
          </div>
        </div>
      </div>

      <!-- Farmyard Stats -->
      <div class="farmyard-stats">
        <span class="stat">🏠 {{ player.getRoomCount() }} {{ player.roomType }}</span>
        <span class="stat">🌾 {{ player.getFieldCount() }} fields</span>
        <span class="stat">🌿 {{ player.getPastureCount() }} pastures</span>
        <span class="stat unused" v-if="unusedSpaces > 0">◻ {{ unusedSpaces }} unused</span>
      </div>

      <!-- Played Cards -->
      <CardSection
        title="Occupations"
        :cards="player.playedOccupations"
        persistKey="agricola-occupations-expanded"
      />

      <CardSection
        title="Minor Improvements"
        :cards="player.playedMinorImprovements"
        persistKey="agricola-minor-expanded"
      />

      <CardSection
        title="Major Improvements"
        :cards="player.majorImprovements"
        persistKey="agricola-major-expanded"
      />

      <!-- Hand (only visible to the player) -->
      <CardSection
        v-if="isViewingPlayer"
        title="Hand"
        :cards="player.hand"
        :player="player"
        :startExpanded="true"
        persistKey="agricola-hand-expanded"
        :sortable="true"
        :cardOrder="handCardOrder"
        @reorder="onHandReorder"
      />

      <!-- Score -->
      <div class="score-section" @click="showScoreBreakdown">
        <span class="score-label">Score:</span>
        <span class="score-value">{{ player.calculateScore() }}</span>
        <span class="score-unit">pts</span>
        <span class="score-hint">click for details</span>
      </div>

      <!-- Begging Cards -->
      <div class="begging-section" v-if="player.beggingCards > 0">
        <span class="begging-icon">😢</span>
        <span class="begging-count">{{ player.beggingCards }} begging cards</span>
      </div>
    </div>
  </div>
</template>

<script>
import AnimalDisplay from './AnimalDisplay.vue'
import CardSection from './CardSection.vue'
import FarmyardGrid from './FarmyardGrid.vue'
import ResourceBar from './ResourceBar.vue'
import axiosWrapper from '@/util/axiosWrapper.js'

export default {
  name: 'PlayerTableau',

  components: {
    AnimalDisplay,
    CardSection,
    FarmyardGrid,
    ResourceBar,
  },

  inject: ['actor', 'bus', 'game', 'ui'],

  props: {
    player: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      handCardOrder: [],
      saveTimer: null,
    }
  },

  mounted() {
    if (this.player.name === this.actor.name) {
      this.fetchCardOrder()
    }
  },

  beforeUnmount() {
    if (this.saveTimer) {
      clearTimeout(this.saveTimer)
      this.saveCardOrderNow()
    }
  },

  computed: {
    isViewingPlayer() {
      return this.player.name === this.actor.name
    },

    headerStyle() {
      return {
        backgroundColor: this.player.color || '#666',
        color: this.getContrastColor(this.player.color),
      }
    },

    // Fencing status computed properties
    showFencingStatus() {
      return this.isViewingPlayer && this.ui.fencing?.active
    },

    fencingValidation() {
      return this.ui.fencing?.validation
    },

    selectedSpaceCount() {
      return this.ui.fencing?.selectedSpaces?.length || 0
    },

    fencingStatusClass() {
      if (!this.fencingValidation) {
        return 'status-empty'
      }
      return this.fencingValidation.valid ? 'status-valid' : 'status-invalid'
    },

    canConfirmFencing() {
      return this.fencingValidation?.valid === true
    },

    unusedSpaces() {
      // Total farmyard is 15 spaces (3x5)
      // Used spaces = rooms + fields + pasture spaces + unfenced stables
      const totalSpaces = 15
      const rooms = this.player.getRoomCount()
      const fields = this.player.getFieldCount()

      // Get pasture info
      let pastureSpaces = 0
      const pastures = this.player.farmyard?.pastures || []
      for (const pasture of pastures) {
        pastureSpaces += pasture.spaces?.length || 0
      }

      // Stables not in pastures count as used
      const stables = this.player.getStableCount()
      const stablesInPastures = pastures.reduce((sum, p) => sum + (p.hasStable ? 1 : 0), 0)
      const freeStandingStables = stables - stablesInPastures

      return totalSpaces - rooms - fields - pastureSpaces - freeStandingStables
    },

    scheduledItems() {
      const items = []
      const state = this.game.state
      const playerName = this.player.name
      const currentRound = state.round || 1

      const resourceTypes = [
        { key: 'scheduledFood', icon: '🍞', label: 'food' },
        { key: 'scheduledVegetables', icon: '🥕', label: 'veg' },
        { key: 'scheduledClay', icon: '🧱', label: 'clay' },
        { key: 'scheduledWood', icon: '🪵', label: 'wood' },
        { key: 'scheduledStone', icon: '🪨', label: 'stone' },
        { key: 'scheduledReed', icon: '🌿', label: 'reed' },
        { key: 'scheduledGrain', icon: '🌾', label: 'grain' },
        { key: 'scheduledSheep', icon: '🐑', label: 'sheep' },
        { key: 'scheduledBoar', icon: '🐗', label: 'boar' },
        { key: 'scheduledCattle', icon: '🐄', label: 'cattle' },
      ]

      for (const { key, icon, label } of resourceTypes) {
        const scheduled = state[key]?.[playerName]
        if (scheduled) {
          for (const [round, amount] of Object.entries(scheduled)) {
            const roundNum = parseInt(round)
            if (amount > 0 && roundNum >= currentRound) {
              items.push({
                round: roundNum,
                type: key,
                icon,
                label,
                amount,
              })
            }
          }
        }
      }

      // Scheduled plows
      const plows = state.scheduledPlows?.[playerName]
      if (plows && plows.length > 0) {
        for (const round of plows) {
          if (round >= currentRound) {
            items.push({
              round,
              type: 'plow',
              icon: '🚜',
              label: 'plow',
              amount: 1,
            })
          }
        }
      }

      // Scheduled stone rooms (Hawktower)
      const stoneRooms = state.scheduledStoneRooms?.[playerName]
      if (stoneRooms && stoneRooms.length > 0) {
        for (const round of stoneRooms) {
          if (round >= currentRound) {
            items.push({
              round,
              type: 'stoneRoom',
              icon: '🏠',
              label: 'stone room',
              amount: 1,
            })
          }
        }
      }

      // Sort by round
      items.sort((a, b) => a.round - b.round)
      return items
    },

    hasScheduledItems() {
      return this.scheduledItems.length > 0
    },

  },

  methods: {
    getContrastColor(hexColor) {
      if (!hexColor) {
        return 'white'
      }
      const hex = hexColor.replace('#', '')
      const r = parseInt(hex.substr(0, 2), 16)
      const g = parseInt(hex.substr(2, 2), 16)
      const b = parseInt(hex.substr(4, 2), 16)
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
      return luminance > 0.5 ? 'black' : 'white'
    },

    showScoreBreakdown() {
      if (this.ui?.fn?.showScoreBreakdown) {
        this.ui.fn.showScoreBreakdown(this.player.name)
      }
    },

    // Virtual field methods
    canSowVirtualField(field) {
      if (!this.isViewingPlayer || !this.ui.sowing?.active) {
        return false
      }
      if (field.crop && field.cropCount > 0) {
        return false  // Already sown
      }
      // Check if player can sow the allowed crop type
      if (field.cropRestriction === 'vegetables') {
        return this.ui.sowing?.canSowVeg
      }
      if (field.cropRestriction === 'grain') {
        return this.ui.sowing?.canSowGrain
      }
      // No restriction - can sow either
      return this.ui.sowing?.canSowGrain || this.ui.sowing?.canSowVeg
    },

    getVirtualFieldClasses(field) {
      const classes = ['field']
      if (field.crop === 'vegetables') {
        classes.push('field-vegetables')
      }
      else if (field.crop === 'grain') {
        classes.push('field-grain')
      }
      if (this.canSowVirtualField(field)) {
        classes.push('sow-selectable')
      }
      return classes
    },

    getVirtualFieldTooltip(field) {
      if (field.crop) {
        return `${field.label} with ${field.cropCount} ${field.crop}`
      }
      const restriction = field.cropRestriction
        ? `(${field.cropRestriction} only)`
        : ''
      return `Empty ${field.label} ${restriction}`.trim()
    },

    getCropIcon(crop) {
      switch (crop) {
        case 'grain': return '🌾'
        case 'vegetables': return '🥕'
        case 'wood': return '🪵'
        default: return ''
      }
    },

    getCropRestrictionLabel(field) {
      if (!field.cropRestriction) {
        return 'empty'
      }
      switch (field.cropRestriction) {
        case 'vegetables': return 'veg only'
        case 'grain': return 'grain only'
        case 'wood': return 'wood only'
        default: return field.cropRestriction
      }
    },

    async fetchCardOrder() {
      try {
        const response = await axiosWrapper.post('/api/game/card-order/fetch', {
          gameId: this.game._id,
        })
        this.handCardOrder = response.cardOrder || []
      }
      catch (err) {
        console.error('Error fetching card order:', err)
      }
    },

    onHandReorder(newOrder) {
      this.handCardOrder = newOrder
      // Debounce save to server
      if (this.saveTimer) {
        clearTimeout(this.saveTimer)
      }
      this.saveTimer = setTimeout(() => {
        this.saveCardOrderNow()
      }, 1000)
    },

    async saveCardOrderNow() {
      try {
        await axiosWrapper.post('/api/game/card-order/save', {
          gameId: this.game._id,
          cardOrder: this.handCardOrder,
        })
      }
      catch (err) {
        console.error('Error saving card order:', err)
      }
    },

    handleVirtualFieldClick(field) {
      if (!this.canSowVirtualField(field)) {
        return
      }

      const canSowGrain = this.ui.sowing?.canSowGrain && (!field.cropRestriction || field.cropRestriction === 'grain')
      const canSowVeg = this.ui.sowing?.canSowVeg && (!field.cropRestriction || field.cropRestriction === 'vegetables')

      // If only one option, sow directly
      if (canSowVeg && !canSowGrain) {
        this.bus.emit('submit-action', {
          actor: this.actor.name,
          action: 'sow-virtual-field',
          fieldId: field.id,
          cropType: 'vegetables',
        })
        return
      }

      if (canSowGrain && !canSowVeg) {
        this.bus.emit('submit-action', {
          actor: this.actor.name,
          action: 'sow-virtual-field',
          fieldId: field.id,
          cropType: 'grain',
        })
        return
      }

      // Both options - show picker (for now, just sow veg as default)
      // TODO: Show crop picker modal
      this.bus.emit('show-virtual-field-crop-picker', {
        fieldId: field.id,
      })
    },
  },
}
</script>

<style scoped>
.player-tableau {
  background-color: #fff;
  border-radius: .5em;
  overflow: hidden;
  margin-bottom: 1em;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}

.player-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: .5em .75em;
  position: sticky;
  top: 0;
  z-index: 1;
}

.player-name {
  font-weight: bold;
  font-size: 1.1em;
}

.worker-info {
  display: flex;
  align-items: center;
  gap: .25em;
  opacity: 0.9;
}

.worker-icon {
  font-size: .9em;
}

.worker-count {
  font-size: .9em;
}

.player-content {
  padding: .5em;
}

.farmyard-container {
  display: flex;
  justify-content: center;
}

/* Farmyard Stats */
.farmyard-stats {
  display: flex;
  flex-wrap: wrap;
  gap: .5em;
  padding: .35em .5em;
  background-color: #f5f5dc;
  border-radius: .25em;
  margin-bottom: .5em;
  font-size: .8em;
}

.farmyard-stats .stat {
  color: #555;
}

.farmyard-stats .stat.unused {
  color: #c62828;
  font-weight: 600;
}

/* Score Section */
.score-section {
  display: flex;
  align-items: center;
  gap: .35em;
  padding: .5em;
  background-color: #e8f5e9;
  border-radius: .25em;
  margin-top: .5em;
  cursor: pointer;
  transition: background-color 0.15s;
}

.score-section:hover {
  background-color: #c8e6c9;
}

.score-label {
  font-weight: 600;
  color: #2e7d32;
}

.score-value {
  font-size: 1.3em;
  font-weight: bold;
  color: #1b5e20;
}

.score-unit {
  color: #66bb6a;
  font-size: .85em;
}

.score-hint {
  margin-left: auto;
  font-size: .7em;
  color: #81c784;
  font-style: italic;
}

/* Begging Section */
.begging-section {
  display: flex;
  align-items: center;
  gap: .35em;
  padding: .5em;
  background-color: #ffebee;
  border-radius: .25em;
  margin-top: .5em;
  color: #c62828;
}

.begging-icon {
  font-size: 1em;
}

.begging-count {
  font-weight: 600;
}

/* Fencing Status */
.fencing-status {
  padding: .5em;
  border-radius: .25em;
  margin-bottom: .5em;
  text-align: center;
}

.fencing-status.status-empty {
  background-color: #fff3e0;
  border: 1px solid #ffb74d;
}

.fencing-status.status-valid {
  background-color: #e8f5e9;
  border: 1px solid #66bb6a;
}

.fencing-status.status-invalid {
  background-color: #ffebee;
  border: 1px solid #ef5350;
}

.fencing-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: .35em;
  font-weight: 600;
  margin-bottom: .25em;
}

.fencing-icon {
  font-size: 1em;
}

.fencing-title {
  color: #8B4513;
}

.fencing-info {
  font-size: .85em;
}

.fencing-hint {
  color: #f57c00;
}

.fencing-valid {
  color: #2e7d32;
}

.fencing-error {
  color: #c62828;
}

.fencing-actions {
  display: flex;
  justify-content: center;
  gap: .5em;
  margin-top: .5em;
}

.fencing-actions .btn {
  min-width: 80px;
}

/* Scheduled Resources Section */
.scheduled-section {
  background-color: #fff8e1;
  border: 1px solid #ffca28;
  border-radius: .25em;
  padding: .5em;
  margin-bottom: .5em;
}

.scheduled-header {
  display: flex;
  align-items: center;
  gap: .35em;
  margin-bottom: .35em;
}

.scheduled-icon {
  font-size: .9em;
}

.scheduled-title {
  font-weight: 600;
  color: #f57f17;
  font-size: .85em;
}

.scheduled-items {
  display: flex;
  flex-wrap: wrap;
  gap: .35em;
}

.scheduled-item {
  display: flex;
  align-items: center;
  gap: .25em;
  background-color: #fff;
  border: 1px solid #ffe082;
  border-radius: .2em;
  padding: .15em .35em;
  font-size: .75em;
}

.scheduled-round {
  font-weight: 600;
  color: #ff8f00;
  min-width: 1.8em;
}

.scheduled-resource {
  color: #5d4037;
}

/* Virtual Fields Section */
.virtual-fields-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  gap: .5em;
  margin-bottom: .5em;
}

.virtual-field-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.virtual-field-label {
  font-size: .7em;
  color: #228B22;
  font-weight: 600;
  margin-bottom: .15em;
}

.virtual-field-cell {
  width: 44px;
  height: 44px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 3px;
  font-size: .75em;
  transition: filter 0.1s ease;
  background-color: #8B7355;
}

.virtual-field-cell:hover {
  filter: brightness(1.1);
}

.virtual-field-cell.field-vegetables {
  background-color: #228B22;
}

.virtual-field-cell.field-grain {
  background-color: #DAA520;
}

.virtual-field-cell.sow-selectable {
  cursor: pointer;
  box-shadow: inset 0 0 0 2px rgba(34, 139, 34, 0.7);
}

.virtual-field-cell.sow-selectable:hover {
  filter: brightness(1.2);
  box-shadow: inset 0 0 0 3px #228b22;
}

.virtual-field-icon {
  font-size: 1.4em;
  line-height: 1;
}

.virtual-field-empty {
  font-size: .6em;
  color: #ddd;
  font-style: italic;
}

.virtual-field-count {
  position: absolute;
  bottom: 2px;
  right: 3px;
  font-size: .9em;
  font-weight: bold;
  background-color: rgba(255,255,255,0.8);
  border-radius: 50%;
  width: 14px;
  height: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
