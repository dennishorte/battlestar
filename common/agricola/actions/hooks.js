const { AgricolaActionManager } = require('../AgricolaActionManager.js')

/**
 * Call onAnyAction hook on ALL players' cards
 */
AgricolaActionManager.prototype.callOnAnyActionHooks = function(actingPlayer, actionId, detailsOrResources) {
  for (const player of this.game.players.all()) {
    const cards = this.game.getPlayerActiveCards(player)
    for (const card of cards) {
      if (card.hasHook('onAnyAction')) {
        card.callHook('onAnyAction', this.game, actingPlayer, actionId, player, detailsOrResources)
      }
    }
  }
}

/**
 * Call onAnyBuildImprovement hooks on ALL players' cards
 */
AgricolaActionManager.prototype.callOnAnyBuildImprovementHooks = function(actingPlayer, cost, improvement) {
  for (const player of this.game.players.all()) {
    const cards = this.game.getPlayerActiveCards(player)
    for (const card of cards) {
      if (card.hasHook('onAnyPlayImprovement')) {
        card.callHook('onAnyPlayImprovement', this.game, actingPlayer, player, improvement)
      }
    }
  }
}

/**
 * Call onAnyBuildMajor hook on ALL players' cards
 */
AgricolaActionManager.prototype.callOnAnyBuildMajorHooks = function(actingPlayer, improvementId) {
  for (const player of this.game.players.all()) {
    const cards = this.game.getPlayerActiveCards(player)
    for (const card of cards) {
      if (card.hasHook('onAnyBuildMajor')) {
        card.callHook('onAnyBuildMajor', this.game, actingPlayer, player, improvementId)
      }
    }
  }
}

/**
 * Call onAnyBeforeSow hook on all OTHER players' cards (before acting player sows)
 */
AgricolaActionManager.prototype.callOnAnyBeforeSowHooks = function(actingPlayer) {
  for (const other of this.game.players.all()) {
    if (other === actingPlayer) {
      continue
    }
    const cards = this.game.getPlayerActiveCards(other)
    for (const card of cards) {
      if (card.hasHook('onAnyBeforeSow')) {
        card.callHook('onAnyBeforeSow', this.game, actingPlayer, other)
      }
    }
  }
}

/**
 * Offer wood for food exchange (Basket, Mushroom Collector)
 */
AgricolaActionManager.prototype.offerWoodForFoodExchange = function(player, card, exchange) {
  const choices = [
    `Exchange ${exchange.wood} wood for ${exchange.food} food`,
    'Skip',
  ]
  const selection = this.choose(player, choices, {
    title: `${card.name}: Exchange wood for food?`,
    min: 1,
    max: 1,
  })

  if (selection[0] !== 'Skip') {
    player.payCost({ wood: exchange.wood })
    player.addResource('food', exchange.food)
    this.log.add({
      template: '{player} exchanges {wood} wood for {food} food using {card}',
      args: { player, wood: exchange.wood, food: exchange.food, card: card },
    })
    // Put wood back on accumulation space (per card text)
    const actionSpace = this.game.state.actionSpaces['take-wood']
    if (actionSpace) {
      actionSpace.accumulated += exchange.wood
    }
  }
}

/**
 * Offer to buy 1 bonus point for foodCost (e.g. Curator, Furniture Carpenter).
 */
AgricolaActionManager.prototype.offerBuyBonusPoint = function(player, card, foodCost) {
  if (player.food < foodCost) {
    return
  }
  const selection = this.choose(player, [
    `Buy 1 bonus point for ${foodCost} food`,
    'Skip',
  ], {
    title: `${card.name}: Buy bonus point for food?`,
    min: 1,
    max: 1,
  })
  if (selection[0] !== 'Skip') {
    player.payCost({ food: foodCost })
    player.addBonusPoints(1)
    this.log.add({
      template: '{player} buys 1 bonus point for {cost} food via {card}',
      args: { player, cost: foodCost, card },
    })
  }
}

/**
 * Offer to buy additional animal (Animal Dealer)
 */
AgricolaActionManager.prototype.offerBuyAnimal = function(player, card, animalType) {
  if (player.food < 1 && this.game.getAnytimeFoodConversionOptions(player).length === 0) {
    return
  }
  if (!player.canPlaceAnimals(animalType, 1)) {
    return
  }

  const choices = [
    `Buy 1 ${animalType} for 1 food`,
    'Skip',
  ]
  const selection = this.choose(player, choices, {
    title: `${card.name}: Buy additional animal?`,
    min: 1,
    max: 1,
  })

  if (selection[0] !== 'Skip') {
    player.payCost({ food: 1 })
    this.handleAnimalPlacement(player, { [animalType]: 1 })
    this.log.add({
      template: '{player} buys 1 {animal} for 1 food using {card}',
      args: { player, animal: animalType, card: card },
    })
  }
}

