const { AgricolaActionManager } = require('../AgricolaActionManager.js')
const res = require('../res/index.js')

AgricolaActionManager.prototype.buildRoomAndOrStable = function(player) {
  // Check what player can afford and has space for
  const canBuildRoom = player.canAffordRoom() && player.getValidRoomBuildSpaces().length > 0
  const canBuildStable = player.canAffordStable() && player.getValidStableBuildSpaces().length > 0

  if (!canBuildRoom && !canBuildStable) {
    this.log.add({
      template: '{player} cannot afford to build anything',
      args: { player },
    })
    return false
  }

  let builtAnything = false
  player._farmExpansionWoodPaid = 0
  let builtRoomType = null
  let builtStable = false

  // Loop: keep offering build choices until the player is done or can't afford more
  while (true) {
    const curCanBuildRoom = player.canAffordRoom() && player.getValidRoomBuildSpaces().length > 0
    const curCanBuildStable = player.canAffordStable() && player.getValidStableBuildSpaces().length > 0

    if (!curCanBuildRoom && !curCanBuildStable) {
      break
    }

    const selection = this.choose(player, () => {
      // Re-evaluate inside function wrapper for anytime action support
      const canRoom = player.canAffordRoom() && player.getValidRoomBuildSpaces().length > 0
      const canStable = player.canAffordStable() && player.getValidStableBuildSpaces().length > 0

      const hasMultiRoom = canRoom && player.hasMultiRoomDiscount()
      const multiRoomOptions = []
      if (hasMultiRoom) {
        const availableSpaces = player.getValidRoomBuildSpaces().length
        for (let count = 2; count <= availableSpaces; count++) {
          const cost = player.getMultiRoomCost(count)
          if (player.canAffordCost(cost)) {
            multiRoomOptions.push(count)
          }
          else {
            break
          }
        }
      }

      const choices = []
      if (canRoom) {
        choices.push('Build Room')
      }
      for (const count of multiRoomOptions) {
        choices.push(`Build ${count} Rooms`)
      }
      if (canStable) {
        choices.push('Build Stable')
      }
      choices.push('Done Building')
      return choices
    }, {
      title: 'Choose what to build',
      min: 1,
      max: 1,
    })

    const choice = selection[0]

    if (choice === 'Done Building') {
      break
    }

    // Handle multi-room building
    const multiMatch = choice.match(/^Build (\d+) Rooms$/)
    if (multiMatch) {
      const count = parseInt(multiMatch[1])
      this.buildMultipleRooms(player, count)
      builtAnything = true
      continue
    }

    if (choice === 'Build Room') {
      this.buildRoom(player)
      builtAnything = true
      builtRoomType = player.roomType
    }

    if (choice === 'Build Stable') {
      const stableCost = player.getStableCost(res.buildingCosts.stable)
      player.payCost(stableCost)
      player._farmExpansionWoodPaid = (player._farmExpansionWoodPaid || 0) + (stableCost.wood || 0)
      this.buildStable(player)
      builtAnything = true
      builtStable = true
    }
  }

  const totalWoodPaid = player._farmExpansionWoodPaid
  delete player._farmExpansionWoodPaid
  if (totalWoodPaid > 0) {
    this.game.callPlayerCardHook(player, 'onFarmExpansion', totalWoodPaid)
  }

  if (builtRoomType && builtStable) {
    this.game.callPlayerCardHook(player, 'onBuildRoomAndStable', builtRoomType)
  }

  if (!builtAnything) {
    this.log.addDoNothing(player, 'build')
  }

  return true
}

