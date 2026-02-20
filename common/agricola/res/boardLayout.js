// Board Layout Data for Agricola Action Spaces
//
// Models the physical spatial layout of the board using a 12-unit row grid.
// All action spaces (fixed, accumulating, extras) span 2 rows each.
// The accumulating column has only 4 spaces (rows 4-12), leaving rows 0-4
// for the first round card. Round card slots span 4 rows (3 per column).
// 6-player-only spaces span 2.4 rows each (5 × 2.4 = 12).

// Column types for color-coding
const COL_TYPE = {
  FIXED: 'fixed',
  ACCUMULATING: 'accumulating',
  ROUND: 'round',
  EXTRA: 'extra',
}

// --- Layout definitions per player count ---

// Each space: { id, col, rowStart, rowEnd }
// col is 0-indexed from the left
// rowStart/rowEnd use the 12-unit grid (0-12)
//
// Fixed column: 6 cards × 2 rows = rows 0-12
// Accumulating column: 4 cards × 2 rows = rows 4-12 (rows 0-4 hold round 1)

const layout2 = {
  spaces: [
    // Col 0: Fixed actions (6 × 2 rows)
    { id: 'build-room-stable', col: 0, rowStart: 0, rowEnd: 2 },
    { id: 'starting-player',   col: 0, rowStart: 2, rowEnd: 4 },
    { id: 'take-grain',        col: 0, rowStart: 4, rowEnd: 6 },
    { id: 'plow-field',        col: 0, rowStart: 6, rowEnd: 8 },
    { id: 'occupation',        col: 0, rowStart: 8, rowEnd: 10 },
    { id: 'day-laborer',       col: 0, rowStart: 10, rowEnd: 12 },

    // Col 1: Accumulating spaces (4 × 2 rows, starting at row 4)
    { id: 'take-wood', col: 1, rowStart: 4, rowEnd: 6 },
    { id: 'take-clay', col: 1, rowStart: 6, rowEnd: 8 },
    { id: 'take-reed', col: 1, rowStart: 8, rowEnd: 10 },
    { id: 'fishing',   col: 1, rowStart: 10, rowEnd: 12 },
  ],
  columns: [
    { col: 0, type: COL_TYPE.FIXED },
    { col: 1, type: COL_TYPE.ACCUMULATING },
  ],
  roundSlotCol: 2,
}

const layout3 = {
  spaces: [
    // Col 0: 3-player extras (4 cards, vertically centered: rows 2-10)
    { id: 'grove',           col: 0, rowStart: 2, rowEnd: 4 },
    { id: 'resource-market', col: 0, rowStart: 4, rowEnd: 6 },
    { id: 'hollow',          col: 0, rowStart: 6, rowEnd: 8 },
    { id: 'lessons-3',       col: 0, rowStart: 8, rowEnd: 10 },

    // Col 1: Fixed actions
    { id: 'build-room-stable', col: 1, rowStart: 0, rowEnd: 2 },
    { id: 'starting-player',   col: 1, rowStart: 2, rowEnd: 4 },
    { id: 'take-grain',        col: 1, rowStart: 4, rowEnd: 6 },
    { id: 'plow-field',        col: 1, rowStart: 6, rowEnd: 8 },
    { id: 'occupation',        col: 1, rowStart: 8, rowEnd: 10 },
    { id: 'day-laborer',       col: 1, rowStart: 10, rowEnd: 12 },

    // Col 2: Accumulating spaces (rows 4-12)
    { id: 'take-wood', col: 2, rowStart: 4, rowEnd: 6 },
    { id: 'take-clay', col: 2, rowStart: 6, rowEnd: 8 },
    { id: 'take-reed', col: 2, rowStart: 8, rowEnd: 10 },
    { id: 'fishing',   col: 2, rowStart: 10, rowEnd: 12 },
  ],
  columns: [
    { col: 0, type: COL_TYPE.EXTRA },
    { col: 1, type: COL_TYPE.FIXED },
    { col: 2, type: COL_TYPE.ACCUMULATING },
  ],
  roundSlotCol: 3,
}

