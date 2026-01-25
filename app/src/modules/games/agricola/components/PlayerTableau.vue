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

      <!-- Hand (only visible to the player) -->
      <CardSection
        v-if="isViewingPlayer"
        title="Hand"
        :cards="player.hand"
        cardType="hand"
        :startExpanded="true"
      />

      <!-- Played Cards -->
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
import FarmyardGrid from './FarmyardGrid'
import ResourceBar from './ResourceBar'

export default {
  name: 'PlayerTableau',

  components: {
    AnimalDisplay,
    CardSection,
    FarmyardGrid,
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
    isViewingPlayer() {
      return this.player.name === this.actor.name
    },

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
