<template>
  <ModalBase id="agricola-animal-placement" size="lg" :closeable="false">
    <template #header>Place Animals</template>

    <div class="animal-placement-modal" v-if="isActive">
      <!-- Incoming Animals -->
      <div class="incoming-section">
        <h5>Incoming Animals</h5>
        <div class="incoming-animals">
          <div
            v-for="(count, animalType) in incoming"
            :key="animalType"
            class="incoming-group"
          >
            <span
              v-for="i in count"
              :key="i"
              class="animal-icon"
              :class="{ placed: i <= getPlacedCount(animalType) }"
            >
              {{ getAnimalEmoji(animalType) }}
            </span>
            <span class="animal-label">{{ count }} {{ animalType }}</span>
          </div>
        </div>
        <div class="remaining-info" v-if="totalRemaining > 0">
          {{ totalRemaining }} animal{{ totalRemaining > 1 ? 's' : '' }} remaining to place
        </div>
      </div>

      <!-- Farmyard Grid -->
      <div class="farmyard-section">
        <h5>Your Farmyard</h5>
        <div class="farmyard-grid">
          <div v-for="row in 3" :key="row" class="farmyard-row">
            <div
              v-for="col in 5"
              :key="col"
              class="farmyard-cell"
              :class="getCellClass(row - 1, col - 1)"
              @click="handleCellClick(row - 1, col - 1)"
            >
              <span class="cell-content">{{ getCellContent(row - 1, col - 1) }}</span>
              <div class="cell-animals" v-if="getCellAnimals(row - 1, col - 1)">
                {{ getCellAnimals(row - 1, col - 1) }}
              </div>
              <!-- Fence indicators -->
              <div class="fence fence-top" v-if="hasFenceTop(row - 1, col - 1)" />
              <div class="fence fence-right" v-if="hasFenceRight(row - 1, col - 1)" />
              <div class="fence fence-bottom" v-if="hasFenceBottom(row - 1, col - 1)" />
              <div class="fence fence-left" v-if="hasFenceLeft(row - 1, col - 1)" />
            </div>
          </div>
        </div>
      </div>

      <!-- Placement Summary -->
      <div class="placement-section">
        <h5>Placements</h5>
        <table class="placement-table">
          <thead>
            <tr>
              <th>Location</th>
              <th>Current</th>
              <th>Adding</th>
              <th>Capacity</th>
              <th>&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="loc in locationsWithPlacements" :key="loc.id">
              <td>{{ loc.name }}</td>
              <td>{{ formatCurrent(loc) }}</td>
              <td>
                <span v-for="(count, type) in getPlacementsAt(loc.id)" :key="type">
                  {{ count }} {{ type }}
                </span>
                <span v-if="!hasPlacementsAt(loc.id)">-</span>
              </td>
              <td>{{ loc.maxCapacity }}</td>
              <td>
                <button
                  class="btn btn-sm btn-outline-danger"
                  v-if="hasPlacementsAt(loc.id)"
                  @click="clearPlacementAt(loc.id)"
                >
                  Clear
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Overflow Section -->
      <div class="overflow-section" v-if="hasOverflow">
        <h5>Cannot Place ({{ overflowCount }} animals)</h5>
        <div v-if="cookingRates" class="cooking-options">
          <p>
            Cooking rates ({{ cookingRates.improvementName }}):
            <span v-for="(rate, type) in cookingRates.rates" :key="type" class="rate">
              {{ type }}: {{ rate }} food
            </span>
          </p>
          <div class="overflow-choice">
            <label>
              <input type="radio" v-model="overflowChoice" value="cook" />
              Cook all ({{ estimatedFood }} food)
            </label>
            <label>
              <input type="radio" v-model="overflowChoice" value="release" />
              Release all
            </label>
          </div>
        </div>
        <div v-else class="no-cooking">
          <p>No cooking improvement - {{ overflowCount }} animals will be released.</p>
        </div>
      </div>

      <!-- Animal Type Selector (when clicking a location) -->
      <div class="type-selector" v-if="selectingLocation">
        <h5>Select animal type for {{ selectingLocation.name }}</h5>
        <div class="type-buttons">
          <button
            v-for="animalType in availableTypesForLocation"
            :key="animalType"
            class="btn btn-outline-primary"
            @click="placeAnimal(animalType)"
          >
            {{ getAnimalEmoji(animalType) }} {{ animalType }}
            ({{ getRemainingOfType(animalType) }} remaining)
          </button>
          <button class="btn btn-outline-secondary" @click="cancelTypeSelection">
            Cancel
          </button>
        </div>
      </div>

      <!-- Summary -->
      <div class="summary" :class="{ valid: isValid, invalid: !isValid }">
        <strong>Summary:</strong>
        <span v-if="totalPlaced > 0">Place {{ totalPlaced }} animals</span>
        <span v-if="cookCount > 0">, Cook {{ cookCount }} (+{{ estimatedFood }} food)</span>
        <span v-if="releaseCount > 0">, Release {{ releaseCount }}</span>
        <span v-if="totalRemaining > 0" class="warning">
          - {{ totalRemaining }} animals not accounted for!
        </span>
      </div>
    </div>

    <template #footer>
      <button class="btn btn-secondary" @click="clearAllPlacements">
        Clear All
      </button>
      <button class="btn btn-primary" :disabled="!isValid" @click="confirm">
        Confirm Placement
      </button>
    </template>
  </ModalBase>
