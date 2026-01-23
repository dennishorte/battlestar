<template>
  <div class="player-tableau">
    <div class="player-header" :style="headerStyle">
      <span class="player-name">{{ player.name }}</span>
      <span class="worker-count">{{ player.getAvailableWorkers() }}/{{ player.getFamilySize() }}</span>
    </div>

    <div class="player-content">
      <!-- Resources Section -->
      <div class="section resources-section">
        <div class="section-header">Resources</div>
        <div class="resource-grid">
          <div class="resource-item">
            <span class="resource-label">Food</span>
            <span class="resource-value">{{ player.food }}</span>
          </div>
          <div class="resource-item">
            <span class="resource-label">Wood</span>
            <span class="resource-value">{{ player.wood }}</span>
          </div>
          <div class="resource-item">
            <span class="resource-label">Clay</span>
            <span class="resource-value">{{ player.clay }}</span>
          </div>
          <div class="resource-item">
            <span class="resource-label">Stone</span>
            <span class="resource-value">{{ player.stone }}</span>
          </div>
          <div class="resource-item">
            <span class="resource-label">Reed</span>
            <span class="resource-value">{{ player.reed }}</span>
          </div>
          <div class="resource-item">
            <span class="resource-label">Grain</span>
            <span class="resource-value">{{ player.grain }}</span>
          </div>
          <div class="resource-item">
            <span class="resource-label">Vegetables</span>
            <span class="resource-value">{{ player.vegetables }}</span>
          </div>
        </div>
      </div>

      <!-- Animals Section -->
      <div class="section animals-section">
        <div class="section-header">Animals</div>
        <div class="animal-grid">
          <div class="animal-item">
            <span class="animal-label">Sheep</span>
            <span class="animal-value">{{ player.sheep }}</span>
          </div>
          <div class="animal-item">
            <span class="animal-label">Boar</span>
            <span class="animal-value">{{ player.boar }}</span>
          </div>
          <div class="animal-item">
            <span class="animal-label">Cattle</span>
            <span class="animal-value">{{ player.cattle }}</span>
          </div>
        </div>
      </div>

      <!-- Farmyard Section (placeholder) -->
      <div class="section farmyard-section">
        <div class="section-header">Farmyard</div>
        <div class="farmyard-placeholder">
          <div class="farmyard-info">
            {{ player.getRoomCount() }} rooms ({{ player.roomType }})
          </div>
          <div class="farmyard-info">
            {{ player.getFieldCount() }} fields
          </div>
          <div class="farmyard-info">
            {{ player.getPastureCount() }} pastures
          </div>
          <div class="farmyard-info">
            {{ player.getStableCount() }} stables
          </div>
        </div>
      </div>

      <!-- Score Section -->
      <div class="section score-section">
        <div class="section-header">Score</div>
        <div class="score-value">{{ player.calculateScore() }} points</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PlayerTableau',

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

.worker-count {
  font-size: .9em;
  opacity: 0.9;
}

.player-content {
  padding: .5em;
}

.section {
  margin-bottom: .75em;
}

.section-header {
  font-weight: bold;
  font-size: .85em;
  color: #666;
  margin-bottom: .25em;
  border-bottom: 1px solid #ddd;
  padding-bottom: .15em;
}

.resource-grid,
.animal-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: .25em;
}

.resource-item,
.animal-item {
  display: flex;
  justify-content: space-between;
  padding: .15em .35em;
  background-color: #f9f9f9;
  border-radius: .2em;
}

.resource-label,
.animal-label {
  color: #555;
  font-size: .85em;
}

.resource-value,
.animal-value {
  font-weight: bold;
}

.farmyard-placeholder {
  background-color: #f5f5dc;
  padding: .5em;
  border-radius: .25em;
}

.farmyard-info {
  font-size: .9em;
  color: #555;
}

.score-section .score-value {
  font-size: 1.2em;
  font-weight: bold;
  color: #2a5a1a;
  text-align: center;
  padding: .25em;
}
</style>
