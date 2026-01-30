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
      />

      <CardSection
        title="Minor Improvements"
        :cards="player.playedMinorImprovements"
      />

      <CardSection
        title="Major Improvements"
        :cards="player.majorImprovements"
      />

      <!-- Hand (only visible to the player) -->
      <CardSection
        v-if="isViewingPlayer"
        title="Hand"
        :cards="player.hand"
        :startExpanded="true"
        persistKey="agricola-hand-expanded"
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

export default {
  name: 'PlayerTableau',

  components: {
    AnimalDisplay,
    CardSection,
    FarmyardGrid,
    ResourceBar,
  },

  inject: ['actor', 'game', 'ui'],

  props: {
    player: {
      type: Object,
      required: true,
    },
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
</style>
