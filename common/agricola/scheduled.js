const { Agricola } = require('./agricola')

/**
 * Schedule a resource delivery for a future round.
 * Returns true if scheduled, false if round is past the game end.
 */
Agricola.prototype.scheduleResource = function(player, type, round, amount) {
  if (round > 14) {
    return false
  }
  const stateKey = `scheduled${type[0].toUpperCase()}${type.slice(1)}`
  if (!this.state[stateKey]) {
    this.state[stateKey] = {}
  }
  if (!this.state[stateKey][player.name]) {
    this.state[stateKey][player.name] = {}
  }
  this.state[stateKey][player.name][round] =
    (this.state[stateKey][player.name][round] || 0) + amount
  return true
}

/**
 * Schedule an event for a future round (plows, freeStables, freeOccupation).
 * Returns true if scheduled, false if round is past the game end.
 */
Agricola.prototype.scheduleEvent = function(player, type, round) {
  if (round > 14) {
    return false
  }
  const stateKey = `scheduled${type[0].toUpperCase()}${type.slice(1)}`
  if (!this.state[stateKey]) {
    this.state[stateKey] = {}
  }
  if (!this.state[stateKey][player.name]) {
    this.state[stateKey][player.name] = []
  }
  this.state[stateKey][player.name].push(round)
  return true
}

/**
 * Collect scheduled resources from cards (food, vegetables, clay, etc.)
 */
Agricola.prototype.collectScheduledResources = function(player) {
  const round = this.state.round

  // Scheduled food (Pond Hut, Wall Builder)
  if (this.state.scheduledFood?.[player.name]?.[round]) {
    const amount = this.state.scheduledFood[player.name][round]
    player.addResource('food', amount)
    this.log.add({
      template: '{player} receives {amount} scheduled food',
      args: { player, amount },
    })
    delete this.state.scheduledFood[player.name][round]
  }

  // Scheduled vegetables (Large Greenhouse)
  if (this.state.scheduledVegetables?.[player.name]?.[round]) {
    const amount = this.state.scheduledVegetables[player.name][round]
    player.addResource('vegetables', amount)
    this.log.add({
      template: '{player} receives {amount} scheduled vegetables',
      args: { player, amount },
    })
    delete this.state.scheduledVegetables[player.name][round]
  }

  // Scheduled clay (Clay Hut Builder)
  if (this.state.scheduledClay?.[player.name]?.[round]) {
    const amount = this.state.scheduledClay[player.name][round]
    player.addResource('clay', amount)
    this.log.add({
      template: '{player} receives {amount} scheduled clay',
      args: { player, amount },
    })
    delete this.state.scheduledClay[player.name][round]
  }

  // Scheduled wood (Ceilings, Thick Forest)
  if (this.state.scheduledWood?.[player.name]?.[round]) {
    const amount = this.state.scheduledWood[player.name][round]
    player.addResource('wood', amount)
    this.log.add({
      template: '{player} receives {amount} scheduled wood',
      args: { player, amount },
    })
    delete this.state.scheduledWood[player.name][round]
  }

  // Scheduled grain (Sack Cart, Grain Depot)
  if (this.state.scheduledGrain?.[player.name]?.[round]) {
    const amount = this.state.scheduledGrain[player.name][round]
    player.addResource('grain', amount)
    this.log.add({
      template: '{player} receives {amount} scheduled grain',
      args: { player, amount },
    })
    delete this.state.scheduledGrain[player.name][round]
  }

  // Scheduled reed (Reed Belt)
  if (this.state.scheduledReed?.[player.name]?.[round]) {
    const amount = this.state.scheduledReed[player.name][round]
    player.addResource('reed', amount)
    this.log.add({
      template: '{player} receives {amount} scheduled reed',
      args: { player, amount },
    })
    delete this.state.scheduledReed[player.name][round]
  }

  // Scheduled stone (Club House)
  if (this.state.scheduledStone?.[player.name]?.[round]) {
    const amount = this.state.scheduledStone[player.name][round]
    player.addResource('stone', amount)
    this.log.add({
      template: '{player} receives {amount} scheduled stone',
      args: { player, amount },
    })
    delete this.state.scheduledStone[player.name][round]
  }

  // Scheduled sheep (Sheep Whisperer)
  if (this.state.scheduledSheep?.[player.name]?.[round]) {
    const amount = this.state.scheduledSheep[player.name][round]
    this.actions.handleAnimalPlacement(player, { sheep: amount })
    this.log.add({
      template: '{player} receives {amount} scheduled sheep',
      args: { player, amount },
    })
    delete this.state.scheduledSheep[player.name][round]
  }

  // Scheduled boar (Acorns Basket)
  if (this.state.scheduledBoar?.[player.name]?.[round]) {
    const amount = this.state.scheduledBoar[player.name][round]
    this.actions.handleAnimalPlacement(player, { boar: amount })
    this.log.add({
      template: '{player} receives {amount} scheduled wild boar',
      args: { player, amount },
    })
    delete this.state.scheduledBoar[player.name][round]
  }

  // Scheduled plows (Handplow, Chain Float)
  if (this.state.scheduledPlows?.[player.name]?.includes(round)) {
    this.offerScheduledPlow(player)
    this.state.scheduledPlows[player.name] = this.state.scheduledPlows[player.name].filter(r => r !== round)
  }

  // Scheduled stone rooms (Hawktower)
  if (this.state.scheduledStoneRooms?.[player.name]?.includes(round)) {
    this.offerScheduledStoneRoom(player)
    this.state.scheduledStoneRooms[player.name] =
      this.state.scheduledStoneRooms[player.name].filter(r => r !== round)
  }

  // Scheduled free stables (Stable Planner)
  if (this.state.scheduledFreeStables?.[player.name]?.includes(round)) {
    this.actions.buildFreeStable(player)
    this.state.scheduledFreeStables[player.name] =
      this.state.scheduledFreeStables[player.name].filter(r => r !== round)
  }
}