/**
 * Offer resource choice (Seasonal Worker, Animal Tamer)
 */
AgricolaActionManager.prototype.offerResourceChoice = function(player, card, resources) {
  const choices = resources.map(r => `Take 1 ${r}`)
  const selection = this.choose(player, choices, {
    title: `${card.name}: Choose resource`,
    min: 1,
    max: 1,
  })

  const chosen = resources.find(r => selection[0].includes(r))
  if (chosen) {
    player.addResource(chosen, 1)
    this.log.add({
      template: '{player} chooses 1 {resource} from {card}',
      args: { player, resource: chosen, card: card },
    })
  }
}

/**
 * Build a free stable (Mining Hammer, Stable Planner). Optional card for title/log.
 */
AgricolaActionManager.prototype.buildFreeStable = function(player, card) {
  const validSpaces = player.getValidStableBuildSpaces()
  if (validSpaces.length === 0) {
    this.log.add({
      template: '{player} has no valid space for a stable',
      args: { player },
    })
    return
  }

  const cardName = card?.name || 'Mining Hammer'
  const spaceChoices = validSpaces.map(s => `${s.row},${s.col}`)
  spaceChoices.push('Skip')
  const selection = this.choose(player, spaceChoices, {
    title: `${cardName}: Build a free stable?`,
    min: 1,
    max: 1,
  })

  if (selection[0] !== 'Skip') {
    const [row, col] = selection[0].split(',').map(Number)
    player.buildStable(row, col)

    this.log.add({
      template: '{player} builds a free stable using {card}',
      args: { player, card: card || { name: 'Mining Hammer' } },
    })
  }
}

/**
 * Offer to place another person immediately (Lazy Sowman, Stock Protector).
 * opts: { allowOccupied?: boolean, excludeMeetingPlace?: boolean }
 */
AgricolaActionManager.prototype.offerExtraPerson = function(player, card, opts = {}) {
  const choices = ['Place another person', 'Skip']
  const selection = this.choose(player, choices, {
    title: `${card.name}: Place another person?`,
    min: 1,
    max: 1,
  })
  if (selection[0] === 'Skip') {
    return
  }
  this.log.add({
    template: '{player} uses {card} to place another person',
    args: { player, card },
  })
  const beforeWorkers = player.availableWorkers
  player.availableWorkers = (player.availableWorkers || 0) + 1
  this.log.indent()
  this.game.playerTurn(player, {
    isBonusTurn: true,
    allowOccupied: opts.allowOccupied || false,
    excludeMeetingPlace: opts.excludeMeetingPlace || false,
  })
  this.log.outdent()
  if (player.availableWorkers > beforeWorkers) {
    player.availableWorkers = beforeWorkers
  }
}

/**
 * Offer to build a stable for 1 wood (Groom)
 */
AgricolaActionManager.prototype.offerBuildStableForWood = function(player, card) {
  const stableCost = player.getStableCost({ wood: 1 })
  if (!player.canAffordCost(stableCost)) {
    return
  }

  const validSpaces = player.getValidStableBuildSpaces()
  if (validSpaces.length === 0) {
    return
  }

  const spaceChoices = validSpaces.map(s => `Build stable at ${s.row},${s.col}`)
  spaceChoices.push('Skip')
  const selection = this.choose(player, spaceChoices, {
    title: `${card.name}: Build a stable?`,
    min: 1,
    max: 1,
  })

  if (selection[0] !== 'Skip') {
    const match = selection[0].match(/(\d+),(\d+)/)
    if (match) {
      const row = parseInt(match[1])
      const col = parseInt(match[2])
      player.payCost(stableCost)
      player.buildStable(row, col)
      this.log.add({
        template: '{player} builds a stable using {card}',
        args: { player, card: card },
      })
    }
  }
}

/**
 * Offer to play an occupation with a custom cost (e.g., Night School Student, Market Master)
 * Delegates to playOccupation with the specified cost override.
 */
AgricolaActionManager.prototype.offerPlayOccupation = function(player, card, options = {}) {
  const costObj = options.cost || {}
  const foodCost = costObj.food || 0
  return this.playOccupation(player, { costOverride: foodCost })
}

