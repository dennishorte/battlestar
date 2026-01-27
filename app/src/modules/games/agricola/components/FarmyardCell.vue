<template>
  <div
    class="farmyard-cell"
    :class="cellClasses"
    :title="cellTooltip"
    @click="handleClick"
  >
    <!-- Cell content -->
    <div class="cell-content">
      <!-- Room -->
      <template v-if="cell.type === 'room'">
        <span class="cell-icon">🏠</span>
        <span class="cell-label" v-if="showLabel">{{ cell.roomType }}</span>
      </template>

      <!-- Field -->
      <template v-else-if="cell.type === 'field'">
        <span class="cell-icon" v-if="fieldIcon">{{ fieldIcon }}</span>
        <span class="field-empty" v-else>plowed</span>
        <span class="crop-count" v-if="cell.cropCount > 0">{{ cell.cropCount }}</span>
      </template>

      <!-- Pasture (empty or with animals) -->
      <template v-else-if="isInPasture">
        <span class="cell-icon" v-if="pastureAnimals">{{ animalIcon }}</span>
        <span class="animal-count" v-if="showAnimalCount">{{ pastureAnimalCount }}</span>
      </template>

      <!-- Empty -->
      <template v-else>
        <span class="empty-marker">·</span>
      </template>

      <!-- Stable indicator (overlay) -->
      <span class="stable-marker" v-if="cell.hasStable">⌂</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FarmyardCell',

  inject: {
    actor: { from: 'actor' },
    bus: { from: 'bus' },
    ui: { from: 'ui' },
  },

  props: {
    cell: {
      type: Object,
      required: true,
    },
    row: {
      type: Number,
      required: true,
    },
    col: {
      type: Number,
      required: true,
    },
    pasture: {
      type: Object,
      default: null,
    },
    player: {
      type: Object,
      required: true,
    },
  },

  computed: {
    // Check if fencing mode is active and this is the viewing player's board
    isFencingActive() {
      return this.ui.fencing?.active && this.player.name === this.actor.name
    },

    // Check if this cell is currently selected for fencing
    isSelected() {
      if (!this.isFencingActive) {
        return false
      }
      const spaces = this.ui.fencing.selectedSpaces || []
      return spaces.some(s => s.row === this.row && s.col === this.col)
    },

    // Check if this cell can be clicked during fencing
    canFence() {
      if (!this.isFencingActive) {
        return false
      }
      // Can fence empty spaces and existing pastures, not rooms or fields
      return this.cell.type !== 'room' && this.cell.type !== 'field'
    },

    cellClasses() {
      const classes = []

      // Cell type
      if (this.cell.type === 'room') {
        classes.push('room')
        classes.push(`room-${this.cell.roomType}`)
      }
      else if (this.cell.type === 'field') {
        classes.push('field')
        if (this.cell.crop) {
          classes.push(`field-${this.cell.crop}`)
        }
      }
      else if (this.isInPasture) {
        classes.push('pasture')
      }
      else {
        classes.push('empty')
      }

      // Stable
      if (this.cell.hasStable) {
        classes.push('has-stable')
      }

      // Fencing states
      if (this.isSelected) {
        classes.push('fence-selected')
      }
      else if (this.canFence) {
        classes.push('fence-selectable')
      }

      return classes
    },

    cellTooltip() {
      if (this.cell.type === 'room') {
        return `${this.cell.roomType} room`
      }
      if (this.cell.type === 'field') {
        if (this.cell.crop) {
          return `Field with ${this.cell.cropCount} ${this.cell.crop}`
        }
        return 'Empty field'
      }
      if (this.isInPasture) {
        if (this.pasture.animalType) {
          return `Pasture with ${this.pasture.animalCount} ${this.pasture.animalType}`
        }
        return 'Empty pasture'
      }
      if (this.cell.hasStable) {
        return 'Unfenced stable'
      }
      return 'Empty space'
    },

    isInPasture() {
      return this.pasture !== null
    },

    showLabel() {
      // Show room type label on all rooms
      return this.cell.type === 'room'
    },

    fieldIcon() {
      if (this.cell.crop === 'grain') {
        return '🌾'
      }
      if (this.cell.crop === 'vegetables') {
        return '🥕'
      }
      return '' // Empty field - rely on background color
    },

    pastureAnimals() {
      return this.pasture && this.pasture.animalType && this.pasture.animalCount > 0
    },

    pastureAnimalCount() {
      if (!this.pasture) {
        return 0
      }
      // Distribute animal count display across pasture cells
      // Show total on first cell of pasture only
      const firstSpace = this.pasture.spaces[0]
      if (firstSpace && firstSpace.row === this.row && firstSpace.col === this.col) {
        return this.pasture.animalCount
      }
      return 0
    },

    showAnimalCount() {
      return this.pastureAnimalCount > 0
    },

    animalIcon() {
      if (!this.pasture || !this.pasture.animalType) {
        return ''
      }
      switch (this.pasture.animalType) {
        case 'sheep': return '🐑'
        case 'boar': return '🐗'
        case 'cattle': return '🐄'
        default: return ''
      }
    },
  },

  methods: {
    handleClick() {
      // Only handle clicks during fencing mode for fenceable spaces
      if (!this.canFence) {
        return
      }

      // Determine the correct choice to emit based on current selection state
      // If selected, emit "Deselect (row,col)", else emit "Space (row,col)"
      const choiceName = this.isSelected
        ? `Deselect (${this.row},${this.col})`
        : `Space (${this.row},${this.col})`

      // Emit the event to select this option in the WaitingPanel
      this.bus.emit('user-select-option', {
        actor: this.actor,
        optionName: choiceName,
        opts: {},
      })

      // Auto-submit the selection after a brief delay to let the checkbox update
      setTimeout(() => {
        this.bus.emit('click-choose-selected-option')
      }, 50)
    },
  },
}
</script>

