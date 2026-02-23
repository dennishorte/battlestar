const res = require('../res/index.js')


/**
 * Check if a set of spaces are orthogonally connected.
 * @param {Array<{row: number, col: number}>} spaces - Array of space coordinates
 * @returns {boolean} True if all spaces are connected
 */
function areSpacesConnected(spaces) {
  if (!spaces || spaces.length <= 1) {
    return true
  }

  const spaceSet = new Set(spaces.map(s => `${s.row},${s.col}`))
  const visited = new Set()
  const queue = [spaces[0]]
  visited.add(`${spaces[0].row},${spaces[0].col}`)

  while (queue.length > 0) {
    const current = queue.shift()
    const { row, col } = current

    // Check all 4 orthogonal neighbors
    const neighbors = [
      { row: row - 1, col },
      { row: row + 1, col },
      { row, col: col - 1 },
      { row, col: col + 1 },
    ]

    for (const n of neighbors) {
      const key = `${n.row},${n.col}`
      if (spaceSet.has(key) && !visited.has(key)) {
        visited.add(key)
        queue.push(n)
      }
    }
  }

  return visited.size === spaces.length
}

/**
 * Calculate which edges of each selected space need fencing.
 * @param {Array<{row: number, col: number}>} spaces - Array of selected space coordinates
 * @param {Array} existingFences - Array of existing fence segments (optional)
 * @param {Object} options - Options: { rows: 3, cols: 5 } for board dimensions
 * @returns {Object} Map of "row,col" to { top, right, bottom, left } booleans
 */
function calculateFenceEdges(spaces, existingFences = [], options = {}) {
  const rows = options.rows || res.constants.farmyardRows || 3
  const cols = options.cols || res.constants.farmyardCols || 5

  const spaceSet = new Set(spaces.map(s => `${s.row},${s.col}`))
  const result = {}

  // Helper to check if a fence already exists between two cells
  const hasFenceBetween = (r1, c1, r2, c2) => {
    return existingFences.some(f =>
      (f.row1 === r1 && f.col1 === c1 && f.row2 === r2 && f.col2 === c2) ||
      (f.row1 === r2 && f.col1 === c2 && f.row2 === r1 && f.col2 === c1)
    )
  }

  // Helper to check if a board edge fence already exists
  const hasBoardEdgeFence = (row, col, edge) => {
    // Board edge fences are stored with row2/col2 as -1 to indicate edge
    return existingFences.some(f => {
      if (edge === 'top') {
        return f.row1 === row && f.col1 === col && f.row2 === -1 && f.edge === 'top'
      }
      if (edge === 'bottom') {
        return f.row1 === row && f.col1 === col && f.row2 === -1 && f.edge === 'bottom'
      }
      if (edge === 'left') {
        return f.row1 === row && f.col1 === col && f.col2 === -1 && f.edge === 'left'
      }
      if (edge === 'right') {
        return f.row1 === row && f.col1 === col && f.col2 === -1 && f.edge === 'right'
      }
      return false
    })
  }

  for (const coord of spaces) {
    const { row, col } = coord
    const key = `${row},${col}`
    const edges = { top: false, right: false, bottom: false, left: false }

    // Top edge
    if (row === 0) {
      // Board edge - needs fence unless already exists
      if (!hasBoardEdgeFence(row, col, 'top')) {
        edges.top = true
      }
    }
    else {
      const neighborKey = `${row - 1},${col}`
      if (!spaceSet.has(neighborKey) && !hasFenceBetween(row, col, row - 1, col)) {
        edges.top = true
      }
    }

    // Bottom edge
    if (row === rows - 1) {
      // Board edge - needs fence unless already exists
      if (!hasBoardEdgeFence(row, col, 'bottom')) {
        edges.bottom = true
      }
    }
    else {
      const neighborKey = `${row + 1},${col}`
      if (!spaceSet.has(neighborKey) && !hasFenceBetween(row, col, row + 1, col)) {
        edges.bottom = true
      }
    }

    // Left edge
    if (col === 0) {
      // Board edge - needs fence unless already exists
      if (!hasBoardEdgeFence(row, col, 'left')) {
        edges.left = true
      }
    }
    else {
      const neighborKey = `${row},${col - 1}`
      if (!spaceSet.has(neighborKey) && !hasFenceBetween(row, col, row, col - 1)) {
        edges.left = true
      }
    }

    // Right edge
    if (col === cols - 1) {
      // Board edge - needs fence unless already exists
      if (!hasBoardEdgeFence(row, col, 'right')) {
        edges.right = true
      }
    }
    else {
      const neighborKey = `${row},${col + 1}`
      if (!spaceSet.has(neighborKey) && !hasFenceBetween(row, col, row, col + 1)) {
        edges.right = true
      }
    }

    result[key] = edges
  }

  return result
}

