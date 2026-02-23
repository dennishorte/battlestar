const {
  Game,
} = require('../../lib/game.js')
const { Agricola } = require('../agricola.js')
const res = require('../res/index.js')


Agricola.prototype.workPhase = function() {
  this.log.add({ template: 'Work phase begins', event: 'work-phase' })
  this.log.indent()

  this._resetActionSpaces()
  this.callCardHook('onWorkPhaseStart')

  for (const player of this.players.all()) {
    player.resetRoundState()
  }

  this.players.passToPlayer(this.players.byName(this.state.startingPlayer))

  while (true) {
    const playerOrder = this.players.startingWithCurrent()
    let acted = false

    for (const player of playerOrder) {
      if (player.getAvailableWorkers() > 0) {
        this._handleActivePlayer(player)
        this.players.passToPlayer(this.players.following(player))
        acted = true
        break
      }
      else if (this._tryAlternativeWorkerSource(player)) {
        this.players.passToPlayer(this.players.following(player))
        acted = true
        break
      }
    }

    if (!acted) {
      break
    }
  }

  for (const player of this.players.all()) {
    this.callPlayerCardHook(player, 'onWorkPhaseEnd', player._lastActionId)
  }
  this._executeArchwayAction()

  this.log.outdent()
}

Agricola.prototype.playerTurn = function(player, options) {
  // Choose color on first turn if not already set
  Game.prototype.chooseColor.call(this, player)

  // Reset per-turn tracking for Cookery Lesson
  player._usedCookingThisTurn = false

  const availableActions = this.getAvailableActions(player, options)

  if (availableActions.length === 0) {
    this.log.add({
      template: '{player} has no available actions',
      args: { player },
    })
    return
  }

  // Build choice list
  const choices = availableActions.map(actionId => {
    const action = res.getActionById(actionId)
    const state = this.state.actionSpaces[actionId]

    const name = action ? action.name : state.name
    const choice = { id: actionId, label: name }
    if (action && action.type === 'accumulating' && state.accumulated > 0) {
      choice.detail = `${state.accumulated}`
    }
    return choice
  })

  // Sort alphabetically by label (only for version 3+)
  if (this.settings.version >= 3) {
    choices.sort((a, b) => a.label.localeCompare(b.label))
  }

  // Check for cards that modify worker placement (SourDough, WoodSaw, JobContract)
  const specialChoices = this._getSpecialPlacementChoices(player)
  for (const special of specialChoices) {
    choices.push(special)
  }

  const selectorChoices = choices.map(c => {
    if (c.detail) {
      return { title: c.label, detail: c.detail }
    }
    return c.label
  })

  const selection = this.actions.choose(
    player,
    selectorChoices,
    { title: 'Choose an action', min: 1, max: 1 }
  )

  // Find the selected action
  const selectedLabel = selection[0]
  const selectedChoice = choices.find(c => c.label === selectedLabel)

  // Handle special placement choices (no worker used or combined actions)
  if (selectedChoice && selectedChoice.special) {
    this._executeSpecialPlacement(player, selectedChoice)
    return
  }

  if (selectedChoice) {
    const actionId = selectedChoice.id
    const state = this.state.actionSpaces[actionId]
    const wasAlreadyOccupiedByUs = state.occupiedBy === player.name

    // Track previous occupier before overwriting (used by ParrotBreeder)
    state.previousOccupiedBy = state.occupiedBy

    // Mark action as occupied
    state.occupiedBy = player.name

    // Track last action for onWorkPhaseEnd hooks (e.g., Steam Machine)
    player._lastActionId = actionId

    // Track first action for BasketChair
    if (!player._firstActionThisRound) {
      player._firstActionThisRound = actionId
    }

    // Track fishing for card hooks
    if (actionId === 'fishing') {
      player.usedFishingThisRound = true
    }

    // Use a worker (skip for GuestRoom/WorkPermit bonus workers)
    if (!options?.skipUseWorker) {
      player.useWorker()
    }

    // Track which person number was placed here (used by SecondSpouse)
    state.personNumber = player.getPersonPlacedThisRound()

    // Call onBeforeAction hooks (e.g., Trellis builds fences before Pig Market)
    this.callPlayerCardHook(player, 'onBeforeAction', actionId)

    // Record unused spaces before action for onUseMultipleSpaces hook
    const unusedBefore = player.getUnusedSpaceCount()

    // Execute the action
    this.actions.executeAction(player, actionId)

    // Check if unused spaces were converted to used spaces
    const spacesUsed = unusedBefore - player.getUnusedSpaceCount()
    for (let i = 0; i < spacesUsed; i++) {
      this.callPlayerCardHook(player, 'onUseSpace')
    }
    if (spacesUsed >= 1) {
      this.callPlayerCardHook(player, 'onUseFarmyardSpace')
    }
    if (spacesUsed >= 2) {
      this.callPlayerCardHook(player, 'onUseMultipleSpaces', spacesUsed)
    }

    // Fire afterPlayerAction hook (not during bonus turns to prevent recursion)
    if (!options?.isBonusTurn) {
      this.callPlayerCardHook(player, 'afterPlayerAction', actionId)
    }

    // Check for unused once-per-round anytime actions
    if (!options?.isBonusTurn) {
      const unusedActions = this.getUnusedOncePerRoundActions(player)
      if (unusedActions.length > 0) {
        this.actions.choose(player, ['End turn'], {
          title: 'You have unused once-per-turn actions.',
          anytimeActions: unusedActions,
          noAutoRespond: true,
        })
      }
    }

    // Check for Cookery Lesson: Lessons action + cooking on same turn
    const isLessonsAction = actionId === 'occupation' || actionId.startsWith('lessons-')
    if (isLessonsAction && player._usedCookingThisTurn) {
      this.callPlayerCardHook(player, 'onLessonsWithCooking')
    }

    // Mummy's Boy: mark once-per-round double action as used
    if (wasAlreadyOccupiedByUs) {
      for (const card of player.getActiveCards()) {
        if (card.allowsDoubleAction) {
          player._usedMummysBoyDoubleAction = true
          break
        }
      }
    }

    // Call onPersonActionEnd hooks (fires on every person action including bonus turns)
    this.callPlayerCardHook(player, 'onPersonActionEnd', actionId)
  }
}