<style scoped>
.farmyard-cell {
  width: 44px;
  height: 44px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 3px;
  font-size: .75em;
  transition: filter 0.1s ease;
}

.farmyard-cell:hover {
  filter: brightness(1.1);
}

.cell-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

.cell-icon {
  font-size: 1.4em;
  line-height: 1;
}

.cell-label {
  font-size: .7em;
  color: #555;
  margin-top: -2px;
}

.crop-count,
.animal-count {
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

.empty-marker {
  color: #a0826d;
  font-size: 1.5em;
}

.field-empty {
  font-size: .65em;
  color: #5a4a3a;
  font-style: italic;
}

/* Cell type backgrounds */
.farmyard-cell.empty {
  background-color: #D2B48C;
}

.farmyard-cell.room {
  background-color: #DEB887;
}

.farmyard-cell.room-wood {
  background-color: #DEB887;
}

.farmyard-cell.room-clay {
  background-color: #CD853F;
}

.farmyard-cell.room-stone {
  background-color: #A9A9A9;
}

.farmyard-cell.field {
  background-color: #8B7355;
}

.farmyard-cell.field-grain {
  background-color: #DAA520;
}

.farmyard-cell.field-vegetables {
  background-color: #228B22;
}

.farmyard-cell.pasture {
  background-color: #7CCD7C;
}

/* Stable marker */
.stable-marker {
  position: absolute;
  top: 1px;
  right: 2px;
  font-size: .9em;
  color: #654321;
}

.farmyard-cell.has-stable {
  box-shadow: inset 0 0 0 2px #654321;
}

/* Fencing states */
.farmyard-cell.fence-selectable {
  cursor: pointer;
}

.farmyard-cell.fence-selectable:hover {
  filter: brightness(1.2);
  box-shadow: inset 0 0 0 2px rgba(102, 51, 153, 0.5);
}

.farmyard-cell.fence-selected {
  cursor: pointer;
  background-color: #81d4fa !important;
  box-shadow: inset 0 0 0 2px #0288d1;
}
</style>
