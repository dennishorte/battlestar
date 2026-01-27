<template>
  <ModalBase id="agricola-fencing" size="lg" :closeable="false">
    <template #header>Build Pasture</template>

    <div class="fencing-modal">
      <div class="instructions">
        Click on spaces to select them for your pasture.
        Spaces must be connected orthogonally.
      </div>

      <div class="resource-info">
        <span class="wood-available">🪵 {{ player.wood }} wood available</span>
        <span class="fences-remaining">┼ {{ maxFences - player.getFenceCount() }} fences remaining</span>
      </div>

      <!-- Farmyard Grid for Selection -->
      <div class="farmyard-selector">
        <div v-for="row in 3" :key="row" class="farmyard-row">
          <div
            v-for="col in 5"
            :key="col"
            class="farmyard-cell"
            :class="getCellClass(row - 1, col - 1)"
            @click="toggleCell(row - 1, col - 1)"
          >
            <span class="cell-content">{{ getCellContent(row - 1, col - 1) }}</span>
            <div class="fence fence-top" v-if="hasFenceTop(row - 1, col - 1)" />
            <div class="fence fence-right" v-if="hasFenceRight(row - 1, col - 1)" />
            <div class="fence fence-bottom" v-if="hasFenceBottom(row - 1, col - 1)" />
            <div class="fence fence-left" v-if="hasFenceLeft(row - 1, col - 1)" />
            <!-- New fence indicators -->
            <div class="new-fence new-fence-top" v-if="needsNewFenceTop(row - 1, col - 1)" />
            <div class="new-fence new-fence-right" v-if="needsNewFenceRight(row - 1, col - 1)" />
            <div class="new-fence new-fence-bottom" v-if="needsNewFenceBottom(row - 1, col - 1)" />
            <div class="new-fence new-fence-left" v-if="needsNewFenceLeft(row - 1, col - 1)" />
          </div>
        </div>
      </div>

      <!-- Selection Status -->
      <div class="selection-status" :class="statusClass">
        <template v-if="selectedSpaces.length === 0">
          Select spaces to create a pasture
        </template>
        <template v-else-if="validation.valid">
          <span class="valid-icon">✓</span>
          {{ selectedSpaces.length }} spaces selected, needs {{ validation.fencesNeeded }} fences
        </template>
        <template v-else>
          <span class="invalid-icon">✗</span>
          {{ validation.error }}
        </template>
      </div>

      <!-- Action Buttons -->
      <div class="actions">
        <button
          class="btn btn-success"
          :disabled="!validation.valid"
          @click="confirmPasture"
        >
          Build Pasture ({{ validation.fencesNeeded || 0 }} wood)
        </button>
        <button class="btn btn-secondary" @click="clearSelection">
          Clear Selection
        </button>
        <button class="btn btn-outline-secondary" @click="finishFencing">
          Done Fencing
        </button>
      </div>

      <!-- Built pastures this action -->
      <div v-if="pasturesBuilt.length > 0" class="built-pastures">
        <div class="built-title">Pastures built this action:</div>
        <div v-for="(p, i) in pasturesBuilt" :key="i" class="built-item">
          {{ p.spaces }} spaces, {{ p.fences }} fences
        </div>
      </div>
    </div>
  </ModalBase>
</template>

<script>
import ModalBase from '@/components/ModalBase'

