<template>
  <div class="commit-ground-forces-action">
    <div class="action-header">Commit Ground Forces</div>

    <div class="assignments">
      <div v-for="planet in planets" :key="planet.id" class="planet-row">
        <span class="planet-name">{{ planet.id }}</span>
        <div class="unit-selectors">
          <div v-for="unit in planet.units" :key="unit.type" class="unit-selector">
            <button class="btn btn-sm btn-outline-secondary" @click="decrement(planet, unit.type)" :disabled="unit.count <= 0">-</button>
            <span class="unit-count">{{ unit.count }}</span>
            <button class="btn btn-sm btn-outline-secondary" @click="increment(planet, unit.type)" :disabled="remaining(unit.type) <= 0">+</button>
            <span class="unit-type">{{ unit.type }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="remaining-info" v-if="totalRemaining > 0">
      {{ totalRemaining }} ground force{{ totalRemaining > 1 ? 's' : '' }} unassigned
    </div>

    <div class="action-buttons">
      <button class="btn btn-sm btn-primary" @click="confirm" :disabled="totalRemaining > 0">
        Confirm
      </button>
      <button class="btn btn-sm btn-secondary" @click="skip">Skip</button>
    </div>
  </div>
</template>

<script>
import { twilight } from 'battlestar-common'
const res = twilight.res

export default {
  name: 'CommitGroundForces',

  inject: ['actor', 'game', 'bus'],

  props: {
    request: { type: Object, default: null },
    playerName: { type: String, default: null },
  },

  data() {
    return {
      planets: [],
    }
  },

  computed: {
    actorName() {
      return this.playerName || this.actor.name
    },

    systemId() {
      return this.game.state.currentTacticalAction?.systemId
    },

    groundForceTypes() {
      if (!this.systemId) {
        return {}
      }
      const systemUnits = this.game.state.units[this.systemId]
      if (!systemUnits) {
        return {}
      }

      const byType = {}
      for (const unit of systemUnits.space) {
        if (unit.owner === this.actorName) {
          const unitDef = res.getUnit(unit.type)
          if (unitDef?.category === 'ground') {
            byType[unit.type] = (byType[unit.type] || 0) + 1
          }
        }
      }
      return byType
    },

    totalRemaining() {
      let total = 0
      for (const type of Object.keys(this.groundForceTypes)) {
        total += this.remaining(type)
      }
      return total
    },
  },

  methods: {
    remaining(unitType) {
      const total = this.groundForceTypes[unitType] || 0
      let assigned = 0
      for (const planet of this.planets) {
        const unit = planet.units.find(u => u.type === unitType)
        if (unit) {
          assigned += unit.count
        }
      }
      return total - assigned
    },

    increment(planet, unitType) {
      const unit = planet.units.find(u => u.type === unitType)
      if (unit && this.remaining(unitType) > 0) {
        unit.count++
      }
    },

    decrement(planet, unitType) {
      const unit = planet.units.find(u => u.type === unitType)
      if (unit && unit.count > 0) {
        unit.count--
      }
    },

    confirm() {
      const assignments = {}
      for (const planet of this.planets) {
        const planetAssign = {}
        for (const unit of planet.units) {
          if (unit.count > 0) {
            planetAssign[unit.type] = unit.count
          }
        }
        if (Object.keys(planetAssign).length > 0) {
          assignments[planet.id] = planetAssign
        }
      }

      this.bus.emit('submit-action', {
        actor: this.actorName,
        selection: { action: 'commit-ground-forces', assignments },
      })
    },

    skip() {
      this.bus.emit('submit-action', {
        actor: this.actorName,
        selection: ['Done'],
      })
    },

    initPlanets() {
      if (!this.systemId) {
        return
      }

      const unitTypes = Object.keys(this.groundForceTypes)
      const systemPlanets = this.request?.planets || []

      this.planets = systemPlanets.map(planetId => ({
        id: planetId,
        units: unitTypes.map(type => ({ type, count: 0 })),
      }))
    },
  },

  watch: {
    request: {
      immediate: true,
      handler() {
        this.initPlanets()
      },
    },
  },
}
</script>

<style scoped>
.commit-ground-forces-action {
  padding: 8px;
}
.action-header {
  font-weight: bold;
  margin-bottom: 8px;
}
.planet-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}
.planet-name {
  min-width: 100px;
  text-transform: capitalize;
}
.unit-selectors {
  display: flex;
  gap: 8px;
}
.unit-selector {
  display: flex;
  align-items: center;
  gap: 4px;
}
.unit-count {
  min-width: 20px;
  text-align: center;
}
.remaining-info {
  margin: 8px 0;
  color: #856404;
}
.action-buttons {
  margin-top: 8px;
  display: flex;
  gap: 4px;
}
</style>
