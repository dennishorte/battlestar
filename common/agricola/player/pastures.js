const { AgricolaPlayer } = require('../AgricolaPlayer.js')
const res = require('../res/index.js')


AgricolaPlayer.prototype.getStableCount = function() {
  let count = 0
  for (let row = 0; row < res.constants.farmyardRows; row++) {
    for (let col = 0; col < res.constants.farmyardCols; col++) {
      const space = this.farmyard.grid[row][col]
      if (space.hasStable) {
        count++
      }
    }
  }
  return count
}

AgricolaPlayer.prototype.getStableSpaces = function() {
  const stables = []
  for (let row = 0; row < res.constants.farmyardRows; row++) {
    for (let col = 0; col < res.constants.farmyardCols; col++) {
      const space = this.farmyard.grid[row][col]
      if (space.hasStable) {
        stables.push({ row, col, ...space })
      }
    }
  }
  return stables
}

AgricolaPlayer.prototype.canBuildStable = function(row, col) {
  // Cannot exceed max stables (accounting for stables removed by Open Air Farmer)
  if (this.getStableCount() >= res.constants.maxStables - (this.removedStables || 0)) {
    return false
  }

  const space = this.getSpace(row, col)
  if (!space) {
    return false
  }

  // Can build on empty space or in pasture, but not on room/field/existing stable
  if (space.type === 'room' || space.type === 'field') {
    return false
  }
  if (space.hasStable) {
    return false
  }

  // Future Building Site restriction (only for empty spaces, not existing pastures)
  if (space.type === 'empty' && this.isRestrictedByFutureBuildingSite(row, col)) {
    return false
  }

  return true
}

AgricolaPlayer.prototype.getValidStableBuildSpaces = function() {
  const valid = []
  for (let row = 0; row < res.constants.farmyardRows; row++) {
    for (let col = 0; col < res.constants.farmyardCols; col++) {
      if (this.canBuildStable(row, col)) {
        valid.push({ row, col })
      }
    }
  }
  return valid
}

AgricolaPlayer.prototype.hasStableAt = function({ row, col }) {
  const space = this.getSpace(row, col)
  return space && space.hasStable === true
}

AgricolaPlayer.prototype.buildStable = function(row, col) {
  if (!this.canBuildStable(row, col)) {
    return false
  }
  const space = this.getSpace(row, col)
  space.hasStable = true
  return true
}

AgricolaPlayer.prototype.getStableCost = function(baseCost) {
  let cost = { ...baseCost }
  const stableNumber = this.getStableCount() + 1
  for (const card of this.getActiveCards()) {
    if (card.hasHook('modifyStableCost')) {
      cost = card.callHook('modifyStableCost', this, cost, stableNumber)
    }
  }
  return cost
}

AgricolaPlayer.prototype.canAffordStable = function(baseCost = res.buildingCosts.stable) {
  return this.canAffordCost(this.getStableCost(baseCost))
}

// ---------------------------------------------------------------------------
// Fence and Pasture methods
// ---------------------------------------------------------------------------

AgricolaPlayer.prototype.getFenceCount = function() {
  return this.farmyard.fences.length
}

AgricolaPlayer.prototype.getFencesInSupply = function() {
  return res.constants.maxFences - this.getFenceCount() - (this.usedFences || 0)
}

AgricolaPlayer.prototype.useFenceFromSupply = function(count = 1) {
  this.usedFences = (this.usedFences || 0) + count
}

AgricolaPlayer.prototype.getPastureCount = function() {
  return this.farmyard.pastures.length
}

AgricolaPlayer.prototype.hasPastureAdjacentToHouse = function() {
  for (const pasture of this.farmyard.pastures) {
    for (const pSpace of pasture.spaces) {
      const neighbors = this.getOrthogonalNeighbors(pSpace.row, pSpace.col)
      for (const n of neighbors) {
        const space = this.getSpace(n.row, n.col)
        if (space && space.type === 'room') {
          return true
        }
      }
    }
  }
  return false
}