AgricolaActionManager.prototype.buildMultipleRooms = function(player, count) {
  const cost = player.getMultiRoomCost(count)
  player.payCost(cost)
  player._farmExpansionWoodPaid = (player._farmExpansionWoodPaid || 0) + (cost.wood || 0)
  const roomType = player.roomType

  for (let i = 0; i < count; i++) {
    const validSpaces = player.getValidRoomBuildSpaces()
    if (validSpaces.length === 0) {
      break
    }

    const spaceChoices = validSpaces.map(s => `${s.row},${s.col}`)
    const result = this.game.requestInputSingle({
      type: 'select',
      actor: player.name,
      title: `Choose where to build room ${i + 1} of ${count}`,
      choices: spaceChoices,
      min: 1,
      max: 1,
      allowsAction: 'build-room',
      validSpaces: validSpaces,
      help: 'You can also click on the farmyard to select.',
    })

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
      template: '{player} builds a {type} room at ({row},{col})',
      args: { player, type: roomType, row, col },
    })
  }

  // Call onBuildRoom hooks for the multi-room build
  this.game.callPlayerCardHook(player, 'onBuildRoom', roomType, count)

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

AgricolaActionManager.prototype.buildRoom = function(player, opts = {}) {
  const validSpaces = player.getValidRoomBuildSpaces()
  if (validSpaces.length === 0) {
    this.log.add({
      template: '{player} has no valid space for a room',
      args: { player },
    })
    return false
  }

  const roomType = player.roomType
  const riparianDiscount = opts.riparianBuilderCard ? (roomType === 'clay' ? { clay: 1 } : roomType === 'stone' ? { stone: 2 } : null) : null
  const resourceDiscount = opts.discount || null

  // Build choices as coordinate strings for dropdown fallback
  const spaceChoices = validSpaces.map(s => `${s.row},${s.col}`)

  // Request input - supports both dropdown selection and direct farm board clicks
  const selector = {
    type: 'select',
    actor: player.name,
    title: 'Choose where to build the room',
    choices: spaceChoices,
    min: 1,
    max: 1,
    // Mark this as accepting action-based input for room building
    allowsAction: 'build-room',
    validSpaces: validSpaces,
    help: 'You can also click on the farmyard to select.',
  }

  const result = this.game.requestInputSingle(selector)

  // Handle action-based response (from clicking the farm board)
  let row, col
  if (result.action === 'build-room') {
    row = result.row
    col = result.col
    // Validate that the selected space is valid
    const isValid = validSpaces.some(s => s.row === row && s.col === col)
    if (!isValid) {
      throw new Error(`Invalid room space: (${row}, ${col}) is not a valid space to build a room`)
    }
  }
  else {
    // Handle standard selection response
    [row, col] = result[0].split(',').map(Number)
  }

  // costOverride: skip normal cost calculation, pay only the override (e.g. free room from ResourceRecycler)
  if (opts.costOverride) {
    player.payCost(opts.costOverride)
    player.buildRoom(row, col)
    this.log.add({
      template: '{player} builds a {type} room at ({row},{col})',
      args: { player, type: roomType, row, col },
    })
    this.game.callPlayerCardHook(player, 'onBuildRoom', roomType)
    for (const otherPlayer of this.game.players.all()) {
      const cards = this.game.getPlayerActiveCards(otherPlayer)
      for (const card of cards) {
        if (card.hasHook('onAnyBuildRoom')) {
          card.callHook('onAnyBuildRoom', this.game, otherPlayer, player, roomType)
        }
      }
    }
    return true
  }

  // Choose cost — present options if Frame Builder (or similar) offers alternatives; apply Riparian Builder or generic resource discount when building from that offer
  let affordableOptions = player.getAffordableRoomCostOptions()
  if (riparianDiscount || resourceDiscount) {
    const baseOptions = player.getRoomCostOptions()
    affordableOptions = baseOptions.map(opt => {
      const cost = { ...opt.cost }
      if (riparianDiscount) {
        if (riparianDiscount.clay) {
          cost.clay = Math.max(0, (cost.clay || 0) - riparianDiscount.clay)
        }
        if (riparianDiscount.stone) {
          cost.stone = Math.max(0, (cost.stone || 0) - riparianDiscount.stone)
        }
      }
      if (resourceDiscount) {
        for (const [resource, amount] of Object.entries(resourceDiscount)) {
          if (amount) {
            cost[resource] = Math.max(0, (cost[resource] || 0) - amount)
          }
        }
      }
      return { cost, label: opt.label }
    }).filter(opt => player.canAffordCost(opt.cost))
    if (affordableOptions.length === 0) {
      this.log.add({
        template: '{player} cannot afford a room even with discount',
        args: { player },
      })
      return false
    }
  }
  let chosenCost
  if (affordableOptions.length > 1) {
    const costChoices = affordableOptions.map(opt => this._formatCostLabel(opt.cost))
    const selection = this.choose(player, costChoices, {
      title: 'Choose payment for room',
      min: 1,
      max: 1,
    })
    const selectedIdx = costChoices.indexOf(selection[0])
    chosenCost = affordableOptions[selectedIdx].cost
  }
  else {
    chosenCost = affordableOptions[0].cost
  }

  player.payCost(chosenCost)
  player._farmExpansionWoodPaid = (player._farmExpansionWoodPaid || 0) + (chosenCost.wood || 0)
  player.buildRoom(row, col)

  this.log.add({
    template: '{player} builds a {type} room at ({row},{col})',
    args: { player, type: roomType, row, col },
  })

  // Call onBuildRoom hooks (Roughcaster, Wall Builder)
  this.game.callPlayerCardHook(player, 'onBuildRoom', roomType)

  // Call onAnyBuildRoom hooks on all players' cards (Twibil)
  for (const otherPlayer of this.game.players.all()) {
    const cards = this.game.getPlayerActiveCards(otherPlayer)
    for (const card of cards) {
      if (card.hasHook('onAnyBuildRoom')) {
        card.callHook('onAnyBuildRoom', this.game, otherPlayer, player, roomType)
      }
    }
  }

  return true
}

