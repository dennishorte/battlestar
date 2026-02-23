const { AgricolaPlayer } = require('../AgricolaPlayer.js')
const res = require('../res/index.js')


// ---------------------------------------------------------------------------
// Unused spaces calculation
// ---------------------------------------------------------------------------

AgricolaPlayer.prototype.getUnusedSpaceCount = function() {
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

AgricolaPlayer.prototype.getScoreState = function() {
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
    grain: this.getTotalGrain(),
    vegetables: this.getTotalVegetables(),
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

AgricolaPlayer.prototype.getCardPoints = function() {
  let points = 0
  for (const id of this.majorImprovements) {
    const imp = this.cards.byId(id)
    if (imp) {
      points += imp.victoryPoints || 0
    }
  }
  return points
}

AgricolaPlayer.prototype.getBonusPoints = function() {
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

  // Bonuses from cards with getEndGamePointsAllPlayers (any player's card grants to qualifying players)
  // Skip if endGame() already applied these to this.bonusPoints to avoid double-counting
  if (!this._endGameAllPlayersBonusApplied) {
    for (const player of this.game.players.all()) {
      for (const id of [...player.playedOccupations, ...player.playedMinorImprovements]) {
        const card = this.cards.byId(id)
        if (card && card.hasHook('getEndGamePointsAllPlayers')) {
          const bonuses = card.callHook('getEndGamePointsAllPlayers', this.game)
          points += bonuses[this.name] || 0
        }
      }
    }
  }


  return points
}

// Spend resources for crafting improvement bonus points
// Revised Edition: Resources are spent from supply to earn bonus points
// This affects tie-breaker calculation (remaining resources)
AgricolaPlayer.prototype.spendResourcesForCraftingBonus = function() {
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
        this.removeResource(resource, resourcesSpent)
        spent[resource] = resourcesSpent
      }
    }
  }

  return spent
}


// Get count of all improvements (major + minor)
AgricolaPlayer.prototype.getImprovementCount = function() {
  return this.majorImprovements.length + this.playedMinorImprovements.length
}

// Get count of grain fields (fields with grain planted)
AgricolaPlayer.prototype.getGrainFieldCount = function() {
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

AgricolaPlayer.prototype.getVegetableFieldCount = function() {
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
AgricolaPlayer.prototype.getPastureSpaceCount = function() {
  let count = 0
  for (const pasture of this.farmyard.pastures) {
    count += pasture.spaces.length
  }
  return count
}

// Get count of unfenced stables
AgricolaPlayer.prototype.getUnfencedStableCount = function() {
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

// Get count of pastures with at least min spaces (e.g. Fellow Grazer: 3+ spaces)
AgricolaPlayer.prototype.getPasturesWithMinSpaces = function(min) {
  let count = 0
  for (const pasture of this.farmyard.pastures) {
    if (pasture.spaces && pasture.spaces.length >= min) {
      count++
    }
  }
  return count
}

// Get count of cooking improvements (majors with canCook) for Cookery Outfitter
AgricolaPlayer.prototype.getCookingImprovementCount = function() {
  let count = 0
  for (const id of this.majorImprovements) {
    const imp = this.cards.byId(id)
    if (imp && imp.abilities && imp.abilities.canCook) {
      count++
    }
  }
  return count
}

// Get cards that trigger on specific hooks
AgricolaPlayer.prototype.getCardsWithHook = function(hookName) {
  return this.getActiveCards().filter(card => card.hasHook(hookName))
}

AgricolaPlayer.prototype.calculateScore = function() {
  const state = this.getScoreState()
  return res.calculateTotalScore(state)
}

AgricolaPlayer.prototype.getScoreBreakdown = function() {
  const state = this.getScoreState()
  return res.getScoreBreakdown(state)
}
