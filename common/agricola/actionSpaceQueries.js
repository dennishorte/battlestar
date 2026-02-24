const { Agricola } = require('./agricola')
const res = require('./res/index.js')

Agricola.prototype.getActionById = function(actionId) {
  return res.getActionById(actionId)
}

/**
 * Check if an action space is currently occupied
 */
Agricola.prototype.isActionOccupied = function(actionId) {
  const state = this.state.actionSpaces[actionId]
  return !!(state && state.occupiedBy)
}

/**
 * Check if any player returned from a Lessons action space this round
 * (called during return home phase, before workers are reset)
 */
Agricola.prototype.anyPlayerReturnedFromLessons = function() {
  const lessonsActions = ['occupation', 'lessons-1', 'lessons-2', 'lessons-3', 'lessons-4', 'lessons-5', 'lessons-6']
  for (const actionId of lessonsActions) {
    const state = this.state.actionSpaces[actionId]
    if (state && state.occupiedBy) {
      return true
    }
  }
  return false
}

// ---------------------------------------------------------------------------
// Per-game card state (avoids mutating singleton card definitions)
// ---------------------------------------------------------------------------

Agricola.prototype.cardState = function(id) {
  if (!this.state._cardState) {
    this.state._cardState = {}
  }
  if (!this.state._cardState[id]) {
    this.state._cardState[id] = {}
  }
  return this.state._cardState[id]
}

// ---------------------------------------------------------------------------
// Accumulation space helpers (used by card hooks like TreeCutter, Loudmouth)
// ---------------------------------------------------------------------------

Agricola.prototype.isAccumulationSpace = function(actionId) {
  const action = res.getActionById(actionId)
  return !!(action && action.type === 'accumulating')
}

Agricola.prototype.isBuildingResourceAccumulationSpace = function(actionId) {
  const action = res.getActionById(actionId)
  if (!action || action.type !== 'accumulating' || !action.accumulates) {
    return false
  }
  return Object.keys(action.accumulates).some(r => ['wood', 'clay', 'stone', 'reed'].includes(r))
}

Agricola.prototype.isWoodAccumulationSpace = function(actionId) {
  const action = res.getActionById(actionId)
  return !!(action && action.type === 'accumulating' && action.accumulates && action.accumulates.wood)
}

Agricola.prototype.getAccumulationSpaceGoodType = function(actionId) {
  const action = res.getActionById(actionId)
  if (!action || !action.accumulates) {
    return null
  }
  return Object.keys(action.accumulates)[0]
}

/**
 * Returns { resourceType: amount } for an accumulation space.
 * During onAction hooks for the current action, returns the pre-take amount
 * (since takeAccumulatedResource already reset it to 0).
 * For other spaces, returns the current accumulated amount.
 */
Agricola.prototype.getAccumulatedResources = function(actionId) {
  const action = res.getActionById(actionId)
  if (!action || !action.accumulates) {
    return {}
  }

  const actionState = this.state.actionSpaces[actionId]
  if (!actionState) {
    return {}
  }

  // If this is the action currently being taken, use the saved pre-take amount
  const last = this.state.lastAccumulated
  const amount = (last && last.actionId === actionId) ? last.amount : actionState.accumulated

  const result = {}
  for (const resource of Object.keys(action.accumulates)) {
    result[resource] = amount
  }
  return result
}

/**
 * Remove resources from an accumulation space (e.g. Riverine Shepherd taking from the other space).
 */
Agricola.prototype.removeFromAccumulationSpace = function(actionId, resource, amount) {
  const state = this.state.actionSpaces[actionId]
  if (!state || state.accumulated == null) {
    return
  }
  state.accumulated = Math.max(0, (state.accumulated || 0) - amount)
}

Agricola.prototype.hasAccumulationSpaceWithGoods = function(minGoods) {
  for (const actionId of this.state.activeActions) {
    const action = res.getActionById(actionId)
    if (action && action.type === 'accumulating') {
      const actionState = this.state.actionSpaces[actionId]
      if (actionState && actionState.accumulated >= minGoods) {
        return true
      }
    }
  }
  return false
}

Agricola.prototype.isAccumulationSpaceWith5PlusGoods = function(actionId) {
  const action = res.getActionById(actionId)
  if (!action || action.type !== 'accumulating') {
    return false
  }
  const actionState = this.state.actionSpaces[actionId]

  // During onAction for this space, use the pre-take amount
  const last = this.state.lastAccumulated
  const amount = (last && last.actionId === actionId) ? last.amount : (actionState?.accumulated || 0)
  return amount >= 5
}

Agricola.prototype.isRoundActionSpace = function(actionId) {
  const action = res.getActionById(actionId)
  return !!(action && action.stage)
}

