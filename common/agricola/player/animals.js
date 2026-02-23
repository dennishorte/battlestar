const { AgricolaPlayer } = require('../AgricolaPlayer.js')
const res = require('../res/index.js')


AgricolaPlayer.prototype.getTotalAnimals = function(type) {
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
      count += stable.animalCount || 1
    }
  }

  // Count on card-based holders
  for (const holding of this.getAnimalHoldingCards()) {
    count += holding.animals[type] || 0
  }

  return count
}

AgricolaPlayer.prototype.getAllAnimals = function() {
  return {
    sheep: this.getTotalAnimals('sheep'),
    boar: this.getTotalAnimals('boar'),
    cattle: this.getTotalAnimals('cattle'),
  }
}

AgricolaPlayer.prototype.getAnimalsInHouse = function() {
  return this.pet ? 1 : 0
}

AgricolaPlayer.prototype.hasAllAnimalTypes = function() {
  return this.getTotalAnimals('sheep') > 0
    && this.getTotalAnimals('boar') > 0
    && this.getTotalAnimals('cattle') > 0
}

AgricolaPlayer.prototype.getCategoriesWithMaxScore = function() {
  // Compute category scores directly to avoid infinite recursion when called
  // from getEndGamePoints (which is called from getBonusPoints -> getScoreState -> getScoreBreakdown).
  let count = 0

  let fields = this.getFieldCount()
  for (const cardId of this.playedMinorImprovements) {
    const card = this.cards.byId(cardId)
    if (card && card.definition.wildcardRoles
        && card.definition.wildcardRoles.includes('field')) {
      fields++
    }
  }

  const categoryValues = {
    fields,
    pastures: this.getPastureCount(),
    grain: this.getTotalGrain(),
    vegetables: this.getTotalVegetables(),
    sheep: this.getTotalAnimals('sheep'),
    boar: this.getTotalAnimals('boar'),
    cattle: this.getTotalAnimals('cattle'),
  }

  for (const [cat, value] of Object.entries(categoryValues)) {
    if (res.scoreCategory(cat, value) >= 4) {
      count++
    }
  }

  // Fenced stables: max is 4+ stables
  if (this.getFencedStableCount() >= 4) {
    count++
  }
  return count
}

// Get total count of building resources (for tie-breaker)
// Revised Edition: wood + clay + reed + stone remaining in supply
AgricolaPlayer.prototype.getBuildingResourcesCount = function() {
  return this.wood + this.clay + this.reed + this.stone
}

AgricolaPlayer.prototype.getPastureAtSpace = function(row, col) {
  for (const pasture of this.farmyard.pastures) {
    if (pasture.spaces.some(s => s.row === row && s.col === col)) {
      return pasture
    }
  }
  return null
}

AgricolaPlayer.prototype.isRoomAdjacentToField = function(room) {
  const neighbors = this.getOrthogonalNeighbors(room.row, room.col)
  return neighbors.some(n => {
    const space = this.getSpace(n.row, n.col)
    return space && space.type === 'field'
  })
}

AgricolaPlayer.prototype.isRoomAdjacentToPasture = function(room) {
  const neighbors = this.getOrthogonalNeighbors(room.row, room.col)
  return neighbors.some(n => this.getPastureAtSpace(n.row, n.col) !== null)
}

AgricolaPlayer.prototype.getPastureCapacity = function(pasture) {
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

  if (hasStable) {
    for (const card of this.getActiveCards()) {
      if (card.hasHook('modifyStableCapacity')) {
        capacity = card.callHook('modifyStableCapacity', this.game, this, capacity, true)
      }
    }
  }

  return capacity
}

/**
 * Number of pastures that are at capacity (holding the maximum number of animals).
 * Used by Full Farmer occupation for getEndGamePoints.
 */
AgricolaPlayer.prototype.getFullPastureCount = function() {
  let count = 0
  for (const pasture of this.farmyard.pastures) {
    const capacity = this.getPastureCapacity(pasture)
    const animals = pasture.animalCount || 0
    if (animals >= capacity && capacity > 0) {
      count++
    }
  }
  return count
}

AgricolaPlayer.prototype.getModifiedUnfencedStableCapacity = function() {
  let capacity = 1
  for (const card of this.getActiveCards()) {
    if (card.hasHook('modifyStableCapacity')) {
      capacity = card.callHook('modifyStableCapacity', this.game, this, capacity, false)
    }
  }
  return capacity
}

AgricolaPlayer.prototype.getUnfencedStableCapacity = function() {
  // Each unfenced stable can hold animals (base 1, modifiable by cards)
  const perStable = this.getModifiedUnfencedStableCapacity()
  let capacity = 0
  for (const stable of this.getStableSpaces()) {
    if (!this.getPastureAtSpace(stable.row, stable.col)) {
      capacity += perStable
    }
  }
  return capacity
}

AgricolaPlayer.prototype.hasEmptyUnfencedStable = function() {
  for (const stable of this.getStableSpaces()) {
    if (!this.getPastureAtSpace(stable.row, stable.col)) {
      const space = this.getSpace(stable.row, stable.col)
      if (!space.animal) {
        return true
      }
    }
  }
  return false
}

