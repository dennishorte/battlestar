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

      <!-- Farmyard Summary -->
      <div class="farmyard-summary">
        <div class="farmyard-title">Farmyard</div>
        <div class="farmyard-stats">
          <div class="stat-item">
            <span class="stat-icon">🏠</span>
            <span class="stat-value">{{ player.getRoomCount() }}</span>
            <span class="stat-label">{{ player.roomType }} rooms</span>
          </div>
          <div class="stat-item">
            <span class="stat-icon">🌾</span>
            <span class="stat-value">{{ player.getFieldCount() }}</span>
            <span class="stat-label">fields</span>
          </div>
          <div class="stat-item">
            <span class="stat-icon">🌿</span>
            <span class="stat-value">{{ player.getPastureCount() }}</span>
            <span class="stat-label">pastures</span>
          </div>
          <div class="stat-item">
            <span class="stat-icon">⌂</span>
            <span class="stat-value">{{ player.getStableCount() }}</span>
            <span class="stat-label">stables</span>
          </div>
          <div class="stat-item unused" v-if="unusedSpaces > 0">
            <span class="stat-icon">◻</span>
            <span class="stat-value">{{ unusedSpaces }}</span>
            <span class="stat-label">unused</span>
          </div>
        </div>
      </div>

      <!-- Cards -->
      <CardSection
        title="Occupations"
        :cards="player.playedOccupations"
        cardType="occupation"
      />

      <CardSection
        title="Minor Improvements"
        :cards="player.playedMinorImprovements"
        cardType="minor"
      />

      <CardSection
        title="Major Improvements"
        :cards="player.majorImprovements"
        cardType="major"
      />

      <!-- Score -->
      <div class="score-section">
        <span class="score-label">Score:</span>
        <span class="score-value">{{ player.calculateScore() }}</span>
        <span class="score-unit">pts</span>
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
import AnimalDisplay from './AnimalDisplay'
import CardSection from './CardSection'
import ResourceBar from './ResourceBar'

export default {
  name: 'PlayerTableau',

  components: {
    AnimalDisplay,
    CardSection,
    ResourceBar,
  },

  inject: ['actor', 'game'],

  props: {
    player: {
      type: Object,
      required: true,
    },
  },

  computed: {
    headerStyle() {
      return {
        backgroundColor: this.player.color || '#666',
        color: this.getContrastColor(this.player.color),
      }
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

/* Farmyard Summary */
.farmyard-summary {
  background-color: #f5f5dc;
  border-radius: .25em;
  padding: .5em;
  margin-bottom: .5em;
}

.farmyard-title {
  font-weight: 600;
  font-size: .85em;
  color: #666;
  margin-bottom: .35em;
}

.farmyard-stats {
  display: flex;
  flex-wrap: wrap;
  gap: .5em;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: .2em;
  font-size: .85em;
}

.stat-icon {
  font-size: .9em;
}

.stat-value {
  font-weight: bold;
}

.stat-label {
  color: #666;
}

.stat-item.unused {
  color: #c62828;
}

.stat-item.unused .stat-value {
  color: #c62828;
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
</style>
