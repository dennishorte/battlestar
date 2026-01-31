const { BasePlayer } = require('../lib/game/index.js')
const res = require('./res/index.js')


class AgricolaPlayer extends BasePlayer {

  _cardZone(zoneName) {
    try {
      return this.game.zones.byPlayer(this, zoneName)
    }
    catch {
      return null
    }
  }

  get hand() {
    const zone = this._cardZone('hand')
    return zone ? zone.cardlist().map(c => c.id) : (this._hand || [])
  }

  set hand(val) {
    this._hand = val
  }

  get playedOccupations() {
    const zone = this._cardZone('occupations')
    return zone ? zone.cardlist().map(c => c.id) : (this._playedOccupations || [])
  }

  set playedOccupations(val) {
    this._playedOccupations = val
  }

  get playedMinorImprovements() {
    const zone = this._cardZone('minorImprovements')
    return zone ? zone.cardlist().map(c => c.id) : (this._playedMinorImprovements || [])
  }

  set playedMinorImprovements(val) {
    this._playedMinorImprovements = val
  }

  get majorImprovements() {
    const zone = this._cardZone('majorImprovements')
    return zone ? zone.cardlist().map(c => c.id) : (this._majorImprovements || [])
  }

  set majorImprovements(val) {
    this._majorImprovements = val
  }

  initializeResources() {
    // Starting resources
    this.food = 0
    this.wood = 0
    this.clay = 0
    this.stone = 0
    this.reed = 0
    this.grain = 0
    this.vegetables = 0

    // Family members (start with 2)
    this.familyMembers = 2
    this.availableWorkers = 2
    this.newborns = [] // Track newborns for feeding (need only 1 food)

    // House state
    this.roomType = 'wood'

    // Begging cards
    this.beggingCards = 0

    // Occupations played
    this.occupationsPlayed = 0

    // Bonus points from cards
    this.bonusPoints = 0

    // Initialize farmyard grid (3 rows x 5 columns)
    this.initializeFarmyard()
  }

  // ---------------------------------------------------------------------------
  // Farmyard initialization and grid management
  // ---------------------------------------------------------------------------

  initializeFarmyard() {
    const { farmyardRows, farmyardCols } = res.constants

    // Create empty grid
    this.farmyard = {
      grid: [],
      pastures: [], // Array of pasture objects
      fences: [], // Array of fence segments
    }

    for (let row = 0; row < farmyardRows; row++) {
      this.farmyard.grid[row] = []
      for (let col = 0; col < farmyardCols; col++) {
        this.farmyard.grid[row][col] = { type: 'empty' }
      }
    }

    // Place starting rooms (top-left, vertically stacked)
    this.farmyard.grid[0][0] = { type: 'room', roomType: 'wood' }
    this.farmyard.grid[1][0] = { type: 'room', roomType: 'wood' }

    // Pet animal (one animal can live in the house)
    this.pet = null
  }

  getSpace(row, col) {
    if (row < 0 || row >= res.constants.farmyardRows ||
        col < 0 || col >= res.constants.farmyardCols) {
      return null
    }
    return this.farmyard.grid[row][col]
  }

  setSpace(row, col, space) {
    if (row >= 0 && row < res.constants.farmyardRows &&
        col >= 0 && col < res.constants.farmyardCols) {
      this.farmyard.grid[row][col] = space
    }
  }

  isSpaceEmpty(row, col) {
    const space = this.getSpace(row, col)
    return space && space.type === 'empty'
  }

  getEmptySpaces() {
    const empty = []
    for (let row = 0; row < res.constants.farmyardRows; row++) {
      for (let col = 0; col < res.constants.farmyardCols; col++) {
        if (this.isSpaceEmpty(row, col)) {
          empty.push({ row, col })
        }
      }
    }
    return empty
  }

  // ---------------------------------------------------------------------------
  // Room methods
  // ---------------------------------------------------------------------------

  getRoomCount() {
    let count = 0
    for (let row = 0; row < res.constants.farmyardRows; row++) {
      for (let col = 0; col < res.constants.farmyardCols; col++) {
        if (this.farmyard.grid[row][col].type === 'room') {
          count++
        }
      }
    }
    return count
  }

  getRoomSpaces() {
    const rooms = []
    for (let row = 0; row < res.constants.farmyardRows; row++) {
      for (let col = 0; col < res.constants.farmyardCols; col++) {
        if (this.farmyard.grid[row][col].type === 'room') {
          rooms.push({ row, col, ...this.farmyard.grid[row][col] })
        }
      }
    }
    return rooms
  }

  canBuildRoom(row, col) {
    // Must be empty
    if (!this.isSpaceEmpty(row, col)) {
      return false
    }

    // Must be adjacent to existing room
    const neighbors = this.getOrthogonalNeighbors(row, col)
    return neighbors.some(n => {
      const space = this.getSpace(n.row, n.col)
      return space && space.type === 'room'
    })
  }