AgricolaPlayer.prototype.getAdjacentRoomPairCount = function() {
  let count = 0
  for (let row = 0; row < res.constants.farmyardRows; row++) {
    for (let col = 0; col < res.constants.farmyardCols; col++) {
      if (this.farmyard.grid[row][col].type === 'room') {
        // Check right neighbor
        if (col + 1 < res.constants.farmyardCols && this.farmyard.grid[row][col + 1].type === 'room') {
          count++
        }
        // Check down neighbor
        if (row + 1 < res.constants.farmyardRows && this.farmyard.grid[row + 1][col].type === 'room') {
          count++
        }
      }
    }
  }
  return count
}

AgricolaPlayer.prototype.getFencedStableCount = function() {
  let count = 0
  for (const pasture of this.farmyard.pastures) {
    for (const coord of pasture.spaces) {
      const space = this.getSpace(coord.row, coord.col)
      if (space && space.hasStable) {
        count++
      }
    }
  }
  return count
}

AgricolaPlayer.prototype.canBuildFences = function(fenceSegments) {
  // Check we have enough wood
  const woodNeeded = fenceSegments.length
  if (this.wood < woodNeeded) {
    return false
  }

  // Check fence limit
  if (this.getFenceCount() + fenceSegments.length > res.constants.maxFences) {
    return false
  }

  // Fences must create complete pastures (no partial enclosures)
  // This is complex validation - simplified for now
  return true
}

AgricolaPlayer.prototype.buildFences = function(fenceSegments) {
  if (!this.canBuildFences(fenceSegments)) {
    return false
  }

  // Add fences
  for (const fence of fenceSegments) {
    this.farmyard.fences.push(fence)
  }

  // Pay wood (accounting for fence cost modifiers)
  const woodCost = this.applyFenceCostModifiers(fenceSegments.length, this._countEdgeFences(fenceSegments))
  this.payCost({ wood: woodCost })

  // Recalculate pastures
  this.recalculatePastures()

  return true
}

AgricolaPlayer.prototype.recalculatePastures = function() {
  // Save old pasture data with remaining animal counts (decremented as distributed)
  const oldPastures = this.farmyard.pastures
    .filter(p => p.animalType && p.animalCount > 0)
    .map(p => ({
      spaceKeys: new Set(p.spaces.map(s => `${s.row},${s.col}`)),
      animalType: p.animalType,
      remaining: p.animalCount,
    }))

  // Find all enclosed areas created by fences
  const pastures = []
  const visited = new Set()

  for (let row = 0; row < res.constants.farmyardRows; row++) {
    for (let col = 0; col < res.constants.farmyardCols; col++) {
      const key = `${row},${col}`
      if (visited.has(key)) {
        continue
      }

      const space = this.getSpace(row, col)
      if (space.type === 'room' || space.type === 'field') {
        visited.add(key)
        continue
      }

      // Check if this space is enclosed by fences
      const enclosedSpaces = this.findEnclosedArea(row, col)
      if (enclosedSpaces.length > 0) {
        for (const coord of enclosedSpaces) {
          visited.add(`${coord.row},${coord.col}`)
        }

        // Check if all spaces are properly enclosed
        if (this.isPastureFullyEnclosed(enclosedSpaces)) {
          // Migrate animals from unfenced stables on these spaces
          let animalType = null
          let animalCount = 0
          for (const coord of enclosedSpaces) {
            const s = this.getSpace(coord.row, coord.col)
            if (s.animal && s.hasStable) {
              animalType = s.animal
              animalCount += s.animalCount || 1
              s.animal = null
              s.animalCount = 0
            }
          }

          // Carry over animals from old pastures that overlap these spaces
          if (!animalType) {
            const spaceKey = `${enclosedSpaces[0].row},${enclosedSpaces[0].col}`
            const oldP = oldPastures.find(p => p.remaining > 0 && p.spaceKeys.has(spaceKey))
            if (oldP) {
              animalType = oldP.animalType
              const newCapacity = this.getPastureCapacity({ spaces: enclosedSpaces })
              animalCount = Math.min(oldP.remaining, newCapacity)
              oldP.remaining -= animalCount
            }
          }

          pastures.push({
            id: pastures.length,
            spaces: enclosedSpaces,
            animalType,
            animalCount,
          })

          // Mark spaces as pasture type
          for (const coord of enclosedSpaces) {
            const s = this.getSpace(coord.row, coord.col)
            if (s.type === 'empty') {
              s.type = 'pasture'
            }
          }
        }
      }
    }
  }

  this.farmyard.pastures = pastures
  this.syncPastureLinkedVirtualFields()
}

