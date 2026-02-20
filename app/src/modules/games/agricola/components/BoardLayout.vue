<template>
  <div class="board-layout" :style="gridStyle">
    <!-- Action spaces from layout data -->
    <div
      v-for="space in layoutSpaces"
      :key="space.id"
      class="board-cell"
      :class="cellClass(space)"
      :style="cellStyle(space)"
    >
      <ActionSpace
        v-if="isActive(space.id)"
        :actionId="space.id"
      />
      <div v-else class="inactive-space">
        {{ spaceName(space.id) }}
      </div>
      <!-- Linked indicator -->
      <div v-if="isLinkedLeft(space.id)" class="linked-badge" title="Linked space">🔗</div>
    </div>

    <!-- Round card slots -->
    <div
      v-for="slot in roundSlots"
      :key="'round-' + slot.index"
      class="board-cell round-cell"
      :class="roundCellClass(slot)"
      :style="cellStyle(slot)"
    >
      <ActionSpace
        v-if="slot.actionId && isActive(slot.actionId)"
        :actionId="slot.actionId"
      />
      <div v-else class="round-placeholder">
        <div class="round-stage">Stage {{ slot.stage }}</div>
        <div class="round-number">R{{ slot.index + 1 }}</div>
      </div>
    </div>
  </div>
</template>


<script>
import ActionSpace from './ActionSpace.vue'
import { agricola } from 'battlestar-common'

const res = agricola.res
const boardLayout = res.boardLayout

// Round stages: which rounds belong to which stage
const ROUND_STAGES = {
  1: 1, 2: 1, 3: 1, 4: 1,
  5: 2, 6: 2, 7: 2,
  8: 3, 9: 3,
  10: 4, 11: 4,
  12: 5, 13: 5,
  14: 6,
}

export default {
  name: 'BoardLayout',

  components: {
    ActionSpace,
  },

  inject: ['game'],

  computed: {
    playerCount() {
      return this.game.state.numPlayers || this.game.players.all().length
    },

    layout() {
      return boardLayout.getLayoutForPlayerCount(this.playerCount)
    },

    layoutSpaces() {
      return this.layout.spaces
    },

    activeActions() {
      return this.game.state.activeActions || []
    },

    linkedPairMap() {
      const map = {}
      for (const [left, right] of boardLayout.LINKED_PAIRS) {
        map[left] = right
        map[right] = left
      }
      return map
    },

    // Which spaces are the "left" of a linked pair (shown with link badge)
    linkedLeftIds() {
      const set = new Set()
      for (const [left] of boardLayout.LINKED_PAIRS) {
        set.add(left)
      }
      return set
    },

    roundSlots() {
      const slots = []
      const deck = this.game.state.roundCardDeck || []

      for (let i = 0; i < 14; i++) {
        const pos = boardLayout.getRoundSlotPosition(i, this.playerCount)
        const card = deck[i]
        const revealed = card && this.activeActions.includes(card.id)
        slots.push({
          index: i,
          col: pos.col,
          rowStart: pos.rowStart,
          rowEnd: pos.rowEnd,
          actionId: revealed ? card.id : null,
          stage: ROUND_STAGES[i + 1],
          revealed,
        })
      }

      return slots
    },

    totalCols() {
      return boardLayout.getTotalColumns(this.playerCount)
    },

    gridStyle() {
      // CSS grid: 12-unit grid × N columns
      // 120 CSS grid rows (12 units × 10) to handle 2.4 row units for 6-player cards
      const colTemplate = `repeat(${this.totalCols}, minmax(90px, 1fr))`
      return {
        display: 'grid',
        gridTemplateColumns: colTemplate,
        gridTemplateRows: 'repeat(120, 1fr)',
        gap: '0',
        padding: '.25em',
      }
    },
  },

  methods: {
    isActive(actionId) {
      return this.activeActions.includes(actionId)
    },

    spaceName(actionId) {
      const action = res.getActionById(actionId)
      return action ? action.name : actionId
    },

    isLinkedLeft(spaceId) {
      return this.linkedLeftIds.has(spaceId)
        && this.isActive(spaceId)
        && this.isActive(this.linkedPairMap[spaceId])
    },

    cellStyle(space) {
      // Convert 12-unit grid to 120-row CSS grid (×10 multiplier)
      const rowStart = Math.round(space.rowStart * 10) + 1
      const rowEnd = Math.round(space.rowEnd * 10) + 1
      return {
        gridColumn: `${space.col + 1}`,
        gridRow: `${rowStart} / ${rowEnd}`,
      }
    },

    cellClass(space) {
      const classes = []
      const colType = boardLayout.getColumnType(space.col, this.playerCount)
      classes.push(`col-${colType}`)

      if (!this.isActive(space.id)) {
        classes.push('inactive')
      }
      return classes
    },

    roundCellClass(slot) {
      const classes = [`stage-${slot.stage}`]
      if (!slot.revealed) {
        classes.push('unrevealed')
      }
      return classes
    },
  },
}
</script>


<style scoped>
.board-layout {
  overflow-x: auto;
  min-height: 300px;
  background-color: #f5f0e0;
  border-radius: .35em;
  border: 1px solid #c4b48a;
}

.board-cell {
  margin: 2px;
  border-radius: .25em;
  position: relative;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

/* Column type backgrounds */
.board-cell.col-fixed {
  background-color: rgba(255, 255, 255, 0.4);
}

.board-cell.col-accumulating {
  background-color: rgba(255, 243, 224, 0.5);
}

.board-cell.col-extra {
  background-color: rgba(232, 234, 246, 0.4);
}

.board-cell.col-round {
  background-color: rgba(245, 245, 220, 0.4);
}

/* Inactive spaces (not yet in game) */
.board-cell.inactive {
  opacity: 0.3;
}

.inactive-space {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: .75em;
  color: #999;
  text-align: center;
  padding: .2em;
  border: 1px dashed #ccc;
  border-radius: .25em;
}

/* Round card slots */
.round-cell {
  background-color: rgba(245, 245, 220, 0.5);
}

.round-cell.unrevealed {
  opacity: 0.5;
}

.round-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  border: 1px dashed #bbb;
  border-radius: .25em;
  padding: .2em;
}

.round-stage {
  font-size: .65em;
  color: #888;
  font-weight: 500;
}

.round-number {
  font-size: .8em;
  color: #666;
  font-weight: bold;
}

/* Stage color coding for round cards */
.round-cell.stage-1 { border-left: 3px solid #8BC34A; }
.round-cell.stage-2 { border-left: 3px solid #FFC107; }
.round-cell.stage-3 { border-left: 3px solid #FF9800; }
.round-cell.stage-4 { border-left: 3px solid #F44336; }
.round-cell.stage-5 { border-left: 3px solid #9C27B0; }
.round-cell.stage-6 { border-left: 3px solid #3F51B5; }

/* Linked space badge */
.linked-badge {
  position: absolute;
  top: -2px;
  right: -2px;
  font-size: .6em;
  line-height: 1;
  z-index: 3;
}

/* Make ActionSpace fill its grid cell */
.board-cell :deep(.action-space) {
  height: 100%;
  min-height: 0;
}
</style>