</template>


<script>
import ModalBase from '@/components/ModalBase.vue'

export default {
  name: 'AnimalPlacementModal',

  components: {
    ModalBase,
  },

  inject: ['game', 'ui', 'bus', 'actor'],

  data() {
    return {
      placements: {},  // { locationId: { sheep: n, boar: n, cattle: n } }
      overflowChoice: 'cook',
      selectingLocation: null,
    }
  },

  computed: {
    waitingRequest() {
      const viewingPlayer = this.game.players.byName(this.actor.name)
      if (!viewingPlayer) {
        return null
      }
      return this.game.getWaiting(viewingPlayer)
    },

    isActive() {
      return this.waitingRequest?.type === 'animal-placement'
    },

    incoming() {
      return this.waitingRequest?.incoming || {}
    },

    locations() {
      return this.waitingRequest?.locations || []
    },

    cookingRates() {
      return this.waitingRequest?.cookingRates || null
    },

    player() {
      return this.game.players.byName(this.actor.name)
    },

    totalIncoming() {
      return Object.values(this.incoming).reduce((sum, n) => sum + n, 0)
    },

    totalPlaced() {
      let total = 0
      for (const locPlacements of Object.values(this.placements)) {
        for (const count of Object.values(locPlacements)) {
          total += count
        }
      }
      return total
    },

    totalRemaining() {
      return this.totalIncoming - this.totalPlaced
    },

    hasOverflow() {
      return this.totalRemaining > 0
    },

    overflowCount() {
      return this.totalRemaining
    },

    cookCount() {
      if (!this.cookingRates || this.overflowChoice !== 'cook') {
        return 0
      }
      return this.overflowCount
    },

    releaseCount() {
      if (this.overflowChoice === 'release' || !this.cookingRates) {
        return this.overflowCount
      }
      return 0
    },

    estimatedFood() {
      if (!this.cookingRates) {
        return 0
      }
      let food = 0
      // Calculate based on remaining animals of each type
      for (const [type, count] of Object.entries(this.incoming)) {
        const placed = this.getPlacedCount(type)
        const remaining = count - placed
        if (remaining > 0 && this.cookingRates.rates[type]) {
          food += remaining * this.cookingRates.rates[type]
        }
      }
      return food
    },

    isValid() {
      // All animals must be accounted for (placed + overflow)
      return this.totalRemaining >= 0
    },

    locationsWithPlacements() {
      return this.locations.filter(loc => {
        return loc.currentCount > 0 || this.hasPlacementsAt(loc.id)
      })
    },

    availableTypesForLocation() {
      if (!this.selectingLocation) {
        return []
      }
      const types = []
      for (const type of Object.keys(this.incoming)) {
        const remaining = this.getRemainingOfType(type)
        if (remaining > 0 && this.canPlaceTypeAt(this.selectingLocation, type)) {
          types.push(type)
        }
      }
      return types
    },
  },

  watch: {
    isActive: {
      immediate: true,
      handler(active, wasActive) {
        if (active) {
          this.reset()
          this.$nextTick(() => {
            this.showModal()
          })
        }
        else if (wasActive) {
          // Only hide if it was previously active (modal was shown)
          this.hideModal()
        }
      },
    },
  },

  mounted() {
    this.bus.on('open-animal-placement-modal', this.showModal)
  },

  beforeUnmount() {
    this.bus.off('open-animal-placement-modal', this.showModal)
  },

  methods: {
    showModal() {
      if (this.isActive) {
        this.$modal('agricola-animal-placement')?.show()
      }
    },

    hideModal() {
      this.$modal('agricola-animal-placement')?.hide()
    },
    reset() {
      this.placements = {}
      this.overflowChoice = 'cook'
      this.selectingLocation = null
    },

    getAnimalEmoji(type) {
      const emojis = { sheep: '🐑', boar: '🐗', cattle: '🐄' }
      return emojis[type] || '?'
    },

    getPlacedCount(animalType) {
      let count = 0
      for (const locPlacements of Object.values(this.placements)) {
        count += locPlacements[animalType] || 0
      }
      return count
    },

    getRemainingOfType(animalType) {
      const total = this.incoming[animalType] || 0
      return total - this.getPlacedCount(animalType)
    },

    getPlacementsAt(locationId) {
      return this.placements[locationId] || {}
    },

    hasPlacementsAt(locationId) {
      const p = this.placements[locationId]
      if (!p) {
        return false
      }
      return Object.values(p).some(n => n > 0)
    },

    clearPlacementAt(locationId) {
      delete this.placements[locationId]
    },

    clearAllPlacements() {
      this.placements = {}
    },

    formatCurrent(loc) {
      if (!loc.currentAnimalType) {
        return '-'
      }
      return `${loc.currentCount} ${loc.currentAnimalType}`
    },

    getCell(row, col) {
      if (!this.player) {
        return { type: 'empty' }
      }
      return this.player.farmyard.grid[row]?.[col] || { type: 'empty' }
    },

    getCellClass(row, col) {
      const cell = this.getCell(row, col)
      const classes = []

      if (cell.type === 'room') {
        classes.push('cell-room')
        // House can hold a pet
        if (this.getLocationForCell(row, col)) {
          classes.push('selectable')
        }
      }
      else if (cell.type === 'field') {
        classes.push('cell-field')
      }
      else if (this.isInPasture(row, col)) {
        classes.push('cell-pasture')
        classes.push('selectable')
      }
      else if (cell.hasStable) {
        classes.push('cell-stable')
        classes.push('selectable')
      }
      else {
        classes.push('cell-empty')
      }

      return classes
    },

    getCellContent(row, col) {
      const cell = this.getCell(row, col)
      if (cell.type === 'room') {
        return '🏠'
      }
      if (cell.type === 'field') {
        return '▭'
      }
      if (cell.hasStable) {
        return '⌂'
      }
      return ''
    },

    getCellAnimals(row, col) {
      const loc = this.getLocationForCell(row, col)
      if (!loc) {
        return null
      }

      // For house locations, only show animals on specific room cells
      // to avoid duplicating the display across all rooms
      if (loc.type === 'house') {
        const roomIndex = this.getRoomIndex(row, col)
        if (roomIndex === -1) {
          return null
        }

        // Get total animals for house (current + placed)
        const placedCount = this.getTotalPlacedAt(loc.id)
        const totalAnimals = loc.currentCount + placedCount

        // If capacity is 1 per room (Animal Tamer style), distribute across rooms
        // Otherwise, show all on first room only
        if (loc.maxCapacity > 1 && loc.maxCapacity === this.getRoomCount()) {
          // One animal per room - show on room if index < totalAnimals
          if (roomIndex < totalAnimals) {
            const animalType = loc.currentAnimalType || this.getPlacedAnimalType(loc.id)
            if (animalType) {
              const isPlaced = roomIndex >= loc.currentCount
              return isPlaced ? `+1${this.getAnimalEmoji(animalType)}` : `1${this.getAnimalEmoji(animalType)}`
            }
          }
          return null
        }
        else {
          // Standard case - only show on first room
          if (roomIndex !== 0) {
            return null
          }
        }
      }

      const parts = []
      // Current animals
      if (loc.currentCount > 0) {
        parts.push(`${loc.currentCount}${this.getAnimalEmoji(loc.currentAnimalType)}`)
      }
      // Placed animals
      const placed = this.placements[loc.id]
      if (placed) {
        for (const [type, count] of Object.entries(placed)) {
          if (count > 0) {
            parts.push(`+${count}${this.getAnimalEmoji(type)}`)
          }
        }
      }
      return parts.join(' ') || null
    },

    getRoomIndex(row, col) {
      // Get the index of this room among all rooms (for distributing animals)
      if (!this.player) {
        return -1
      }
      let index = 0
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 5; c++) {
          const cell = this.getCell(r, c)
          if (cell.type === 'room') {
            if (r === row && c === col) {
              return index
            }
            index++
          }
        }
      }
      return -1
    },

    getRoomCount() {
      if (!this.player) {
        return 0
      }
      let count = 0
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 5; c++) {
          const cell = this.getCell(r, c)
          if (cell.type === 'room') {
            count++
          }
        }
      }
      return count
    },

    getPlacedAnimalType(locationId) {
      const placed = this.placements[locationId]
      if (!placed) {
        return null
      }
      for (const [type, count] of Object.entries(placed)) {
        if (count > 0) {
          return type
        }
      }
      return null
    },

    isInPasture(row, col) {
      if (!this.player) {
        return false
      }
      return this.player.getPastureAtSpace(row, col) !== null
    },

    getLocationForCell(row, col) {
      const cell = this.getCell(row, col)

      // Room cells = house location
      if (cell.type === 'room') {
        return this.locations.find(l => l.type === 'house')
      }

      // Pasture cells
      const pasture = this.player?.getPastureAtSpace(row, col)
      if (pasture) {
        return this.locations.find(l => l.id === `pasture-${pasture.id}`)
      }

      // Unfenced stable
      if (cell.hasStable) {
        return this.locations.find(l => l.id === `stable-${row}-${col}`)
      }

      return null
    },

    handleCellClick(row, col) {
      const loc = this.getLocationForCell(row, col)
      if (!loc) {
        return
      }

      // Check if there's any room at this location
      const totalAtLoc = loc.currentCount + this.getTotalPlacedAt(loc.id)
      if (totalAtLoc >= loc.maxCapacity) {
        return
      }

      // Check what types can go here
      const availableTypes = []
      for (const type of Object.keys(this.incoming)) {
        if (this.getRemainingOfType(type) > 0 && this.canPlaceTypeAt(loc, type)) {
          availableTypes.push(type)
        }
      }

      if (availableTypes.length === 0) {
        return
      }
      else if (availableTypes.length === 1) {
        // Only one option - place directly
        this.addPlacement(loc.id, availableTypes[0])
      }
      else {
        // Multiple options - show selector
        this.selectingLocation = loc
      }
    },

    canPlaceTypeAt(loc, animalType) {
      // Check if location already has a different type
      if (loc.currentAnimalType && loc.currentAnimalType !== animalType) {
        return false
      }
      // Check if we've already placed a different type there
      const placed = this.placements[loc.id]
      if (placed) {
        const placedTypes = Object.keys(placed).filter(t => placed[t] > 0)
        if (placedTypes.length > 0 && !placedTypes.includes(animalType)) {
          return false
        }
      }
      return true
    },

    getTotalPlacedAt(locationId) {
      const placed = this.placements[locationId]
      if (!placed) {
        return 0
      }
      return Object.values(placed).reduce((sum, n) => sum + n, 0)
    },

    addPlacement(locationId, animalType) {
      if (!this.placements[locationId]) {
        this.placements[locationId] = {}
      }
      if (!this.placements[locationId][animalType]) {
        this.placements[locationId][animalType] = 0
      }
      this.placements[locationId][animalType]++
      this.selectingLocation = null
    },

    placeAnimal(animalType) {
      if (this.selectingLocation) {
        this.addPlacement(this.selectingLocation.id, animalType)
      }
    },

    cancelTypeSelection() {
      this.selectingLocation = null
    },

    hasFenceTop(row, col) {
      if (!this.player) {
        return false
      }
      if (row === 0) {
        return this.isInPasture(row, col)
      }
      return this.player.hasFenceBetween(row, col, row - 1, col)
    },

    hasFenceBottom(row, col) {
      if (!this.player) {
        return false
      }
      if (row === 2) {
        return this.isInPasture(row, col)
      }
      return this.player.hasFenceBetween(row, col, row + 1, col)
    },

    hasFenceLeft(row, col) {
      if (!this.player) {
        return false
      }
      if (col === 0) {
        return this.isInPasture(row, col)
      }
      return this.player.hasFenceBetween(row, col, row, col - 1)
    },

    hasFenceRight(row, col) {
      if (!this.player) {
        return false
      }
      if (col === 4) {
        return this.isInPasture(row, col)
      }
      return this.player.hasFenceBetween(row, col, row, col + 1)
    },

    confirm() {
      if (!this.isValid) {
        return
      }

      // Build the placement array
      const placementArray = []
      for (const [locationId, animals] of Object.entries(this.placements)) {
        for (const [animalType, count] of Object.entries(animals)) {
          if (count > 0) {
            placementArray.push({ locationId, animalType, count })
          }
        }
      }

      // Build overflow based on what's remaining
      const overflow = { cook: {}, release: {} }
      for (const [type, total] of Object.entries(this.incoming)) {
        const remaining = total - this.getPlacedCount(type)
        if (remaining > 0) {
          if (this.overflowChoice === 'cook' && this.cookingRates) {
            overflow.cook[type] = remaining
            overflow.release[type] = 0
          }
          else {
            overflow.cook[type] = 0
            overflow.release[type] = remaining
          }
        }
      }

      // Submit the action
      this.bus.emit('submit-action', {
        actor: this.actor.name,
        action: 'animal-placement',
        placements: placementArray,
        overflow,
      })

      this.reset()
      this.hideModal()
    },
  },
}
</script>