AgricolaPlayer.prototype.findEnclosedArea = function(startRow, startCol) {
  // Flood fill to find connected empty/pasture spaces
  const spaces = []
  const visited = new Set()
  const queue = [{ row: startRow, col: startCol }]

  while (queue.length > 0) {
    const { row, col } = queue.shift()
    const key = `${row},${col}`

    if (visited.has(key)) {
      continue
    }
    visited.add(key)

    const space = this.getSpace(row, col)
    if (!space || space.type === 'room' || space.type === 'field') {
      continue
    }

    spaces.push({ row, col })

    // Add neighbors if no fence between
    const neighbors = this.getOrthogonalNeighbors(row, col)
    for (const n of neighbors) {
      if (!this.hasFenceBetween(row, col, n.row, n.col)) {
        queue.push(n)
      }
    }
  }

  return spaces
}

AgricolaPlayer.prototype.hasFenceBetween = function(row1, col1, row2, col2) {
  // Check if there's a fence between two adjacent spaces
  for (const fence of this.farmyard.fences) {
    if ((fence.row1 === row1 && fence.col1 === col1 &&
         fence.row2 === row2 && fence.col2 === col2) ||
        (fence.row1 === row2 && fence.col1 === col2 &&
         fence.row2 === row1 && fence.col2 === col1)) {
      return true
    }
  }
  return false
}

AgricolaPlayer.prototype.hasBoardEdgeFence = function(row, col, edge) {
  // Check if there's a fence on a board edge
  // Board edge fences are stored with row2/col2 = -1 and edge property
  for (const fence of this.farmyard.fences) {
    if (fence.row1 === row && fence.col1 === col && fence.edge === edge) {
      return true
    }
  }
  // Also check palisades (WoodPalisades card)
  for (const fence of this.farmyard.palisades) {
    if (fence.row1 === row && fence.col1 === col && fence.edge === edge) {
      return true
    }
  }
  return false
}

// Get the two corner points of a fence segment as string keys
AgricolaPlayer.prototype._getFenceCorners = function(fence) {
  const { row1, col1 } = fence
  let edge = fence.edge
  if (!edge) {
    if (fence.row2 < row1) {
      edge = 'top'
    }
    else if (fence.row2 > row1) {
      edge = 'bottom'
    }
    else if (fence.col2 < col1) {
      edge = 'left'
    }
    else {
      edge = 'right'
    }
  }
  switch (edge) {
    case 'top': return [`${row1},${col1}`, `${row1},${col1 + 1}`]
    case 'bottom': return [`${row1 + 1},${col1}`, `${row1 + 1},${col1 + 1}`]
    case 'left': return [`${row1},${col1}`, `${row1 + 1},${col1}`]
    case 'right': return [`${row1},${col1 + 1}`, `${row1 + 1},${col1 + 1}`]
  }
}

AgricolaPlayer.prototype.isPastureFullyEnclosed = function(spaces) {
  // Check if all border edges of the space group have fences
  // This includes both internal fences (between spaces) and board edge fences
  for (const coord of spaces) {
    // Check board edges - spaces at the edge need board edge fences
    if (coord.row === 0 && !this.hasBoardEdgeFence(coord.row, coord.col, 'top')) {
      return false
    }
    if (coord.row === res.constants.farmyardRows - 1 && !this.hasBoardEdgeFence(coord.row, coord.col, 'bottom')) {
      return false
    }
    if (coord.col === 0 && !this.hasBoardEdgeFence(coord.row, coord.col, 'left')) {
      return false
    }
    if (coord.col === res.constants.farmyardCols - 1 && !this.hasBoardEdgeFence(coord.row, coord.col, 'right')) {
      return false
    }

    // Check internal borders with neighboring spaces
    const neighbors = this.getOrthogonalNeighbors(coord.row, coord.col)
    for (const n of neighbors) {
      const neighborInPasture = spaces.some(s => s.row === n.row && s.col === n.col)
      if (!neighborInPasture) {
        // This is an internal border - must have fence
        const neighborSpace = this.getSpace(n.row, n.col)
        if (neighborSpace && neighborSpace.type !== 'room' && neighborSpace.type !== 'field') {
          // Neighbor is empty/pasture outside our group - need fence
          if (!this.hasFenceBetween(coord.row, coord.col, n.row, n.col)) {
            return false
          }
        }
      }
    }
  }
  return true
}