  getValidRoomBuildSpaces() {
    const valid = []
    for (const space of this.getEmptySpaces()) {
      if (this.canBuildRoom(space.row, space.col)) {
        valid.push(space)
      }
    }
    return valid
  }

  buildRoom(row, col) {
    if (!this.canBuildRoom(row, col)) {
      return false
    }
    this.setSpace(row, col, { type: 'room', roomType: this.roomType })
    return true
  }

  canAffordRoom() {
    const cost = res.buildingCosts.room[this.roomType]
    return this.canAffordCost(cost)
  }

  getRoomCost() {
    return res.buildingCosts.room[this.roomType]
  }

  // ---------------------------------------------------------------------------
  // Renovation methods
  // ---------------------------------------------------------------------------

  canRenovate() {
    const nextType = res.houseMaterialUpgrades[this.roomType]
    if (!nextType) {
      return false // Already stone
    }

    const costKey = this.roomType === 'wood' ? 'woodToClay' : 'clayToStone'
    const costPerRoom = res.buildingCosts.renovation[costKey]
    const roomCount = this.getRoomCount()

    // Cost is (material * roomCount) + 1 reed
    const materialType = nextType // clay or stone
    const totalMaterialNeeded = costPerRoom[materialType] * roomCount
    const reedNeeded = costPerRoom.reed

    return this[materialType] >= totalMaterialNeeded && this.reed >= reedNeeded
  }

  getRenovationCost() {
    const nextType = res.houseMaterialUpgrades[this.roomType]
    if (!nextType) {
      return null
    }

    const costKey = this.roomType === 'wood' ? 'woodToClay' : 'clayToStone'
    const costPerRoom = res.buildingCosts.renovation[costKey]
    const roomCount = this.getRoomCount()

    const materialType = nextType
    return {
      [materialType]: costPerRoom[materialType] * roomCount,
      reed: costPerRoom.reed,
    }
  }

  renovate() {
    if (!this.canRenovate()) {
      return false
    }

    const cost = this.getRenovationCost()
    this.payCost(cost)

    const nextType = res.houseMaterialUpgrades[this.roomType]
    this.roomType = nextType

    // Update all room spaces
    for (let row = 0; row < res.constants.farmyardRows; row++) {
      for (let col = 0; col < res.constants.farmyardCols; col++) {
        if (this.farmyard.grid[row][col].type === 'room') {
          this.farmyard.grid[row][col].roomType = nextType
        }
      }
    }

    return true
  }

  // ---------------------------------------------------------------------------
  // Field methods
  // ---------------------------------------------------------------------------

  // Revised Edition rule: Only field TILES count for scoring.
  // Field cards (like Beanfield) count for prerequisites but NOT for scoring points.
  // This method counts field tiles only (for scoring).
  getFieldCount() {
    let count = 0
    for (let row = 0; row < res.constants.farmyardRows; row++) {
      for (let col = 0; col < res.constants.farmyardCols; col++) {
        if (this.farmyard.grid[row][col].type === 'field') {
          count++
        }
      }
    }
    return count
  }

  // For prerequisites, field cards should also be counted.
  // Returns total fields including both field tiles and field cards.
  getFieldCountForPrereqs() {
    let count = this.getFieldCount()
    // Add field cards (cards with isField: true property)
    for (const cardId of this.playedMinorImprovements) {
      const card = this.cards.byId(cardId)
      if (card && card.isField) {
        count++
      }
    }
    return count
  }

  getFieldSpaces() {
    const fields = []
    for (let row = 0; row < res.constants.farmyardRows; row++) {
      for (let col = 0; col < res.constants.farmyardCols; col++) {
        if (this.farmyard.grid[row][col].type === 'field') {
          fields.push({ row, col, ...this.farmyard.grid[row][col] })
        }
      }
    }
    return fields
  }

  getEmptyFields() {
    return this.getFieldSpaces().filter(f => !f.crop || f.cropCount === 0)
  }

  getSownFields() {
    return this.getFieldSpaces().filter(f => f.crop && f.cropCount > 0)
  }

  canPlowField(row, col) {
    // Must be empty
    if (!this.isSpaceEmpty(row, col)) {
      return false
    }

    // First field can go anywhere
    const existingFields = this.getFieldSpaces()
    if (existingFields.length === 0) {
      return true
    }

    // Additional fields must be adjacent to existing field
    const neighbors = this.getOrthogonalNeighbors(row, col)
    return neighbors.some(n => {
      const space = this.getSpace(n.row, n.col)
      return space && space.type === 'field'
    })
  }

  getValidPlowSpaces() {
    const valid = []
    for (const space of this.getEmptySpaces()) {
      if (this.canPlowField(space.row, space.col)) {
        valid.push(space)
      }
    }
    return valid
  }

  plowField(row, col) {
    if (!this.canPlowField(row, col)) {
      return false
    }
    this.setSpace(row, col, { type: 'field', crop: null, cropCount: 0 })
    return true
  }