/**
 * Pass a minor improvement card to the player on the left, if it has passLeft.
 * Moves the card from the current player's minorImprovements zone to
 * the left player's hand zone.
 */
AgricolaActionManager.prototype.maybePassLeft = function(player, cardId) {
  const card = this.game.cards.byId(cardId)
  if (!card || !card.passLeft) {
    return
  }

  const leftPlayer = this.game.players.leftOf(player)
  if (!leftPlayer || leftPlayer === player) {
    return
  }

  // Move card from played zone to left player's hand zone
  const leftHandZone = this.game.zones.byPlayer(leftPlayer, 'hand')
  card.moveTo(leftHandZone)

  this.log.add({
    template: '{card} is passed to {playerNext}',
    args: { card: card, playerNext: leftPlayer },
  })
}

// ---------------------------------------------------------------------------
// 5-6 Player Expansion Action Handlers
// ---------------------------------------------------------------------------

/**
 * House Building action: Build rooms using standard room cost (with modifiers)
 */
AgricolaActionManager.prototype.houseBuilding = function(player) {
  const validSpaces = player.getValidRoomBuildSpaces()
  if (validSpaces.length === 0) {
    this.log.addDoNothing(player, 'build rooms')
    return false
  }

  if (!player.canAffordRoom()) {
    this.log.add({
      template: '{player} cannot afford house building',
      args: { player },
    })
    return false
  }

  const roomType = player.roomType

  // Build rooms loop
  let roomsBuilt = 0
  while (true) {
    const currentValidSpaces = player.getValidRoomBuildSpaces()
    if (currentValidSpaces.length === 0) {
      break
    }

    if (!player.canAffordRoom()) {
      break
    }

    const selection = this.choose(player, () => {
      const curSpaces = player.getValidRoomBuildSpaces()
      const spaceChoices = curSpaces.map(s => `${s.row},${s.col}`)
      spaceChoices.push('Done building rooms')
      return spaceChoices
    }, {
      title: 'Build a room',
      min: 1,
      max: 1,
    })

    if (selection[0] === 'Done building rooms') {
      break
    }

    const [row, col] = selection[0].split(',').map(Number)

    // Choose cost option (handles wood substitution from Frame Builder, etc.)
    const affordableOptions = player.getAffordableRoomCostOptions()
    let chosenCost
    if (affordableOptions.length > 1) {
      const costChoices = affordableOptions.map(opt => this._formatCostLabel(opt.cost))
      const costSelection = this.choose(player, costChoices, {
        title: 'Choose payment for room',
        min: 1,
        max: 1,
      })
      const selectedIdx = costChoices.indexOf(costSelection[0])
      chosenCost = affordableOptions[selectedIdx].cost
    }
    else {
      chosenCost = affordableOptions[0].cost
    }

    player.payCost(chosenCost)
    player.buildRoom(row, col)
    roomsBuilt++

    this.log.add({
      template: '{player} builds a {type} room at ({row},{col})',
      args: { player, type: roomType, row, col },
    })

    this.game.callPlayerCardHook(player, 'onBuildRoom', roomType)
  }

  if (roomsBuilt === 0) {
    this.log.addDoNothing(player, 'build rooms')
  }
  else {
    // Call onAnyBuildRoom hooks on all players' cards (Twibil)
    for (const otherPlayer of this.game.players.all()) {
      const cards = this.game.getPlayerActiveCards(otherPlayer)
      for (const card of cards) {
        if (card.hasHook('onAnyBuildRoom')) {
          card.callHook('onAnyBuildRoom', this.game, otherPlayer, player, roomType)
        }
      }
    }
  }

  return roomsBuilt > 0
}

/**
 * Animal Market action: Choose sheep (+1 food) or cattle (costs 1 food)
 */