AgricolaPlayer.prototype.getOrthogonalNeighbors = function(row, col) {
  const neighbors = []
  if (row > 0) {
    neighbors.push({ row: row - 1, col })
  }
  if (row < res.constants.farmyardRows - 1) {
    neighbors.push({ row: row + 1, col })
  }
  if (col > 0) {
    neighbors.push({ row, col: col - 1 })
  }
  if (col < res.constants.farmyardCols - 1) {
    neighbors.push({ row, col: col + 1 })
  }
  return neighbors
}

// Future Building Site: check if a space is restricted
AgricolaPlayer.prototype.isRestrictedByFutureBuildingSite = function(row, col) {
  // Check if player has the card
  const hasFBS = this.playedMinorImprovements.some(id => {
    const card = this.cards.byId(id)
    return card && card.definition.futureBuildingSiteRestriction
  })
  if (!hasFBS) {
    return false
  }

  // Check if this space is adjacent to a room
  const neighbors = this.getOrthogonalNeighbors(row, col)
  const adjacentToRoom = neighbors.some(n => {
    const space = this.getSpace(n.row, n.col)
    return space && space.type === 'room'
  })
  if (!adjacentToRoom) {
    return false
  }

  // Check if there are still unused non-adjacent-to-room spaces
  // If all non-adjacent spaces are used, the restriction is lifted
  for (let r = 0; r < res.constants.farmyardRows; r++) {
    for (let c = 0; c < res.constants.farmyardCols; c++) {
      const space = this.farmyard.grid[r][c]
      if (space.type !== 'empty' || space.hasStable || this.getPastureAtSpace(r, c)) {
        continue // This space is used
      }
      // This space is unused — check if it's NOT adjacent to a room
      const isAdjacentToRoom = this.getOrthogonalNeighbors(r, c).some(n => {
        const nSpace = this.getSpace(n.row, n.col)
        return nSpace && nSpace.type === 'room'
      })
      if (!isAdjacentToRoom) {
        // Found an unused non-adjacent space, so restriction is still active
        return true
      }
    }
  }

  // All non-adjacent spaces are used, restriction lifted
  return false
}

// Calculate fences needed to enclose a given set of spaces as a pasture
AgricolaPlayer.prototype.calculateFencesForPasture = function(spaces) {
  const fences = []
  const spaceSet = new Set(spaces.map(s => `${s.row},${s.col}`))

  for (const coord of spaces) {
    const { row, col } = coord

    // Check each direction for needed fences
    // Top edge
    if (row === 0) {
      // Board edge - needs fence too
      if (!this.hasBoardEdgeFence(row, col, 'top')) {
        fences.push({ row1: row, col1: col, row2: -1, col2: col, edge: 'top' })
      }
    }
    else {
      const neighborKey = `${row - 1},${col}`
      if (!spaceSet.has(neighborKey)) {
        // Need fence between this space and neighbor
        if (!this.hasFenceBetween(row, col, row - 1, col)) {
          fences.push({ row1: row, col1: col, row2: row - 1, col2: col })
        }
      }
    }

    // Bottom edge
    if (row === res.constants.farmyardRows - 1) {
      // Board edge - needs fence too
      if (!this.hasBoardEdgeFence(row, col, 'bottom')) {
        fences.push({ row1: row, col1: col, row2: -1, col2: col, edge: 'bottom' })
      }
    }
    else {
      const neighborKey = `${row + 1},${col}`
      if (!spaceSet.has(neighborKey)) {
        if (!this.hasFenceBetween(row, col, row + 1, col)) {
          fences.push({ row1: row, col1: col, row2: row + 1, col2: col })
        }
      }
    }

    // Left edge
    if (col === 0) {
      // Board edge - needs fence too
      if (!this.hasBoardEdgeFence(row, col, 'left')) {
        fences.push({ row1: row, col1: col, row2: row, col2: -1, edge: 'left' })
      }
    }
    else {
      const neighborKey = `${row},${col - 1}`
      if (!spaceSet.has(neighborKey)) {
        if (!this.hasFenceBetween(row, col, row, col - 1)) {
          fences.push({ row1: row, col1: col, row2: row, col2: col - 1 })
        }
      }
    }

    // Right edge
    if (col === res.constants.farmyardCols - 1) {
      // Board edge - needs fence too
      if (!this.hasBoardEdgeFence(row, col, 'right')) {
        fences.push({ row1: row, col1: col, row2: row, col2: -1, edge: 'right' })
      }
    }
    else {
      const neighborKey = `${row},${col + 1}`
      if (!spaceSet.has(neighborKey)) {
        if (!this.hasFenceBetween(row, col, row, col + 1)) {
          fences.push({ row1: row, col1: col, row2: row, col2: col + 1 })
        }
      }
    }
  }

  return fences
}