<style scoped>
.animal-placement-modal {
  padding: 1rem;
}

.incoming-section {
  margin-bottom: 1rem;
  padding: 0.5rem;
  background: #f8f9fa;
  border-radius: 4px;
}

.incoming-animals {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.incoming-group {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.animal-icon {
  font-size: 1.5rem;
  transition: opacity 0.2s;
}

.animal-icon.placed {
  opacity: 0.3;
}

.animal-label {
  margin-left: 0.5rem;
  font-weight: 500;
}

.remaining-info {
  margin-top: 0.5rem;
  color: #856404;
  font-weight: 500;
}

.farmyard-section {
  margin-bottom: 1rem;
}

.farmyard-grid {
  display: flex;
  flex-direction: column;
  gap: 2px;
  background: #8b4513;
  padding: 4px;
  border-radius: 4px;
}

.farmyard-row {
  display: flex;
  gap: 2px;
}

.farmyard-cell {
  width: 60px;
  height: 60px;
  background: #90ee90;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  border-radius: 2px;
  cursor: default;
}

.farmyard-cell.selectable {
  cursor: pointer;
}

.farmyard-cell.selectable:hover {
  background: #7cdb7c;
}

.farmyard-cell.cell-room {
  background: #deb887;
}

.farmyard-cell.cell-field {
  background: #daa520;
}

.farmyard-cell.cell-pasture {
  background: #98fb98;
}

.farmyard-cell.cell-stable {
  background: #c0c0c0;
}

.cell-content {
  font-size: 1.2rem;
}

.cell-animals {
  font-size: 0.7rem;
  position: absolute;
  bottom: 2px;
  background: rgba(255,255,255,0.8);
  padding: 0 2px;
  border-radius: 2px;
}

.fence {
  position: absolute;
  background: #8b4513;
}

.fence-top {
  top: -2px;
  left: 0;
  right: 0;
  height: 4px;
}

.fence-bottom {
  bottom: -2px;
  left: 0;
  right: 0;
  height: 4px;
}

.fence-left {
  left: -2px;
  top: 0;
  bottom: 0;
  width: 4px;
}

.fence-right {
  right: -2px;
  top: 0;
  bottom: 0;
  width: 4px;
}

.placement-section {
  margin-bottom: 1rem;
}

.placement-table {
  width: 100%;
  border-collapse: collapse;
}

.placement-table th,
.placement-table td {
  padding: 0.25rem 0.5rem;
  text-align: left;
  border-bottom: 1px solid #dee2e6;
}

.placement-table th {
  font-weight: 600;
  background: #f8f9fa;
}

.overflow-section {
  margin-bottom: 1rem;
  padding: 0.5rem;
  background: #fff3cd;
  border-radius: 4px;
}

.cooking-options .rate {
  margin-right: 1rem;
  font-weight: 500;
}

.overflow-choice {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
}

.overflow-choice label {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  cursor: pointer;
}

.no-cooking {
  color: #856404;
}

.type-selector {
  margin-bottom: 1rem;
  padding: 0.5rem;
  background: #cce5ff;
  border-radius: 4px;
}

.type-buttons {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
  flex-wrap: wrap;
}

.summary {
  margin-bottom: 1rem;
  padding: 0.5rem;
  border-radius: 4px;
}

.summary.valid {
  background: #d4edda;
}

.summary.invalid {
  background: #f8d7da;
}

.summary .warning {
  color: #721c24;
  font-weight: 600;
}

.actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}
</style>