export default {
  name: 'FencingModal',

  components: {
    ModalBase,
  },

  inject: ['game', 'ui'],

  data() {
    return {
      selectedSpaces: [],
      pasturesBuilt: [],
      maxFences: 15,
    }
  },

  computed: {
    player() {
      const playerName = this.ui.modals?.fencing?.playerName
      if (!playerName) {
        return null
      }
      return this.game.players.byName(playerName)
    },

    validation() {
      if (!this.player || this.selectedSpaces.length === 0) {
        return { valid: false, error: 'No spaces selected', fencesNeeded: 0 }
      }
      return this.player.validatePastureSelection(this.selectedSpaces)
    },

    statusClass() {
      if (this.selectedSpaces.length === 0) {
        return 'status-empty'
      }
      return this.validation.valid ? 'status-valid' : 'status-invalid'
    },

    newFences() {
      if (!this.validation.valid || !this.validation.fences) {
        return []
      }
      return this.validation.fences
    },
  },

  methods: {
    getCell(row, col) {
      if (!this.player) {
        return { type: 'empty' }
      }
      return this.player.farmyard.grid[row]?.[col] || { type: 'empty' }
    },

    getCellClass(row, col) {
      const cell = this.getCell(row, col)
      const classes = []

      // Cell type
      if (cell.type === 'room') {
        classes.push('cell-room')
        classes.push('not-selectable')
      }
      else if (cell.type === 'field') {
        classes.push('cell-field')
        classes.push('not-selectable')
      }
      else if (cell.type === 'pasture' || this.isInExistingPasture(row, col)) {
        classes.push('cell-pasture')
        classes.push('selectable')
      }
      else {
        classes.push('cell-empty')
        classes.push('selectable')
      }

      // Selected state
      if (this.isSelected(row, col)) {
        classes.push('selected')
      }

      // Stable
      if (cell.hasStable) {
        classes.push('has-stable')
      }

      return classes
    },

    getCellContent(row, col) {
      const cell = this.getCell(row, col)
      if (cell.type === 'room') {
        return '🏠'
      }
      if (cell.type === 'field') {
        if (cell.crop === 'grain') {
          return '🌾'
        }
        if (cell.crop === 'vegetables') {
          return '🥕'
        }
        return '▭'
      }
      if (cell.hasStable) {
        return '⌂'
      }
      return ''
    },

    isInExistingPasture(row, col) {
      if (!this.player) {
        return false
      }
      return this.player.getPastureAtSpace(row, col) !== null
    },

    isSelected(row, col) {
      return this.selectedSpaces.some(s => s.row === row && s.col === col)
    },

    toggleCell(row, col) {
      const cell = this.getCell(row, col)

      // Can't select rooms or fields
      if (cell.type === 'room' || cell.type === 'field') {
        return
      }

      const index = this.selectedSpaces.findIndex(s => s.row === row && s.col === col)
      if (index >= 0) {
        this.selectedSpaces.splice(index, 1)
      }
      else {
        this.selectedSpaces.push({ row, col })
      }
    },

    clearSelection() {
      this.selectedSpaces = []
    },

    hasFenceTop(row, col) {
      if (!this.player) {
        return false
      }
      if (row === 0) {
        return this.isInExistingPasture(row, col)
      }
      return this.player.hasFenceBetween(row, col, row - 1, col)
    },

    hasFenceBottom(row, col) {
      if (!this.player) {
        return false
      }
      if (row === 2) {
        return this.isInExistingPasture(row, col)
      }
      return this.player.hasFenceBetween(row, col, row + 1, col)
    },

    hasFenceLeft(row, col) {
      if (!this.player) {
        return false
      }
      if (col === 0) {
        return this.isInExistingPasture(row, col)
      }
      return this.player.hasFenceBetween(row, col, row, col - 1)
    },

    hasFenceRight(row, col) {
      if (!this.player) {
        return false
      }
      if (col === 4) {
        return this.isInExistingPasture(row, col)
      }
      return this.player.hasFenceBetween(row, col, row, col + 1)
    },

    needsNewFenceTop(row, col) {
      if (!this.isSelected(row, col)) {
        return false
      }
      if (row === 0) {
        return false // Board edge, no fence needed
      }
      if (this.isSelected(row - 1, col)) {
        return false // Connected to selection
      }
      if (this.hasFenceTop(row, col)) {
        return false // Already has fence
      }
      return true
    },

    needsNewFenceBottom(row, col) {
      if (!this.isSelected(row, col)) {
        return false
      }
      if (row === 2) {
        return false
      }
      if (this.isSelected(row + 1, col)) {
        return false
      }
      if (this.hasFenceBottom(row, col)) {
        return false
      }
      return true
    },

    needsNewFenceLeft(row, col) {
      if (!this.isSelected(row, col)) {
        return false
      }
      if (col === 0) {
        return false
      }
      if (this.isSelected(row, col - 1)) {
        return false
      }
      if (this.hasFenceLeft(row, col)) {
        return false
      }
      return true
    },

    needsNewFenceRight(row, col) {
      if (!this.isSelected(row, col)) {
        return false
      }
      if (col === 4) {
        return false
      }
      if (this.isSelected(row, col + 1)) {
        return false
      }
      if (this.hasFenceRight(row, col)) {
        return false
      }
      return true
    },

    confirmPasture() {
      if (!this.validation.valid || !this.player) {
        return
      }

      const result = this.player.buildPasture(this.selectedSpaces)
      if (result.success) {
        this.pasturesBuilt.push({
          spaces: this.selectedSpaces.length,
          fences: result.fencesBuilt,
        })
        this.selectedSpaces = []

        // Trigger a game state update
        if (this.ui.fn?.onFencingUpdate) {
          this.ui.fn.onFencingUpdate()
        }
      }
    },

    finishFencing() {
      // Close the modal and notify the game
      if (this.ui.fn?.onFencingComplete) {
        this.ui.fn.onFencingComplete(this.pasturesBuilt)
      }
      this.selectedSpaces = []
      this.pasturesBuilt = []
      this.$modal('agricola-fencing').hide()
    },

    reset() {
      this.selectedSpaces = []
      this.pasturesBuilt = []
    },
  },

  watch: {
    'ui.modals.fencing.playerName'() {
      this.reset()
    },
  },
}
</script>