// Validate a pasture selection
AgricolaPlayer.prototype.validatePastureSelection = function(spaces, options) {
  if (!spaces || spaces.length === 0) {
    return { valid: false, error: 'No spaces selected' }
  }

  // Check all spaces are valid (empty or existing pasture, not room/field)
  for (const coord of spaces) {
    const space = this.getSpace(coord.row, coord.col)
    if (!space) {
      return { valid: false, error: 'Invalid space' }
    }
    if (space.type === 'room' || space.type === 'field') {
      return { valid: false, error: 'Cannot fence rooms or fields' }
    }
    // Future Building Site restriction (only for empty unfenced spaces)
    if (space.type === 'empty' && !this.getPastureAtSpace(coord.row, coord.col)
        && this.isRestrictedByFutureBuildingSite(coord.row, coord.col)) {
      return { valid: false, error: 'Future Building Site: space adjacent to house is restricted' }
    }
  }

  // Check spaces are orthogonally connected
  if (!this.areSpacesConnected(spaces)) {
    return { valid: false, error: 'Spaces must be connected' }
  }

  // Calculate fences needed
  const fences = this.calculateFencesForPasture(spaces)

  // Check that new fences connect to existing fence network
  const allExistingFences = [...this.farmyard.fences, ...this.farmyard.palisades]
  if (allExistingFences.length > 0 && fences.length > 0) {
    const existingCorners = new Set()
    for (const f of allExistingFences) {
      for (const c of this._getFenceCorners(f)) {
        existingCorners.add(c)
      }
    }
    const connects = fences.some(f =>
      this._getFenceCorners(f).some(c => existingCorners.has(c))
    )
    if (!connects) {
      return { valid: false, error: 'New pasture must connect to existing fences' }
    }
  }

  // WoodPalisades: edge fences become palisades (2 wood each, don't count against 15-fence limit)
  const usesPalisades = this.hasWoodPalisadesCard()
  const { edgeFences, internalFences } = this._splitEdgeAndInternalFences(fences)

  if (!options?.skipCostCheck) {
    // Check if player has enough wood
    let woodCost
    if (usesPalisades) {
      // Internal fences: normal cost (1 wood each, with modifiers)
      woodCost = this.applyFenceCostModifiers(internalFences.length, 0)
      // Edge fences: 2 wood each as palisades
      woodCost += edgeFences.length * 2
    }
    else {
      woodCost = this.applyFenceCostModifiers(fences.length, this._countEdgeFences(fences))
    }
    // Overhaul free fence discount (validation only — don't decrement)
    if (this._overhaulFreeFences > 0) {
      woodCost = Math.max(0, woodCost - this._overhaulFreeFences)
    }
    // Field Fences discount: fences adjacent to fields are free
    if (this._fieldFencesActive) {
      woodCost = Math.max(0, woodCost - this._countFieldAdjacentFences(fences))
    }
    // Farm Redevelopment free fence discount (validation only — don't decrement)
    if ((this._farmRedevelopmentFreeFences || 0) > 0) {
      woodCost = Math.max(0, woodCost - this._farmRedevelopmentFreeFences)
    }
    // Card-based free fences (e.g. Ash Trees) — validation only, don't decrement
    for (const card of this.getActiveCards()) {
      if (card.hasHook('getFreeFences')) {
        const freeFences = card.callHook('getFreeFences', this.game)
        woodCost = Math.max(0, woodCost - freeFences)
      }
    }
    if (woodCost > this.wood) {
      return {
        valid: false,
        error: `Need ${woodCost} wood, have ${this.wood}`,
        fencesNeeded: fences.length,
      }
    }
  }

  // Check if player has enough fences remaining (palisades don't count against limit)
  const fencesForLimit = usesPalisades ? internalFences.length : fences.length
  const remainingFences = res.constants.maxFences - this.getFenceCount()
  if (fencesForLimit > remainingFences) {
    return {
      valid: false,
      error: `Need ${fencesForLimit} fences, only ${remainingFences} remaining`,
      fencesNeeded: fences.length,
    }
  }

  return {
    valid: true,
    fencesNeeded: fences.length,
    fences,
  }
}