AgricolaActionManager.prototype.animalMarket = function(player) {
  const canSheep = player.canPlaceAnimals('sheep', 1)
  const canPayFood = player.food >= 1 || this.game.getAnytimeFoodConversionOptions(player).length > 0
  const canCattle = canPayFood && player.canPlaceAnimals('cattle', 1)

  if (!canSheep && !canCattle) {
    this.log.add({
      template: '{player} cannot take any animals from the market',
      args: { player },
    })
    return false
  }

  const selection = this.choose(player, () => {
    const choices = []
    if (player.canPlaceAnimals('sheep', 1)) {
      choices.push('Take 1 sheep and 1 food')
    }
    const curCanPay = player.food >= 1 || this.game.getAnytimeFoodConversionOptions(player).length > 0
    if (curCanPay && player.canPlaceAnimals('cattle', 1)) {
      choices.push('Pay 1 food for 1 cattle')
    }
    choices.push('Do nothing')
    return choices
  }, {
    title: 'Animal Market',
    min: 1,
    max: 1,
  })

  if (selection[0] === 'Do nothing') {
    this.log.addDoNothing(player, 'take animal')
    return true
  }

  if (selection[0] === 'Take 1 sheep and 1 food') {
    this.handleAnimalPlacement(player, { sheep: 1 })
    player.addResource('food', 1)
    this.log.add({
      template: '{player} takes 1 sheep and 1 food from the Animal Market',
      args: { player },
    })
  }
  else if (selection[0] === 'Pay 1 food for 1 cattle') {
    player.payCost({ food: 1 })
    this.handleAnimalPlacement(player, { cattle: 1 })
    this.log.add({
      template: '{player} pays 1 food for 1 cattle from the Animal Market',
      args: { player },
    })
  }

  return true
}

/**
 * Farm Supplies action: 1 grain for 1 food, and/or plow 1 field for 1 food
 */
AgricolaActionManager.prototype.farmSupplies = function(player) {
  const canPayFood = player.food >= 1 || this.game.getAnytimeFoodConversionOptions(player).length > 0

  if (!canPayFood) {
    this.log.add({
      template: '{player} cannot afford farm supplies',
      args: { player },
    })
    return false
  }

  let didSomething = false

  // Offer grain for food
  if (canPayFood) {
    const grainChoices = ['Buy 1 grain for 1 food', 'Skip grain']
    const grainSelection = this.choose(player, grainChoices, {
      title: 'Farm Supplies: Buy grain?',
      min: 1,
      max: 1,
    })

    if (grainSelection[0] === 'Buy 1 grain for 1 food') {
      player.payCost({ food: 1 })
      player.addResource('grain', 1)
      this.log.add({
        template: '{player} buys 1 grain for 1 food',
        args: { player },
      })
      didSomething = true
    }
  }

  // Offer plow for food (check affordability again)
  const canStillPayFood = player.food >= 1 || this.game.getAnytimeFoodConversionOptions(player).length > 0
  const canPlow = player.getValidPlowSpaces().length > 0

  if (canStillPayFood && canPlow) {
    const plowChoices = ['Plow 1 field for 1 food', 'Skip plowing']
    const plowSelection = this.choose(player, plowChoices, {
      title: 'Farm Supplies: Plow field?',
      min: 1,
      max: 1,
    })

    if (plowSelection[0] === 'Plow 1 field for 1 food') {
      player.payCost({ food: 1 })
      this.plowField(player)
      didSomething = true
    }
  }

  if (!didSomething) {
    this.log.addDoNothing(player, 'use farm supplies')
  }

  return true
}

/**
 * Building Supplies action: 1 food + (reed or stone) + (wood or clay)
 */
AgricolaActionManager.prototype.buildingSupplies = function(player) {
  // Give 1 food
  player.addResource('food', 1)
  this.log.add({
    template: '{player} receives 1 food',
    args: { player },
  })

  // Choose reed or stone
  const choice1Selection = this.choose(player, ['Reed', 'Stone'], {
    title: 'Building Supplies: Choose first resource',
    min: 1,
    max: 1,
  })
  const firstResource = choice1Selection[0].toLowerCase()
  player.addResource(firstResource, 1)
  this.log.add({
    template: '{player} takes 1 {resource}',
    args: { player, resource: firstResource },
  })

  // Choose wood or clay
  const choice2Selection = this.choose(player, ['Wood', 'Clay'], {
    title: 'Building Supplies: Choose second resource',
    min: 1,
    max: 1,
  })
  const secondResource = choice2Selection[0].toLowerCase()
  player.addResource(secondResource, 1)
  this.log.add({
    template: '{player} takes 1 {resource}',
    args: { player, resource: secondResource },
  })

  return true
}

/**
 * Corral action: Get animal you don't have (sheep → boar → cattle order)
 */
AgricolaActionManager.prototype.corral = function(player) {
  const animals = player.getAllAnimals()

  // Find first animal type player doesn't have
  let animalToGet = null
  if (animals.sheep === 0 && player.canPlaceAnimals('sheep', 1)) {
    animalToGet = 'sheep'
  }
  else if (animals.boar === 0 && player.canPlaceAnimals('boar', 1)) {
    animalToGet = 'boar'
  }
  else if (animals.cattle === 0 && player.canPlaceAnimals('cattle', 1)) {
    animalToGet = 'cattle'
  }

  if (!animalToGet) {
    this.log.add({
      template: '{player} has all animal types or cannot house more animals',
      args: { player },
    })
    return false
  }

  player.placeAnimals(animalToGet, 1)
  this.log.add({
    template: '{player} takes 1 {animal} from the Corral',
    args: { player, animal: animalToGet },
  })

  return true
}