const layout4 = {
  spaces: [
    // Col 0: 4-player extras (6 × 2 rows)
    { id: 'copse',             col: 0, rowStart: 0, rowEnd: 2 },
    { id: 'grove',             col: 0, rowStart: 2, rowEnd: 4 },
    { id: 'resource-market',   col: 0, rowStart: 4, rowEnd: 6 },
    { id: 'hollow',            col: 0, rowStart: 6, rowEnd: 8 },
    { id: 'lessons-4',         col: 0, rowStart: 8, rowEnd: 10 },
    { id: 'traveling-players', col: 0, rowStart: 10, rowEnd: 12 },

    // Col 1: Fixed actions
    { id: 'build-room-stable', col: 1, rowStart: 0, rowEnd: 2 },
    { id: 'starting-player',   col: 1, rowStart: 2, rowEnd: 4 },
    { id: 'take-grain',        col: 1, rowStart: 4, rowEnd: 6 },
    { id: 'plow-field',        col: 1, rowStart: 6, rowEnd: 8 },
    { id: 'occupation',        col: 1, rowStart: 8, rowEnd: 10 },
    { id: 'day-laborer',       col: 1, rowStart: 10, rowEnd: 12 },

    // Col 2: Accumulating spaces (rows 4-12)
    { id: 'take-wood', col: 2, rowStart: 4, rowEnd: 6 },
    { id: 'take-clay', col: 2, rowStart: 6, rowEnd: 8 },
    { id: 'take-reed', col: 2, rowStart: 8, rowEnd: 10 },
    { id: 'fishing',   col: 2, rowStart: 10, rowEnd: 12 },
  ],
  columns: [
    { col: 0, type: COL_TYPE.EXTRA },
    { col: 1, type: COL_TYPE.FIXED },
    { col: 2, type: COL_TYPE.ACCUMULATING },
  ],
  roundSlotCol: 3,
}

const layout5 = {
  spaces: [
    // Col 0: 5-6p linked left column (3 linked cards with gaps)
    { id: 'lessons-5',      col: 0, rowStart: 0, rowEnd: 2 },
    { id: 'lessons-5b',     col: 0, rowStart: 4, rowEnd: 6 },
    { id: 'house-building', col: 0, rowStart: 8, rowEnd: 10 },

    // Col 1: 5-6p linked right + extras
    { id: 'copse-5',                  col: 1, rowStart: 0, rowEnd: 2 },
    { id: 'grove-5',                  col: 1, rowStart: 2, rowEnd: 4 },
    { id: 'modest-wish-for-children', col: 1, rowStart: 4, rowEnd: 6 },
    { id: 'resource-market-5',        col: 1, rowStart: 6, rowEnd: 8 },
    { id: 'hollow-5',                 col: 1, rowStart: 8, rowEnd: 10 },
    { id: 'traveling-players-5',      col: 1, rowStart: 10, rowEnd: 12 },

    // Col 2: Fixed actions
    { id: 'build-room-stable', col: 2, rowStart: 0, rowEnd: 2 },
    { id: 'starting-player',   col: 2, rowStart: 2, rowEnd: 4 },
    { id: 'take-grain',        col: 2, rowStart: 4, rowEnd: 6 },
    { id: 'plow-field',        col: 2, rowStart: 6, rowEnd: 8 },
    { id: 'occupation',        col: 2, rowStart: 8, rowEnd: 10 },
    { id: 'day-laborer',       col: 2, rowStart: 10, rowEnd: 12 },

    // Col 3: Accumulating spaces (rows 4-12)
    { id: 'take-wood', col: 3, rowStart: 4, rowEnd: 6 },
    { id: 'take-clay', col: 3, rowStart: 6, rowEnd: 8 },
    { id: 'take-reed', col: 3, rowStart: 8, rowEnd: 10 },
    { id: 'fishing',   col: 3, rowStart: 10, rowEnd: 12 },
  ],
  columns: [
    { col: 0, type: COL_TYPE.EXTRA },
    { col: 1, type: COL_TYPE.EXTRA },
    { col: 2, type: COL_TYPE.FIXED },
    { col: 3, type: COL_TYPE.ACCUMULATING },
  ],
  roundSlotCol: 4,
}