AgricolaActionManager.prototype.buildStable = function(player) {
  const validSpaces = player.getValidStableBuildSpaces()
  if (validSpaces.length === 0) {
    this.log.add({
      template: '{player} has no valid space for a stable',
      args: { player },
    })
    return false
  }

  // Build choices as coordinate strings for dropdown fallback
  const spaceChoices = validSpaces.map(s => `${s.row},${s.col}`)

  // Request input - supports both dropdown selection and direct farm board clicks
  const selector = {
    type: 'select',
    actor: player.name,
    title: 'Choose where to build the stable',
    choices: spaceChoices,
    min: 1,
    max: 1,
    // Mark this as accepting action-based input for stable building
    allowsAction: 'build-stable',
    validSpaces: validSpaces,
    help: 'You can also click on the farmyard to select.',
  }

  const result = this.game.requestInputSingle(selector)

  // Handle action-based response (from clicking the farm board)
  let row, col
  if (result.action === 'build-stable') {
    row = result.row
    col = result.col
    // Validate that the selected space is valid
    const isValid = validSpaces.some(s => s.row === row && s.col === col)
    if (!isValid) {
      throw new Error(`Invalid stable space: (${row}, ${col}) is not a valid space to build a stable`)
    }
  }
  else {
    // Handle standard selection response
    [row, col] = result[0].split(',').map(Number)
  }

  player.buildStable(row, col)

  this.log.add({
    template: '{player} builds a stable at ({row},{col})',
    args: { player, row, col },
  })

  this.game.callPlayerCardHook(player, 'onBuildStable', player.getStableCount())

  return true
}

/**
 * Central function for completing a renovation (post-selection).
 * Handles cost payment, room type change, grid update, hasRenovated flag,
 * logging, and all renovation hooks.
 *
 * @param {object} player
 * @param {string} targetType     — 'clay' or 'stone'
 * @param {object} [options]
 * @param {object} [options.cost]             — cost to pay (omit for free)
 * @param {string} [options.logTemplate]      — custom log template
 * @param {object} [options.logArgs]          — extra log args merged with { player, old, new }
 * @param {boolean} [options.skipBeforeHooks] — suppress onBeforeRenovateToStone
 */