AgricolaPlayer.prototype.getTotalAnimalCapacity = function(animalType) {
  // Pet in house - only count if empty or same type
  let capacity = 0
  if (!this.pet || this.pet === animalType) {
    capacity += this.applyHouseAnimalCapacityModifiers(1)
  }

  // Pastures that are empty or already have this type
  for (const pasture of this.farmyard.pastures) {
    if (!pasture.animalType || pasture.animalType === animalType) {
      capacity += this.getPastureCapacity(pasture)
    }
  }

  // Unfenced stables - only count if empty or same type
  const perStable = this.getModifiedUnfencedStableCapacity()
  for (const stable of this.getStableSpaces()) {
    if (!this.getPastureAtSpace(stable.row, stable.col)) {
      const space = this.getSpace(stable.row, stable.col)
      if (!space.animal || space.animal === animalType) {
        capacity += perStable
      }
    }
  }

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
AgricolaPlayer.prototype.getAnimalPlacementLocations = function() {
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
  const stableMax = this.getModifiedUnfencedStableCapacity()
  for (const stable of this.getStableSpaces()) {
    if (!this.getPastureAtSpace(stable.row, stable.col)) {
      const space = this.getSpace(stable.row, stable.col)
      locations.push({
        id: `stable-${stable.row}-${stable.col}`,
        type: 'unfenced-stable',
        name: 'Unfenced Stable',
        space: { row: stable.row, col: stable.col },
        currentAnimalType: space.animal || null,
        currentCount: space.animalCount || (space.animal ? 1 : 0),
        maxCapacity: stableMax,
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
AgricolaPlayer.prototype.getAnimalPlacementLocationsWithAvailability = function() {
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

AgricolaPlayer.prototype.canPlaceAnimals = function(animalType, count) {
  const currentCount = this.getTotalAnimals(animalType)
  const capacity = this.getTotalAnimalCapacity(animalType)
  return currentCount + count <= capacity
}

AgricolaPlayer.prototype.addAnimals = function(animalType, count) {
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
  const unfencedStableMax = this.getModifiedUnfencedStableCapacity()
  for (const stable of this.getStableSpaces()) {
    if (remaining <= 0) {
      break
    }
    if (!this.getPastureAtSpace(stable.row, stable.col)) {
      const space = this.getSpace(stable.row, stable.col)
      const currentCount = space.animalCount || (space.animal ? 1 : 0)
      const canAdd = unfencedStableMax - currentCount
      if (canAdd > 0 && (!space.animal || space.animal === animalType)) {
        const toAdd = Math.min(remaining, canAdd)
        space.animal = animalType
        space.animalCount = currentCount + toAdd
        remaining -= toAdd
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

AgricolaPlayer.prototype.removeAnimals = function(animalType, count) {
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
        space.animalCount = 0
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

AgricolaPlayer.prototype.getCardAnimals = function(cardId) {
  return this.cardAnimals[cardId] || { sheep: 0, boar: 0, cattle: 0 }
}

AgricolaPlayer.prototype.getCardAnimalTotal = function(cardId) {
  const animals = this.getCardAnimals(cardId)
  return animals.sheep + animals.boar + animals.cattle
}

AgricolaPlayer.prototype.addCardAnimal = function(cardId, type, count = 1) {
  if (!this.cardAnimals[cardId]) {
    this.cardAnimals[cardId] = { sheep: 0, boar: 0, cattle: 0 }
  }
  this.cardAnimals[cardId][type] += count
}

AgricolaPlayer.prototype.removeCardAnimal = function(cardId, type, count = 1) {
  if (!this.cardAnimals[cardId]) {
    return
  }
  this.cardAnimals[cardId][type] = Math.max(0, this.cardAnimals[cardId][type] - count)
}

AgricolaPlayer.prototype.getAnimalHoldingCards = function() {
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

    // holdsCattlePerPasture: capacity = number of pastures, cattle only
    if (def.holdsCattlePerPasture) {
      holdings.push({
        card,
        cardId: card.id,
        name: card.name,
        capacity: this.getPastureCount(),
        mixedTypes: false,
        sameTypeOnly: false,
        allowedTypes: ['cattle'],
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
AgricolaPlayer.prototype.applyAnimalPlacements = function(plan) {
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

AgricolaPlayer.prototype.breedAnimals = function() {
  const bred = { sheep: 0, boar: 0, cattle: 0 }

  for (const type of res.animalTypes) {
    const count = this.getTotalAnimals(type)
    const required = this._getBreedingRequirement(type)
    if (count >= required) {
      // Can breed - but only if we can house the baby
      if (this.canPlaceAnimals(type, 1)) {
        this.addAnimals(type, 1)
        bred[type] = 1
      }
    }
  }

  return bred
}

AgricolaPlayer.prototype._getBreedingRequirement = function(type) {
  if (type === 'sheep') {
    for (const card of this.getActiveCards()) {
      if (card.hasHook('modifySheepBreedingRequirement')) {
        return card.callHook('modifySheepBreedingRequirement', this.game, this)
      }
    }
  }
  return 2
}
