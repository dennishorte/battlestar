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

  getOccupationCount() {
    return this.playedOccupations.length
  }

  getPlayedOccupations() {
    return this.playedOccupations.map(id => this.game.cards.byId(id).definition)
  }

  getOccupationsInHand() {
    return this.hand.filter(id => {
      const c = this.cards.byId(id)
      return c && c.type === 'occupation'
    })
  }

  getImprovementsInHand() {
    return this.hand.filter(id => {
      const c = this.cards.byId(id)
      return c && c.type === 'minor'
    })
  }

  getPeopleOnAccumulationSpaces() {
    let count = 0
    for (const [, state] of Object.entries(this.game.state.actionSpaces)) {
      if (state.occupiedBy === this.name && state.accumulated !== undefined) {
        count++
      }
    }
    return count
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

    // Virtual fields from cards (Beanfield, Lettuce Patch, etc.)
    // Each entry: { id, cardId, label, cropRestriction, crop, cropCount }
    // cropRestriction: null = any, 'grain', 'vegetables', 'wood'
    this.virtualFields = []

    // Card-based animal holdings (e.g., Feedyard)
    // { cardId: { sheep: 0, boar: 0, cattle: 0 } }
    this.cardAnimals = {}
  }

  // ---------------------------------------------------------------------------
  // Virtual field management
  // ---------------------------------------------------------------------------

  addVirtualField(config) {
    const field = {
      id: config.id || config.cardId,
      cardId: config.cardId,
      label: config.label || config.cardId,
      cropRestriction: config.cropRestriction || null,  // null = any crop, or 'grain', 'vegetables', 'wood'
      crop: null,
      cropCount: 0,
      // Optional callbacks (card IDs to look up for hooks)
      onHarvest: config.onHarvest || null,        // Called each harvest with amount
      onHarvestLast: config.onHarvestLast || null, // Called when last crop removed
      sowingAmount: config.sowingAmount || null,   // Custom sowing amount (default uses constants)
      pastureSpaces: config.pastureSpaces || null,        // space-set key linking to a pasture
      countsAsFieldForScoring: config.countsAsFieldForScoring || false,
    }
    this.virtualFields.push(field)
    return field
  }

  getVirtualField(fieldId) {
    return this.virtualFields.find(f => f.id === fieldId)
  }

  getEmptyVirtualFields() {
    return this.virtualFields.filter(f => !f.crop || f.cropCount === 0)
  }

  getSownVirtualFields() {
    return this.virtualFields.filter(f => f.crop && f.cropCount > 0)
  }

  canSowAnything() {
    const emptyFields = this.getEmptyFields()
    if (emptyFields.length === 0) {
      return false
    }
    if (this.grain >= 1 || this.vegetables >= 1) {
      return true
    }
    // Check if any virtual field accepts non-standard crops the player has
    return this.getEmptyVirtualFields().some(vf => {
      if (vf.cropRestriction === 'wood') {
        return this.wood >= 1
      }
      if (vf.cropRestriction === 'stone') {
        return this.stone >= 1
      }
      return false
    })
  }

  canSowVirtualField(fieldId, cropType) {
    const field = this.getVirtualField(fieldId)
    if (!field) {
      return false
    }
    if (field.crop && field.cropCount > 0) {
      return false  // Already sown
    }
    if (field.cropRestriction && field.cropRestriction !== cropType) {
      return false
    }
    if (this[cropType] < 1) {
      return false
    }
    return true
  }

  sowVirtualField(fieldId, cropType) {
    const field = this.getVirtualField(fieldId)
    if (!field) {
      return false
    }
    if (!this.canSowVirtualField(fieldId, cropType)) {
      return false
    }

    this[cropType] -= 1
    field.crop = cropType

    // Use custom sowing amount if specified, otherwise use defaults
    if (field.sowingAmount) {
      field.cropCount = field.sowingAmount
    }
    else if (cropType === 'grain') {
      field.cropCount = res.constants.sowingGrain
    }
    else if (cropType === 'vegetables') {
      field.cropCount = res.constants.sowingVegetables
    }
    else if (cropType === 'wood') {
      // Wood uses grain sowing amount (like Cherry Orchard)
      field.cropCount = res.constants.sowingGrain
    }
    else if (cropType === 'stone') {
      // Stone uses vegetable sowing amount (like Rock Garden)
      field.cropCount = res.constants.sowingVegetables
    }
    return true
  }

  syncPastureLinkedVirtualFields() {
    const cardId = 'love-for-agriculture-b072'
    if (!this.getActiveCards().some(c => c.id === cardId)) {
      return
    }

    const eligiblePastures = this.farmyard.pastures.filter(p => p.spaces.length <= 2)

    // Build space-set keys for current eligible pastures
    const pastureKeys = new Set()
    for (const p of eligiblePastures) {
      pastureKeys.add(p.spaces.map(s => `${s.row},${s.col}`).sort().join('|'))
    }

    // Remove virtual fields whose pasture no longer exists/eligible (lose crops)
    this.virtualFields = this.virtualFields.filter(vf => {
      if (vf.cardId !== cardId) {
        return true
      }
      return pastureKeys.has(vf.pastureSpaces)
    })

    // Add virtual fields for eligible pastures that don't have one yet
    const existingKeys = new Set(
      this.virtualFields.filter(vf => vf.cardId === cardId).map(vf => vf.pastureSpaces)
    )
    for (const p of eligiblePastures) {
      const key = p.spaces.map(s => `${s.row},${s.col}`).sort().join('|')
      if (!existingKeys.has(key)) {
        const label = p.spaces.length === 1
          ? `Pasture (${p.spaces[0].row},${p.spaces[0].col})`
          : `Pasture (${p.spaces[0].row},${p.spaces[0].col})-(${p.spaces[1].row},${p.spaces[1].col})`
        this.addVirtualField({
          id: `love-pasture-${key}`,
          cardId,
          label,
          pastureSpaces: key,
          countsAsFieldForScoring: true,
        })
      }
    }
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
    for (const card of this.getActiveCards()) {
      if (card.definition.providesRoom) {
        count++
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

  getColumnsWithRooms() {
    const cols = new Set()
    for (let row = 0; row < res.constants.farmyardRows; row++) {
      for (let col = 0; col < res.constants.farmyardCols; col++) {
        if (this.farmyard.grid[row][col].type === 'room') {
          cols.add(col)
        }
      }
    }
    return cols.size
  }

  canBuildRoom(row, col) {
    // Must be empty
    if (!this.isSpaceEmpty(row, col)) {
      return false
    }

    // Future Building Site restriction
    if (this.isRestrictedByFutureBuildingSite(row, col)) {
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
    const cost = this.getRoomCost()
    return this.canAffordCost(cost)
  }

  getRoomCost() {
    let cost = { ...res.buildingCosts.room[this.roomType] }
    cost = this.applyBuildCostModifiers(cost, 'build-room')
    cost = this.applyAnyCostModifiers(cost, 'build-room')
    return cost
  }

  getMultiRoomCost(count) {
    const baseCost = this.getRoomCost()
    const totalCost = {}
    for (const [resource, amount] of Object.entries(baseCost)) {
      totalCost[resource] = amount * count
    }
    return this.applyMultiRoomCostModifiers(totalCost, count, this.roomType)
  }

  applyMultiRoomCostModifiers(totalCost, roomCount, roomType) {
    let cost = { ...totalCost }
    for (const card of this.getActiveCards()) {
      if (card.hasHook('modifyMultiRoomCost')) {
        cost = card.callHook('modifyMultiRoomCost', this, cost, roomCount, roomType)
      }
    }
    return cost
  }

  hasMultiRoomDiscount() {
    return this.getActiveCards().some(card => card.hasHook('modifyMultiRoomCost'))
  }

  // ---------------------------------------------------------------------------
  // Renovation methods
  // ---------------------------------------------------------------------------

  canRenovate(targetType) {
    if (this.cannotRenovate) {
      return false
    }
    const cost = this.getRenovationCost(targetType)
    if (!cost) {
      return false
    }
    if (this.canAffordCost(cost)) {
      return true
    }
    // If no target specified, also check direct stone path (Conservator)
    if (!targetType && this.roomType === 'wood' && this.canRenovateDirectlyToStone()) {
      return this.canRenovate('stone')
    }
    return false
  }

  getRenovationCost(targetType) {
    // If targetType specified, use it; otherwise use standard upgrade path
    let nextType = targetType
    if (!nextType) {
      nextType = res.houseMaterialUpgrades[this.roomType]
    }
    if (!nextType) {
      return null
    }

    // Determine the cost key based on actual renovation path
    let costKey
    if (this.roomType === 'wood' && nextType === 'stone') {
      // Direct wood→stone (Conservator): use clayToStone cost key
      costKey = 'clayToStone'
    }
    else if (this.roomType === 'wood') {
      costKey = 'woodToClay'
    }
    else {
      costKey = 'clayToStone'
    }

    const costPerRoom = res.buildingCosts.renovation[costKey]
    const roomCount = this.getRoomCount()

    const materialType = nextType
    let cost = {
      [materialType]: costPerRoom[materialType] * roomCount,
      reed: costPerRoom.reed,
    }
    cost = this.applyBuildCostModifiers(cost, 'renovate')
    cost = this.applyAnyCostModifiers(cost, 'renovate')
    return cost
  }

  renovate(targetType) {
    if (!this.canRenovate(targetType)) {
      return false
    }

    const cost = this.getRenovationCost(targetType)
    this.payCost(cost)

    const nextType = targetType || res.houseMaterialUpgrades[this.roomType]
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
    // Sown pasture virtual fields (Love for Agriculture) count as fields for scoring
    for (const vf of this.virtualFields) {
      if (vf.countsAsFieldForScoring && vf.crop && vf.cropCount > 0) {
        count++
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
    const fields = this.getFieldSpaces().filter(f => !f.crop || f.cropCount === 0)
    // Include empty virtual fields
    for (const vf of this.getEmptyVirtualFields()) {
      fields.push({ isVirtualField: true, virtualFieldId: vf.id, ...vf })
    }
    return fields
  }

  getSownFields() {
    const fields = this.getFieldSpaces().filter(f => f.crop && f.cropCount > 0)
    // Include sown virtual fields
    for (const vf of this.getSownVirtualFields()) {
      fields.push({ isVirtualField: true, virtualFieldId: vf.id, ...vf })
    }
    return fields
  }

  getGrainInFields() {
    return this.getSownFields()
      .filter(f => f.crop === 'grain')
      .reduce((sum, f) => sum + f.cropCount, 0)
  }

  getVegetablesInFields() {
    return this.getSownFields()
      .filter(f => f.crop === 'vegetables')
      .reduce((sum, f) => sum + f.cropCount, 0)
  }

  canPlowField(row, col) {
    // Must be empty
    if (!this.isSpaceEmpty(row, col)) {
      return false
    }

    // Future Building Site restriction
    if (this.isRestrictedByFutureBuildingSite(row, col)) {
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
    // Must have the seed
    if (this[cropType] < 1) {
      return false
    }

    // Check regular empty fields
    const emptyRegularFields = this.getFieldSpaces().filter(f => !f.crop || f.cropCount === 0)
    if (emptyRegularFields.length > 0) {
      return true
    }

    // Check virtual fields that accept this crop type
    for (const vf of this.getEmptyVirtualFields()) {
      if (!vf.cropRestriction || vf.cropRestriction === cropType) {
        return true
      }
    }

    return false
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
    const harvested = { grain: 0, vegetables: 0, wood: 0, stone: 0 }
    const virtualFieldHarvests = []  // Track virtual field harvests for callbacks

    // Harvest regular fields
    for (const field of this.getFieldSpaces().filter(f => f.crop && f.cropCount > 0)) {
      if (field.cropCount > 0) {
        harvested[field.crop] += 1
        const space = this.getSpace(field.row, field.col)
        space.cropCount -= 1
        if (space.cropCount === 0) {
          space.crop = null
        }
      }
    }

    // Harvest virtual fields
    for (const vf of this.getSownVirtualFields()) {
      const crop = vf.crop
      harvested[crop] += 1
      vf.cropCount -= 1

      const isLast = vf.cropCount === 0
      if (isLast) {
        vf.crop = null
      }

      // Track for callbacks
      virtualFieldHarvests.push({
        fieldId: vf.id,
        cardId: vf.cardId,
        crop,
        amount: 1,
        isLast,
        onHarvest: vf.onHarvest,
        onHarvestLast: vf.onHarvestLast,
      })
    }

    this.addResource('grain', harvested.grain)
    this.addResource('vegetables', harvested.vegetables)
    this.addResource('wood', harvested.wood)
    this.addResource('stone', harvested.stone)

    return { harvested, virtualFieldHarvests }
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

    // Future Building Site restriction (only for empty spaces, not existing pastures)
    if (space.type === 'empty' && this.isRestrictedByFutureBuildingSite(row, col)) {
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

  hasStableAt({ row, col }) {
    const space = this.getSpace(row, col)
    return space && space.hasStable === true
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

  getFencesInSupply() {
    return res.constants.maxFences - this.getFenceCount() - (this.usedFences || 0)
  }

  useFenceFromSupply(count = 1) {
    this.usedFences = (this.usedFences || 0) + count
  }

  getPastureCount() {
    return this.farmyard.pastures.length
  }

  hasPastureAdjacentToHouse() {
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

  getAdjacentRoomPairCount() {
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

    // Pay wood (accounting for fence cost modifiers)
    const woodCost = this.applyFenceCostModifiers(fenceSegments.length)
    this.payCost({ wood: woodCost })

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
    this.syncPastureLinkedVirtualFields()
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

  // Get the two corner points of a fence segment as string keys
  _getFenceCorners(fence) {
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

  // Future Building Site: check if a space is restricted
  isRestrictedByFutureBuildingSite(row, col) {
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
    if (this.farmyard.fences.length > 0 && fences.length > 0) {
      const existingCorners = new Set()
      for (const f of this.farmyard.fences) {
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

    // Check if player has enough wood (accounting for fence cost modifiers)
    const woodCost = this.applyFenceCostModifiers(fences.length)
    if (woodCost > this.wood) {
      return {
        valid: false,
        error: `Need ${woodCost} wood, have ${this.wood}`,
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

    // Pay wood cost (accounting for fence cost modifiers)
    const woodCost = this.applyFenceCostModifiers(validation.fencesNeeded)
    this.payCost({ wood: woodCost })

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

    // Count on card-based holders
    for (const holding of this.getAnimalHoldingCards()) {
      count += holding.animals[type] || 0
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

    // Card-based holders
    for (const holding of this.getAnimalHoldingCards()) {
      // Skip if this card doesn't allow this animal type
      if (holding.allowedTypes && !holding.allowedTypes.includes(animalType)) {
        continue
      }

      if (holding.perTypeLimits) {
        // Per-type limits: capacity for this type is its specific limit
        const limit = holding.perTypeLimits[animalType] || 0
        const current = holding.animals[animalType] || 0
        capacity += Math.max(0, limit - current)
      }
      else if (holding.sameTypeOnly) {
        // Same-type-only: skip if card already has a different type
        const existingType = Object.entries(holding.animals).find(([, n]) => n > 0)?.[0]
        if (existingType && existingType !== animalType) {
          continue
        }
        const totalOnCard = Object.values(holding.animals).reduce((s, n) => s + n, 0)
        capacity += Math.max(0, holding.capacity - totalOnCard)
      }
      else if (holding.mixedTypes) {
        // Mixed types: capacity minus animals of other types
        const otherCount = Object.entries(holding.animals)
          .filter(([t]) => t !== animalType)
          .reduce((sum, [, n]) => sum + n, 0)
        capacity += Math.max(0, holding.capacity - otherCount)
      }
      else {
        // Single type (non-mixed, no per-type limits)
        const totalOnCard = Object.values(holding.animals).reduce((s, n) => s + n, 0)
        capacity += Math.max(0, holding.capacity - totalOnCard)
      }
    }

    return capacity
  }

  /**
   * Get all locations where animals can be placed, with capacity info.
   * Used by the animal placement modal.
   * @returns {Array} Array of location objects with placement info
   */
  getAnimalPlacementLocations() {
    const locations = []

    // House (pet slot)
    const houseCapacity = this.applyHouseAnimalCapacityModifiers(1)
    locations.push({
      id: 'house',
      type: 'house',
      name: 'House',
      currentAnimalType: this.pet,
      currentCount: this.pet ? 1 : 0,
      maxCapacity: houseCapacity,
    })

    // Pastures
    for (const pasture of this.farmyard.pastures) {
      const hasStable = pasture.spaces.some(s => {
        const space = this.getSpace(s.row, s.col)
        return space && space.hasStable
      })

      locations.push({
        id: `pasture-${pasture.id}`,
        type: 'pasture',
        name: `Pasture (${pasture.spaces.length} space${pasture.spaces.length > 1 ? 's' : ''})`,
        spaces: pasture.spaces,
        hasStable,
        currentAnimalType: pasture.animalType,
        currentCount: pasture.animalCount,
        maxCapacity: this.getPastureCapacity(pasture),
      })
    }

    // Unfenced stables
    for (const stable of this.getStableSpaces()) {
      if (!this.getPastureAtSpace(stable.row, stable.col)) {
        const space = this.getSpace(stable.row, stable.col)
        locations.push({
          id: `stable-${stable.row}-${stable.col}`,
          type: 'unfenced-stable',
          name: 'Unfenced Stable',
          space: { row: stable.row, col: stable.col },
          currentAnimalType: space.animal || null,
          currentCount: space.animal ? 1 : 0,
          maxCapacity: 1,
        })
      }
    }

    // Card-based animal holders
    for (const holding of this.getAnimalHoldingCards()) {
      const loc = {
        id: `card-${holding.cardId}`,
        type: 'card',
        name: holding.name,
        cardId: holding.cardId,
        mixedTypes: holding.mixedTypes,
        sameTypeOnly: holding.sameTypeOnly,
        allowedTypes: holding.allowedTypes,
        perTypeLimits: holding.perTypeLimits,
        currentAnimals: { ...holding.animals },
        currentCount: this.getCardAnimalTotal(holding.cardId),
        maxCapacity: holding.capacity,
      }
      // For sameTypeOnly cards, derive currentAnimalType
      if (holding.sameTypeOnly) {
        loc.currentAnimalType = Object.entries(holding.animals).find(([, n]) => n > 0)?.[0] || null
      }
      locations.push(loc)
    }

    return locations
  }

  /**
   * Calculate available capacity at each location for each animal type.
   * A location can only hold one type - if it has animals, only that type can be added.
   * @returns {Array} Locations with availableFor map added
   */
  getAnimalPlacementLocationsWithAvailability() {
    const locations = this.getAnimalPlacementLocations()

    for (const loc of locations) {
      const available = loc.maxCapacity - loc.currentCount
      loc.availableFor = {}

      if (loc.perTypeLimits) {
        // Per-type limits: each type has its own capacity
        for (const animalType of res.animalTypes) {
          const limit = loc.perTypeLimits[animalType] || 0
          const current = loc.currentAnimals?.[animalType] || 0
          loc.availableFor[animalType] = Math.max(0, limit - current)
        }
      }
      else if (loc.sameTypeOnly) {
        // Same-type-only: if has a current type, only that type; if empty, all allowed
        const currentType = loc.currentAnimalType
        for (const animalType of res.animalTypes) {
          if (loc.allowedTypes && !loc.allowedTypes.includes(animalType)) {
            loc.availableFor[animalType] = 0
          }
          else if (currentType && currentType !== animalType) {
            loc.availableFor[animalType] = 0
          }
          else {
            loc.availableFor[animalType] = available
          }
        }
      }
      else if (loc.mixedTypes) {
        // Mixed-type holders share a capacity pool across all types
        for (const animalType of res.animalTypes) {
          if (loc.allowedTypes && !loc.allowedTypes.includes(animalType)) {
            loc.availableFor[animalType] = 0
          }
          else {
            loc.availableFor[animalType] = available
          }
        }
      }
      else {
        for (const animalType of res.animalTypes) {
          if (loc.allowedTypes && !loc.allowedTypes.includes(animalType)) {
            loc.availableFor[animalType] = 0
          }
          else if (loc.currentAnimalType === null || loc.currentAnimalType === undefined) {
            // Empty location - can place any allowed type
            loc.availableFor[animalType] = available
          }
          else if (loc.currentAnimalType === animalType) {
            // Same type - can add more
            loc.availableFor[animalType] = available
          }
          else {
            // Different type - can't mix
            loc.availableFor[animalType] = 0
          }
        }
      }
    }

    return locations
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

    // Then try card-based holders
    for (const holding of this.getAnimalHoldingCards()) {
      if (remaining <= 0) {
        break
      }
      // Skip if this card doesn't allow this animal type
      if (holding.allowedTypes && !holding.allowedTypes.includes(animalType)) {
        continue
      }
      // Skip same-type-only cards with a different type present
      if (holding.sameTypeOnly) {
        const existingType = Object.entries(holding.animals).find(([, n]) => n > 0)?.[0]
        if (existingType && existingType !== animalType) {
          continue
        }
      }

      let canAdd
      if (holding.perTypeLimits) {
        const limit = holding.perTypeLimits[animalType] || 0
        const current = holding.animals[animalType] || 0
        canAdd = limit - current
      }
      else {
        const totalOnCard = Object.values(holding.animals).reduce((s, n) => s + n, 0)
        canAdd = holding.capacity - totalOnCard
      }

      const toAdd = Math.min(remaining, Math.max(0, canAdd))
      if (toAdd > 0) {
        this.addCardAnimal(holding.cardId, animalType, toAdd)
        remaining -= toAdd
      }
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

    // Remove from card-based holders
    for (const holding of this.getAnimalHoldingCards()) {
      if (remaining <= 0) {
        break
      }
      const onCard = holding.animals[animalType] || 0
      const toRemove = Math.min(remaining, onCard)
      if (toRemove > 0) {
        this.removeCardAnimal(holding.cardId, animalType, toRemove)
        remaining -= toRemove
      }
    }

    // Remove pet
    if (remaining > 0 && this.pet === animalType) {
      this.pet = null
      remaining--
    }

    return remaining === 0
  }

  // ---------------------------------------------------------------------------
  // Card-based animal holding
  // ---------------------------------------------------------------------------

  getCardAnimals(cardId) {
    return this.cardAnimals[cardId] || { sheep: 0, boar: 0, cattle: 0 }
  }

  getCardAnimalTotal(cardId) {
    const animals = this.getCardAnimals(cardId)
    return animals.sheep + animals.boar + animals.cattle
  }

  addCardAnimal(cardId, type, count = 1) {
    if (!this.cardAnimals[cardId]) {
      this.cardAnimals[cardId] = { sheep: 0, boar: 0, cattle: 0 }
    }
    this.cardAnimals[cardId][type] += count
  }

  removeCardAnimal(cardId, type, count = 1) {
    if (!this.cardAnimals[cardId]) {
      return
    }
    this.cardAnimals[cardId][type] = Math.max(0, this.cardAnimals[cardId][type] - count)
  }

  getAnimalHoldingCards() {
    const holdings = []
    const cards = this.getActiveCards()
    for (const card of cards) {
      const def = card.definition

      // holdsAnimalsPerPasture: capacity = number of pastures, always mixed
      if (def.holdsAnimalsPerPasture) {
        holdings.push({
          card,
          cardId: card.id,
          name: card.name,
          capacity: this.getPastureCount(),
          mixedTypes: true,
          sameTypeOnly: false,
          allowedTypes: null,
          perTypeLimits: null,
          animals: { ...this.getCardAnimals(card.id) },
        })
        continue
      }

      const holdsAnimals = def.holdsAnimals
      if (holdsAnimals === undefined || holdsAnimals === null) {
        continue
      }

      let capacity = 0
      let mixedTypes = !!def.mixedAnimals
      let sameTypeOnly = !!def.sameTypeOnly
      let allowedTypes = null
      let perTypeLimits = null

      if (typeof holdsAnimals === 'number') {
        // Static capacity (e.g., Stockyard: 3)
        capacity = holdsAnimals
      }
      else if (typeof holdsAnimals === 'boolean') {
        // Dynamic capacity via getAnimalCapacity (e.g., Petting Zoo)
        capacity = def.getAnimalCapacity(this.game, this)
      }
      else if (typeof holdsAnimals === 'object') {
        const entries = Object.entries(holdsAnimals)
        const hasBooleanValues = entries.some(([, v]) => v === true)

        if (hasBooleanValues) {
          // Dynamic capacity via getAnimalCapacity
          capacity = def.getAnimalCapacity(this.game, this)
          const hasAnyKey = entries.some(([k]) => k === 'any')
          if (!hasAnyKey) {
            // Type-restricted (e.g., { sheep: true })
            allowedTypes = entries.map(([k]) => k)
          }
        }
        else {
          // All values are numbers — per-type static limits (e.g., { sheep: 1, boar: 1, cattle: 1 })
          perTypeLimits = { ...holdsAnimals }
          capacity = Object.values(holdsAnimals).reduce((sum, n) => sum + n, 0)
          allowedTypes = Object.keys(holdsAnimals)
          if (allowedTypes.length > 1) {
            mixedTypes = true
          }
        }
      }

      holdings.push({
        card,
        cardId: card.id,
        name: card.name,
        capacity,
        mixedTypes,
        sameTypeOnly,
        allowedTypes,
        perTypeLimits,
        animals: { ...this.getCardAnimals(card.id) },
      })
    }
    return holdings
  }

  /**
   * Validate and apply a placement plan from the animal placement modal.
   * @param {Object} plan - The placement plan
   * @param {Array} plan.placements - Array of { locationId, animalType, count }
   * @param {Object} plan.overflow - { cook: { sheep: n, ... }, release: { sheep: n, ... } }
   * @param {Object} plan.incoming - { sheep: n, boar: n, cattle: n } - animals to place
   * @returns {Object} { success: boolean, error?: string, cooked?: { food: n } }
   */
  applyAnimalPlacements(plan) {
    const { placements, overflow, incoming } = plan

    // Build a map of location id -> location data for validation
    const locations = this.getAnimalPlacementLocationsWithAvailability()
    const locationMap = {}
    for (const loc of locations) {
      locationMap[loc.id] = loc
    }

    // Track what we're placing at each location
    const placementsByLocation = {}
    for (const p of placements) {
      if (!placementsByLocation[p.locationId]) {
        placementsByLocation[p.locationId] = {}
      }
      if (!placementsByLocation[p.locationId][p.animalType]) {
        placementsByLocation[p.locationId][p.animalType] = 0
      }
      placementsByLocation[p.locationId][p.animalType] += p.count
    }

    // Validate each placement
    for (const [locId, animalCounts] of Object.entries(placementsByLocation)) {
      const loc = locationMap[locId]
      if (!loc) {
        return { success: false, error: `Unknown location: ${locId}` }
      }

      for (const [animalType, count] of Object.entries(animalCounts)) {
        if (count > loc.availableFor[animalType]) {
          return {
            success: false,
            error: `Cannot place ${count} ${animalType} at ${loc.name} (only ${loc.availableFor[animalType]} available)`,
          }
        }
      }

      const types = Object.keys(animalCounts).filter(t => animalCounts[t] > 0)

      if (loc.perTypeLimits) {
        // Per-type limits: validate each type against its specific limit
        for (const [animalType, count] of Object.entries(animalCounts)) {
          const limit = loc.perTypeLimits[animalType] || 0
          const current = loc.currentAnimals?.[animalType] || 0
          if (count + current > limit) {
            return {
              success: false,
              error: `Cannot place ${count} ${animalType} at ${loc.name} (limit ${limit}, current ${current})`,
            }
          }
        }
      }
      else if (loc.sameTypeOnly) {
        // Same-type-only: no mixing multiple types
        const existingType = loc.currentAnimalType
        if (types.length > 1) {
          return { success: false, error: `Cannot mix animal types at ${loc.name}` }
        }
        const placingType = types[0]
        if (placingType && existingType && existingType !== placingType) {
          return {
            success: false,
            error: `${loc.name} already has ${existingType}, cannot add ${placingType}`,
          }
        }
        const totalPlacing = Object.values(animalCounts).reduce((s, n) => s + n, 0)
        const available = loc.maxCapacity - loc.currentCount
        if (totalPlacing > available) {
          return {
            success: false,
            error: `Cannot place ${totalPlacing} animals at ${loc.name} (only ${available} available)`,
          }
        }
      }
      else if (loc.mixedTypes) {
        // Mixed-type holders: check total across all types doesn't exceed capacity
        const totalPlacing = Object.values(animalCounts).reduce((s, n) => s + n, 0)
        const available = loc.maxCapacity - loc.currentCount
        if (totalPlacing > available) {
          return {
            success: false,
            error: `Cannot place ${totalPlacing} animals at ${loc.name} (only ${available} available)`,
          }
        }
      }
      else {
        // Check that we're not mixing types at a location
        if (types.length > 1) {
          return { success: false, error: `Cannot mix animal types at ${loc.name}` }
        }

        // Check that we're not placing a different type than what's already there
        const placingType = types[0]
        if (placingType && loc.currentAnimalType && loc.currentAnimalType !== placingType) {
          return {
            success: false,
            error: `${loc.name} already has ${loc.currentAnimalType}, cannot add ${placingType}`,
          }
        }
      }
    }

    // Validate that all incoming animals are accounted for
    const totalPlaced = { sheep: 0, boar: 0, cattle: 0 }
    for (const p of placements) {
      totalPlaced[p.animalType] = (totalPlaced[p.animalType] || 0) + p.count
    }

    const totalCooked = overflow?.cook || {}
    const totalReleased = overflow?.release || {}

    for (const animalType of res.animalTypes) {
      const incomingCount = incoming[animalType] || 0
      const placed = totalPlaced[animalType] || 0
      const cooked = totalCooked[animalType] || 0
      const released = totalReleased[animalType] || 0

      if (placed + cooked + released !== incomingCount) {
        return {
          success: false,
          error: `Must account for all ${incomingCount} ${animalType} (placed: ${placed}, cooked: ${cooked}, released: ${released})`,
        }
      }
    }

    // All validation passed - apply the placements
    for (const p of placements) {
      if (p.count <= 0) {
        continue
      }

      const loc = locationMap[p.locationId]

      if (loc.type === 'house') {
        // Pet placement
        this.pet = p.animalType
      }
      else if (loc.type === 'pasture') {
        // Find the pasture and add animals
        const pastureId = parseInt(p.locationId.replace('pasture-', ''))
        const pasture = this.farmyard.pastures.find(pa => pa.id === pastureId)
        if (pasture) {
          if (!pasture.animalType) {
            pasture.animalType = p.animalType
            pasture.animalCount = p.count
          }
          else {
            pasture.animalCount += p.count
          }
        }
      }
      else if (loc.type === 'unfenced-stable') {
        // Find the stable and set its animal
        const [, row, col] = p.locationId.split('-').map(Number)
        const space = this.getSpace(row, col)
        if (space) {
          space.animal = p.animalType
        }
      }
      else if (loc.type === 'card') {
        this.addCardAnimal(loc.cardId, p.animalType, p.count)
      }
    }

    // Apply cooking
    let totalFood = 0
    const cookingImp = this.getCookingImprovement()
    if (cookingImp) {
      for (const [animalType, count] of Object.entries(totalCooked)) {
        if (count > 0) {
          const food = res.calculateCookingFood(cookingImp, animalType, count)
          this.addResource('food', food)
          totalFood += food
        }
      }
    }

    // Released animals just disappear (no action needed)

    return {
      success: true,
      cooked: totalFood > 0 ? { food: totalFood } : null,
    }
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
      if (this.resourcesGainedThisRound) {
        this.resourcesGainedThisRound[type] = (this.resourcesGainedThisRound[type] || 0) + amount
      }
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

  isFirstWorkerThisRound() {
    return this.familyMembers - this.availableWorkers === 1
  }

  getNewbornsReturningHome() {
    return this.newborns.length
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
    const entries = Object.entries(cost).filter(([, amount]) => amount > 0)
    if (entries.length === 0) {
      return
    }

    for (const [resource, amount] of entries) {
      this.removeResource(resource, amount)
    }

    const parts = []
    const args = {}
    for (const [resource, amount] of entries) {
      const key = `resource_${resource}`
      args[key] = { amount, type: resource }
      parts.push(`{${key}}`)
    }

    this.log.indent()
    this.log.add({
      template: `spent ${parts.join(', ')}`,
      args,
      classes: ['cost-spent'],
    })
    this.log.outdent()
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
    // Note: newborns are cleared at end of round (after harvest), not here
  }

  clearNewborns() {
    this.newborns = []
  }

  canAdoptNewborn() {
    return this.newborns.length > 0 && this.food >= 1
  }

  adoptNewborn() {
    if (!this.canAdoptNewborn()) {
      return false
    }

    // Pay 1 food
    this.removeResource('food', 1)

    // Remove newborn status (they now need 2 food during harvest, not 1)
    this.newborns.pop()

    // Make them available as a worker
    this.availableWorkers += 1

    return true
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
      this.removeResource('food', this.food)
      this.beggingCards += shortage
    }
    else {
      this.removeResource('food', required)
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
    if (this.majorImprovements.some(id => {
      const imp = this.cards.byId(id)
      return imp && imp.abilities && imp.abilities.canBake
    })) {
      return true
    }
    return this.playedMinorImprovements.some(id => {
      const card = this.cards.byId(id)
      return card && card.definition.bakingConversion
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
    // Fall back to minor improvement with bakingConversion
    for (const id of this.playedMinorImprovements) {
      const card = this.cards.byId(id)
      if (card && card.definition.bakingConversion) {
        return {
          name: card.name,
          abilities: { canBake: true, bakingRate: card.definition.bakingConversion.rate },
        }
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
      this.addResource('food', food)
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
      this.removeResource('vegetables', toCook)
      const food = res.calculateCookingFood(imp, 'vegetables', toCook)
      this.addResource('food', food)
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
      this.removeResource('grain', toBake)
      const food = res.calculateBakingFood(imp, toBake)
      this.addResource('food', food)
      return food
    }
    return 0
  }

  // Converts grain or vegetables to food without improvement (1:1 ratio)
  convertToFood(resourceType, count = 1) {
    const available = this[resourceType]
    const toConvert = Math.min(count, available)

    if (toConvert > 0) {
      this.removeResource(resourceType, toConvert)
      this.addResource('food', toConvert)
      return toConvert
    }
    return 0
  }

  // ---------------------------------------------------------------------------
  // Major Improvement methods
  // ---------------------------------------------------------------------------

  getMajorImprovementCost(improvementId) {
    const imp = this.cards.byId(improvementId)
    if (!imp || !imp.cost) {
      return {}
    }
    let cost = { ...imp.cost }
    cost = this.applyImprovementCostModifiers(cost)
    cost = this.applyAnyCostModifiers(cost, 'major-improvement')
    return cost
  }

  _getWildcardAsFireplace() {
    for (const minorId of this.playedMinorImprovements) {
      const card = this.cards.byId(minorId)
      if (card && card.definition.wildcardRoles
          && card.definition.wildcardRoles.includes('fireplace')) {
        return minorId
      }
    }
    return null
  }

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
        return true
      }  // Upgrade = return old card, free

      const needsFireplace = imp.upgradesFrom.some(id => id.startsWith('fireplace'))
      if (needsFireplace && this._getWildcardAsFireplace()) {
        return true  // Wildcard as fireplace trade-in, also free
      }
    }

    // Normal purchase
    const cost = this.getMajorImprovementCost(improvementId)
    return this.canAffordCost(cost)
  }

  buyMajorImprovement(improvementId) {
    const imp = this.cards.byId(improvementId)
    if (!imp) {
      return { upgraded: false }
    }

    if (!this.canBuyMajorImprovement(improvementId)) {
      return { upgraded: false }
    }

    let upgraded = false

    // Handle upgrade - move old card back to common zone
    const commonMajorZone = this.zones.byId('common.majorImprovements')
    if (imp.upgradesFrom && imp.upgradesFrom.length > 0) {
      // Try normal upgrade first
      for (const fromId of imp.upgradesFrom) {
        if (this.majorImprovements.includes(fromId)) {
          const oldCard = this.cards.byId(fromId)
          oldCard.moveTo(commonMajorZone)
          upgraded = true
          break
        }
      }
      // Try wildcard-as-fireplace trade-in
      if (!upgraded) {
        const needsFireplace = imp.upgradesFrom.some(id => id.startsWith('fireplace'))
        const wildcardId = needsFireplace && this._getWildcardAsFireplace()
        if (wildcardId) {
          const wildcardCard = this.cards.byId(wildcardId)
          wildcardCard.moveTo(this.zones.byId('common.supply'))
          upgraded = true
        }
      }
    }

    // Move improvement to player's zone (cost is paid by caller after logging)
    imp.moveTo(this.zones.byPlayer(this, 'majorImprovements'))

    return { upgraded }
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
    let fields = this.getFieldCount()
    for (const cardId of this.playedMinorImprovements) {
      const card = this.cards.byId(cardId)
      if (card && card.definition.wildcardRoles
          && card.definition.wildcardRoles.includes('field')) {
        fields++
      }
    }
    return {
      fields,
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
        points += card.callHook('getEndGamePoints', this, this.game)
      }
      if (card && card.vps) {
        points += card.vps
      }
    }

    // Bonus from occupations
    for (const id of this.playedOccupations) {
      const card = this.cards.byId(id)
      if (card && card.hasHook('getEndGamePoints')) {
        points += card.callHook('getEndGamePoints', this, this.game)
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

        if (bonusPoints > 0) {
          const costs = imp.abilities.endGameBonus.spendingCosts
          let resourcesSpent = costs[Math.min(bonusPoints, costs.length) - 1]
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

  canAffordSingleCost(cost) {
    for (const [resource, amount] of Object.entries(cost)) {
      if (resource === 'sheep' || resource === 'boar' || resource === 'cattle') {
        if (this.getTotalAnimals(resource) < amount) {
          return false
        }
      }
      else if ((this[resource] || 0) < amount) {
        return false
      }
    }
    return true
  }

  canAffordCard(cardId) {
    const card = this.cards.byId(cardId)
    if (!card) {
      return false
    }

    if (!card.cost) {
      return true
    }

    const options = this.getCardCostOptions(card)
    return options.some(opt => this.canAffordSingleCost(opt.cost))
  }

  getAffordableCardCostOptions(cardId) {
    const card = this.cards.byId(cardId)
    if (!card || !card.cost) {
      return [{ cost: {}, label: 'free' }]
    }
    const options = this.getCardCostOptions(card)
    return options.filter(opt => this.canAffordSingleCost(opt.cost))
  }

  meetsCardPrereqs(cardId) {
    if (this._meetsCardPrereqsCore(cardId)) {
      return true
    }

    for (const minorId of this.playedMinorImprovements) {
      const card = this.cards.byId(minorId)
      if (!card || !card.definition.wildcardRoles) {
        continue
      }
      for (const role of card.definition.wildcardRoles) {
        if (this._meetsCardPrereqsCore(cardId, role)) {
          return true
        }
      }
    }
    return false
  }

  _meetsCardPrereqsCore(cardId, wildcardRole = null) {
    const card = this.cards.byId(cardId)
    if (!card || !card.prereqs) {
      return true
    }

    const occBonus = wildcardRole === 'occupation' ? 1 : 0
    const fieldBonus = wildcardRole === 'field' ? 1 : 0
    const majorBonus = wildcardRole === 'fireplace' ? 1 : 0

    const prereqs = card.prereqs

    // --- Occupation checks ---
    const occCount = this.playedOccupations.length + occBonus
    if (prereqs.occupations !== undefined) {
      if (prereqs.occupationsExact) {
        if (occCount !== prereqs.occupations) {
          return false
        }
      }
      else if (prereqs.occupationsAtMost) {
        if (occCount > prereqs.occupations) {
          return false
        }
      }
      else {
        if (occCount < prereqs.occupations) {
          return false
        }
      }
    }
    if (prereqs.exactlyOccupations !== undefined) {
      if (occCount !== prereqs.exactlyOccupations) {
        return false
      }
    }
    // Standalone occupationsAtMost (used by StableManure/SocialBenefits without occupations key)
    if (prereqs.occupationsAtMost !== undefined && prereqs.occupations === undefined) {
      if (occCount > prereqs.occupationsAtMost) {
        return false
      }
    }
    if (prereqs.noOccupations) {
      if (occCount > 0) {
        return false
      }
    }
    if (prereqs.occupationsInHand !== undefined) {
      const occInHand = this.hand.filter(id => {
        const c = this.cards.byId(id)
        return c && c.type === 'occupation'
      })
      if (occInHand.length < prereqs.occupationsInHand) {
        return false
      }
    }

    // --- Field checks ---
    const fieldCount = this.getFieldCountForPrereqs() + fieldBonus
    if (prereqs.fields !== undefined) {
      if (fieldCount < prereqs.fields) {
        return false
      }
    }
    if (prereqs.fieldsExactly !== undefined) {
      if (fieldCount !== prereqs.fieldsExactly) {
        return false
      }
    }
    if (prereqs.grainFields !== undefined) {
      if (this.getGrainFieldCount() < prereqs.grainFields) {
        return false
      }
    }
    if (prereqs.vegetableFields !== undefined) {
      if (this.getVegetableFieldCount() < prereqs.vegetableFields) {
        return false
      }
    }
    if (prereqs.plantedFields !== undefined) {
      if (this.getSownFields().length < prereqs.plantedFields) {
        return false
      }
    }
    if (prereqs.emptyFields !== undefined) {
      if (this.getEmptyFields().length < prereqs.emptyFields) {
        return false
      }
    }
    if (prereqs.unplantedFields !== undefined) {
      if (this.getEmptyFields().length < prereqs.unplantedFields) {
        return false
      }
    }
    if (prereqs.noFields) {
      if (fieldCount > 0) {
        return false
      }
    }
    if (prereqs.noGrainFields) {
      if (this.getGrainFieldCount() > 0) {
        return false
      }
    }

    // --- Pasture and stable checks ---
    if (prereqs.pastures !== undefined) {
      if (prereqs.pasturesExact) {
        if (this.getPastureCount() !== prereqs.pastures) {
          return false
        }
      }
      else {
        if (this.getPastureCount() < prereqs.pastures) {
          return false
        }
      }
    }
    if (prereqs.stables !== undefined) {
      if (this.getStableCount() < prereqs.stables) {
        return false
      }
    }
    if (prereqs.fences !== undefined) {
      if (this.getFenceCount() < prereqs.fences) {
        return false
      }
    }
    if (prereqs.fencesInSupply !== undefined) {
      const remaining = res.constants.maxFences - this.getFenceCount()
      if (remaining < prereqs.fencesInSupply) {
        return false
      }
    }

    // --- Room checks ---
    if (prereqs.rooms !== undefined) {
      if (this.getRoomCount() < prereqs.rooms) {
        return false
      }
    }
    if (prereqs.roomCount !== undefined) {
      if (prereqs.roomCountExact) {
        if (this.getRoomCount() !== prereqs.roomCount) {
          return false
        }
      }
      else {
        if (this.getRoomCount() < prereqs.roomCount) {
          return false
        }
      }
    }
    if (prereqs.houseType !== undefined) {
      if (Array.isArray(prereqs.houseType)) {
        if (!prereqs.houseType.includes(this.roomType)) {
          return false
        }
      }
      else {
        if (this.roomType !== prereqs.houseType) {
          return false
        }
      }
    }

    // --- Animal checks ---
    if (prereqs.sheep !== undefined) {
      if (this.getTotalAnimals('sheep') < prereqs.sheep) {
        return false
      }
    }
    if (prereqs.sheepExactly !== undefined) {
      if (this.getTotalAnimals('sheep') !== prereqs.sheepExactly) {
        return false
      }
    }
    if (prereqs.boar !== undefined) {
      if (this.getTotalAnimals('boar') < prereqs.boar) {
        return false
      }
    }
    if (prereqs.cattle !== undefined) {
      if (this.getTotalAnimals('cattle') < prereqs.cattle) {
        return false
      }
    }
    if (prereqs.animals !== undefined) {
      const total = this.getTotalAnimals('sheep') + this.getTotalAnimals('boar') + this.getTotalAnimals('cattle')
      if (total < prereqs.animals) {
        return false
      }
    }
    if (prereqs.animalTypes !== undefined) {
      let types = 0
      if (this.getTotalAnimals('sheep') > 0) {
        types++
      }
      if (this.getTotalAnimals('boar') > 0) {
        types++
      }
      if (this.getTotalAnimals('cattle') > 0) {
        types++
      }
      if (types < prereqs.animalTypes) {
        return false
      }
    }
    if (prereqs.allAnimalTypes) {
      if (this.getTotalAnimals('sheep') === 0 || this.getTotalAnimals('boar') === 0 || this.getTotalAnimals('cattle') === 0) {
        return false
      }
    }
    if (prereqs.noAnimals) {
      const total = this.getTotalAnimals('sheep') + this.getTotalAnimals('boar') + this.getTotalAnimals('cattle')
      if (total > 0) {
        return false
      }
    }
    if (prereqs.noSheep) {
      if (this.getTotalAnimals('sheep') > 0) {
        return false
      }
    }

    // --- Resource checks ---
    if (prereqs.grain !== undefined) {
      if (this.grain < prereqs.grain) {
        return false
      }
    }
    if (prereqs.clay !== undefined) {
      if (this.clay < prereqs.clay) {
        return false
      }
    }
    if (prereqs.reed !== undefined) {
      if (this.reed < prereqs.reed) {
        return false
      }
    }
    if (prereqs.stone !== undefined) {
      if (this.stone < prereqs.stone) {
        return false
      }
    }
    if (prereqs.noGrain) {
      if (this.grain > 0) {
        return false
      }
    }

    // --- People checks ---
    if (prereqs.maxPeople !== undefined) {
      if (this.familyMembers > prereqs.maxPeople) {
        return false
      }
    }

    // --- Improvement checks ---
    if (prereqs.improvements !== undefined) {
      if (this.getImprovementCount() < prereqs.improvements) {
        return false
      }
    }
    if (prereqs.majorImprovements !== undefined) {
      if (this.majorImprovements.length + majorBonus < prereqs.majorImprovements) {
        return false
      }
    }

    // --- Farmyard usage checks ---
    if (prereqs.allFarmyardUsed) {
      if (this.getUnusedSpaceCount() > 0) {
        return false
      }
    }
    if (prereqs.unusedFarmyard !== undefined) {
      if (this.getUnusedSpaceCount() < prereqs.unusedFarmyard) {
        return false
      }
    }
    if (prereqs.unusedFarmyardAtMost !== undefined) {
      if (this.getUnusedSpaceCount() > prereqs.unusedFarmyardAtMost) {
        return false
      }
    }

    // --- Round checks ---
    if (prereqs.maxRound !== undefined) {
      if (this.game.state.round > prereqs.maxRound) {
        return false
      }
    }
    if (prereqs.minRound !== undefined) {
      if (this.game.state.round < prereqs.minRound) {
        return false
      }
    }
    if (prereqs.roundIn !== undefined) {
      if (!prereqs.roundIn.includes(this.game.state.round)) {
        return false
      }
    }

    // --- Person on action space checks ---
    if (prereqs.personOnFishing) {
      const fishingSpace = this.game.state.actionSpaces['fishing']
      if (!fishingSpace || fishingSpace.occupiedBy !== this.name) {
        return false
      }
    }

    // --- Building resource checks ---
    if (prereqs.buildingResourcesInSupply !== undefined) {
      const total = this.wood + this.clay + this.reed + this.stone
      if (total < prereqs.buildingResourcesInSupply) {
        return false
      }
    }

    // --- Pasture space checks ---
    if (prereqs.pastureSpacesGteRound) {
      const totalPastureSpaces = this.farmyard.pastures.reduce((sum, p) => sum + p.spaces.length, 0)
      if (totalPastureSpaces < this.game.state.round) {
        return false
      }
    }

    // --- Deferred prereq checks (complex game-state checks not yet implemented) ---
    // TODO: bakingImprovement, cookingImprovement, hasPotteryOrUpgrade,
    //   hasFireplaceAndCookingHearth, returnFireplaceOrCookingHearth, returnMajor,
    //   fieldsInLShape, personOnAction, personYetToPlace,
    //   noPeopleInHouse, fencedStables, woodGteRound,
    //   cardsInPlay, maxCardsInPlay, exactlyAdults, majorImprovement (specific card),
    //   roundsLeftGreaterThanUnusedSpaces

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

  payCardCost(cardId, chosenCost) {
    const card = this.cards.byId(cardId)
    if (!card || !card.cost) {
      return true
    }

    const cost = chosenCost || this.getCardCost(card)
    const animalCost = {}
    const resourceCost = {}
    for (const [resource, amount] of Object.entries(cost)) {
      if (resource === 'sheep' || resource === 'boar' || resource === 'cattle') {
        animalCost[resource] = amount
      }
      else {
        resourceCost[resource] = amount
      }
    }

    for (const [resource, amount] of Object.entries(animalCost)) {
      this.removeAnimals(resource, amount)
    }

    this.payCost(resourceCost)
    return true
  }

  getCardCost(card) {
    if (!card.cost) {
      return {}
    }

    // Handle special dynamic costs (e.g., Bottles)
    if (card.cost.special === true && card.hasHook('getSpecialCost')) {
      let cost = card.callHook('getSpecialCost', this)
      cost = this.applyAnyCostModifiers(cost, 'minor-improvement')
      return cost
    }

    let cost = { ...card.cost }
    if (card.type === 'minor') {
      cost = this.applyImprovementCostModifiers(cost)
      cost = this.applyAnyCostModifiers(cost, 'minor-improvement')
    }
    return cost
  }

  getCardCostOptions(card) {
    const options = []

    // Primary cost
    const primaryCost = this.getCardCost(card)
    options.push({ cost: primaryCost, label: 'primary' })

    // costAlternative — skip special keys like cookBoar
    const alt = card.definition.costAlternative
    if (alt && !alt.cookBoar) {
      let cost = { ...alt }
      if (card.type === 'minor') {
        cost = this.applyImprovementCostModifiers(cost)
        cost = this.applyAnyCostModifiers(cost, 'minor-improvement')
      }
      options.push({ cost, label: 'alternative' })
    }

    // costAlternative2
    const alt2 = card.definition.costAlternative2
    if (alt2) {
      let cost = { ...alt2 }
      if (card.type === 'minor') {
        cost = this.applyImprovementCostModifiers(cost)
        cost = this.applyAnyCostModifiers(cost, 'minor-improvement')
      }
      options.push({ cost, label: 'alternative2' })
    }

    return options
  }

  playCard(cardId) {
    if (!this.canPlayCard(cardId)) {
      return false
    }

    const card = this.cards.byId(cardId)

    // Move card to appropriate played zone
    if (card.type === 'occupation') {
      card.moveTo(this.zones.byPlayer(this, 'occupations'))
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

  getVegetableFieldCount() {
    let count = 0
    for (let row = 0; row < res.constants.farmyardRows; row++) {
      for (let col = 0; col < res.constants.farmyardCols; col++) {
        const space = this.farmyard.grid[row][col]
        if (space.type === 'field' && space.crop === 'vegetables') {
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
   * Check if player has free fences available (e.g., from Hedge Keeper)
   */
  getFreeFenceCount() {
    // Calculate how many fences would be free by checking the difference
    const testCount = 15  // max fences
    const modifiedCount = this.applyFenceCostModifiers(testCount)
    return testCount - modifiedCount
  }

  /**
   * Apply modifyBuildCost hooks from cards (room building and renovation)
   */
  applyBuildCostModifiers(cost, action) {
    let modifiedCost = { ...cost }
    for (const card of this.getActiveCards()) {
      if (card.hasHook('modifyBuildCost')) {
        modifiedCost = card.callHook('modifyBuildCost', this, modifiedCost, action)
      }
    }
    return modifiedCost
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
  applyAnyCostModifiers(cost, action) {
    let modifiedCost = { ...cost }
    for (const card of this.getActiveCards()) {
      if (card.hasHook('modifyAnyCost')) {
        modifiedCost = card.callHook('modifyAnyCost', this, modifiedCost, action)
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

  // ---------------------------------------------------------------------------
  // Farmyard drawing (for debugging / console output)
  // ---------------------------------------------------------------------------

  drawFarmyard() {
    const rows = res.constants.farmyardRows
    const cols = res.constants.farmyardCols
    const cellW = 9
    const numContentLines = 3

    // Build fence lookup tables.
    // hFence[rb][c] = true if horizontal fence at row boundary rb, column c
    // vFence[r][cb] = true if vertical fence at row r, column boundary cb
    const hFence = Array.from({ length: rows + 1 }, () => Array(cols).fill(false))
    const vFence = Array.from({ length: rows }, () => Array(cols + 1).fill(false))

    for (const f of this.farmyard.fences) {
      if (f.edge) {
        if (f.edge === 'top') {
          hFence[0][f.col1] = true
        }
        else if (f.edge === 'bottom') {
          hFence[rows][f.col1] = true
        }
        else if (f.edge === 'left') {
          vFence[f.row1][0] = true
        }
        else if (f.edge === 'right') {
          vFence[f.row1][cols] = true
        }
      }
      else if (f.col1 === f.col2) {
        // Vertical neighbors → horizontal fence between them
        hFence[Math.max(f.row1, f.row2)][f.col1] = true
      }
      else {
        // Horizontal neighbors → vertical fence between them
        vFence[f.row1][Math.max(f.col1, f.col2)] = true
      }
    }

    // Box-drawing intersection character lookup.
    // Key encodes weight of each arm: up, right, down, left
    // 0 = no arm, 1 = light, 2 = heavy (fence)
    const BOX = {
      '0110': '┌', '0210': '┍', '0120': '┎', '0220': '┏',
      '0011': '┐', '0012': '┑', '0021': '┒', '0022': '┓',
      '1100': '└', '1200': '┕', '2100': '┖', '2200': '┗',
      '1001': '┘', '1002': '┙', '2001': '┚', '2002': '┛',
      '1110': '├', '1210': '┝', '2110': '┞', '1120': '┟',
      '2120': '┠', '2210': '┡', '1220': '┢', '2220': '┣',
      '1011': '┤', '1012': '┥', '2011': '┦', '1021': '┧',
      '2021': '┨', '2012': '┩', '1022': '┪', '2022': '┫',
      '0111': '┬', '0112': '┭', '0211': '┮', '0212': '┯',
      '0121': '┰', '0122': '┱', '0221': '┲', '0222': '┳',
      '1101': '┴', '1102': '┵', '1201': '┶', '1202': '┷',
      '2101': '┸', '2102': '┹', '2201': '┺', '2202': '┻',
      '1111': '┼', '1112': '┽', '1211': '┾', '1212': '┿',
      '2111': '╀', '1121': '╁', '2121': '╂', '2112': '╃',
      '2211': '╄', '1122': '╅', '1221': '╆', '2212': '╇',
      '1222': '╈', '2122': '╉', '2221': '╊', '2222': '╋',
    }

    function intersection(rb, cb) {
      const u = rb > 0 ? (vFence[rb - 1][cb] ? 2 : 1) : 0
      const d = rb < rows ? (vFence[rb][cb] ? 2 : 1) : 0
      const l = cb > 0 ? (hFence[rb][cb - 1] ? 2 : 1) : 0
      const r = cb < cols ? (hFence[rb][cb] ? 2 : 1) : 0
      return BOX[`${u}${r}${d}${l}`] || '+'
    }

    function center(text, width) {
      if (text.length >= width) {
        return text.slice(0, width)
      }
      const left = Math.floor((width - text.length) / 2)
      return ' '.repeat(left) + text + ' '.repeat(width - text.length - left)
    }

    // Precompute cell content (3 lines each)
    const self = this
    const cells = []
    for (let r = 0; r < rows; r++) {
      cells[r] = []
      for (let c = 0; c < cols; c++) {
        const space = self.getSpace(r, c)
        const hasStable = space.hasStable
        const pasture = self.getPastureAtSpace(r, c)
        const lines = ['', '', '']

        if (space.type === 'room') {
          const type = space.roomType || self.roomType
          lines[0] = 'Room'
          lines[1] = type.charAt(0).toUpperCase() + type.slice(1)
        }
        else if (space.type === 'field') {
          lines[0] = 'Field'
          if (space.crop && space.cropCount > 0) {
            lines[1] = space.crop.charAt(0).toUpperCase() + space.crop.slice(1) + ': ' + space.cropCount
          }
        }
        else if (pasture) {
          lines[0] = 'Pasture'
          // Show animals on the first space of the pasture only
          const first = pasture.spaces[0]
          if (first.row === r && first.col === c && pasture.animalType && pasture.animalCount > 0) {
            lines[1] = pasture.animalType.charAt(0).toUpperCase() + pasture.animalType.slice(1) + ': ' + pasture.animalCount
          }
        }

        // Unfenced stable with animal
        if (!pasture && space.animal) {
          const type = space.animal.charAt(0).toUpperCase() + space.animal.slice(1)
          lines[1] = type + ': 1'
        }

        // Stable marker on first empty line slot
        if (hasStable) {
          if (!lines[2]) {
            lines[2] = 'Stable'
          }
          else if (!lines[1]) {
            lines[1] = 'Stable'
          }
        }

        cells[r][c] = lines
      }
    }

    // Build output lines
    const output = []

    // Column headers
    let header = '  '
    for (let c = 0; c < cols; c++) {
      header += ' ' + center(String(c), cellW)
    }
    output.push(header)

    for (let rb = 0; rb <= rows; rb++) {
      // Border row
      let border = '  '
      for (let cb = 0; cb <= cols; cb++) {
        border += intersection(rb, cb)
        if (cb < cols) {
          border += (hFence[rb][cb] ? '━' : '─').repeat(cellW)
        }
      }
      output.push(border)

      // Content rows
      if (rb < rows) {
        for (let cl = 0; cl < numContentLines; cl++) {
          // Row label on middle content line
          let line = cl === 1 ? (rb + ' ') : '  '
          for (let cb = 0; cb <= cols; cb++) {
            line += vFence[rb][cb] ? '┃' : '│'
            if (cb < cols) {
              line += center(cells[rb][cb][cl], cellW)
            }
          }
          output.push(line)
        }
      }
    }

    // Summary line
    const parts = []
    if (this.pet) {
      parts.push('Pet: ' + this.pet)
    }
    parts.push('Fences: ' + this.getFenceCount() + '/' + res.constants.maxFences)
    parts.push('Unused: ' + this.getUnusedSpaceCount())
    output.push('  ' + parts.join('  '))

    return output.join('\n')
  }
}

module.exports = { AgricolaPlayer }