  canSow(cropType) {
    // Must have an empty field
    if (this.getEmptyFields().length === 0) {
      return false
    }

    // Must have the seed
    return this[cropType] >= 1
  }

  sowField(row, col, cropType) {
    const space = this.getSpace(row, col)
    if (!space || space.type !== 'field' || (space.crop && space.cropCount > 0)) {
      return false
    }

    if (this[cropType] < 1) {
      return false
    }

    // Take 1 from supply, place on field with bonus
    this[cropType] -= 1

    const totalCrops = cropType === 'grain'
      ? res.constants.sowingGrain
      : res.constants.sowingVegetables

    space.crop = cropType
    space.cropCount = totalCrops
    return true
  }

  harvestFields() {
    const harvested = { grain: 0, vegetables: 0 }

    for (const field of this.getSownFields()) {
      if (field.cropCount > 0) {
        harvested[field.crop] += 1
        const space = this.getSpace(field.row, field.col)
        space.cropCount -= 1
        if (space.cropCount === 0) {
          space.crop = null
        }
      }
    }

    this.grain += harvested.grain
    this.vegetables += harvested.vegetables

    return harvested
  }

  // ---------------------------------------------------------------------------
  // Stable methods
  // ---------------------------------------------------------------------------

  getStableCount() {
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

  getStableSpaces() {
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

  canBuildStable(row, col) {
    // Cannot exceed max stables
    if (this.getStableCount() >= res.constants.maxStables) {
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

    return true
  }

  getValidStableBuildSpaces() {
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

  buildStable(row, col) {
    if (!this.canBuildStable(row, col)) {
      return false
    }
    const space = this.getSpace(row, col)
    space.hasStable = true
    return true
  }

  canAffordStable() {
    return this.canAffordCost(res.buildingCosts.stable)
  }

  // ---------------------------------------------------------------------------
  // Fence and Pasture methods
  // ---------------------------------------------------------------------------

  getFenceCount() {
    return this.farmyard.fences.length
  }

  getPastureCount() {
    return this.farmyard.pastures.length
  }

  getFencedStableCount() {
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

  canBuildFences(fenceSegments) {
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

  buildFences(fenceSegments) {
    if (!this.canBuildFences(fenceSegments)) {
      return false
    }

    // Add fences
    for (const fence of fenceSegments) {
      this.farmyard.fences.push(fence)
    }

    // Pay wood
    this.wood -= fenceSegments.length

    // Recalculate pastures
    this.recalculatePastures()

    return true
  }

  recalculatePastures() {
    // Find all enclosed areas created by fences
    // This is a simplified implementation
    const pastures = []
    const visited = new Set()

    // Check each space to see if it's in a fenced area
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
            pastures.push({
              id: pastures.length,
              spaces: enclosedSpaces,
              animalType: null,
              animalCount: 0,
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
  }

  findEnclosedArea(startRow, startCol) {
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

  hasFenceBetween(row1, col1, row2, col2) {
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

  hasBoardEdgeFence(row, col, edge) {
    // Check if there's a fence on a board edge
    // Board edge fences are stored with row2/col2 = -1 and edge property
    for (const fence of this.farmyard.fences) {
      if (fence.row1 === row && fence.col1 === col && fence.edge === edge) {
        return true
      }
    }
    return false
  }

  isPastureFullyEnclosed(spaces) {
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

  getOrthogonalNeighbors(row, col) {
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

  // Calculate fences needed to enclose a given set of spaces as a pasture
  calculateFencesForPasture(spaces) {
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
  validatePastureSelection(spaces) {
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
    }

    // Check spaces are orthogonally connected
    if (!this.areSpacesConnected(spaces)) {
      return { valid: false, error: 'Spaces must be connected' }
    }

    // Calculate fences needed
    const fences = this.calculateFencesForPasture(spaces)

    // Check if player has enough wood
    if (fences.length > this.wood) {
      return {
        valid: false,
        error: `Need ${fences.length} wood, have ${this.wood}`,
        fencesNeeded: fences.length,
      }
    }

    // Check if player has enough fences remaining
    const remainingFences = res.constants.maxFences - this.getFenceCount()
    if (fences.length > remainingFences) {
      return {
        valid: false,
        error: `Need ${fences.length} fences, only ${remainingFences} remaining`,
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
  areSpacesConnected(spaces) {
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
  buildPasture(spaces) {
    const validation = this.validatePastureSelection(spaces)
    if (!validation.valid) {
      return { success: false, error: validation.error }
    }

    // Pay wood cost
    this.wood -= validation.fencesNeeded

    // Add fences
    for (const fence of validation.fences) {
      this.farmyard.fences.push(fence)
    }

    // Recalculate pastures
    this.recalculatePastures()

    return { success: true, fencesBuilt: validation.fencesNeeded }
  }

  // Get spaces available for fencing (empty or already pasture, not room/field)
  getFenceableSpaces() {
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

  // ---------------------------------------------------------------------------
  // Animal methods
  // ---------------------------------------------------------------------------

  getTotalAnimals(type) {
    let count = 0

    // Count pet
    if (this.pet === type) {
      count++
    }

    // Count in pastures
    for (const pasture of this.farmyard.pastures) {
      if (pasture.animalType === type) {
        count += pasture.animalCount
      }
    }

    // Count in unfenced stables
    for (const stable of this.getStableSpaces()) {
      const pasture = this.getPastureAtSpace(stable.row, stable.col)
      if (!pasture && stable.animal === type) {
        count++
      }
    }

    return count
  }

  getAllAnimals() {
    return {
      sheep: this.getTotalAnimals('sheep'),
      boar: this.getTotalAnimals('boar'),
      cattle: this.getTotalAnimals('cattle'),
    }
  }

  // Get total count of building resources (for tie-breaker)
  // Revised Edition: wood + clay + reed + stone remaining in supply
  getBuildingResourcesCount() {
    return this.wood + this.clay + this.reed + this.stone
  }

  getPastureAtSpace(row, col) {
    for (const pasture of this.farmyard.pastures) {
      if (pasture.spaces.some(s => s.row === row && s.col === col)) {
        return pasture
      }
    }
    return null
  }

  getPastureCapacity(pasture) {
    // 2 animals per space
    let capacity = pasture.spaces.length * 2

    // Check for stables in pasture (doubles capacity)
    let hasStable = false
    for (const coord of pasture.spaces) {
      const space = this.getSpace(coord.row, coord.col)
      if (space && space.hasStable) {
        hasStable = true
        break
      }
    }

    if (hasStable) {
      capacity *= 2
    }

    // Apply card modifiers (Drinking Trough: +2 per pasture)
    capacity = this.applyPastureCapacityModifiers(pasture, capacity)

    return capacity
  }

  getUnfencedStableCapacity() {
    // Each unfenced stable can hold 1 animal
    let capacity = 0
    for (const stable of this.getStableSpaces()) {
      if (!this.getPastureAtSpace(stable.row, stable.col)) {
        capacity++
      }
    }
    return capacity
  }

  getTotalAnimalCapacity(animalType) {
    // Pet in house (default 1, Animal Tamer: 1 per room)
    let capacity = this.applyHouseAnimalCapacityModifiers(1)

    // Pastures that are empty or already have this type
    for (const pasture of this.farmyard.pastures) {
      if (!pasture.animalType || pasture.animalType === animalType) {
        capacity += this.getPastureCapacity(pasture)
      }
    }

    // Unfenced stables
    capacity += this.getUnfencedStableCapacity()

    return capacity
  }

  canPlaceAnimals(animalType, count) {
    const currentCount = this.getTotalAnimals(animalType)
    const capacity = this.getTotalAnimalCapacity(animalType)
    return currentCount + count <= capacity
  }

  addAnimals(animalType, count) {
    // Try to place animals automatically
    let remaining = count

    // First try pastures that already have this type
    for (const pasture of this.farmyard.pastures) {
      if (remaining <= 0) {
        break
      }
      if (pasture.animalType === animalType) {
        const capacity = this.getPastureCapacity(pasture)
        const canAdd = capacity - pasture.animalCount
        const toAdd = Math.min(remaining, canAdd)
        pasture.animalCount += toAdd
        remaining -= toAdd
      }
    }

    // Then try empty pastures
    for (const pasture of this.farmyard.pastures) {
      if (remaining <= 0) {
        break
      }
      if (!pasture.animalType) {
        pasture.animalType = animalType
        const capacity = this.getPastureCapacity(pasture)
        const toAdd = Math.min(remaining, capacity)
        pasture.animalCount = toAdd
        remaining -= toAdd
      }
    }

    // Then try unfenced stables
    for (const stable of this.getStableSpaces()) {
      if (remaining <= 0) {
        break
      }
      if (!this.getPastureAtSpace(stable.row, stable.col)) {
        const space = this.getSpace(stable.row, stable.col)
        if (!space.animal) {
          space.animal = animalType
          remaining--
        }
      }
    }

    // Finally try pet
    if (remaining > 0 && !this.pet) {
      this.pet = animalType
      remaining--
    }

    return remaining === 0
  }

  removeAnimals(animalType, count) {
    let remaining = count

    // Remove from pastures first
    for (const pasture of this.farmyard.pastures) {
      if (remaining <= 0) {
        break
      }
      if (pasture.animalType === animalType) {
        const toRemove = Math.min(remaining, pasture.animalCount)
        pasture.animalCount -= toRemove
        remaining -= toRemove
        if (pasture.animalCount === 0) {
          pasture.animalType = null
        }
      }
    }

    // Remove from unfenced stables
    for (const stable of this.getStableSpaces()) {
      if (remaining <= 0) {
        break
      }
      if (!this.getPastureAtSpace(stable.row, stable.col)) {
        const space = this.getSpace(stable.row, stable.col)
        if (space.animal === animalType) {
          space.animal = null
          remaining--
        }
      }
    }

    // Remove pet
    if (remaining > 0 && this.pet === animalType) {
      this.pet = null
      remaining--
    }

    return remaining === 0
  }

  breedAnimals() {
    const bred = { sheep: 0, boar: 0, cattle: 0 }

    for (const type of res.animalTypes) {
      const count = this.getTotalAnimals(type)
      if (count >= 2) {
        // Can breed - but only if we can house the baby
        if (this.canPlaceAnimals(type, 1)) {
          this.addAnimals(type, 1)
          bred[type] = 1
        }
      }
    }

    return bred
  }

  // ---------------------------------------------------------------------------
  // Resource methods
  // ---------------------------------------------------------------------------

  addResource(type, amount) {
    if (this[type] !== undefined) {
      this[type] += amount
    }
  }

  removeResource(type, amount) {
    if (this[type] !== undefined) {
      this[type] = Math.max(0, this[type] - amount)
    }
  }

  hasResource(type, amount) {
    return this[type] !== undefined && this[type] >= amount
  }

  getResources() {
    return {
      food: this.food,
      wood: this.wood,
      clay: this.clay,
      stone: this.stone,
      reed: this.reed,
      grain: this.grain,
      vegetables: this.vegetables,
    }
  }

  canAffordCost(cost) {
    for (const [resource, amount] of Object.entries(cost)) {
      if (!this.hasResource(resource, amount)) {
        return false
      }
    }
    return true
  }

  payCost(cost) {
    for (const [resource, amount] of Object.entries(cost)) {
      this.removeResource(resource, amount)
    }
  }

  // ---------------------------------------------------------------------------
  // Family methods
  // ---------------------------------------------------------------------------

  getFamilySize() {
    return this.familyMembers
  }

  getAvailableWorkers() {
    return this.availableWorkers
  }

  useWorker() {
    if (this.availableWorkers > 0) {
      this.availableWorkers -= 1
      return true
    }
    return false
  }

  resetWorkers() {
    this.availableWorkers = this.familyMembers
    // Clear newborn status after one full round
    this.newborns = []
  }

  canGrowFamily(requiresRoom = true) {
    // Max 5 family members
    if (this.familyMembers >= res.constants.maxFamilyMembers) {
      return false
    }

    // Need more rooms than family members (if required)
    if (requiresRoom && this.getRoomCount() <= this.familyMembers) {
      return false
    }

    return true
  }

  growFamily() {
    if (this.familyMembers >= res.constants.maxFamilyMembers) {
      return false
    }

    this.familyMembers += 1
    this.newborns.push(this.familyMembers) // Track which family member is newborn
    // Note: newborn is NOT available for work this round
    return true
  }

  // ---------------------------------------------------------------------------
  // Feeding methods
  // ---------------------------------------------------------------------------

  getFoodRequired() {
    let required = 0
    for (let i = 1; i <= this.familyMembers; i++) {
      if (this.newborns.includes(i)) {
        required += res.constants.foodPerNewborn
      }
      else {
        required += res.constants.foodPerFamilyMember
      }
    }
    return required
  }

  feedFamily() {
    const required = this.getFoodRequired()
    const shortage = Math.max(0, required - this.food)

    if (shortage > 0) {
      this.food = 0
      this.beggingCards += shortage
    }
    else {
      this.food -= required
    }

    return { required, fed: required - shortage, beggingCards: shortage }
  }

  // ---------------------------------------------------------------------------
  // Cooking and Baking methods
  // ---------------------------------------------------------------------------

  hasCookingAbility() {
    return this.majorImprovements.some(id => {
      const imp = this.cards.byId(id)
      return imp && imp.abilities && imp.abilities.canCook
    })
  }

  hasBakingAbility() {
    return this.majorImprovements.some(id => {
      const imp = this.cards.byId(id)
      return imp && imp.abilities && imp.abilities.canBake
    })
  }

  getCookingImprovement() {
    for (const id of this.majorImprovements) {
      const imp = this.cards.byId(id)
      if (imp && imp.abilities && imp.abilities.canCook) {
        return imp
      }
    }
    return null
  }

  getBakingImprovement() {
    for (const id of this.majorImprovements) {
      const imp = this.cards.byId(id)
      if (imp && imp.abilities && imp.abilities.canBake) {
        return imp
      }
    }
    return null
  }

  cookAnimal(animalType, count = 1) {
    const imp = this.getCookingImprovement()
    if (!imp) {
      return 0
    }

    const available = this.getTotalAnimals(animalType)
    const toCook = Math.min(count, available)

    if (toCook > 0) {
      this.removeAnimals(animalType, toCook)
      const food = res.calculateCookingFood(imp, animalType, toCook)
      this.food += food
      return food
    }
    return 0
  }

  cookVegetable(count = 1) {
    const imp = this.getCookingImprovement()
    if (!imp) {
      return 0
    }

    const toCook = Math.min(count, this.vegetables)
    if (toCook > 0) {
      this.vegetables -= toCook
      const food = res.calculateCookingFood(imp, 'vegetables', toCook)
      this.food += food
      return food
    }
    return 0
  }

  bakeGrain(count = 1) {
    const imp = this.getBakingImprovement()
    if (!imp) {
      return 0
    }

    const limit = imp.abilities.bakingLimit || count
    const toBake = Math.min(count, this.grain, limit)

    if (toBake > 0) {
      this.grain -= toBake
      const food = res.calculateBakingFood(imp, toBake)
      this.food += food
      return food
    }
    return 0
  }

  // Converts grain or vegetables to food without improvement (1:1 ratio)
  convertToFood(resourceType, count = 1) {
    const available = this[resourceType]
    const toConvert = Math.min(count, available)

    if (toConvert > 0) {
      this[resourceType] -= toConvert
      this.food += toConvert
      return toConvert
    }
    return 0
  }

  // ---------------------------------------------------------------------------
  // Major Improvement methods
  // ---------------------------------------------------------------------------

  canBuyMajorImprovement(improvementId) {
    const imp = this.cards.byId(improvementId)
    if (!imp) {
      return false
    }

    // Check if already owned
    if (this.majorImprovements.includes(improvementId)) {
      return false
    }

    // Check upgrade path
    if (imp.upgradesFrom && imp.upgradesFrom.length > 0) {
      const canUpgrade = imp.upgradesFrom.some(fromId =>
        this.majorImprovements.includes(fromId)
      )
      if (canUpgrade) {
        // Upgrading - just need to afford it
        return this.canAffordCost(imp.cost)
      }
    }

    // Normal purchase
    return this.canAffordCost(imp.cost)
  }

  buyMajorImprovement(improvementId) {
    const imp = this.cards.byId(improvementId)
    if (!imp) {
      return false
    }

    if (!this.canBuyMajorImprovement(improvementId)) {
      return false
    }

    // Handle upgrade - move old card back to common zone
    const commonMajorZone = this.zones.byId('common.majorImprovements')
    if (imp.upgradesFrom && imp.upgradesFrom.length > 0) {
      for (const fromId of imp.upgradesFrom) {
        if (this.majorImprovements.includes(fromId)) {
          const oldCard = this.cards.byId(fromId)
          oldCard.moveTo(commonMajorZone)
          break
        }
      }
    }

    // Pay cost and move improvement to player's zone
    this.payCost(imp.cost)
    imp.moveTo(this.zones.byPlayer(this, 'majorImprovements'))

    return true
  }

  // ---------------------------------------------------------------------------
  // Unused spaces calculation
  // ---------------------------------------------------------------------------

  getUnusedSpaceCount() {
    let count = 0
    for (let row = 0; row < res.constants.farmyardRows; row++) {
      for (let col = 0; col < res.constants.farmyardCols; col++) {
        const space = this.farmyard.grid[row][col]
        // Unused = empty without stable, and not in a pasture
        if (space.type === 'empty' && !space.hasStable) {
          if (!this.getPastureAtSpace(row, col)) {
            count++
          }
        }
      }
    }
    return count
  }

  // ---------------------------------------------------------------------------
  // Scoring
  // ---------------------------------------------------------------------------

  getScoreState() {
    return {
      fields: this.getFieldCount(),
      pastures: this.getPastureCount(),
      grain: this.grain,
      vegetables: this.vegetables,
      sheep: this.getTotalAnimals('sheep'),
      boar: this.getTotalAnimals('boar'),
      cattle: this.getTotalAnimals('cattle'),
      rooms: this.getRoomCount(),
      roomType: this.roomType,
      familyMembers: this.familyMembers,
      unusedSpaces: this.getUnusedSpaceCount(),
      fencedStables: this.getFencedStableCount(),
      beggingCards: this.beggingCards,
      cardPoints: this.getCardPoints(),
      bonusPoints: this.getBonusPoints(),
    }
  }

  getCardPoints() {
    let points = 0
    for (const id of this.majorImprovements) {
      const imp = this.cards.byId(id)
      if (imp) {
        points += imp.victoryPoints || 0
      }
    }
    return points
  }

  getBonusPoints() {
    let points = this.bonusPoints || 0

    // Bonus from crafting improvements (joinery, pottery, basketmaker's)
    // Note: Resources are actually spent in spendResourcesForCraftingBonus()
    // This method just calculates the points
    for (const id of this.majorImprovements) {
      const imp = this.cards.byId(id)
      if (imp && imp.abilities && imp.abilities.endGameBonus) {
        const resource = imp.abilities.endGameBonus.resource
        const count = this[resource] || 0
        points += res.calculateCraftingBonus(imp, count)
      }
    }

    // Bonus from minor improvements
    for (const id of this.playedMinorImprovements) {
      const card = this.cards.byId(id)
      if (card && card.hasHook('getEndGamePoints')) {
        points += card.callHook('getEndGamePoints', this)
      }
      if (card && card.vps) {
        points += card.vps
      }
    }

    // Bonus from occupations
    for (const id of this.playedOccupations) {
      const card = this.cards.byId(id)
      if (card && card.hasHook('getEndGamePoints')) {
        points += card.callHook('getEndGamePoints', this)
      }
    }

    return points
  }

  // Spend resources for crafting improvement bonus points
  // Revised Edition: Resources are spent from supply to earn bonus points
  // This affects tie-breaker calculation (remaining resources)
  spendResourcesForCraftingBonus() {
    const spent = { wood: 0, clay: 0, reed: 0, stone: 0 }

    for (const id of this.majorImprovements) {
      const imp = this.cards.byId(id)
      if (imp && imp.abilities && imp.abilities.endGameBonus) {
        const resource = imp.abilities.endGameBonus.resource
        const count = this[resource] || 0
        const bonusPoints = res.calculateCraftingBonus(imp, count)

        // Calculate how many resources were spent for these bonus points
        // Joinery/Pottery: 3/5/7 for 1/2/3 points
        // Basketmaker's: 2/4/5 for 1/2/3 points
        if (bonusPoints > 0) {
          let resourcesSpent = 0
          if (imp.id === 'basketmakers-workshop') {
            // 2/4/5 reed for 1/2/3 points
            if (bonusPoints >= 3) {
              resourcesSpent = 5
            }
            else if (bonusPoints >= 2) {
              resourcesSpent = 4
            }
            else {
              resourcesSpent = 2
            }
          }
          else {
            // Joinery/Pottery: 3/5/7 for 1/2/3 points
            if (bonusPoints >= 3) {
              resourcesSpent = 7
            }
            else if (bonusPoints >= 2) {
              resourcesSpent = 5
            }
            else {
              resourcesSpent = 3
            }
          }
          resourcesSpent = Math.min(resourcesSpent, count)
          this[resource] -= resourcesSpent
          spent[resource] = resourcesSpent
        }
      }
    }

    return spent
  }

  // ---------------------------------------------------------------------------
  // Card methods
  // ---------------------------------------------------------------------------

  getPlayedCards() {
    return [...this.playedOccupations, ...this.playedMinorImprovements]
  }

  getPlayedCard(cardId) {
    if (this.playedOccupations.includes(cardId) || this.playedMinorImprovements.includes(cardId)) {
      return this.cards.byId(cardId)
    }
    return null
  }

  hasCard(cardId) {
    return this.hand.includes(cardId)
  }

  hasPlayedCard(cardId) {
    return this.playedOccupations.includes(cardId) || this.playedMinorImprovements.includes(cardId)
  }

  canAffordCard(cardId) {
    const card = this.cards.byId(cardId)
    if (!card) {
      return false
    }

    // Check cost
    if (card.cost) {
      for (const [resource, amount] of Object.entries(card.cost)) {
        if (resource === 'sheep' || resource === 'boar' || resource === 'cattle') {
          if (this.getTotalAnimals(resource) < amount) {
            return false
          }
        }
        else if ((this[resource] || 0) < amount) {
          return false
        }
      }
    }

    return true
  }

  meetsCardPrereqs(cardId) {
    const card = this.cards.byId(cardId)
    if (!card || !card.prereqs) {
      return true
    }

    const prereqs = card.prereqs

    // Check occupation count
    if (prereqs.occupations !== undefined) {
      if (prereqs.occupationsExact) {
        if (this.playedOccupations.length !== prereqs.occupations) {
          return false
        }
      }
      else if (prereqs.occupationsAtMost) {
        if (this.playedOccupations.length > prereqs.occupations) {
          return false
        }
      }
      else {
        if (this.playedOccupations.length < prereqs.occupations) {
          return false
        }
      }
    }

    // Check grain fields
    if (prereqs.grainFields !== undefined) {
      if (this.getGrainFieldCount() < prereqs.grainFields) {
        return false
      }
    }

    // Check sheep
    if (prereqs.sheep !== undefined) {
      if (this.getTotalAnimals('sheep') < prereqs.sheep) {
        return false
      }
    }

    // Check all farmyard used
    if (prereqs.allFarmyardUsed) {
      if (this.getUnusedSpaceCount() > 0) {
        return false
      }
    }

    return true
  }

  canPlayCard(cardId) {
    if (!this.hasCard(cardId)) {
      return false
    }
    if (!this.canAffordCard(cardId)) {
      return false
    }
    if (!this.meetsCardPrereqs(cardId)) {
      return false
    }
    return true
  }

  payCardCost(cardId) {
    const card = this.cards.byId(cardId)
    if (!card || !card.cost) {
      return true
    }

    for (const [resource, amount] of Object.entries(card.cost)) {
      if (resource === 'sheep' || resource === 'boar' || resource === 'cattle') {
        this.removeAnimals(resource, amount)
      }
      else {
        this[resource] -= amount
      }
    }
    return true
  }

  playCard(cardId) {
    if (!this.canPlayCard(cardId)) {
      return false
    }

    const card = this.cards.byId(cardId)
    this.payCardCost(cardId)

    // Move card to appropriate played zone
    if (card.type === 'occupation') {
      card.moveTo(this.zones.byPlayer(this, 'occupations'))
      this.occupationsPlayed++
    }
    else {
      card.moveTo(this.zones.byPlayer(this, 'minorImprovements'))
    }

    return true
  }

  // Get count of all improvements (major + minor)
  getImprovementCount() {
    return this.majorImprovements.length + this.playedMinorImprovements.length
  }

  // Get count of grain fields (fields with grain planted)
  getGrainFieldCount() {
    let count = 0
    for (let row = 0; row < res.constants.farmyardRows; row++) {
      for (let col = 0; col < res.constants.farmyardCols; col++) {
        const space = this.farmyard.grid[row][col]
        if (space.type === 'field' && space.crop === 'grain') {
          count++
        }
      }
    }
    return count
  }

  // Get total pasture spaces
  getPastureSpaceCount() {
    let count = 0
    for (const pasture of this.farmyard.pastures) {
      count += pasture.spaces.length
    }
    return count
  }

  // Get count of unfenced stables
  getUnfencedStableCount() {
    let count = 0
    for (let row = 0; row < res.constants.farmyardRows; row++) {
      for (let col = 0; col < res.constants.farmyardCols; col++) {
        const space = this.farmyard.grid[row][col]
        if (space.hasStable && !this.getPastureAtSpace(row, col)) {
          count++
        }
      }
    }
    return count
  }

  // Get cards that trigger on specific hooks
  getCardsWithHook(hookName) {
    return this.getActiveCards().filter(card => card.hasHook(hookName))
  }

  calculateScore() {
    const state = this.getScoreState()
    return res.calculateTotalScore(state)
  }

  getScoreBreakdown() {
    const state = this.getScoreState()
    return res.getScoreBreakdown(state)
  }

  // ---------------------------------------------------------------------------
  // Card Modifier Hook Helpers
  // ---------------------------------------------------------------------------

  /**
   * Get all active cards (played occupations + minor improvements)
   */
  getActiveCards() {
    const cards = []
    const occZone = this._cardZone('occupations')
    if (occZone) {
      cards.push(...occZone.cardlist())
    }
    const minorZone = this._cardZone('minorImprovements')
    if (minorZone) {
      cards.push(...minorZone.cardlist())
    }
    return cards
  }

  /**
   * Apply modifyPastureCapacity hooks from cards
   */
  applyPastureCapacityModifiers(pasture, baseCapacity) {
    let capacity = baseCapacity
    for (const card of this.getActiveCards()) {
      if (card.hasHook('modifyPastureCapacity')) {
        capacity = card.callHook('modifyPastureCapacity', this, pasture, capacity)
      }
    }
    return capacity
  }

  /**
   * Apply modifyHouseAnimalCapacity hooks from cards
   */
  applyHouseAnimalCapacityModifiers(baseCapacity) {
    for (const card of this.getActiveCards()) {
      if (card.hasHook('modifyHouseAnimalCapacity')) {
        return card.callHook('modifyHouseAnimalCapacity', this)
      }
    }
    return baseCapacity
  }

  /**
   * Apply modifyFenceCost hooks from cards
   */
  applyFenceCostModifiers(fenceCount) {
    for (const card of this.getActiveCards()) {
      if (card.hasHook('modifyFenceCost')) {
        fenceCount = card.callHook('modifyFenceCost', this, fenceCount)
      }
    }
    return fenceCount
  }

  /**
   * Apply modifyImprovementCost hooks from cards
   */
  applyImprovementCostModifiers(cost) {
    let modifiedCost = { ...cost }
    for (const card of this.getActiveCards()) {
      if (card.hasHook('modifyImprovementCost')) {
        modifiedCost = card.callHook('modifyImprovementCost', this, modifiedCost)
      }
    }
    return modifiedCost
  }

  /**
   * Apply modifyAnyCost hooks from cards
   */
  applyAnyCostModifiers(cost) {
    let modifiedCost = { ...cost }
    for (const card of this.getActiveCards()) {
      if (card.hasHook('modifyAnyCost')) {
        modifiedCost = card.callHook('modifyAnyCost', this, modifiedCost)
      }
    }
    return modifiedCost
  }

  /**
   * Check if player can use alternate fence resource (Rammed Clay)
   */
  canUseAlternateFenceResource() {
    for (const card of this.getActiveCards()) {
      if (card.hasHook('modifyFenceCost')) {
        const result = card.callHook('modifyFenceCost')
        if (result && result.alternateResource) {
          return result.alternateResource
        }
      }
    }
    return null
  }

  /**
   * Check if player can renovate directly to stone (Conservator)
   */
  canRenovateDirectlyToStone() {
    for (const card of this.getActiveCards()) {
      if (card.definition.allowDirectStoneRenovation) {
        return true
      }
    }
    return false
  }
}

module.exports = { AgricolaPlayer }
