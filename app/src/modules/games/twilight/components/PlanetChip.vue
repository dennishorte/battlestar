<template>
  <div class="planet-chip" :style="chipStyle" @click.stop="showDetails">
    <span v-if="ownerColor" class="owner-dot" :style="{ backgroundColor: ownerColor }" />
    <span class="planet-name">{{ planet.name }}</span>
    <span class="planet-values">{{ planet.resources }}R/{{ planet.influence }}I</span>
  </div>
</template>

<script>
import { twilight } from 'battlestar-common'
const res = twilight.res

const traitColors = {
  cultural: '#1565c0',
  hazardous: '#c62828',
  industrial: '#2e7d32',
}

export default {
  name: 'PlanetChip',

  props: {
    planetId: { type: String, required: true },
  },

  inject: ['game', 'ui'],

  computed: {
    planet() {
      return res.getPlanet(this.planetId) || { name: this.planetId, resources: 0, influence: 0, trait: null, systemId: null }
    },

    chipStyle() {
      const color = traitColors[this.planet.trait] || '#888'
      return { borderLeftColor: color }
    },

    ownerColor() {
      const planetState = this.game.state.planets?.[this.planetId]
      if (!planetState?.controller) {
        return null
      }
      const player = this.game.players.byName(planetState.controller)
      return player?.color || null
    },
  },

  methods: {
    showDetails() {
      if (this.planet.systemId != null) {
        this.ui.modals.systemDetail.systemId = this.planet.systemId
        this.$modal('twilight-system-detail').show()
      }
    },
  },
}
</script>

<style scoped>
.planet-chip {
  display: inline-flex;
  align-items: center;
  gap: .35em;
  padding: .2em .5em;
  border-radius: .2em;
  border-left: 4px solid;
  background: #dee2e6;
  font-size: .9em;
  cursor: pointer;
}

.planet-chip:hover {
  background: #ced4da;
}

.planet-name {
  font-weight: 600;
}

.planet-values {
  font-size: .85em;
  opacity: .7;
}

.owner-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
</style>