const layout6 = {
  spaces: [
    // Col 0: 6-player-only left column (5 × 2.4 rows)
    { id: 'farm-supplies',     col: 0, rowStart: 0, rowEnd: 2.4 },
    { id: 'building-supplies', col: 0, rowStart: 2.4, rowEnd: 4.8 },
    { id: 'corral',            col: 0, rowStart: 4.8, rowEnd: 7.2 },
    { id: 'side-job',          col: 0, rowStart: 7.2, rowEnd: 9.6 },
    { id: 'improvement-6',     col: 0, rowStart: 9.6, rowEnd: 12 },

    // Col 1: 6-player-only right column (5 × 2.4 rows)
    { id: 'grove-6',           col: 1, rowStart: 0, rowEnd: 2.4 },
    { id: 'riverbank-forest',  col: 1, rowStart: 2.4, rowEnd: 4.8 },
    { id: 'animal-market',     col: 1, rowStart: 4.8, rowEnd: 7.2 },
    { id: 'hollow-6',          col: 1, rowStart: 7.2, rowEnd: 9.6 },
    { id: 'resource-market-6', col: 1, rowStart: 9.6, rowEnd: 12 },

    // Col 2: 5-6p linked left column
    { id: 'lessons-5',      col: 2, rowStart: 0, rowEnd: 2 },
    { id: 'lessons-5b',     col: 2, rowStart: 4, rowEnd: 6 },
    { id: 'house-building', col: 2, rowStart: 8, rowEnd: 10 },

    // Col 3: 5-6p linked right + extras
    { id: 'copse-5',                  col: 3, rowStart: 0, rowEnd: 2 },
    { id: 'grove-5',                  col: 3, rowStart: 2, rowEnd: 4 },
    { id: 'modest-wish-for-children', col: 3, rowStart: 4, rowEnd: 6 },
    { id: 'resource-market-5',        col: 3, rowStart: 6, rowEnd: 8 },
    { id: 'hollow-5',                 col: 3, rowStart: 8, rowEnd: 10 },
    { id: 'traveling-players-5',      col: 3, rowStart: 10, rowEnd: 12 },

    // Col 4: Fixed actions
    { id: 'build-room-stable', col: 4, rowStart: 0, rowEnd: 2 },
    { id: 'starting-player',   col: 4, rowStart: 2, rowEnd: 4 },
    { id: 'take-grain',        col: 4, rowStart: 4, rowEnd: 6 },
    { id: 'plow-field',        col: 4, rowStart: 6, rowEnd: 8 },
    { id: 'occupation',        col: 4, rowStart: 8, rowEnd: 10 },
    { id: 'day-laborer',       col: 4, rowStart: 10, rowEnd: 12 },

    // Col 5: Accumulating spaces (rows 4-12)
    { id: 'take-wood', col: 5, rowStart: 4, rowEnd: 6 },
    { id: 'take-clay', col: 5, rowStart: 6, rowEnd: 8 },
    { id: 'take-reed', col: 5, rowStart: 8, rowEnd: 10 },
    { id: 'fishing',   col: 5, rowStart: 10, rowEnd: 12 },
  ],
  columns: [
    { col: 0, type: COL_TYPE.EXTRA },
    { col: 1, type: COL_TYPE.EXTRA },
    { col: 2, type: COL_TYPE.EXTRA },
    { col: 3, type: COL_TYPE.EXTRA },
    { col: 4, type: COL_TYPE.FIXED },
    { col: 5, type: COL_TYPE.ACCUMULATING },
  ],
  roundSlotCol: 6,
}

const layouts = {
  2: layout2,
  3: layout3,
  4: layout4,
  5: layout5,
  6: layout6,
}

// Linked pairs: rendered with a visual link indicator between them
const LINKED_PAIRS = [
  ['lessons-5', 'copse-5'],
  ['house-building', 'traveling-players-5'],
  ['lessons-5b', 'modest-wish-for-children'],
]

// --- Adjacency computation ---

// Two spaces are adjacent if:
// 1. Same column and their row spans share a boundary (rowEnd_A === rowStart_B or vice versa)
// 2. Adjacent columns (|col_A - col_B| === 1) and their row ranges overlap
//    (meaning they share at least a sliver of vertical extent)

function rangesOverlap(startA, endA, startB, endB) {
  return startA < endB && startB < endA
}

function rangesShareBoundary(startA, endA, startB, endB) {
  return endA === startB || endB === startA
}

