const { AgricolaPlayer } = require('../AgricolaPlayer.js')
const res = require('../res/index.js')


// ---------------------------------------------------------------------------
// Major Improvement methods
// ---------------------------------------------------------------------------

AgricolaPlayer.prototype.getMajorImprovementCost = function(improvementId) {
  const imp = this.cards.byId(improvementId)
  if (!imp || !imp.cost) {
    return {}
  }
  let cost = { ...imp.cost }
  return this.applyCostModifiers(cost, { type: 'major-improvement', improvementId })
}

AgricolaPlayer.prototype._getWildcardAsFireplace = function() {
  for (const minorId of this.playedMinorImprovements) {
    const card = this.cards.byId(minorId)
    if (card && card.definition.wildcardRoles
        && card.definition.wildcardRoles.includes('fireplace')) {
      return minorId
    }
  }
  return null
}

AgricolaPlayer.prototype.canBuyMajorImprovement = function(improvementId) {
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
  // Apply House Redevelopment discount for affordability check
  if ((this._houseRedevelopmentDiscount || 0) > 0) {
    return this._canAffordWithBuildingResourceDiscount(cost, this._houseRedevelopmentDiscount)
  }
  return this.canAffordCost(cost)
}

AgricolaPlayer.prototype.buyMajorImprovement = function(improvementId) {
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
// Card methods
// ---------------------------------------------------------------------------

AgricolaPlayer.prototype.getPlayedCards = function() {
  return [...this.playedOccupations, ...this.playedMinorImprovements]
}

AgricolaPlayer.prototype.getPlayedCard = function(cardId) {
  if (this.playedOccupations.includes(cardId) || this.playedMinorImprovements.includes(cardId)) {
    return this.cards.byId(cardId)
  }
  return null
}

AgricolaPlayer.prototype.hasCard = function(cardId) {
  return this.hand.includes(cardId)
}

AgricolaPlayer.prototype.hasPlayedCard = function(cardId) {
  return this.playedOccupations.includes(cardId) || this.playedMinorImprovements.includes(cardId)
}

AgricolaPlayer.prototype.canAffordSingleCost = function(cost) {
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

AgricolaPlayer.prototype._canAffordWithBuildingResourceDiscount = function(cost, discount) {
  const buildingResources = ['wood', 'clay', 'stone', 'reed'].filter(r => (cost[r] || 0) > 0)
  if (buildingResources.length === 0 || discount <= 0) {
    return this.canAffordSingleCost(cost)
  }
  // Try each possible resource reduction and check if any is affordable
  for (const resource of buildingResources) {
    const modified = { ...cost }
    modified[resource] = Math.max(0, modified[resource] - discount)
    if (this.canAffordSingleCost(modified)) {
      return true
    }
  }
  return false
}

AgricolaPlayer.prototype.canAffordCard = function(cardId) {
  const card = this.cards.byId(cardId)
  if (!card) {
    return false
  }

  if (!card.cost) {
    return true
  }

  const options = this.getCardCostOptions(card)
  // Apply House Redevelopment discount for affordability check
  if ((this._houseRedevelopmentDiscount || 0) > 0) {
    return options.some(opt => this._canAffordWithBuildingResourceDiscount(opt.cost, this._houseRedevelopmentDiscount))
  }
  return options.some(opt => this.canAffordSingleCost(opt.cost))
}

AgricolaPlayer.prototype.getAffordableCardCostOptions = function(cardId) {
  const card = this.cards.byId(cardId)
  if (!card || !card.cost) {
    return [{ cost: {}, label: 'free' }]
  }
  const options = this.getCardCostOptions(card)
  if ((this._houseRedevelopmentDiscount || 0) > 0) {
    return options.filter(opt => this._canAffordWithBuildingResourceDiscount(opt.cost, this._houseRedevelopmentDiscount))
  }
  return options.filter(opt => this.canAffordSingleCost(opt.cost))
}

AgricolaPlayer.prototype.meetsCardPrereqs = function(cardId) {
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

AgricolaPlayer.prototype._meetsCardPrereqsCore = function(cardId, wildcardRole = null) {
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

  if (prereqs.fieldsInLShape) {
    if (!this.hasFieldsInLShape()) {
      return false
    }
  }

  if (prereqs.noPeopleInHouse) {
    if (this.familyMembers >= this.getRoomCount()) {
      return false
    }
  }

  // --- Deferred prereq checks (complex game-state checks not yet implemented) ---
  // TODO: bakingImprovement, cookingImprovement, hasPotteryOrUpgrade,
  //   hasFireplaceAndCookingHearth, returnFireplaceOrCookingHearth, returnMajor,
  //   personOnAction, personYetToPlace,
  //   fencedStables, woodGteRound,
  //   cardsInPlay, maxCardsInPlay, exactlyAdults, majorImprovement (specific card),
  //   roundsLeftGreaterThanUnusedSpaces

  return true
}

AgricolaPlayer.prototype.canPlayCard = function(cardId) {
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

AgricolaPlayer.prototype.payCardCost = function(cardId, chosenCost) {
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

AgricolaPlayer.prototype.getCardCost = function(card) {
  if (!card.cost) {
    return {}
  }

  // Handle special dynamic costs (e.g., Bottles)
  if (card.cost.special === true && card.hasHook('getSpecialCost')) {
    let cost = card.callHook('getSpecialCost', this)
    cost = this.applyCostModifiers(cost, { type: 'minor-improvement' })
    return cost
  }

  let cost = { ...card.cost }
  if (card.type === 'minor') {
    cost = this.applyCostModifiers(cost, { type: 'minor-improvement' })
  }
  return cost
}

AgricolaPlayer.prototype.getCardCostOptions = function(card) {
  const options = []

  // Primary cost
  const primaryCost = this.getCardCost(card)
  options.push({ cost: primaryCost, label: 'primary' })

  // costAlternative — skip special keys like cookBoar
  const alt = card.definition.costAlternative
  if (alt && !alt.cookBoar) {
    let cost = { ...alt }
    if (card.type === 'minor') {
      cost = this.applyCostModifiers(cost, { type: 'minor-improvement' })
    }
    options.push({ cost, label: 'alternative' })
  }

  // costAlternative2
  const alt2 = card.definition.costAlternative2
  if (alt2) {
    let cost = { ...alt2 }
    if (card.type === 'minor') {
      cost = this.applyCostModifiers(cost, { type: 'minor-improvement' })
    }
    options.push({ cost, label: 'alternative2' })
  }

  return options
}

AgricolaPlayer.prototype.playCard = function(cardId) {
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
