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

  getMajorImprovementCount() {
    return this.majorImprovements.length
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

  occupiesActionSpace(actionId) {
    const state = this.game.state.actionSpaces[actionId]
    return state && state.occupiedBy === this.name
  }

  /**
   * Number of this player's workers on accumulation spaces (used at return home).
   * Same as getPeopleOnAccumulationSpaces(); name matches card text.
   */
  getWorkersReturnedFromAccumulationSpaces() {
    return this.getPeopleOnAccumulationSpaces()
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

  getAllImprovements() {
    return [...this.playedMinorImprovements, ...this.majorImprovements]
  }

  getTotalGrain() {
    let total = this.grain
    for (const field of this.getFieldSpaces()) {
      if (field.crop === 'grain' && field.cropCount > 0) {
        total += field.cropCount
      }
    }
    return total
  }

  getTotalVegetables() {
    let total = this.vegetables
    for (const field of this.getFieldSpaces()) {
      if (field.crop === 'vegetables' && field.cropCount > 0) {
        total += field.cropCount
      }
    }
    return total
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

    // Set up traps to catch direct writes to resource fields
    this._setupResourceTraps()
  }

  _setupResourceTraps() {
    const trapped = ['food', 'wood', 'clay', 'stone', 'reed', 'grain', 'vegetables', 'beggingCards', 'bonusPoints']
    for (const field of trapped) {
      const backingKey = `_${field}`
      this[backingKey] = this[field]
      Object.defineProperty(this, field, {
        get() {
          return this[backingKey]
        },
        set(value) {
          if (!this._resourceWriteDepth) {
            throw new Error(`Direct write to player.${field} not allowed. Use addResource/removeResource/setResource.`)
          }
          this[backingKey] = value
        },
        enumerable: true,
        configurable: true,
      })
    }
  }

  _withResourceWrite(fn) {
    this._resourceWriteDepth = (this._resourceWriteDepth || 0) + 1
    try {
      return fn()
    }
    finally {
      this._resourceWriteDepth--
    }
  }

  setResource(type, value) {
    this._withResourceWrite(() => {
      this[type] = value
    })
  }

  addBonusPoints(amount) {
    this._withResourceWrite(() => {
      this.bonusPoints += amount
    })
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
      palisades: [], // Array of wood palisade fence segments (edge fences from WoodPalisades card)
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
    const sowableFields = this.getSowableFields()
    if (sowableFields.length === 0) {
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

    this.removeResource(cropType, 1)
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
      if (card.definition.providesRoom || this.game.cardState(card.definition.id).providesRoom) {
        const untilRound = card.definition.providesRoomUntilRound
        if (untilRound !== undefined && this.game.state.round > untilRound) {
          continue // Lodger etc.: room no longer provided after that round
        }
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

  getUnoccupiedRoomsByType(type) {
    if (this.roomType !== type) {
      return 0
    }
    const rooms = this.getRoomCount()
    return Math.max(0, rooms - this.familyMembers)
  }

  getFieldTilesAdjacentToRooms() {
    const counted = new Set()
    const rooms = this.getRoomSpaces()
    for (const room of rooms) {
      for (const [dr, dc] of [[-1,0],[1,0],[0,-1],[0,1]]) {
        const nr = room.row + dr, nc = room.col + dc
        if (nr >= 0 && nr < res.constants.farmyardRows
          && nc >= 0 && nc < res.constants.farmyardCols
          && this.farmyard.grid[nr][nc].type === 'field') {
          counted.add(`${nr},${nc}`)
        }
      }
    }
    return counted.size
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
    return this.getAffordableRoomCostOptions().length > 0
  }

  getRoomCost() {
    let cost = { ...res.buildingCosts.room[this.roomType] }
    cost = this.applyBuildCostModifiers(cost, 'build-room')
    cost = this.applyCostModifiers(cost, { type: 'build-room' })
    for (const card of this.getActiveCards()) {
      if (card.hasHook('modifyRoomCost')) {
        cost = card.callHook('modifyRoomCost', this, cost, this.game.state.round)
      }
    }
    return cost
  }

  // Strip non-resource metadata keys (e.g. allowWoodSubstitution) from a cost object
  _cleanCost(cost) {
    const clean = {}
    for (const [key, value] of Object.entries(cost)) {
      if (typeof value === 'number' && value > 0) {
        clean[key] = value
      }
    }
    return clean
  }

  getRoomCostOptions() {
    const baseCost = this.getRoomCost()
    const { allowWoodSubstitution, ...rawCost } = baseCost
    const primaryCost = this._cleanCost(rawCost)
    const options = [{ cost: primaryCost, label: 'standard' }]

    if (allowWoodSubstitution) {
      for (const resource of ['clay', 'stone']) {
        if (primaryCost[resource] && primaryCost[resource] >= 2) {
          const altCost = { ...primaryCost }
          altCost[resource] -= 2
          altCost.wood = (altCost.wood || 0) + 1
          // Remove zero-value entries
          if (altCost[resource] === 0) {
            delete altCost[resource]
          }
          options.push({ cost: altCost, label: `substitute-${resource}` })
        }
      }
    }

    return options
  }

  getAffordableRoomCostOptions() {
    return this.getRoomCostOptions().filter(opt => this.canAffordCost(opt.cost))
  }

  getMultiRoomCost(count) {
    const baseCost = this.getRoomCost()
    const cleanCost = this._cleanCost(baseCost)
    const totalCost = {}
    for (const [resource, amount] of Object.entries(cleanCost)) {
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
    if (this.getAffordableRenovationCostOptions(targetType).length > 0) {
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
    cost = this.applyCostModifiers(cost, { type: 'renovate' })

    // Apply card-specific renovation cost modifiers (e.g., WoodSlideHammer stone discount)
    for (const card of this.getActiveCards()) {
      if (card.hasHook('modifyRenovationCost')) {
        cost = card.callHook('modifyRenovationCost', this.game, this, cost, { fromType: this.roomType, toType: nextType })
      }
    }

    return cost
  }

  getRenovationCostOptions(targetType) {
    const baseCost = this.getRenovationCost(targetType)
    if (!baseCost) {
      return []
    }

    const { allowWoodSubstitution, ...rawCost } = baseCost
    const primaryCost = this._cleanCost(rawCost)
    const options = [{ cost: primaryCost, label: 'standard' }]

    if (allowWoodSubstitution) {
      // For renovation, only one substitution per action
      for (const resource of ['clay', 'stone']) {
        if (primaryCost[resource] && primaryCost[resource] >= 2) {
          const altCost = { ...primaryCost }
          altCost[resource] -= 2
          altCost.wood = (altCost.wood || 0) + 1
          if (altCost[resource] === 0) {
            delete altCost[resource]
          }
          options.push({ cost: altCost, label: `substitute-${resource}` })
        }
      }
    }

    return options
  }

  getAffordableRenovationCostOptions(targetType) {
    return this.getRenovationCostOptions(targetType).filter(opt => this.canAffordCost(opt.cost))
  }

  renovate(targetType, chosenCost) {
    if (!this.canRenovate(targetType)) {
      return false
    }

    const cost = chosenCost || this._cleanCost(this.getRenovationCost(targetType))
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

    this.hasRenovated = true
    return true
  }

  // ---------------------------------------------------------------------------
  // Resource methods
  // ---------------------------------------------------------------------------

  addResource(type, amount) {
    this._withResourceWrite(() => {
      if (this[type] !== undefined) {
        this[type] += amount
        if (this.resourcesGainedThisRound) {
          this.resourcesGainedThisRound[type] = (this.resourcesGainedThisRound[type] || 0) + amount
        }
      }
    })
  }

  removeResource(type, amount) {
    this._withResourceWrite(() => {
      if (this[type] !== undefined) {
        this[type] = Math.max(0, this[type] - amount)
      }
    })
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

  hasPersonInSupply() {
    return this.familyMembers < res.constants.maxFamilyMembers
  }

  useWorker() {
    if (this.availableWorkers > 0) {
      this.availableWorkers -= 1
      return true
    }
    return false
  }

  getPersonPlacedThisRound() {
    // Calculate how many people this player has placed this round
    // This is the number of workers used = family size - available workers
    const newbornCount = this.getNewbornsReturningHome()
    const workersThatCanWork = this.getFamilySize() - newbornCount
    return workersThatCanWork - this.availableWorkers
  }

  getFirstPersonActionThisRound() {
    return this._firstActionThisRound
  }

  resetWorkers() {
    this.availableWorkers = this.familyMembers
    // Note: newborns are cleared at end of round (after harvest), not here
  }

  resetRoundState() {
    this.usedFishingThisRound = false
    this.resourcesGainedThisRound = {}
    this._firstActionThisRound = null
    this._usedMummysBoyDoubleAction = false
    this.usedAccumulationSpaceTypes = undefined
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

  getHouseCapacity() {
    let capacity = this.getRoomCount()
    for (const card of this.getActiveCards()) {
      if (card.hasHook('modifyHouseCapacity')) {
        capacity = card.callHook('modifyHouseCapacity', this, capacity)
      }
    }
    for (const room of this.getRoomSpaces()) {
      for (const card of this.getActiveCards()) {
        if (card.hasHook('modifyRoomCapacity')) {
          const bonus = card.callHook('modifyRoomCapacity', this.game, this, room)
          if (bonus > 0) {
            capacity += bonus
          }
        }
      }
    }
    return Math.min(capacity, res.constants.maxFamilyMembers)
  }

  canGrowFamily(requiresRoom = true) {
    // Max 5 family members
    if (this.familyMembers >= res.constants.maxFamilyMembers) {
      return false
    }

    // Need more rooms than family members (if required)
    if (requiresRoom && this.familyMembers >= this.getHouseCapacity()) {
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
  applyFenceCostModifiers(fenceCount, edgeFenceCount = 0) {
    for (const card of this.getActiveCards()) {
      if (card.hasHook('modifyFenceCost')) {
        fenceCount = card.callHook('modifyFenceCost', this, fenceCount, edgeFenceCount)
      }
    }
    return fenceCount
  }

  _countEdgeFences(fences) {
    return fences.filter(f => f.edge).length
  }

  hasWoodPalisadesCard() {
    return this.getActiveCards().some(c => c.definition.allowWoodPalisades)
  }

  _splitEdgeAndInternalFences(fences) {
    const edgeFences = fences.filter(f => f.edge)
    const internalFences = fences.filter(f => !f.edge)
    return { edgeFences, internalFences }
  }

  _countFieldAdjacentFences(fences) {
    let count = 0
    for (const f of fences) {
      const space1 = (f.row1 >= 0 && f.col1 >= 0) ? this.getSpace(f.row1, f.col1) : null
      const space2 = (f.row2 >= 0 && f.col2 >= 0) ? this.getSpace(f.row2, f.col2) : null
      if ((space1 && space1.type === 'field') || (space2 && space2.type === 'field')) {
        count++
      }
    }
    return count
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
   * Apply all cost-modifier hooks from cards in the correct order:
   *   1. modifyMajorCost — major improvements only (receives improvement ID)
   *   2. modifyImprovementCost — all improvements (major + minor)
   *   3. modifyAnyCost — any cost (rooms, renovations, improvements, …)
   *
   * @param {Object} cost - Base cost object
   * @param {Object} opts
   * @param {string} opts.type - Cost context: 'major-improvement', 'minor-improvement',
   *                             'build-room', 'renovate', etc.
   * @param {string} [opts.improvementId] - Major improvement ID (for modifyMajorCost hooks)
   */
  applyCostModifiers(cost, { type, improvementId } = {}) {
    let modified = { ...cost }
    const isMajor = type === 'major-improvement'
    const isImprovement = isMajor || type === 'minor-improvement'

    for (const card of this.getActiveCards()) {
      if (isMajor && improvementId && card.hasHook('modifyMajorCost')) {
        modified = card.callHook('modifyMajorCost', this, improvementId, modified)
      }
      if (isImprovement && card.hasHook('modifyImprovementCost')) {
        modified = card.callHook('modifyImprovementCost', this, modified)
      }
      if (card.hasHook('modifyAnyCost')) {
        modified = card.callHook('modifyAnyCost', this, modified, type)
      }
    }
    return modified
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

require('./player/sowing')
require('./player/pastures')
require('./player/animals')
require('./player/cooking')
require('./player/scoring')
require('./player/cards')
