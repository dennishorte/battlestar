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
        <!-- Pet indicator -->
        <span class="pet-indicator" v-if="showPet">{{ petIcon }}</span>
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

    // Check if plowing mode is active and this is the viewing player's board
    isPlowingActive() {
      return this.ui.plowing?.active && this.player.name === this.actor.name
    },

    // Check if room building mode is active and this is the viewing player's board
    isBuildingRoomActive() {
      return this.ui.buildingRoom?.active && this.player.name === this.actor.name
    },

    // Check if stable building mode is active and this is the viewing player's board
    isBuildingStableActive() {
      return this.ui.buildingStable?.active && this.player.name === this.actor.name
    },

    // Check if sowing mode is active and this is the viewing player's board
    isSowingActive() {
      return this.ui.sowing?.active && this.player.name === this.actor.name
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

      // If already selected, can always click to deselect
      if (this.isSelected) {
        return true
      }

      // Check if this is in the fenceable spaces list
      const fenceableSpaces = this.ui.fencing?.fenceableSpaces || []
      const isFenceable = fenceableSpaces.some(
        s => s.row === this.row && s.col === this.col
      )
      if (!isFenceable) {
        return false
      }

      // If no spaces selected yet, all fenceable spaces are valid
      const selectedSpaces = this.ui.fencing?.selectedSpaces || []
      if (selectedSpaces.length === 0) {
        return true
      }

      // Otherwise, only adjacent to current selection
      return this.isAdjacentToSelection(selectedSpaces)
    },

    // Check if this cell can be plowed
    canPlow() {
      if (!this.isPlowingActive) {
        return false
      }
      const validSpaces = this.ui.plowing?.validSpaces || []
      return validSpaces.some(s => s.row === this.row && s.col === this.col)
    },

    // Check if this cell can have a room built on it
    canBuildRoom() {
      if (!this.isBuildingRoomActive) {
        return false
      }
      const validSpaces = this.ui.buildingRoom?.validSpaces || []
      return validSpaces.some(s => s.row === this.row && s.col === this.col)
    },

    // Check if this cell can have a stable built on it
    canBuildStable() {
      if (!this.isBuildingStableActive) {
        return false
      }
      const validSpaces = this.ui.buildingStable?.validSpaces || []
      return validSpaces.some(s => s.row === this.row && s.col === this.col)
    },

    // Check if this cell can be sown
    canSow() {
      if (!this.isSowingActive) {
        return false
      }
      const validSpaces = this.ui.sowing?.validSpaces || []
      return validSpaces.some(s => s.row === this.row && s.col === this.col)
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

      // Plowing states
      if (this.canPlow) {
        classes.push('plow-selectable')
      }

      // Room building states
      if (this.canBuildRoom) {
        classes.push('build-room-selectable')
      }

      // Stable building states
      if (this.canBuildStable) {
        classes.push('build-stable-selectable')
      }

      // Sowing states
      if (this.canSow) {
        classes.push('sow-selectable')
      }

      return classes
    },

    cellTooltip() {
      if (this.cell.type === 'room') {
        if (this.showPet) {
          return `${this.cell.roomType} room (pet ${this.player.pet})`
        }
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

    // Show pet in the first room cell (0,0)
    showPet() {
      return this.cell.type === 'room' &&
             this.row === 0 &&
             this.col === 0 &&
             this.player.pet
    },

    petIcon() {
      switch (this.player.pet) {
        case 'sheep': return '🐑'
        case 'boar': return '🐗'
        case 'cattle': return '🐄'
        default: return ''
      }
    },
  },

  methods: {
    isAdjacentToSelection(selectedSpaces) {
      for (const selected of selectedSpaces) {
        const rowDiff = Math.abs(this.row - selected.row)
        const colDiff = Math.abs(this.col - selected.col)
        // Adjacent means exactly one step in one direction
        if ((rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1)) {
          return true
        }
      }
      return false
    },

    handleClick() {
      // Handle plowing clicks
      if (this.canPlow) {
        // Send a plow action directly to the game
        this.bus.emit('submit-action', {
          actor: this.actor.name,
          action: 'plow-space',
          row: this.row,
          col: this.col,
        })
        return
      }

      // Handle room building clicks
      if (this.canBuildRoom) {
        // Send a build-room action directly to the game
        this.bus.emit('submit-action', {
          actor: this.actor.name,
          action: 'build-room',
          row: this.row,
          col: this.col,
        })
        return
      }

      // Handle stable building clicks
      if (this.canBuildStable) {
        // Send a build-stable action directly to the game
        this.bus.emit('submit-action', {
          actor: this.actor.name,
          action: 'build-stable',
          row: this.row,
          col: this.col,
        })
        return
      }

      // Handle sowing clicks
      if (this.canSow) {
        const canSowGrain = this.ui.sowing?.canSowGrain
        const canSowVeg = this.ui.sowing?.canSowVeg

        // If only one option available, sow directly
        if (canSowGrain && !canSowVeg) {
          this.bus.emit('submit-action', {
            actor: this.actor.name,
            action: 'sow-field',
            row: this.row,
            col: this.col,
            cropType: 'grain',
          })
          return
        }

        if (canSowVeg && !canSowGrain) {
          this.bus.emit('submit-action', {
            actor: this.actor.name,
            action: 'sow-field',
            row: this.row,
            col: this.col,
            cropType: 'vegetables',
          })
          return
        }

        // Both options available - emit event to show crop picker
        this.bus.emit('show-crop-picker', {
          row: this.row,
          col: this.col,
        })
        return
      }

      // Handle fencing clicks - toggle local selection
      if (!this.canFence) {
        return
      }

      // Emit event to toggle this space in the local fencing selection
      this.bus.emit('toggle-fence-space', {
        row: this.row,
        col: this.col,
      })
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
  font-size: 1.4em;
  color: #654321;
}

.farmyard-cell.has-stable {
  box-shadow: inset 0 0 0 2px #654321;
}

/* Pet indicator in room */
.pet-indicator {
  position: absolute;
  bottom: 1px;
  left: 2px;
  font-size: .9em;
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

/* Plowing states */
.farmyard-cell.plow-selectable {
  cursor: pointer;
  box-shadow: inset 0 0 0 2px rgba(139, 69, 19, 0.7);
}

.farmyard-cell.plow-selectable:hover {
  filter: brightness(1.2);
  box-shadow: inset 0 0 0 3px #8b4513;
}

/* Room building states */
.farmyard-cell.build-room-selectable {
  cursor: pointer;
  box-shadow: inset 0 0 0 2px rgba(222, 184, 135, 0.9);
}

.farmyard-cell.build-room-selectable:hover {
  filter: brightness(1.2);
  box-shadow: inset 0 0 0 3px #deb887;
}

/* Stable building states */
.farmyard-cell.build-stable-selectable {
  cursor: pointer;
  box-shadow: inset 0 0 0 2px rgba(101, 67, 33, 0.7);
}

.farmyard-cell.build-stable-selectable:hover {
  filter: brightness(1.2);
  box-shadow: inset 0 0 0 3px #654321;
}

/* Sowing states */
.farmyard-cell.sow-selectable {
  cursor: pointer;
  box-shadow: inset 0 0 0 2px rgba(34, 139, 34, 0.7);
}

.farmyard-cell.sow-selectable:hover {
  filter: brightness(1.2);
  box-shadow: inset 0 0 0 3px #228b22;
}
</style>
