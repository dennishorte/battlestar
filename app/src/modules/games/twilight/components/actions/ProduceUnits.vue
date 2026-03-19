<template>
  <div class="produce-units-action">
    <div class="action-header">Produce Units</div>

    <div class="production-info" v-if="capacity > 0">
      <span>Capacity: {{ usedCapacity }}/{{ capacity }}</span>
      <span>Resources: {{ spentResources }}/{{ availableResources }}</span>
    </div>

    <div class="unit-catalog">
      <div v-for="unit in availableUnits" :key="unit.type" class="unit-row">
        <span class="unit-name">{{ unit.type }}</span>
        <span class="unit-cost">{{ unit.cost }}R</span>
        <div class="unit-controls">
          <button class="btn btn-sm btn-outline-secondary" @click="decrement(unit.type)" :disabled="(selected[unit.type] || 0) <= 0">-</button>
          <span class="unit-count">{{ selected[unit.type] || 0 }}</span>
          <button class="btn btn-sm btn-outline-secondary" @click="increment(unit.type)" :disabled="!canAdd(unit)">+</button>
        </div>
      </div>
    </div>

    <div class="action-buttons">
      <button class="btn btn-sm btn-primary" @click="confirm" :disabled="totalUnits === 0">
        Produce ({{ totalUnits }} units)
      </button>
      <button class="btn btn-sm btn-secondary" @click="skip">Skip</button>
    </div>
  </div>
</template>

<script>
import { twilight } from 'battlestar-common'
const res = twilight.res

export default {
  name: 'ProduceUnits',

  inject: ['actor', 'game', 'bus'],

  props: {
    request: { type: Object, default: null },
    playerName: { type: String, default: null },
  },

  data() {
    return {
      selected: {},
    }
  },

  computed: {
    currentPlayer() {
      return this.game.players.byName(this.playerName || this.actor.name)
    },

    availableUnits() {
      const unitTypes = ['infantry', 'fighter', 'carrier', 'destroyer', 'cruiser', 'dreadnought', 'space-dock', 'pds', 'mech', 'flagship', 'warsun']
      return unitTypes.map(type => {
        const unit = res.getUnit?.(type)
        return {
          type,
          cost: unit?.cost || 0,
        }
      }).filter(u => u.cost > 0 || u.type === 'infantry' || u.type === 'fighter')
    },

    capacity() {
      // Production capacity from request context or default
      return this.request?.capacity || 6
    },

    usedCapacity() {
      let total = 0
      for (const [, count] of Object.entries(this.selected)) {
        total += count
      }
      return total
    },

    totalUnits() {
      return this.usedCapacity
    },

    availableResources() {
      return this.currentPlayer?.getTotalResources() + (this.currentPlayer?.tradeGoods || 0)
    },

    spentResources() {
      let total = 0
      for (const [type, count] of Object.entries(this.selected)) {
        const unit = this.availableUnits.find(u => u.type === type)
        total += (unit?.cost || 0) * count
      }
      return total
    },
  },

  methods: {
    canAdd(unit) {
      if (this.usedCapacity >= this.capacity) {
        return false
      }
      if (this.spentResources + unit.cost > this.availableResources) {
        return false
      }
      return true
    },

    increment(type) {
      this.selected = { ...this.selected, [type]: (this.selected[type] || 0) + 1 }
    },

    decrement(type) {
      if ((this.selected[type] || 0) > 0) {
        this.selected = { ...this.selected, [type]: this.selected[type] - 1 }
      }
    },

    confirm() {
      const units = []
      for (const [type, count] of Object.entries(this.selected)) {
        if (count > 0) {
          units.push({ type, count })
        }
      }

      this.bus.emit('submit-action', {
        actor: this.playerName || this.actor.name,
        selection: { action: 'produce-units', units },
      })
    },

    skip() {
      this.bus.emit('submit-action', {
        actor: this.playerName || this.actor.name,
        selection: ['Skip'],
      })
    },
  },
}
</script>

<style scoped>
.produce-units-action {
  padding: .5em;
  background: #fff3e0;
  border-left: 3px solid #ff9800;
  margin: .5em 0;
}

.action-header {
  font-weight: 700;
  font-size: .9em;
  margin-bottom: .25em;
}

.production-info {
  display: flex;
  gap: 1em;
  font-size: .8em;
  color: #555;
  margin-bottom: .35em;
}

.unit-catalog {
  display: flex;
  flex-direction: column;
  gap: .15em;
}

.unit-row {
  display: flex;
  align-items: center;
  gap: .5em;
  font-size: .8em;
  padding: .15em .25em;
  background: white;
  border-radius: .15em;
}

.unit-name {
  flex: 1;
  font-weight: 500;
  text-transform: capitalize;
}

.unit-cost {
  color: #888;
  min-width: 2em;
  text-align: right;
}

.unit-controls {
  display: flex;
  align-items: center;
  gap: .15em;
}

.unit-count {
  font-weight: 600;
  min-width: 1.2em;
  text-align: center;
}

.action-buttons {
  display: flex;
  gap: .35em;
  margin-top: .35em;
}
</style>