/**
 * Count total number of new fences needed for a selection.
 * @param {Array<{row: number, col: number}>} spaces - Array of selected space coordinates
 * @param {Array} existingFences - Array of existing fence segments
 * @param {Object} options - Options: { rows: 3, cols: 5 } for board dimensions
 * @returns {number} Number of new fences needed
 */
function countFencesNeeded(spaces, existingFences = [], options = {}) {
  const edges = calculateFenceEdges(spaces, existingFences, options)
  let count = 0

  for (const key in edges) {
    const e = edges[key]
    if (e.top) {
      count++
    }
    if (e.right) {
      count++
    }
    if (e.bottom) {
      count++
    }
    if (e.left) {
      count++
    }
  }

  // Each internal fence is counted twice (once from each side), but since we're
  // only counting edges that need NEW fences (not in selection), this is correct.
  // However, we need to deduplicate fences that would be counted from both sides.
  // Actually, because we only count edges where neighbor is NOT in selection,
  // internal edges (between two selected spaces) are never counted at all.
  // So the count is already correct.

  return count
}

/**
 * Validate a pasture selection.
 * @param {Array<{row: number, col: number}>} spaces - Array of selected space coordinates
 * @param {Object} params - Validation parameters
 * @param {number} params.wood - Available wood
 * @param {number} params.currentFenceCount - Current number of fences placed
 * @param {number} params.maxFences - Maximum fences allowed (default 15)
 * @param {Array} params.existingFences - Array of existing fence segments
 * @param {Function} params.isSpaceValid - Function(row, col) to check if space can be fenced
 * @returns {Object} { valid, error, fencesNeeded, fenceEdges }
 */
function validatePastureSelection(spaces, params = {}) {
  const {
    wood = Infinity,
    currentFenceCount = 0,
    maxFences = res.constants.maxFences || 15,
    existingFences = [],
    isSpaceValid = () => true,
  } = params

  if (!spaces || spaces.length === 0) {
    return { valid: false, error: 'No spaces selected', fencesNeeded: 0 }
  }

  // Check all spaces are valid
  for (const coord of spaces) {
    if (!isSpaceValid(coord.row, coord.col)) {
      return { valid: false, error: 'Invalid space selected', fencesNeeded: 0 }
    }
  }

  // Check connectivity
  if (!areSpacesConnected(spaces)) {
    return { valid: false, error: 'Spaces must be connected', fencesNeeded: 0 }
  }

  // Calculate fences needed
  const fenceEdges = calculateFenceEdges(spaces, existingFences)
  const fencesNeeded = countFencesNeeded(spaces, existingFences)

  // Check wood
  if (fencesNeeded > wood) {
    return {
      valid: false,
      error: `Need ${fencesNeeded} wood (have ${wood})`,
      fencesNeeded,
      fenceEdges,
    }
  }

  // Check fence limit
  const remainingFences = maxFences - currentFenceCount
  if (fencesNeeded > remainingFences) {
    return {
      valid: false,
      error: `Need ${fencesNeeded} fences (${remainingFences} remaining)`,
      fencesNeeded,
      fenceEdges,
    }
  }

  return {
    valid: true,
    fencesNeeded,
    fenceEdges,
  }
}


module.exports = {
  areSpacesConnected,
  calculateFenceEdges,
  countFencesNeeded,
  validatePastureSelection,
}