/**
 * Returns an array of action space states that accumulate wood.
 * Used by cards like Wood Harvester to check wood accumulation spaces.
 */
Agricola.prototype.getWoodAccumulationSpaces = function() {
  const woodSpaces = []
  for (const actionId of this.state.activeActions) {
    const action = res.getActionById(actionId)
    if (action && action.type === 'accumulating' && action.accumulates && action.accumulates.wood) {
      const actionState = this.state.actionSpaces[actionId]
      if (actionState) {
        woodSpaces.push({
          actionId,
          accumulated: actionState.accumulated || 0,
        })
      }
    }
  }
  return woodSpaces
}

Agricola.prototype.actionGivesReed = function(actionId) {
  const action = res.getActionById(actionId)
  if (!action) {
    return false
  }
  return !!(action.accumulates?.reed || action.gives?.reed)
}

Agricola.prototype.isLastInTurnOrder = function(player) {
  const players = this.players.all()
  const startIdx = players.findIndex(p => p.name === this.state.startingPlayer)
  const lastIdx = (startIdx + players.length - 1) % players.length
  return players[lastIdx].name === player.name
}

Agricola.prototype.isNonAccumulatingActionSpace = function(actionId) {
  const action = res.getActionById(actionId)
  if (!action) {
    // Card-provided action spaces are non-accumulating
    const state = this.state.actionSpaces[actionId]
    return state && !state.accumulated
  }
  return action.type !== 'accumulating'
}

Agricola.prototype.actionSpaceProvidesStoneAndOther = function(actionId) {
  const action = res.getActionById(actionId)
  if (!action) {
    return false
  }
  const gives = action.gives || {}
  const accumulates = action.accumulates || {}
  const hasStone = gives.stone > 0 || accumulates.stone > 0
  const hasOtherBuilding = gives.wood > 0 || gives.clay > 0 || gives.reed > 0
    || accumulates.wood > 0 || accumulates.clay > 0 || accumulates.reed > 0
  // Also check allowsResourceChoice for spaces like Resource Market
  const hasStoneChoice = action.allowsResourceChoice && action.allowsResourceChoice.includes('stone')
  const hasOtherChoice = action.allowsResourceChoice && action.allowsResourceChoice.some(r => ['wood', 'clay', 'reed'].includes(r))
  return (hasStone || hasStoneChoice) && (hasOtherBuilding || hasOtherChoice)
}

Agricola.prototype.getTotalOccupationsInPlay = function() {
  let count = 0
  for (const player of this.players.all()) {
    count += player.getOccupationCount()
  }
  return count
}

Agricola.prototype.getCompleteStagesLeft = function() {
  // Stages: 1(r1-4), 2(r5-7), 3(r8-9), 4(r10-11), 5(r12-13), 6(r14)
  const stageStartRounds = [1, 5, 8, 10, 12, 14]
  const currentRound = this.state.round
  return stageStartRounds.filter(r => r > currentRound).length
}

Agricola.prototype.isAnimalAccumulationSpace = function(actionId) {
  const action = res.getActionById(actionId)
  if (!action || action.type !== 'accumulating') {
    return false
  }
  const acc = action.accumulates || {}
  return !!(acc.sheep || acc.boar || acc.cattle)
}

Agricola.prototype.actionSpaceGivesFood = function(actionId) {
  const action = res.getActionById(actionId)
  if (!action) {
    return false
  }
  return !!(action.gives && action.gives.food) || !!(action.accumulates && action.accumulates.food)
}

Agricola.prototype.isBuildingResourceAccumulationSpace = function(actionId) {
  const action = res.getActionById(actionId)
  if (!action || action.type !== 'accumulating') {
    return false
  }
  const acc = action.accumulates || {}
  return !!(acc.wood || acc.clay || acc.reed || acc.stone)
}

// getAccumulatedResources already defined above (line 351) with pre-take amount support

Agricola.prototype.allClayAccumulationSpacesUnoccupied = function() {
  for (const actionId of this.state.activeActions) {
    const action = res.getActionById(actionId)
    if (action && action.type === 'accumulating' && action.accumulates && action.accumulates.clay) {
      if (this.state.actionSpaces[actionId].occupiedBy) {
        return false
      }
    }
  }
  return true
}

Agricola.prototype.getStoneAccumulationSpacesWithStone = function() {
  let count = 0
  for (const actionId of this.state.activeActions) {
    const action = res.getActionById(actionId)
    if (action && action.type === 'accumulating' && action.accumulates && action.accumulates.stone) {
      if (this.state.actionSpaces[actionId].accumulated > 0) {
        count++
      }
    }
  }
  return count
}