// Check if spaces are orthogonally connected
AgricolaPlayer.prototype.areSpacesConnected = function(spaces) {
  if (spaces.length <= 1) {
    return true
  }

  const spaceSet = new Set(spaces.map(s => `${s.row},${s.col}`))
  const visited = new Set()
  const queue = [spaces[0]]
  visited.add(`${spaces[0].row},${spaces[0].col}`)

  while (queue.length > 0) {
    const current = queue.shift()
    const neighbors = this.getOrthogonalNeighbors(current.row, current.col)

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

// Build a pasture from selected spaces
AgricolaPlayer.prototype.buildPasture = function(spaces, options) {
  const validation = this.validatePastureSelection(spaces, options?.skipCost ? { skipCostCheck: true } : undefined)
  if (!validation.valid) {
    return { success: false, error: validation.error }
  }

  // WoodPalisades: edge fences become palisades
  const usesPalisades = this.hasWoodPalisadesCard()
  const { edgeFences, internalFences } = this._splitEdgeAndInternalFences(validation.fences)

  if (!options?.skipCost) {
    // Pay wood cost (accounting for fence cost modifiers)
    let woodCost
    if (usesPalisades) {
      woodCost = this.applyFenceCostModifiers(internalFences.length, 0)
      woodCost += edgeFences.length * 2
    }
    else {
      woodCost = this.applyFenceCostModifiers(validation.fencesNeeded, this._countEdgeFences(validation.fences))
    }
    // Overhaul free fence discount — decrement the counter
    if (this._overhaulFreeFences > 0) {
      const discount = Math.min(woodCost, this._overhaulFreeFences)
      woodCost -= discount
      this._overhaulFreeFences -= discount
    }
    // Field Fences discount: fences adjacent to fields are free
    if (this._fieldFencesActive) {
      woodCost = Math.max(0, woodCost - this._countFieldAdjacentFences(validation.fences))
    }
    // Farm Redevelopment free fence discount — decrement the counter
    if ((this._farmRedevelopmentFreeFences || 0) > 0) {
      const discount = Math.min(woodCost, this._farmRedevelopmentFreeFences)
      woodCost -= discount
      this._farmRedevelopmentFreeFences -= discount
    }
    // Card-based free fences (e.g. Ash Trees) — decrement stored fences
    for (const card of this.getActiveCards()) {
      if (card.hasHook('getFreeFences') && card.hasHook('useFreeFences')) {
        const freeFences = card.callHook('getFreeFences', this.game)
        const used = Math.min(woodCost, freeFences)
        if (used > 0) {
          woodCost -= used
          card.callHook('useFreeFences', this.game, used)
        }
      }
    }
    this.payCost({ wood: woodCost })
  }

  // Add fences — edge fences to palisades if WoodPalisades active
  if (usesPalisades) {
    for (const fence of internalFences) {
      this.farmyard.fences.push(fence)
    }
    for (const fence of edgeFences) {
      this.farmyard.palisades.push(fence)
    }
  }
  else {
    for (const fence of validation.fences) {
      this.farmyard.fences.push(fence)
    }
  }

  // Recalculate pastures
  this.recalculatePastures()

  return { success: true, fencesBuilt: validation.fencesNeeded }
}

// Get spaces available for fencing (empty or already pasture, not room/field)
AgricolaPlayer.prototype.getFenceableSpaces = function() {
  const spaces = []
  for (let row = 0; row < res.constants.farmyardRows; row++) {
    for (let col = 0; col < res.constants.farmyardCols; col++) {
      const space = this.farmyard.grid[row][col]
      if (space.type !== 'room' && space.type !== 'field') {
        spaces.push({ row, col })
      }
    }
  }
  return spaces
}
