<template>
  <div class="move-ships-action">
    <div class="action-header">Move Ships</div>

    <div class="movements" v-if="movements.length > 0">
      <div v-for="(mov, idx) in movements" :key="idx" class="movement-row">
        <span class="from-system">{{ mov.from }}</span>
        <span class="arrow">&rarr;</span>
        <div class="unit-selectors">
          <div v-for="unit in mov.units" :key="unit.type" class="unit-selector">
            <button class="btn btn-sm btn-outline-secondary" @click="decrement(mov, unit.type)" :disabled="unit.selected <= 0">-</button>
            <span class="unit-count">{{ unit.selected }}</span>
            <button class="btn btn-sm btn-outline-secondary" @click="increment(mov, unit.type)" :disabled="unit.selected >= maxSelectable(unit)">+</button>
            <span class="unit-type">{{ unit.type }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="no-movements">
      Select origin systems from the map, or click Done if finished.
    </div>

    <div v-if="preview.availableCapacity > 0 && preview.transportedUnits.length > 0" class="capacity-info">
      Transport capacity: {{ preview.availableCapacity }} remaining
    </div>

    <div v-if="totalSelected > 0 && !hasMovableShip" class="no-movable-warning">
      Fighters cannot move without a carrier ship.
    </div>

    <div class="action-buttons">
      <button class="btn btn-sm btn-primary" @click="confirmMoves" :disabled="!hasMovableShip">
        Confirm ({{ totalSelected }} ships)
      </button>
      <button class="btn btn-sm btn-secondary" @click="done">Done</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MoveShips',

  inject: ['actor', 'game', 'bus'],

  props: {
    request: { type: Object, default: null },
  },

  data() {
    return {
      movements: [],
    }
  },

  computed: {
    targetSystemId() {
      return this.game.state.currentTacticalAction?.systemId
    },

    currentMovements() {
      const result = []
      for (const mov of this.movements) {
        for (const unit of mov.units) {
          if (unit.selected > 0) {
            result.push({
              unitType: unit.type,
              from: mov.systemId,
              count: unit.selected,
            })
          }
        }
      }
      return result
    },

    preview() {
      if (!this.targetSystemId) {
        return { shipMovements: [], transportedUnits: [], totalCapacity: 0, usedCapacity: 0, availableCapacity: 0, transportCounts: {} }
      }
      return this.game.getMovementPreview(this.actor.name, this.targetSystemId, this.currentMovements)
    },

    totalSelected() {
      let total = 0
      for (const mov of this.movements) {
        for (const unit of mov.units) {
          total += unit.selected
        }
      }
      return total
    },

    hasMovableShip() {
      return this.preview.shipMovements.length > 0
    },
  },

  methods: {
    maxSelectable(unit) {
      if (!this.targetSystemId) {
        return 0
      }

      // Movable ships: limited only by available count
      if (this.game.isMovableUnitType(this.actor.name, unit.type)) {
        return unit.available
      }

      // Capacity-exempt transported units: limited only by available count
      const player = this.game.players.byName(this.actor.name)
      if (this.game.factionAbilities.isCapacityExempt(player, unit.type)) {
        return unit.available
      }

      // Transported unit: cap by available capacity minus other transported non-exempt selections
      let otherUsed = 0
      for (const mov of this.movements) {
        for (const u of mov.units) {
          if (u === unit || u.selected <= 0) {
            continue
          }
          if (this.game.isMovableUnitType(this.actor.name, u.type)) {
            continue
          }
          if (this.game.factionAbilities.isCapacityExempt(player, u.type)) {
            continue
          }
          otherUsed += u.selected
        }
      }

      return Math.min(unit.available, Math.max(0, this.preview.availableCapacity - otherUsed))
    },

    clampSelections() {
      const player = this.game.players.byName(this.actor.name)
      let used = 0
      for (const mov of this.movements) {
        for (const unit of mov.units) {
          if (this.game.isMovableUnitType(this.actor.name, unit.type)) {
            continue
          }
          if (this.game.factionAbilities.isCapacityExempt(player, unit.type)) {
            continue
          }
          const remaining = Math.max(0, this.preview.availableCapacity - used)
          if (unit.selected > remaining) {
            unit.selected = remaining
          }
          used += unit.selected
        }
      }
    },

    increment(mov, unitType) {
      const unit = mov.units.find(u => u.type === unitType)
      if (unit && unit.selected < this.maxSelectable(unit)) {
        unit.selected++
        this.clampSelections()
      }
    },

    decrement(mov, unitType) {
      const unit = mov.units.find(u => u.type === unitType)
      if (unit && unit.selected > 0) {
        unit.selected--
        this.clampSelections()
      }
    },

    confirmMoves() {
      this.bus.emit('submit-action', {
        actor: this.actor.name,
        selection: { action: 'move-ships', movements: this.currentMovements },
      })
    },

    done() {
      this.bus.emit('submit-action', {
        actor: this.actor.name,
        selection: ['Done'],
      })
    },

    onSystemClick({ systemId }) {
      // Check if system already in movements list
      if (this.movements.find(m => m.systemId === systemId)) {
        return
      }

      const units = this.game.state.units[systemId]?.space || []
      const playerUnits = units.filter(u => u.owner === this.actor.name)

      if (playerUnits.length === 0) {
        return
      }

      // Group by type
      const byType = {}
      for (const unit of playerUnits) {
        byType[unit.type] = (byType[unit.type] || 0) + 1
      }

      this.movements.push({
        systemId,
        from: systemId,
        units: Object.entries(byType).map(([type, count]) => ({
          type,
          available: count,
          selected: 0,
        })),
      })
    },
  },

  mounted() {
    this.bus.on('system-click', this.onSystemClick)
  },

  beforeUnmount() {
    this.bus.off('system-click', this.onSystemClick)
  },
}
</script>

<style scoped>
.move-ships-action {
  padding: .5em;
  background: #e3f2fd;
  border-left: 3px solid #0d6efd;
  margin: .5em 0;
}

.action-header {
  font-weight: 700;
  font-size: .9em;
  margin-bottom: .35em;
}

.movement-row {
  display: flex;
  align-items: flex-start;
  gap: .5em;
  margin-bottom: .35em;
  padding: .25em;
  background: white;
  border-radius: .2em;
}

.from-system {
  font-weight: 600;
  min-width: 3em;
  font-size: .8em;
}

.arrow {
  color: #888;
}

.unit-selectors {
  flex: 1;
}

.unit-selector {
  display: inline-flex;
  align-items: center;
  gap: .15em;
  margin-right: .5em;
  font-size: .8em;
}

.unit-count {
  font-weight: 600;
  min-width: 1.2em;
  text-align: center;
}

.unit-type {
  font-size: .85em;
  color: #555;
}

.no-movements {
  font-size: .8em;
  color: #888;
  font-style: italic;
  padding: .25em 0;
}

.capacity-info {
  font-size: .75em;
  color: #666;
  margin-top: .25em;
}

.no-movable-warning {
  font-size: .75em;
  color: #c44;
  margin-top: .25em;
}

.action-buttons {
  display: flex;
  gap: .35em;
  margin-top: .35em;
}
</style>