/**
 * Offer player the option to plow a field for food (Plow Driver: 1 food; Shifting Cultivator: 3 food).
 */
Agricola.prototype.offerPlowForFood = function(player, card, foodCost) {
  const cost = foodCost ?? 1
  if (player.food < cost && this.getAnytimeFoodConversionOptions(player).length === 0) {
    return
  }

  const choices = [`Plow 1 field for ${cost} food`, 'Skip']
  const selection = this.actions.choose(player, choices, {
    title: `${card.name}: Plow for food?`,
    min: 1,
    max: 1,
  })

  if (selection[0] !== 'Skip') {
    player.payCost({ food: cost })
    this.actions.plowField(player, { immediate: true })
  }
}

/**
 * Offer player a scheduled plow (Handplow)
 */
Agricola.prototype.offerScheduledPlow = function(player) {
  const choices = ['Plow 1 field (Handplow)', 'Skip']
  const selection = this.actions.choose(player, choices, {
    title: 'Handplow: Plow scheduled field?',
    min: 1,
    max: 1,
  })

  if (selection[0] === 'Plow 1 field (Handplow)') {
    this.actions.plowField(player, { immediate: true })
  }
}

/**
 * Offer player a scheduled free stone room (Hawktower)
 */
Agricola.prototype.offerScheduledStoneRoom = function(player) {
  if (player.roomType !== 'stone') {
    this.log.add({
      template: '{player} discards the Hawktower room (not in stone house)',
      args: { player },
    })
    return
  }

  const validSpaces = player.getValidRoomBuildSpaces()
  if (validSpaces.length === 0) {
    this.log.add({
      template: '{player} has no valid space for the Hawktower room',
      args: { player },
    })
    return
  }

  const choices = ['Build free stone room (Hawktower)', 'Skip']
  const selection = this.actions.choose(player, choices, {
    title: 'Hawktower: Build free stone room?',
    min: 1,
    max: 1,
  })

  if (selection[0] === 'Build free stone room (Hawktower)') {
    const spaceChoices = validSpaces.map(s => `${s.row},${s.col}`)

    const selector = {
      type: 'select',
      actor: player.name,
      title: 'Choose where to build the stone room (Hawktower)',
      choices: spaceChoices,
      min: 1,
      max: 1,
      allowsAction: 'build-room',
      validSpaces: validSpaces,
    }

    const result = this.requestInputSingle(selector)

    let row, col
    if (result.action === 'build-room') {
      row = result.row
      col = result.col
    }
    else {
      [row, col] = result[0].split(',').map(Number)
    }

    player.buildRoom(row, col)

    this.log.add({
      template: '{player} builds a free stone room at ({row},{col}) via Hawktower',
      args: { player, row, col },
    })

    this.callPlayerCardHook(player, 'onBuildRoom', 'stone')
  }
}
