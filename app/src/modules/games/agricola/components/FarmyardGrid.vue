<template>
  <div class="farmyard-grid">
    <div v-for="row in 3" :key="row" class="farmyard-row">
      <FarmyardCell
        v-for="col in 5"
        :key="col"
        :cell="getCell(row - 1, col - 1)"
        :row="row - 1"
        :col="col - 1"
        :fences="getFences(row - 1, col - 1)"
        :pasture="getPastureAt(row - 1, col - 1)"
        :player="player"
      />
    </div>
  </div>
</template>

<script>
import FarmyardCell from './FarmyardCell'

export default {
  name: 'FarmyardGrid',

  components: {
    FarmyardCell,
  },

  props: {
    player: {
      type: Object,
      required: true,
    },
  },

  computed: {
    grid() {
      return this.player.farmyard?.grid || []
    },

    fences() {
      return this.player.farmyard?.fences || []
    },

    pastures() {
      return this.player.farmyard?.pastures || []
    },
  },

  methods: {
    getCell(row, col) {
      if (this.grid[row] && this.grid[row][col]) {
        return this.grid[row][col]
      }
      return { type: 'empty' }
    },

    getFences(row, col) {
      // Return which sides of this cell have fences
      const result = {
        top: false,
        right: false,
        bottom: false,
        left: false,
      }

      for (const fence of this.fences) {
        // Check if this fence is adjacent to this cell
        // Fences are stored as pairs of adjacent cells

        // Top fence: fence between (row-1, col) and (row, col)
        if ((fence.row1 === row - 1 && fence.col1 === col && fence.row2 === row && fence.col2 === col) ||
            (fence.row1 === row && fence.col1 === col && fence.row2 === row - 1 && fence.col2 === col)) {
          result.top = true
        }

        // Bottom fence: fence between (row, col) and (row+1, col)
        if ((fence.row1 === row && fence.col1 === col && fence.row2 === row + 1 && fence.col2 === col) ||
            (fence.row1 === row + 1 && fence.col1 === col && fence.row2 === row && fence.col2 === col)) {
          result.bottom = true
        }

        // Left fence: fence between (row, col-1) and (row, col)
        if ((fence.row1 === row && fence.col1 === col - 1 && fence.row2 === row && fence.col2 === col) ||
            (fence.row1 === row && fence.col1 === col && fence.row2 === row && fence.col2 === col - 1)) {
          result.left = true
        }

        // Right fence: fence between (row, col) and (row, col+1)
        if ((fence.row1 === row && fence.col1 === col && fence.row2 === row && fence.col2 === col + 1) ||
            (fence.row1 === row && fence.col1 === col + 1 && fence.row2 === row && fence.col2 === col)) {
          result.right = true
        }
      }

      // Also add border fences for edge cells
      if (row === 0) {
        result.top = this.isInPasture(row, col)
      }
      if (row === 2) {
        result.bottom = this.isInPasture(row, col)
      }
      if (col === 0) {
        result.left = this.isInPasture(row, col)
      }
      if (col === 4) {
        result.right = this.isInPasture(row, col)
      }

      return result
    },

    getPastureAt(row, col) {
      for (const pasture of this.pastures) {
        if (pasture.spaces && pasture.spaces.some(s => s.row === row && s.col === col)) {
          return pasture
        }
      }
      return null
    },

    isInPasture(row, col) {
      return this.getPastureAt(row, col) !== null
    },
  },
}
</script>

<style scoped>
.farmyard-grid {
  display: inline-flex;
  flex-direction: column;
  gap: 2px;
  padding: .5em;
  background-color: #8B4513;
  border-radius: .35em;
  margin-bottom: .5em;
  margin-left: auto;
  margin-right: auto;
}

.farmyard-row {
  display: flex;
  gap: 2px;
}
</style>