function computeAdjacency(spaces) {
  const adjacencyMap = {}
  for (const space of spaces) {
    adjacencyMap[space.id] = []
  }

  for (let i = 0; i < spaces.length; i++) {
    for (let j = i + 1; j < spaces.length; j++) {
      const a = spaces[i]
      const b = spaces[j]
      const colDiff = Math.abs(a.col - b.col)

      let adjacent = false
      if (colDiff === 0) {
        // Same column: adjacent if row spans share a boundary
        adjacent = rangesShareBoundary(a.rowStart, a.rowEnd, b.rowStart, b.rowEnd)
      }
      else if (colDiff === 1) {
        // Adjacent columns: adjacent if row ranges overlap
        adjacent = rangesOverlap(a.rowStart, a.rowEnd, b.rowStart, b.rowEnd)
      }

      if (adjacent) {
        adjacencyMap[a.id].push(b.id)
        adjacencyMap[b.id].push(a.id)
      }
    }
  }

  return adjacencyMap
}

// --- Round card slot positions ---
// The first round card sits at the top of the accumulating column (rows 0-4),
// above Forest. Remaining rounds are grouped by stage in columns to the right.
// Each round card spans 4 rows (3 per column × 4 = 12).
//
// Round 1: accumulating column, rows 0-4
// Rounds 2-4 (remaining Stage 1): roundSlotCol + 0
// Rounds 5-7 (Stage 2): roundSlotCol + 1
// Rounds 8-9 (Stage 3): roundSlotCol + 2
// Rounds 10-11 (Stage 4): roundSlotCol + 3
// Rounds 12-13 (Stage 5): roundSlotCol + 4
// Round 14 (Stage 6): roundSlotCol + 5
const ROUND_COLUMNS = [
  [0],           // accumulating column (handled specially)
  [1, 2, 3],    // remaining Stage 1
  [4, 5, 6],    // Stage 2
  [7, 8],        // Stage 3
  [9, 10],       // Stage 4
  [11, 12],      // Stage 5
  [13],          // Stage 6
]

function getRoundSlotPosition(roundIndex, playerCount) {
  const layout = layouts[playerCount] || layouts[2]
  const rowSpan = 4

  // First round card: top of the accumulating column
  if (roundIndex === 0) {
    return {
      col: layout.roundSlotCol - 1,
      rowStart: 0,
      rowEnd: rowSpan,
    }
  }

  // Remaining rounds in stage columns
  for (let colIdx = 1; colIdx < ROUND_COLUMNS.length; colIdx++) {
    const slotIdx = ROUND_COLUMNS[colIdx].indexOf(roundIndex)
    if (slotIdx !== -1) {
      return {
        col: layout.roundSlotCol + (colIdx - 1),
        rowStart: slotIdx * rowSpan,
        rowEnd: slotIdx * rowSpan + rowSpan,
      }
    }
  }

  return { col: layout.roundSlotCol, rowStart: 0, rowEnd: 4 }
}

// --- Public API ---

function getLayoutForPlayerCount(n) {
  return layouts[n] || layouts[2]
}

function getSpacePosition(actionId, playerCount) {
  const layout = getLayoutForPlayerCount(playerCount)
  return layout.spaces.find(s => s.id === actionId) || null
}

function getAdjacentSpaces(actionId, playerCount, extraSpaces) {
  const layout = getLayoutForPlayerCount(playerCount)
  const allSpaces = extraSpaces
    ? [...layout.spaces, ...extraSpaces]
    : layout.spaces
  const adjacency = computeAdjacency(allSpaces)
  return adjacency[actionId] || []
}

function getColumnType(col, playerCount) {
  const layout = getLayoutForPlayerCount(playerCount)
  const colInfo = layout.columns.find(c => c.col === col)
  return colInfo ? colInfo.type : COL_TYPE.ROUND
}

function getTotalColumns(playerCount) {
  const layout = getLayoutForPlayerCount(playerCount)
  // Round 1 is in the accumulating column; remaining stages use ROUND_COLUMNS.length - 1 columns
  return layout.roundSlotCol + ROUND_COLUMNS.length - 1
}

module.exports = {
  getLayoutForPlayerCount,
  getAdjacentSpaces,
  getRoundSlotPosition,
  getSpacePosition,
  getColumnType,
  getTotalColumns,
  computeAdjacency,
  LINKED_PAIRS,
  COL_TYPE,
}
