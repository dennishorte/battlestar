<template>
  <div class="exhaust-planets-action">
    <div class="action-header">{{ headerText }}</div>

    <div class="planet-list">
      <label
        v-for="planet in planets"
        :key="planet.raw"
        class="planet-row"
        :class="{ selected: planet.selected }"
        @click="togglePlanet(planet)"
      >
        <input type="checkbox" :checked="planet.selected" />
        <span class="planet-name">{{ planet.name }}</span>
        <span class="planet-value">{{ planet.value }}</span>
      </label>
    </div>

    <div class="exhaust-footer">
      <div class="cost-status" :class="{ met: totalSelected >= cost }">
        {{ totalSelected }} / {{ cost }} {{ valueType }}
        <span v-if="valueType === 'resources' && tgRemainder > 0" class="tg-note">
          (+{{ tgRemainder }} TG)
        </span>
      </div>
      <button
        class="btn btn-sm btn-primary"
        :disabled="totalSelected < cost && !canCoverWithTG"
        @click="confirmExhaust"
      >Confirm</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ExhaustPlanets',

  props: {
    request: {
      type: Object,
      default: null,
    },
    playerName: { type: String, default: null },
  },

  inject: ['actor', 'game', 'bus'],

  data() {
    return {
      planets: [],
    }
  },

  computed: {
    title() {
      return this.request?.title || ''
    },

    cost() {
      const match = this.title.match(/for (\d+)/)
      return match ? parseInt(match[1]) : 0
    },

    valueType() {
      if (this.title.toLowerCase().includes('influence')) {
        return 'influence'
      }
      return 'resources'
    },

    headerText() {
      return `Exhaust Planets for ${this.cost} ${this.valueType.charAt(0).toUpperCase() + this.valueType.slice(1)}`
    },

    choices() {
      return (this.request?.choices || []).map(c => typeof c === 'string' ? c : c.title)
    },

    selectedPlanetRaws() {
      return this.planets.filter(p => p.selected).map(p => p.raw)
    },

    totalSelected() {
      return this.planets.filter(p => p.selected).reduce((sum, p) => sum + p.value, 0)
    },

    playerTradeGoods() {
      const name = this.playerName || this.actor.name
      const player = this.game.getPlayerByName(name)
      return player?.tradeGoods || 0
    },

    tgRemainder() {
      if (this.valueType !== 'resources') {
        return 0
      }
      const shortfall = this.cost - this.totalSelected
      return shortfall > 0 ? Math.ceil(shortfall) : 0
    },

    canCoverWithTG() {
      if (this.valueType !== 'resources') {
        return false
      }
      return this.totalSelected + this.playerTradeGoods >= this.cost
    },
  },

  watch: {
    request: {
      immediate: true,
      handler() {
        this.parsePlanets()
      },
    },
  },

  methods: {
    parsePlanets() {
      this.planets = this.choices.map(raw => {
        const match = raw.match(/^(.+?) \((\d+)\)$/)
        if (match) {
          return { raw, name: match[1], value: parseInt(match[2]), selected: false }
        }
        return { raw, name: raw, value: 0, selected: false }
      })
    },

    togglePlanet(planet) {
      planet.selected = !planet.selected
    },

    confirmExhaust() {
      this.bus.emit('submit-action', {
        actor: this.playerName || this.actor.name,
        selection: this.selectedPlanetRaws,
      })
    },
  },
}
</script>

<style scoped>
.exhaust-planets-action {
  padding: .5em;
  background: #e8eaf6;
  border-left: 3px solid #5c6bc0;
  margin: .5em 0;
}

.action-header {
  font-weight: 700;
  font-size: .9em;
  margin-bottom: .35em;
}

.planet-list {
  display: flex;
  flex-direction: column;
  gap: .2em;
  margin: .35em 0;
  max-height: 200px;
  overflow-y: auto;
}

.planet-row {
  display: flex;
  align-items: center;
  gap: .4em;
  padding: .25em .4em;
  border-radius: 3px;
  cursor: pointer;
  background: #fff;
  border: 1px solid #ddd;
  font-size: .85em;
}
.planet-row:hover {
  background: #e8eaf6;
}
.planet-row.selected {
  background: #c5cae9;
  border-color: #5c6bc0;
}

.planet-row input[type="checkbox"] {
  pointer-events: none;
}

.planet-name {
  flex: 1;
}

.planet-value {
  font-weight: 700;
  color: #5c6bc0;
  min-width: 1.5em;
  text-align: right;
}

.exhaust-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: .35em;
}

.cost-status {
  font-weight: 700;
  font-size: .9em;
  color: #999;
}
.cost-status.met {
  color: #5c6bc0;
}

.tg-note {
  font-weight: 400;
  font-size: .85em;
  color: #888;
}
</style>