AgricolaActionManager.prototype._completeRenovation = function(player, targetType, options = {}) {
  const oldType = player.roomType

  // Fire onBeforeRenovateToStone hooks (e.g. Hammer Crusher gives resources)
  if (targetType === 'stone' && !options.skipBeforeHooks) {
    this.game.callPlayerCardHook(player, 'onBeforeRenovateToStone')
  }

  // Pay cost if provided
  if (options.cost) {
    player.payCost(options.cost)
  }

  // Update room type and grid
  player.roomType = targetType
  for (let row = 0; row < res.constants.farmyardRows; row++) {
    for (let col = 0; col < res.constants.farmyardCols; col++) {
      if (player.farmyard.grid[row][col].type === 'room') {
        player.farmyard.grid[row][col].roomType = targetType
      }
    }
  }
  player.hasRenovated = true

  // Log
  if (options.logTemplate) {
    this.log.add({
      template: options.logTemplate,
      args: { player, old: oldType, new: targetType, ...(options.logArgs || {}) },
    })
  }
  else {
    this.log.add({
      template: '{player} renovates from {old} to {new}',
      args: { player, old: oldType, new: targetType },
    })
  }

  // Fire onRenovate hooks on player's cards (Roughcaster)
  this.game.callPlayerCardHook(player, 'onRenovate', oldType, targetType)

  // Fire onAnyRenovate hooks on all players' cards (Margrave, RecycledBrick, PatternMaker, etc.)
  const roomCount = player.getRoomCount()
  for (const otherPlayer of this.game.players.all()) {
    const cards = this.game.getPlayerActiveCards(otherPlayer)
    for (const card of cards) {
      if (card.hasHook('onAnyRenovate')) {
        card.callHook('onAnyRenovate', this.game, player, otherPlayer, { oldType, newType: targetType, roomCount })
      }
    }
  }

  // Fire onAnyRenovateToStone hooks on all players' cards (Recycled Brick)
  if (targetType === 'stone') {
    for (const otherPlayer of this.game.players.all()) {
      const cards = this.game.getPlayerActiveCards(otherPlayer)
      for (const card of cards) {
        if (card.hasHook('onAnyRenovateToStone')) {
          card.callHook('onAnyRenovateToStone', this.game, player, otherPlayer, roomCount)
        }
      }
    }
  }

  return true
}

AgricolaActionManager.prototype.renovate = function(player) {
  // Check card hooks for renovation modifications (e.g., WoodSlideHammer)
  let renovationMods = {}
  for (const card of this.game.getPlayerActiveCards(player)) {
    if (card.hasHook('modifyRenovation')) {
      renovationMods = card.callHook('modifyRenovation', player, renovationMods)
    }
  }

  // Check if Conservator or card hooks allow direct wood→stone renovation
  let targetType
  if (player.roomType === 'wood' && (player.canRenovateDirectlyToStone() || renovationMods.canSkipToStone)) {
    const canClay = player.canRenovate()       // standard wood→clay
    const canStone = player.canRenovate('stone') // direct wood→stone

    if (canClay && canStone) {
      const selection = this.choose(player, ['Renovate to Clay', 'Renovate to Stone'], {
        title: 'Choose renovation type',
        min: 1,
        max: 1,
      })
      targetType = selection[0] === 'Renovate to Stone' ? 'stone' : undefined
    }
    else if (canStone) {
      targetType = 'stone'
    }
    else if (!canClay) {
      this.log.add({
        template: '{player} cannot afford to renovate',
        args: { player },
      })
      return false
    }
  }
  else {
    // Call onBeforeRenovateToStone hooks BEFORE affordability check
    // (e.g., Hammer Crusher gives resources needed for renovation)
    if (player.roomType === 'clay') {
      this.game.callPlayerCardHook(player, 'onBeforeRenovateToStone')
    }

    if (!player.canRenovate()) {
      this.log.add({
        template: '{player} cannot afford to renovate',
        args: { player },
      })
      return false
    }
  }

  // For Conservator→stone path, fire hook after choice (affordability already verified)
  if (targetType === 'stone') {
    this.game.callPlayerCardHook(player, 'onBeforeRenovateToStone')
  }

  // Choose cost — present options if Frame Builder (or similar) offers alternatives
  const affordableRenovationOptions = player.getAffordableRenovationCostOptions(targetType)
  let chosenRenovationCost
  if (affordableRenovationOptions.length > 1) {
    const costChoices = affordableRenovationOptions.map(opt => this._formatCostLabel(opt.cost))
    const selection = this.choose(player, costChoices, {
      title: 'Choose payment for renovation',
      min: 1,
      max: 1,
    })
    const selectedIdx = costChoices.indexOf(selection[0])
    chosenRenovationCost = affordableRenovationOptions[selectedIdx].cost
  }
  else if (affordableRenovationOptions.length === 1) {
    chosenRenovationCost = affordableRenovationOptions[0].cost
  }

  const resolvedType = targetType || res.houseMaterialUpgrades[player.roomType]
  return this._completeRenovation(player, resolvedType, {
    cost: chosenRenovationCost,
    skipBeforeHooks: true,
  })
}

