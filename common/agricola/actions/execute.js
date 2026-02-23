const { AgricolaActionManager } = require('../AgricolaActionManager.js')
const res = require('../res/index.js')

AgricolaActionManager.prototype.renovationAndImprovement = function(player, availableImprovements, allowMinor = false) {
  // Step 1: Renovation is mandatory for this action
  // The renovate() method handles the choice between renovation types (e.g., wood→clay vs wood→stone)
  const didRenovate = this.renovate(player)

  if (!didRenovate) {
    // This shouldn't happen since we check canRenovate() in prerequisites,
    // but handle gracefully just in case
    this.log.add({
      template: '{player} cannot renovate',
      args: { player },
    })
    return false
  }

  // Step 2: After renovation, offer optional major/minor improvement
  // Check for House Redevelopment discount (Hunting Trophy)
  let houseRedevDiscount = 0
  for (const card of this.game.getPlayerActiveCards(player)) {
    if (card.definition.houseRedevelopmentDiscount) {
      houseRedevDiscount += card.definition.houseRedevelopmentDiscount
    }
  }
  if (houseRedevDiscount > 0) {
    player._houseRedevelopmentDiscount = houseRedevDiscount
  }

  if (allowMinor && this._offerRecruitmentFamilyGrowth(player)) {
    // Player chose Family Growth via Recruitment instead of improvement
  }
  else {
    this.buyImprovement(player, true, allowMinor)
  }

  delete player._houseRedevelopmentDiscount

  return true
}

// ---------------------------------------------------------------------------
// Renovation + Fencing action
// ---------------------------------------------------------------------------

AgricolaActionManager.prototype.renovationAndOrFencing = function(player) {
  const hasFarmRedevFreeFences = this.game.getPlayerActiveCards(player).some(c => c.definition.farmRedevelopmentFreeFences > 0)
  if (!player.canRenovate() && player.wood < 1 && player.getFreeFenceCount() <= 0 && !hasFarmRedevFreeFences) {
    this.log.add({
      template: '{player} cannot renovate or build fences',
      args: { player },
    })
    return false
  }

  const selection = this.choose(player, () => {
    const choices = []
    if (player.canRenovate()) {
      choices.push('Renovate')
    }
    const canFence = player.wood >= 1 || player.getFreeFenceCount() > 0 || hasFarmRedevFreeFences
    if (canFence) {
      choices.push('Build Fences')
    }
    if (player.canRenovate() && canFence) {
      choices.push('Renovate then Fences')
    }
    choices.push('Do Nothing')
    return choices
  }, {
    title: 'Choose action',
    min: 1,
    max: 1,
  })

  const choice = selection[0]

  if (choice === 'Do Nothing') {
    this.log.addDoNothing(player, 'renovate or fence')
    return true
  }

  if (choice === 'Renovate' || choice === 'Renovate then Fences') {
    this.renovate(player)
  }

  if (choice === 'Build Fences' || choice === 'Renovate then Fences') {
    let farmRedevFreeFences = 0
    for (const card of this.game.getPlayerActiveCards(player)) {
      if (card.definition.farmRedevelopmentFreeFences) {
        farmRedevFreeFences += card.definition.farmRedevelopmentFreeFences
      }
    }
    player._farmRedevelopmentFreeFences = farmRedevFreeFences

    this.buildFences(player)

    delete player._farmRedevelopmentFreeFences
  }

  return true
}

// ---------------------------------------------------------------------------
// Execute action space
// ---------------------------------------------------------------------------