Agricola.prototype._getSpecialPlacementChoices = function(player) {
  const choices = []
  const cards = this.getPlayerActiveCards(player)

  for (const card of cards) {
    const mod = card.definition.modifiesWorkerPlacement
    if (!mod) {
      continue
    }

    if (mod === 'sourDough') {
      // SourDough: skip placement and bake bread instead (once per round)
      const state = this.cardState(card.id)
      if (state.lastUsedRound === this.state.round) {
        continue
      }
      if (!player.hasBakingAbility()) {
        continue
      }
      if (player.grain < 1) {
        continue
      }
      // All players must have at least 1 worker remaining
      const allHaveWorkers = this.players.all().every(p => p.getAvailableWorkers() >= 1)
      if (!allHaveWorkers) {
        continue
      }
      choices.push({
        id: 'sour-dough-bake',
        label: 'Bake Bread (Sour Dough)',
        special: 'sourDough',
        cardId: card.id,
      })
    }

    if (mod === 'woodSaw') {
      // WoodSaw: free Build Rooms when all others have more workers (family members)
      const allOthersHaveMore = this.players.all()
        .filter(p => p.name !== player.name)
        .every(p => p.getFamilySize() > player.getFamilySize())
      if (!allOthersHaveMore) {
        continue
      }
      // Check player can actually build rooms
      if (player.getValidRoomBuildSpaces().length === 0) {
        continue
      }
      if (!player.canAffordRoom()) {
        continue
      }
      choices.push({
        id: 'wood-saw-build',
        label: 'Build Rooms (Wood Saw)',
        special: 'woodSaw',
        cardId: card.id,
      })
    }

    if (mod === 'teaHouse') {
      // TeaHouse: skip 2nd placement, get 1 food (once per round)
      const state = this.cardState(card.id)
      if (state.lastUsedRound === this.state.round) {
        continue
      }
      if (player.getPersonPlacedThisRound() !== 1) {
        continue
      }
      choices.push({
        id: 'tea-house-skip',
        label: 'Skip placement (Tea House)',
        special: 'teaHouse',
        cardId: card.id,
      })
    }

    if (mod === 'jobContract') {
      // JobContract: combine Day Laborer + Lessons when both unoccupied
      const dlState = this.state.actionSpaces['day-laborer']
      const lessonsState = this.state.actionSpaces['occupation']
      if (!dlState || dlState.occupiedBy) {
        continue
      }
      if (!lessonsState || lessonsState.occupiedBy) {
        continue
      }
      choices.push({
        id: 'job-contract-combined',
        label: 'Day Laborer + Lessons (Job Contract)',
        special: 'jobContract',
        cardId: card.id,
      })
    }
  }

  return choices
}

