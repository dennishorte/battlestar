<template>
  <div class="farmyard-grid" ref="gridContainer">
    <!-- Cell grid -->
    <div class="cell-grid">
      <div v-for="row in 3" :key="row" class="farmyard-row">
        <FarmyardCell
          v-for="col in 5"
          :key="col"
          :cell="getCell(row - 1, col - 1)"
          :row="row - 1"
          :col="col - 1"
          :pasture="getPastureAt(row - 1, col - 1)"
          :player="player"
        />
      </div>
    </div>

    <!-- SVG overlay for fences -->
    <svg
      class="fence-overlay"
      :viewBox="`0 0 ${gridWidth} ${gridHeight}`"
      :width="gridWidth"
      :height="gridHeight"
    >
      <!-- Existing fences -->
      <rect
        v-for="(fence, index) in fenceSegments"
        :key="'fence-' + index"
        :x="fence.x"
        :y="fence.y"
        :width="fence.width"
        :height="fence.height"
        class="fence-segment"
      />

      <!-- New fence indicators (during fencing mode) -->
      <rect
        v-for="(fence, index) in newFenceSegments"
        :key="'new-fence-' + index"
        :x="fence.x"
        :y="fence.y"
        :width="fence.width"
        :height="fence.height"
        class="new-fence-segment"
      />
    </svg>
  </div>
</template>

<script>
import FarmyardCell from './FarmyardCell.vue'

// Grid constants
const CELL_SIZE = 44
const GAP = 2
const COLS = 5
const ROWS = 3
const FENCE_THICKNESS = 4

export default {
  name: 'FarmyardGrid',

  components: {
    FarmyardCell,
  },

  inject: {
    actor: { from: 'actor' },
    ui: { from: 'ui' },
  },

  props: {
    player: {
      type: Object,
      required: true,
    },
  },

  computed: {
    gridWidth() {
      return COLS * CELL_SIZE + (COLS - 1) * GAP
    },

    gridHeight() {
      return ROWS * CELL_SIZE + (ROWS - 1) * GAP
    },

    grid() {
      return this.player.farmyard?.grid || []
    },

    fences() {
      return this.player.farmyard?.fences || []
    },

    pastures() {
      return this.player.farmyard?.pastures || []
    },

    // Convert fence data to SVG rect positions
    fenceSegments() {
      const segments = []

      for (const fence of this.fences) {
        const segment = this.fenceToSegment(fence)
        if (segment) {
          segments.push(segment)
        }
      }

      return segments
    },

    // New fence indicators during fencing mode (only on viewing player's board)
    newFenceSegments() {
      if (!this.ui.fencing?.active || this.player.name !== this.actor.name) {
        return []
      }

      const segments = []
      const fenceEdges = this.ui.fencing.fenceEdges || {}

      for (const [key, edges] of Object.entries(fenceEdges)) {
        const [row, col] = key.split(',').map(Number)

        if (edges.top) {
          segments.push(this.getHorizontalFenceSegment(row, col, 'top'))
        }
        if (edges.bottom) {
          segments.push(this.getHorizontalFenceSegment(row, col, 'bottom'))
        }
        if (edges.left) {
          segments.push(this.getVerticalFenceSegment(row, col, 'left'))
        }
        if (edges.right) {
          segments.push(this.getVerticalFenceSegment(row, col, 'right'))
        }
      }

      return segments
    },
  },

  methods: {
    getCell(row, col) {
      if (this.grid[row] && this.grid[row][col]) {
        return this.grid[row][col]
      }
      return { type: 'empty' }
    },

    getPastureAt(row, col) {
      for (const pasture of this.pastures) {
        if (pasture.spaces && pasture.spaces.some(s => s.row === row && s.col === col)) {
          return pasture
        }
      }
      return null
    },

    // Get the x position of a cell's left edge
    cellX(col) {
      return col * (CELL_SIZE + GAP)
    },

    // Get the y position of a cell's top edge
    cellY(row) {
      return row * (CELL_SIZE + GAP)
    },

    // Create a horizontal fence segment at the given cell edge
    // edge: 'top' or 'bottom'
    getHorizontalFenceSegment(row, col, edge) {
      const inset = FENCE_THICKNESS / 2
      const edgeInset = inset * 1.5
      const x = this.cellX(col) + inset
      let y

      if (edge === 'top') {
        if (row === 0) {
          // Board edge
          y = -edgeInset
        }
        else {
          // Between cells - position in the gap
          y = this.cellY(row) - GAP / 2 - inset
        }
      }
      else {
        // bottom
        if (row === ROWS - 1) {
          // Board edge
          y = this.gridHeight - edgeInset
        }
        else {
          // Between cells - position in the gap
          y = this.cellY(row) + CELL_SIZE + GAP / 2 - inset
        }
      }

      return { x, y, width: CELL_SIZE - FENCE_THICKNESS, height: FENCE_THICKNESS }
    },

    // Create a vertical fence segment at the given cell edge
    // edge: 'left' or 'right'
    getVerticalFenceSegment(row, col, edge) {
      const inset = FENCE_THICKNESS / 2
      const edgeInset = inset * 0.5
      const y = this.cellY(row) + inset
      let x

      if (edge === 'left') {
        if (col === 0) {
          // Board edge
          x = -edgeInset
        }
        else {
          // Between cells - position in the gap
          x = this.cellX(col) - GAP / 2 - inset
        }
      }
      else {
        // right
        if (col === COLS - 1) {
          // Board edge
          x = this.gridWidth - edgeInset
        }
        else {
          // Between cells - position in the gap
          x = this.cellX(col) + CELL_SIZE + GAP / 2 - inset
        }
      }

      return { x, y, width: FENCE_THICKNESS, height: CELL_SIZE - FENCE_THICKNESS }
    },

    // Convert a fence object from game state to SVG segment coordinates
    fenceToSegment(fence) {
      // Board edge fence (has 'edge' property)
      if (fence.edge) {
        const { row1, col1, edge } = fence
        if (edge === 'top' || edge === 'bottom') {
          return this.getHorizontalFenceSegment(row1, col1, edge)
        }
        else {
          return this.getVerticalFenceSegment(row1, col1, edge)
        }
      }

      // Interior fence between two adjacent cells
      const { row1, col1, row2, col2 } = fence

      // Horizontal fence (between rows, same column)
      if (col1 === col2 && Math.abs(row1 - row2) === 1) {
        const upperRow = Math.min(row1, row2)
        return this.getHorizontalFenceSegment(upperRow, col1, 'bottom')
      }

      // Vertical fence (between cols, same row)
      if (row1 === row2 && Math.abs(col1 - col2) === 1) {
        const leftCol = Math.min(col1, col2)
        return this.getVerticalFenceSegment(row1, leftCol, 'right')
      }

      return null
    },
  },
}
</script>

<style scoped>
.farmyard-grid {
  position: relative;
  display: inline-block;
  padding: .5em;
  background-color: #8B4513;
  border-radius: .35em;
  margin-bottom: .5em;
  margin-left: auto;
  margin-right: auto;
}

.cell-grid {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.farmyard-row {
  display: flex;
  gap: 2px;
}

.fence-overlay {
  position: absolute;
  top: .5em;
  left: .5em;
  pointer-events: none;
  overflow: visible;
}

.fence-segment {
  fill: #f5deb3;
  stroke: #8b7355;
  stroke-width: 1;
}

.new-fence-segment {
  fill: #ff9800;
  filter: drop-shadow(0 0 2px rgba(255, 152, 0, 0.9));
}
</style>