AgricolaActionManager.prototype.executeAction = function(player, actionId) {
  const action = res.getActionById(actionId)
  if (!action) {
    const state = this.game.state.actionSpaces[actionId]
    if (state?.cardProvided) {
      return this.executeCardActionSpace(player, actionId, state)
    }
    this.log.add({
      template: 'Unknown action: {actionId}',
      args: { actionId },
    })
    return false
  }

  this.log.add({
    template: '{player} takes action: {action}',
    args: { player, action: action.name },
    event: 'player-action',
  })

  // Track current action for cards that need to know the context (e.g. Food Chest)
  this.game.state.currentActionId = actionId

  // Block linked space if this action has one
  this.game.blockLinkedSpace(actionId)

  // Handle accumulating actions
  if (action.type === 'accumulating') {
    // Capture accumulated amount before takeAccumulatedResource resets it
    const actionState = this.game.state.actionSpaces[actionId]
    const amountBefore = actionState ? actionState.accumulated : 0

    // Store pre-take amount so onAction hooks can query it via getAccumulatedResources
    this.game.state.lastAccumulated = { actionId, amount: amountBefore }

    const result = this.takeAccumulatedResource(player, actionId)
    if (result) {
      const details = {}
      if (action.accumulates) {
        for (const resource of Object.keys(action.accumulates)) {
          details[`${resource}Taken`] = amountBefore
        }
      }
      // Build resources object for onAction hooks (e.g. Mattock, Syrup Tap)
      const resources = {}
      if (action.accumulates) {
        for (const resource of Object.keys(action.accumulates)) {
          resources[resource] = amountBefore
        }
      }
      // Call hooks even for accumulating actions (pass resources so cards can check amounts, e.g. Cordmaker, MaterialDeliveryman)
      this.game.callPlayerCardHook(player, 'onAction', actionId, resources)
      this.callOnAnyActionHooks(player, actionId, resources)
    }

    this.game.state.lastAccumulated = null
    return result
  }

  // Handle instant actions based on their properties
  if (action.gives) {
    this.giveResources(player, action.gives)
  }

  if (action.allowsResourceChoice) {
    this.chooseResources(player, action)
  }

  if (action.startsPlayer) {
    this.takeStartingPlayer(player)
  }

  if (action.allowsPlowing && !action.allowsSowing) {
    let plowCount = action.allowsPlowing
    for (const card of this.game.getPlayerActiveCards(player)) {
      if (card.hasHook('modifyPlowCount')) {
        plowCount = card.callHook('modifyPlowCount', this.game, player, plowCount, action.id)
      }
    }
    for (let i = 0; i < plowCount; i++) {
      if (!this.plowField(player)) {
        break
      }
    }
  }

  if (action.allowsRoomBuilding || action.allowsStableBuilding) {
    this.buildRoomAndOrStable(player)
  }

  if (action.allowsFencing && !action.allowsRenovation) {
    this.buildFences(player)
  }

  if (action.allowsSowing && action.allowsBaking) {
    this.sowAndOrBake(player)
  }
  else if (action.allowsSowing && action.allowsPlowing) {
    this.plowAndOrSow(player)
  }
  else if (action.allowsSowing) {
    this.game.callPlayerCardHook(player, 'onBeforeSow')
    this.sow(player)
  }

  if (action.allowsFamilyGrowth) {
    this.familyGrowth(player, action.requiresRoom !== false)
  }

  if (action.allowsRenovation && action.allowsFencing) {
    this.renovationAndOrFencing(player)
  }
  else if (action.allowsRenovation && (action.allowsMajorImprovement || action.allowsMinorImprovement)) {
    this.renovationAndImprovement(player, this.game.getAvailableMajorImprovements(), action.allowsMinorImprovement)
  }
  else if (action.allowsRenovation) {
    this.renovate(player)
  }

  // Major or Minor Improvement action (without renovation)
  if ((action.allowsMajorImprovement || action.allowsMinorImprovement) && !action.allowsRenovation && !action.allowsFamilyGrowth) {
    if (action.allowsMinorImprovement && this._offerRecruitmentFamilyGrowth(player)) {
      // Player chose Family Growth via Recruitment instead of improvement
    }
    else {
      this.buyImprovement(player, action.allowsMajorImprovement, action.allowsMinorImprovement)
    }
  }

  // Minor improvement after family growth
  if (action.allowsMinorImprovement && action.allowsFamilyGrowth) {
    this.buyMinorImprovement(player)
  }

  if (action.allowsOccupation) {
    // onLessons hook fires before occupation cost is paid (e.g. Tasting)
    this.game.callPlayerCardHook(player, 'onLessons')
    this.playOccupation(player, {
      costOverride: action.occupationCost,
      firstTwoCost: action.firstTwoOccupationsCost,
    })
  }

  // 5-6 player expansion action handlers
  if (action.allowsHouseBuilding) {
    this.houseBuilding(player)
  }

  if (action.allowsAnimalMarket) {
    this.animalMarket(player)
  }

  if (action.allowsFarmSupplies) {
    this.farmSupplies(player)
  }

  if (action.allowsBuildingSupplies) {
    this.buildingSupplies(player)
  }

  if (action.allowsCorral) {
    this.corral(player)
  }

  if (action.allowsSideJob) {
    this.sideJob(player)
  }

  if (action.allowsMajorFromRound5) {
    this.improvementSix(player)
  }

  // Call onAction hooks for this player's cards
  this.game.callPlayerCardHook(player, 'onAction', actionId, action.gives || {})

  // Call onAnyAction hooks for ALL players' cards
  this.callOnAnyActionHooks(player, actionId)

  return true
}

// ---------------------------------------------------------------------------
// Card Hook Helpers
// ---------------------------------------------------------------------------

AgricolaActionManager.prototype.executeCardActionSpace = function(player, actionId, state) {
  const card = this.game.cards.byId(state.cardId)
  const owner = this.game.players.byName(state.ownerName)
  const def = card.definition

  if (def.onUseCreatedSpace) {
    def.onUseCreatedSpace(this.game, player)
    this.game.state.actionSpaces[actionId].occupiedBy = player.name
    return true
  }

  this.log.add({
    template: '{player} uses {card} action space',
    args: { player, card },
  })

  if (card.hasHook('onActionSpaceUsed')) {
    card.callHook('onActionSpaceUsed', this.game, player, owner)
  }

  this.game.callPlayerCardHook(player, 'onAction', actionId, {})
  this.callOnAnyActionHooks(player, actionId)
  return true
}