/**
 * Side Job action: Build 1 stable for 1 wood + optional bake bread
 */
AgricolaActionManager.prototype.sideJob = function(player) {
  let didSomething = false

  // Build stable for 1 wood (base cost, subject to modifiers)
  const stableCost = player.getStableCost({ wood: 1 })
  const canBuildStable = player.canAffordCost(stableCost) && player.getValidStableBuildSpaces().length > 0

  if (canBuildStable) {
    const stableChoices = ['Build stable', 'Skip stable']
    const stableSelection = this.choose(player, stableChoices, {
      title: 'Side Job: Build a stable?',
      min: 1,
      max: 1,
    })

    if (stableSelection[0] === 'Build stable') {
      player.payCost(stableCost)
      this.buildStable(player)
      didSomething = true
    }
  }

  // Optional bake bread
  if (player.hasBakingAbility() && player.grain >= 1) {
    this.bakeBread(player)
    didSomething = true
  }

  if (!didSomething) {
    this.log.addDoNothing(player, 'do side job')
  }

  return true
}

AgricolaActionManager.prototype.offerPlow = function(player, card) {
  const validSpaces = player.getValidPlowSpaces()
  if (validSpaces.length === 0) {
    return
  }

  const choices = ['Plow 1 field', 'Skip']
  const selection = this.choose(player, choices, {
    title: `${card.name}: Plow 1 field?`,
    min: 1,
    max: 1,
  })

  if (selection[0] !== 'Skip') {
    this.plowField(player)
  }
}

AgricolaActionManager.prototype.improvementSix = function(player) {
  const currentRound = this.game.state.round
  const allowMajor = currentRound >= 5

  if (allowMajor) {
    return this.buyImprovement(player, true, true)
  }
  else {
    return this.buyMinorImprovement(player)
  }
}

AgricolaActionManager.prototype.returnWorkerHome = function(player, workerIndex) {
  if (workerIndex === 0 && player._firstActionThisRound) {
    const actionId = player._firstActionThisRound
    const state = this.game.state.actionSpaces[actionId]
    if (state && state.occupiedBy === player.name) {
      state.occupiedBy = null
    }
    player.availableWorkers++
  }
}

AgricolaActionManager.prototype.buildFreeRoom = function(player, card) {
  const validSpaces = player.getValidRoomBuildSpaces()
  if (validSpaces.length === 0) {
    this.log.add({
      template: '{player} has no valid space for a room',
      args: { player },
    })
    return false
  }

  const spaceChoices = validSpaces.map(s => `${s.row},${s.col}`)

  const selector = {
    type: 'select',
    actor: player.name,
    title: 'Choose where to build the free room',
    choices: spaceChoices,
    min: 1,
    max: 1,
    allowsAction: 'build-room',
    validSpaces: validSpaces,
    help: 'You can also click on the farmyard to select.',
  }

  const result = this.game.requestInputSingle(selector)

  let row, col
  if (result.action === 'build-room') {
    row = result.row
    col = result.col
    const isValid = validSpaces.some(s => s.row === row && s.col === col)
    if (!isValid) {
      throw new Error(`Invalid room space: (${row}, ${col})`)
    }
  }
  else {
    [row, col] = result[0].split(',').map(Number)
  }

  const roomType = player.roomType
  player.buildRoom(row, col)

  this.log.add({
    template: '{player} uses {card} to build a free {type} room at ({row},{col})',
    args: { player, card, type: roomType, row, col },
  })

  this.game.callPlayerCardHook(player, 'onBuildRoom', roomType)

  // Call onAnyBuildRoom hooks on all players' cards (Twibil)
  for (const otherPlayer of this.game.players.all()) {
    const cards = this.game.getPlayerActiveCards(otherPlayer)
    for (const card2 of cards) {
      if (card2.hasHook('onAnyBuildRoom')) {
        card2.callHook('onAnyBuildRoom', this.game, otherPlayer, player, roomType)
      }
    }
  }

  return true
}

AgricolaActionManager.prototype.familyGrowthWithoutRoom = function(player) {
  return this.familyGrowth(player, false)
}
