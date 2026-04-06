<template>
  <ModalBase id="agricola-animal-placement" size="lg" :closeable="false">
    <template #header>Place Animals</template>

    <div class="animal-placement-modal" v-if="isActive">
      <!-- Unplaced Pool -->
      <div class="pool-section" :class="{ selecting: selectingLocation }">
        <h5>
          <template v-if="selectingLocation">
            Select animal for {{ selectingLocation.name }}
          </template>
          <template v-else>
            Animals to Place
          </template>
        </h5>
        <div class="pool-animals">
          <template v-for="type in animalTypes" :key="type">
            <div
              class="pool-group"
              v-if="unplacedPool[type] > 0"
              :class="{
                selectable: selectingLocation && isValidTypeForSelection(type),
                disabled: selectingLocation && !isValidTypeForSelection(type),
              }"
              @click="handlePoolClick(type)"
            >
              <span class="pool-icon">{{ getAnimalEmoji(type) }}</span>
              <span class="pool-count">{{ unplacedPool[type] }}</span>
            </div>
          </template>
          <button
            v-if="selectingLocation"
            class="pool-cancel"
            @click="cancelSelection"
          >
            &times;
          </button>
        </div>
        <div class="pool-empty" v-if="poolTotal === 0 && !selectingLocation">
          All animals placed
        </div>
      </div>

      <!-- Farmyard Grid -->
      <div class="farmyard-section">
        <h5>Your Farmyard</h5>
        <FarmyardGrid :player="player" :animalOverrides="animalOverrides" />
      </div>

      <!-- Card Holdings -->
      <div class="card-holdings-section" v-if="cardLocations.length > 0">
        <h5>Card Holdings</h5>
        <div class="card-holdings">
          <div
            v-for="loc in cardLocations"
            :key="loc.id"
            class="card-holding-box"
            :class="{ full: getLocTotal(loc.id) >= loc.maxCapacity }"
            @click="handleCardClick(loc)"
          >
            <div class="card-holding-name">{{ loc.name }}</div>
            <div class="card-holding-animals">
              <span v-for="type in animalTypes" :key="type">
                <span v-if="(animalState[loc.id]?.[type] || 0) > 0">
                  {{ animalState[loc.id][type] }}{{ getAnimalEmoji(type) }}
                </span>
              </span>
            </div>
            <div class="card-holding-capacity">
              {{ getLocTotal(loc.id) }} / {{ loc.maxCapacity }}
            </div>
          </div>
        </div>
      </div>

      <!-- Placement Summary -->
      <div class="placement-section" v-if="locationsWithActivity.length > 0">
        <h5>Placement Summary</h5>
        <table class="placement-table">
          <thead>
            <tr>
              <th>Location</th>
              <th>Animals</th>
              <th>Changes</th>
              <th>Capacity</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="loc in locationsWithActivity" :key="loc.id">
              <td>{{ loc.name }}</td>
              <td>{{ formatState(loc.id) }}</td>
              <td>
                <span v-if="hasChangesAt(loc.id)" class="changes">
                  {{ formatChanges(loc.id) }}
                </span>
                <span v-else>-</span>
              </td>
              <td>{{ loc.maxCapacity }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Overflow Section -->
      <div class="overflow-section" v-if="poolTotal > 0">
        <h5>Cannot Place ({{ poolTotal }} animal{{ poolTotal > 1 ? 's' : '' }})</h5>
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
          <p>No cooking improvement - {{ poolTotal }} animal{{ poolTotal > 1 ? 's' : '' }} will be released.</p>
        </div>
      </div>

      <!-- Summary -->
      <div class="summary valid">
        <strong>Summary:</strong>
        <span v-if="totalAdded > 0"> Place {{ totalAdded }}</span>
        <span v-if="totalMoved > 0">{{ totalAdded > 0 ? ',' : '' }} Move {{ totalMoved }}</span>
        <span v-if="cookCount > 0">, Cook {{ cookCount }} (+{{ estimatedFood }} food)</span>
        <span v-if="releaseCount > 0">, Release {{ releaseCount }}</span>
        <span v-if="totalAdded === 0 && totalMoved === 0 && poolTotal === 0"> No changes</span>
      </div>
    </div>

    <template #footer>
      <button class="btn btn-secondary" @click="resetAll">
        Reset All
      </button>
      <button class="btn btn-primary" @click="confirm">
        Confirm Placement
      </button>
    </template>
  </ModalBase>
</template>


<script>
import ModalBase from '@/components/ModalBase.vue'
import FarmyardGrid from './FarmyardGrid.vue'

export default {
  name: 'AnimalPlacementModal',

  components: {
    ModalBase,
    FarmyardGrid,
  },

  inject: ['game', 'ui', 'bus', 'actor'],

  data() {
    return {
      animalState: {},      // { locationId: { sheep: n, boar: n, cattle: n } }
      originalState: {},    // snapshot at modal open
      unplacedPool: { sheep: 0, boar: 0, cattle: 0 },
      overflowChoice: 'cook',
      selectingLocation: null,
      animalTypes: ['sheep', 'boar', 'cattle'],
    }
  },

  computed: {
    resolvedActorName() {
      return this.ui.selectedPlayerName || this.actor.name
    },

    waitingRequest() {
      const player = this.game.players.byName(this.resolvedActorName)
      if (!player) {
        return null
      }
      return this.game.getWaiting(player)
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
      return this.game.players.byName(this.resolvedActorName)
    },

    locationMap() {
      const map = {}
      for (const loc of this.locations) {
        map[loc.id] = loc
      }
      return map
    },

    poolTotal() {
      return this.unplacedPool.sheep + this.unplacedPool.boar + this.unplacedPool.cattle
    },

    // Compute overrides for FarmyardGrid to show modified animal state
    animalOverrides() {
      if (!this.isActive) {
        return null
      }

      const overrides = { pastures: {}, housePets: { sheep: 0, boar: 0, cattle: 0 }, stables: {} }

      for (const [locId, animals] of Object.entries(this.animalState)) {
        const animalType = this.animalTypes.find(t => animals[t] > 0) || null
        const totalCount = animals.sheep + animals.boar + animals.cattle

        if (locId === 'house') {
          overrides.housePets = { ...animals }
        }
        else if (locId.startsWith('pasture-')) {
          overrides.pastures[locId] = { animalType, animalCount: totalCount }
        }
        else if (locId.startsWith('stable-')) {
          overrides.stables[locId] = { animalType }
        }
      }

      return overrides
    },

    cardLocations() {
      return this.locations.filter(loc => loc.type === 'card')
    },

    locationsWithActivity() {
      return this.locations.filter(loc => {
        const total = this.getLocTotal(loc.id)
        return total > 0 || this.hasChangesAt(loc.id)
      })
    },

    totalAdded() {
      // Count animals added to locations beyond original state
      let count = 0
      for (const [locId, desired] of Object.entries(this.animalState)) {
        const original = this.originalState[locId] || { sheep: 0, boar: 0, cattle: 0 }
        for (const type of this.animalTypes) {
          const diff = desired[type] - original[type]
          if (diff > 0) {
            count += diff
          }
        }
      }
      return count
    },

    totalMoved() {
      // Count animals removed from locations (moved elsewhere or to pool)
      let count = 0
      for (const [locId, desired] of Object.entries(this.animalState)) {
        const original = this.originalState[locId] || { sheep: 0, boar: 0, cattle: 0 }
        for (const type of this.animalTypes) {
          const diff = original[type] - desired[type]
          if (diff > 0) {
            count += diff
          }
        }
      }
      return count
    },

    cookCount() {
      if (!this.cookingRates || this.overflowChoice !== 'cook') {
        return 0
      }
      return this.poolTotal
    },

    releaseCount() {
      if (this.overflowChoice === 'release' || !this.cookingRates) {
        return this.poolTotal
      }
      return 0
    },

    estimatedFood() {
      if (!this.cookingRates) {
        return 0
      }
      let food = 0
      for (const [type, count] of Object.entries(this.unplacedPool)) {
        if (count > 0 && this.cookingRates.rates[type]) {
          food += count * this.cookingRates.rates[type]
        }
      }
      return food
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
          this.deactivateAnimalPlacement()
          this.hideModal()
        }
      },
    },
  },

  mounted() {
    this.bus.on('open-animal-placement-modal', this.showModal)
    this.bus.on('farmyard-cell-click-animal-placement', this.handleFarmyardCellClick)
  },

  beforeUnmount() {
    this.bus.off('open-animal-placement-modal', this.showModal)
    this.bus.off('farmyard-cell-click-animal-placement', this.handleFarmyardCellClick)
    this.deactivateAnimalPlacement()
  },

  methods: {
    showModal() {
      if (this.isActive) {
        this.activateAnimalPlacement()
        this.$modal('agricola-animal-placement')?.show()
      }
    },

    hideModal() {
      this.$modal('agricola-animal-placement')?.hide()
    },

    activateAnimalPlacement() {
      this.ui.animalPlacement.active = true
      this.ui.animalPlacement.validCells = this.computeValidCells()
    },

    deactivateAnimalPlacement() {
      this.ui.animalPlacement.active = false
      this.ui.animalPlacement.validCells = []
    },

    computeValidCells() {
      const cells = []
      if (!this.player) {
        return cells
      }

      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 5; col++) {
          const cell = this.player.farmyard.grid[row]?.[col]
          if (!cell) {
            continue
          }

          if (cell.type === 'room') {
            cells.push({ row, col })
          }
          else if (this.player.getPastureAtSpace(row, col)) {
            cells.push({ row, col })
          }
          else if (cell.hasStable) {
            cells.push({ row, col })
          }
        }
      }

      return cells
    },

    reset() {
      this.animalState = {}
      this.originalState = {}

      for (const loc of this.locations) {
        const state = { sheep: 0, boar: 0, cattle: 0 }

        if (loc.currentAnimals) {
          for (const [type, count] of Object.entries(loc.currentAnimals)) {
            if (Object.prototype.hasOwnProperty.call(state, type)) {
              state[type] = count
            }
          }
        }
        else if (loc.currentAnimalType && loc.currentCount > 0) {
          state[loc.currentAnimalType] = loc.currentCount
        }

        this.animalState[loc.id] = { ...state }
        this.originalState[loc.id] = { ...state }
      }

      this.unplacedPool = {
        sheep: this.incoming.sheep || 0,
        boar: this.incoming.boar || 0,
        cattle: this.incoming.cattle || 0,
      }

      this.overflowChoice = 'cook'
      this.selectingLocation = null
    },

    resetAll() {
      this.reset()
    },

    getAnimalEmoji(type) {
      const emojis = { sheep: '🐑', boar: '🐗', cattle: '🐄' }
      return emojis[type] || '?'
    },

    getLocTotal(locId) {
      const state = this.animalState[locId]
      if (!state) {
        return 0
      }
      return state.sheep + state.boar + state.cattle
    },

    hasChangesAt(locId) {
      const current = this.animalState[locId]
      const original = this.originalState[locId]
      if (!current || !original) {
        return false
      }
      return this.animalTypes.some(t => current[t] !== original[t])
    },

    formatState(locId) {
      const state = this.animalState[locId]
      if (!state) {
        return '-'
      }
      const parts = []
      for (const type of this.animalTypes) {
        if (state[type] > 0) {
          parts.push(`${state[type]} ${type}`)
        }
      }
      return parts.length > 0 ? parts.join(', ') : '-'
    },

    formatChanges(locId) {
      const current = this.animalState[locId]
      const original = this.originalState[locId]
      if (!current || !original) {
        return ''
      }
      const parts = []
      for (const type of this.animalTypes) {
        const diff = current[type] - original[type]
        if (diff > 0) {
          parts.push(`+${diff} ${type}`)
        }
        else if (diff < 0) {
          parts.push(`${diff} ${type}`)
        }
      }
      return parts.join(', ')
    },

    getLocationForCell(row, col) {
      if (!this.player) {
        return null
      }

      const cell = this.player.farmyard.grid[row]?.[col]
      if (!cell) {
        return null
      }

      // Room cells = house location
      if (cell.type === 'room') {
        return this.locations.find(l => l.type === 'house') || null
      }

      // Pasture cells
      const pasture = this.player.getPastureAtSpace(row, col)
      if (pasture) {
        return this.locations.find(l => l.id === `pasture-${pasture.id}`) || null
      }

      // Unfenced stable
      if (cell.hasStable) {
        return this.locations.find(l => l.id === `stable-${row}-${col}`) || null
      }

      return null
    },

    handleFarmyardCellClick({ row, col }) {
      const loc = this.getLocationForCell(row, col)
      if (!loc) {
        return
      }

      const state = this.animalState[loc.id]
      if (!state) {
        return
      }

      const locTotal = state.sheep + state.boar + state.cattle
      const locAvailable = loc.maxCapacity - locTotal
      const canDrop = this.poolTotal > 0 && locAvailable > 0
      const canPickup = locTotal > 0

      if (canDrop && !canPickup) {
        this.dropAtLocation(loc)
      }
      else if (canPickup && !canDrop) {
        this.pickupFromLocation(loc)
      }
      else if (canDrop && canPickup) {
        // Prefer drop when pool has animals
        this.dropAtLocation(loc)
      }
    },

    dropAtLocation(loc) {
      const droppableTypes = []
      for (const type of this.animalTypes) {
        if (this.unplacedPool[type] > 0 && this.canPlaceTypeAtState(loc, type)) {
          droppableTypes.push(type)
        }
      }

      if (droppableTypes.length === 0) {
        // Can't drop any type — try pickup instead
        this.pickupFromLocation(loc)
        return
      }
      if (droppableTypes.length === 1) {
        const count = this.maxDropCount(loc, droppableTypes[0])
        this.addToLocation(loc.id, droppableTypes[0], count)
      }
      else {
        this.selectingLocation = loc
      }
    },

    pickupFromLocation(loc) {
      const state = this.animalState[loc.id]
      if (!state) {
        return
      }

      // Pick up ALL animals from this location at once
      for (const type of this.animalTypes) {
        if (state[type] > 0) {
          this.removeFromLocation(loc.id, type, state[type])
        }
      }
    },

    maxDropCount(loc, type) {
      const state = this.animalState[loc.id]
      if (!state) {
        return 0
      }
      const total = state.sheep + state.boar + state.cattle
      let available = loc.maxCapacity - total

      if (loc.perTypeLimits) {
        const typeLimit = loc.perTypeLimits[type] || 0
        available = Math.min(available, typeLimit - state[type])
      }

      return Math.min(Math.max(0, available), this.unplacedPool[type])
    },

    canPlaceTypeAtState(loc, type) {
      const state = this.animalState[loc.id]
      if (!state) {
        return false
      }
      const total = state.sheep + state.boar + state.cattle

      if (total >= loc.maxCapacity) {
        return false
      }

      if (loc.allowedTypes && !loc.allowedTypes.includes(type)) {
        return false
      }

      if (loc.perTypeLimits) {
        return state[type] < (loc.perTypeLimits[type] || 0)
      }

      if (loc.mixedTypes) {
        return true
      }

      if (loc.sameTypeOnly) {
        const existingType = this.animalTypes.find(t => state[t] > 0) || null
        if (existingType && existingType !== type) {
          return false
        }
        return true
      }

      // Default: single type per location
      const existingType = this.animalTypes.find(t => state[t] > 0) || null
      if (existingType && existingType !== type) {
        return false
      }
      return true
    },

    addToLocation(locId, type, count) {
      this.animalState[locId][type] += count
      this.unplacedPool[type] -= count
      this.selectingLocation = null
    },

    removeFromLocation(locId, type, count) {
      this.animalState[locId][type] -= count
      this.unplacedPool[type] += count
      this.selectingLocation = null
    },

    handleCardClick(loc) {
      const state = this.animalState[loc.id]
      if (!state) {
        return
      }

      const locTotal = state.sheep + state.boar + state.cattle
      const locAvailable = loc.maxCapacity - locTotal
      const canDrop = this.poolTotal > 0 && locAvailable > 0
      const canPickup = locTotal > 0

      if (canDrop && !canPickup) {
        this.dropAtLocation(loc)
      }
      else if (canPickup && !canDrop) {
        this.pickupFromLocation(loc)
      }
      else if (canDrop && canPickup) {
        this.dropAtLocation(loc)
      }
    },

    isValidTypeForSelection(type) {
      if (!this.selectingLocation) {
        return false
      }
      return this.unplacedPool[type] > 0 && this.canPlaceTypeAtState(this.selectingLocation, type)
    },

    handlePoolClick(type) {
      if (!this.selectingLocation) {
        return
      }
      if (!this.isValidTypeForSelection(type)) {
        return
      }
      const count = this.maxDropCount(this.selectingLocation, type)
      if (count > 0) {
        this.addToLocation(this.selectingLocation.id, type, count)
      }
    },

    cancelSelection() {
      this.selectingLocation = null
    },

    confirm() {
      const placements = []
      const removals = []

      for (const [locId, desired] of Object.entries(this.animalState)) {
        const original = this.originalState[locId] || { sheep: 0, boar: 0, cattle: 0 }

        for (const type of this.animalTypes) {
          const diff = desired[type] - original[type]
          if (diff > 0) {
            placements.push({ locationId: locId, animalType: type, count: diff })
          }
          else if (diff < 0) {
            removals.push({ locationId: locId, animalType: type, count: -diff })
          }
        }
      }

      // Build overflow from unplaced pool
      const overflow = { cook: {}, release: {} }
      for (const [type, count] of Object.entries(this.unplacedPool)) {
        if (count > 0) {
          if (this.overflowChoice === 'cook' && this.cookingRates) {
            overflow.cook[type] = count
            overflow.release[type] = 0
          }
          else {
            overflow.cook[type] = 0
            overflow.release[type] = count
          }
        }
      }

      this.bus.emit('submit-action', {
        actor: this.resolvedActorName,
        action: 'animal-placement',
        placements,
        removals,
        overflow,
      })

      this.deactivateAnimalPlacement()
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

.pool-section {
  margin-bottom: 1rem;
  padding: 0.5rem;
  background: #f8f9fa;
  border-radius: 4px;
}

.pool-animals {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.pool-section.selecting {
  background: #cce5ff;
  border: 2px solid #0d6efd;
}

.pool-group {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  border: 2px solid transparent;
  transition: all 0.15s ease;
}

.pool-group.selectable {
  cursor: pointer;
  border-color: #0d6efd;
  background: rgba(13, 110, 253, 0.1);
}

.pool-group.selectable:hover {
  background: rgba(13, 110, 253, 0.25);
  transform: scale(1.05);
}

.pool-group.disabled {
  opacity: 0.35;
}

.pool-icon {
  font-size: 1.5rem;
}

.pool-count {
  font-size: 1.1rem;
  font-weight: 600;
}

.pool-cancel {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: 1px solid #999;
  border-radius: 50%;
  background: #fff;
  font-size: 1.2rem;
  line-height: 1;
  color: #666;
  cursor: pointer;
  margin-left: 0.25rem;
}

.pool-cancel:hover {
  background: #f0f0f0;
  color: #333;
}

.pool-empty {
  color: #28a745;
  font-weight: 500;
}

.farmyard-section {
  margin-bottom: 1rem;
}

.card-holdings-section {
  margin-bottom: 1rem;
}

.card-holdings {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.card-holding-box {
  padding: 0.5rem;
  background: #d4edda;
  border: 2px solid #28a745;
  border-radius: 4px;
  cursor: pointer;
  min-width: 120px;
  text-align: center;
  position: relative;
}

.card-holding-box:hover {
  background: #c3e6cb;
}

.card-holding-box.full {
  opacity: 0.6;
  cursor: default;
}

.card-holding-name {
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.card-holding-animals {
  font-size: 0.9rem;
  min-height: 1.4em;
}

.card-holding-capacity {
  font-size: 0.8rem;
  color: #666;
  margin-top: 0.25rem;
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

.changes {
  font-weight: 500;
  color: #0d6efd;
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

.summary {
  margin-bottom: 1rem;
  padding: 0.5rem;
  border-radius: 4px;
}

.summary.valid {
  background: #d4edda;
}
</style>