Agricola.prototype._executeSpecialPlacement = function(player, choice) {
  if (choice.special === 'sourDough') {
    // Skip placement, bake bread instead
    this.cardState(choice.cardId).lastUsedRound = this.state.round
    this.log.add({
      template: '{player} skips placement and bakes bread (Sour Dough)',
      args: { player },
    })
    this.actions.bakeBread(player)
    return
  }

  if (choice.special === 'woodSaw') {
    // Free Build Rooms action — no worker used, no action space occupied
    this.log.add({
      template: '{player} takes Build Rooms without placing a person (Wood Saw)',
      args: { player },
    })
    this.actions.buildRoom(player)
    return
  }

  if (choice.special === 'teaHouse') {
    // Skip placement, get 1 food — worker NOT used, placed later naturally
    this.cardState(choice.cardId).lastUsedRound = this.state.round
    player.addResource('food', 1)
    this.log.add({
      template: '{player} skips placement and gets 1 food (Tea House)',
      args: { player },
    })
    return
  }

  if (choice.special === 'jobContract') {
    // Combined Day Laborer + Lessons — one worker, both spaces occupied
    this.state.actionSpaces['day-laborer'].occupiedBy = player.name
    this.state.actionSpaces['occupation'].occupiedBy = player.name
    player.useWorker()
    this.log.add({
      template: '{player} uses Job Contract: Day Laborer + Lessons',
      args: { player },
    })
    this.actions.executeAction(player, 'day-laborer')
    this.actions.executeAction(player, 'occupation')
    return
  }
}

Agricola.prototype.getAvailableActions = function(player, options) {
  const available = []

  for (const actionId of this.state.activeActions) {
    const state = this.state.actionSpaces[actionId]

    // Skip card-provided action spaces if requested (e.g., Archway extra action)
    if (options?.excludeCardSpaces && state.cardProvided) {
      continue
    }

    // Action must not be occupied (unless a card overrides this or options.allowOccupied)
    if (state.occupiedBy) {
      // BrotherlyLove: 4th person can use same space as 3rd
      if (options?.allowSameSpaceAs === actionId && state.occupiedBy === player.name) {
        // Allow through
      }
      else if (!options?.allowOccupied && !this.playerCanUseOccupiedSpace(player, actionId, state)) {
        continue
      }
    }

    // Action must not be blocked by linked space
    if (state.blockedBy) {
      continue
    }

    // Check if player can meaningfully take this action
    // (some actions might have prerequisites)
    if (this.canTakeAction(player, actionId)) {
      available.push(actionId)
    }
  }

  // Created action spaces (e.g. Forest Tallyman gap when Forest and Clay Pit occupied)
  for (const card of player.getActiveCards()) {
    const def = card.definition
    if (!def.createsActionSpace || typeof def.actionSpaceAvailable !== 'function') {
      continue
    }
    if (!def.actionSpaceAvailable(this, player)) {
      continue
    }
    const id = def.createsActionSpace
    if (available.includes(id)) {
      continue
    }
    if (!this.state.actionSpaces[id]) {
      this.state.actionSpaces[id] = {
        occupiedBy: null,
        cardProvided: true,
        cardId: def.id,
        ownerName: player.name,
        name: def.name + ' (gap)',
        description: def.text,
        ownerOnly: true,
      }
    }
    if (!this.state.actionSpaces[id].occupiedBy) {
      available.push(id)
    }
  }

  if (options?.allowedActions) {
    return available.filter(id => options.allowedActions.includes(id))
  }

  if (options?.excludeMeetingPlace) {
    return available.filter(id => id !== 'starting-player')
  }

  return available
}

Agricola.prototype.playerCanUseOccupiedSpace = function(player, actionId, state) {
  const action = res.getActionById(actionId)
  if (!action) {
    return false
  }

  for (const card of player.getActiveCards()) {
    if (card.hasHook('canUseOccupiedActionSpace')) {
      if (card.callHook('canUseOccupiedActionSpace', this, player, actionId, action, state)) {
        return true
      }
    }
    if (card.hasHook('allowsIgnoreOccupied')) {
      if (card.callHook('allowsIgnoreOccupied', player, actionId, this)) {
        return true
      }
    }
  }

  return false
}

Agricola.prototype.canTakeAction = function(player, actionId) {
  const action = res.getActionById(actionId)
  if (!action) {
    const state = this.state.actionSpaces[actionId]
    if (!state?.cardProvided) {
      return false
    }
    if (state.ownerOnly && state.ownerName !== player.name) {
      return false
    }
    const card = this.cards.byId(state.cardId)
    const owner = this.players.byName(state.ownerName)
    if (card.hasHook('canUseActionSpace') && !card.callHook('canUseActionSpace', this, player, owner)) {
      return false
    }
    return true
  }

  if (action.minRound && this.state.round < action.minRound) {
    return false
  }

  if (action.canTake) {
    return action.canTake(this, player)
  }

  return true
}

Agricola.prototype.registerCardActionSpace = function(player, card) {
  const def = card.definition
  if (!def.providesActionSpace || !def.actionSpaceId) {
    return
  }

  const id = def.actionSpaceId
  this.state.activeActions.push(id)
  this.state.actionSpaces[id] = {
    occupiedBy: null,
    cardProvided: true,
    cardId: def.id,
    ownerName: player.name,
    name: def.name,
    description: def.text,
    ownerOnly: def.ownerOnly || false,
  }

  this.log.add({
    template: '{player} adds {card} as an action space',
    args: { player, card },
  })
}