AgricolaActionManager.prototype.offerRenovation = function(player, card) {
  if (!player.canRenovate() && !(player.roomType === 'wood' && player.canRenovateDirectlyToStone())) {
    this.log.add({
      template: '{player} cannot renovate ({card})',
      args: { player, card: card.name },
    })
    return false
  }
  return this.renovate(player)
}

/**
 * Free renovation helper for cards that grant a no-cost renovation.
 *
 * @param {object} player
 * @param {object} [options]
 * @param {object} [options.card]        - the card triggering this (used in default log message)
 * @param {string} [options.targetType]  - force a specific target (e.g. 'clay'); skips choice logic
 * @param {boolean} [options.canSkip]    - if true, adds a "Skip" option; returns false if skipped
 * @param {string} [options.title]       - title for the choice dialog
 * @param {string} [options.logTemplate] - override log template
 * @param {object} [options.logArgs]     - extra log args
 *
 * @returns {string|false} target type string if renovation happened, false if skipped/impossible
 */
AgricolaActionManager.prototype.freeRenovation = function(player, options = {}) {
  let targetType = options.targetType

  if (!targetType) {
    if (player.roomType === 'wood' && player.canRenovateDirectlyToStone()) {
      // Can go to clay or stone — let the player choose
      const choices = ['Renovate to Clay for free', 'Renovate to Stone for free']
      if (options.canSkip) {
        choices.push('Skip')
      }

      const title = options.title || (options.card ? `${options.card.name}: Renovate for free?` : 'Renovate for free?')
      const selection = this.choose(player, choices, { title, min: 1, max: 1 })

      if (selection[0] === 'Skip') {
        return false
      }
      targetType = selection[0].includes('Stone') ? 'stone' : 'clay'
    }
    else {
      targetType = res.houseMaterialUpgrades[player.roomType]
      if (!targetType) {
        return false
      }

      if (options.canSkip) {
        const title = options.title || (options.card ? `${options.card.name}: Renovate for free?` : 'Renovate for free?')
        const selection = this.choose(player, [
          `Renovate from ${player.roomType} to ${targetType} for free`,
          'Skip',
        ], { title, min: 1, max: 1 })
        if (selection[0] === 'Skip') {
          return false
        }
      }
    }
  }

  const logTemplate = options.logTemplate || (options.card
    ? '{player} renovates from {old} to {new} for free using {card}'
    : '{player} renovates from {old} to {new} for free')
  const logArgs = options.card ? { card: options.card, ...(options.logArgs || {}) } : (options.logArgs || {})

  this._completeRenovation(player, targetType, { logTemplate, logArgs })
  return targetType
}