<style scoped>
.fencing-modal {
  padding: 1em;
}

.instructions {
  text-align: center;
  color: #666;
  margin-bottom: 1em;
  font-size: .9em;
}

.resource-info {
  display: flex;
  justify-content: center;
  gap: 2em;
  margin-bottom: 1em;
  font-size: .9em;
}

.wood-available {
  color: #8B4513;
  font-weight: 600;
}

.fences-remaining {
  color: #4a3728;
  font-weight: 600;
}

.farmyard-selector {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 1em;
  background-color: #8B4513;
  border-radius: .5em;
  width: fit-content;
  margin: 0 auto 1em;
}

.farmyard-row {
  display: flex;
  gap: 3px;
}

.farmyard-cell {
  width: 60px;
  height: 60px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.15s ease;
  font-size: 1.5em;
}

.farmyard-cell.selectable:hover {
  filter: brightness(1.1);
  transform: scale(1.02);
}

.farmyard-cell.not-selectable {
  cursor: not-allowed;
  opacity: 0.7;
}

.farmyard-cell.cell-empty {
  background-color: #D2B48C;
}

.farmyard-cell.cell-room {
  background-color: #DEB887;
}

.farmyard-cell.cell-field {
  background-color: #8B7355;
}

.farmyard-cell.cell-pasture {
  background-color: #90EE90;
}

.farmyard-cell.selected {
  background-color: #4FC3F7 !important;
  box-shadow: inset 0 0 0 3px #0288D1;
}

.farmyard-cell.has-stable::after {
  content: '⌂';
  position: absolute;
  top: 2px;
  right: 4px;
  font-size: .6em;
  color: #654321;
}

.cell-content {
  z-index: 1;
}

/* Existing fences */
.fence {
  position: absolute;
  background-color: #4a3728;
  z-index: 2;
}

.fence-top {
  top: -2px;
  left: 0;
  right: 0;
  height: 4px;
}

.fence-right {
  top: 0;
  right: -2px;
  bottom: 0;
  width: 4px;
}

.fence-bottom {
  bottom: -2px;
  left: 0;
  right: 0;
  height: 4px;
}

.fence-left {
  top: 0;
  left: -2px;
  bottom: 0;
  width: 4px;
}

/* New fences to be built */
.new-fence {
  position: absolute;
  background-color: #FF9800;
  z-index: 3;
  animation: pulse 1s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.new-fence-top {
  top: -2px;
  left: 0;
  right: 0;
  height: 4px;
}

.new-fence-right {
  top: 0;
  right: -2px;
  bottom: 0;
  width: 4px;
}

.new-fence-bottom {
  bottom: -2px;
  left: 0;
  right: 0;
  height: 4px;
}

.new-fence-left {
  top: 0;
  left: -2px;
  bottom: 0;
  width: 4px;
}

.selection-status {
  text-align: center;
  padding: .75em;
  border-radius: .25em;
  margin-bottom: 1em;
  font-weight: 500;
}

.status-empty {
  background-color: #f5f5f5;
  color: #666;
}

.status-valid {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.status-invalid {
  background-color: #ffebee;
  color: #c62828;
}

.valid-icon, .invalid-icon {
  margin-right: .5em;
}

.actions {
  display: flex;
  justify-content: center;
  gap: .5em;
  flex-wrap: wrap;
}

.actions .btn {
  min-width: 120px;
}

.built-pastures {
  margin-top: 1em;
  padding: .75em;
  background-color: #e3f2fd;
  border-radius: .25em;
}

.built-title {
  font-weight: 600;
  color: #1976d2;
  margin-bottom: .5em;
}

.built-item {
  color: #555;
  font-size: .9em;
}
</style>
