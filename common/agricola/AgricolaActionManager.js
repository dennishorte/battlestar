const { BaseActionManager } = require('../lib/game/index.js')
const res = require('./res/index.js')


class AgricolaActionManager extends BaseActionManager {
  constructor(game) {
    super(game)
  }

  // ---------------------------------------------------------------------------
  // Stats tracking
  // ---------------------------------------------------------------------------

  _recordCardPlayed(player, card) {
    if (!this.game.stats) {
      return
    }

    const cardId = card.id
    const setId = card.definition?.deck || 'major'

    this.game.stats.cards.played[cardId] = {
      name: card.name,
      type: card.type,
      setId: setId,
      playedBy: player.name,
      roundPlayed: this.game.state.round,
    }

    if (this.game.stats.players[player.name]) {
      this.game.stats.players[player.name].played.push(cardId)
    }
  }

  // ---------------------------------------------------------------------------
  // Cost choice helpers
  // ---------------------------------------------------------------------------

  _formatCostLabel(cost) {
    const parts = Object.entries(cost).map(([resource, amount]) => `${amount} ${resource}`)
    return parts.join(', ') || 'free'
  }

  _applyBuildingResourceDiscount(player, cost, discount) {
    const buildingResources = ['wood', 'clay', 'stone', 'reed'].filter(r => (cost[r] || 0) > 0)
    if (buildingResources.length === 0 || discount <= 0) {
      return cost
    }

    const modified = { ...cost }
    if (buildingResources.length === 1) {
      modified[buildingResources[0]] = Math.max(0, modified[buildingResources[0]] - discount)
    }
    else {
      const choices = buildingResources.map(r => `Reduce ${r} by 1`)
      const selection = this.choose(player, choices, {
        title: 'Choose building resource discount',
        min: 1,
        max: 1,
      })
      const chosenResource = buildingResources[choices.indexOf(selection[0])]
      modified[chosenResource] = Math.max(0, modified[chosenResource] - discount)
    }
    return modified
  }

  _playMinorWithCostChoice(player, cardId) {
    const card = this.game.cards.byId(cardId)
    const affordableOptions = player.getAffordableCardCostOptions(cardId)

    let chosenCost
    if (affordableOptions.length > 1) {
      const costChoices = affordableOptions.map(opt => this._formatCostLabel(opt.cost))
      const selection = this.choose(player, costChoices, {
        title: `Choose payment for ${card.name}`,
        min: 1,
        max: 1,
      })
      const selectedIdx = costChoices.indexOf(selection[0])
      chosenCost = affordableOptions[selectedIdx].cost
    }
    else {
      chosenCost = affordableOptions[0].cost
    }

    // Apply House Redevelopment discount (Hunting Trophy)
    if ((player._houseRedevelopmentDiscount || 0) > 0) {
      chosenCost = this._applyBuildingResourceDiscount(player, chosenCost, player._houseRedevelopmentDiscount)
    }

    player.playCard(cardId)
    this._recordCardPlayed(player, card)

    this.log.add({
      template: '{player} plays {card}',
      args: { player, card: card },
    })
    player.payCardCost(cardId, chosenCost)

    if (card.hasHook('onPlay')) {
      card.callHook('onPlay', this.game, player, chosenCost)
    }

    this.game.registerCardActionSpace(player, card)
    this.game.callPlayerCardHook(player, 'onBuildImprovement', chosenCost, card)
    this.callOnAnyBuildImprovementHooks(player, chosenCost, card)
    this.maybePassLeft(player, cardId)
  }

  // ---------------------------------------------------------------------------
  // Anytime actions support
  // ---------------------------------------------------------------------------

  choose(player, choicesOrFn, opts = {}) {
    while (true) {
      const choices = typeof choicesOrFn === 'function' ? choicesOrFn() : choicesOrFn
      const anytimeActions = this.game.getAnytimeActions(player)
      const hasAnytime = anytimeActions.length > 0

      const result = super.choose(player, choices, {
        ...opts,
        anytimeActions: hasAnytime ? anytimeActions : undefined,
        noAutoRespond: hasAnytime || undefined,
      })

      if (result && result.action === 'anytime-action') {
        this.game.executeAnytimeAction(player, result.anytimeAction)
        continue
      }

      return result
    }
  }

  // ---------------------------------------------------------------------------
  // Resource collection actions
  // ---------------------------------------------------------------------------

  takeAccumulatedResource(player, actionId) {
    const actionState = this.game.state.actionSpaces[actionId]
    if (!actionState || actionState.accumulated === 0) {
      return false
    }

    const action = res.getActionById(actionId)
    if (!action || !action.accumulates) {
      return false
    }

    // Give all accumulated resources
    for (const [resource] of Object.entries(action.accumulates)) {
      this.log.add({
        template: '{player} takes {amount} {resource}',
        args: { player, amount: actionState.accumulated, resource },
      })

      if (resource === 'sheep' || resource === 'boar' || resource === 'cattle') {
        // Animals need placement
        const count = actionState.accumulated
        const allAccommodated = player.canPlaceAnimals(resource, count)

        // PetGrower (and similar cards) require manual placement so the player
        // can choose to leave the house pet slot empty for their bonus
        const forceModal = this.game.getPlayerActiveCards(player)
          .some(c => c.definition.forceManualAnimalPlacement)

        if (forceModal) {
          this.handleAnimalPlacement(player, { [resource]: count }, { forceModal: true })
        }
        else if (allAccommodated) {
          player.addAnimals(resource, count)
        }
        else {
          this.handleAnimalOverflow(player, resource, count)
        }

        this.game.callPlayerCardHook(player, 'onTakeAnimals', resource, count, allAccommodated)
        if (resource === 'boar') {
          this.game.callPlayerCardHook(player, 'onGainBoar', count, true)
        }
      }
      else {
        player.addResource(resource, actionState.accumulated)
        if (resource === 'wood') {
          player._lastWoodTaken = actionState.accumulated
        }
        this.game.callPlayerCardHook(player, 'onObtainResource', resource, actionState.accumulated)
      }
    }

    actionState.accumulated = 0

    if (action.accumulates.wood) {
      this.game.callPlayerCardHook(player, 'onGainWood')
    }

    // Give bonus resources placed on this space by card effects (e.g. Outskirts Director)
    if (actionState.bonusResources) {
      for (const [resource, amount] of Object.entries(actionState.bonusResources)) {
        if (amount > 0) {
          player.addResource(resource, amount)
          this.log.add({
            template: '{player} takes {amount} bonus {resource}',
            args: { player, amount, resource },
          })
        }
      }
      actionState.bonusResources = null
    }

    // Some accumulating actions also give instant resources (e.g., Riverbank Forest)
    if (action.gives) {
      this.giveResources(player, action.gives)
    }

    return true
  }

  /**
   * Handle placement of animals when they don't all fit.
   * For version 4+: Uses new modal with full placement control.
   * For version 3 and earlier: Uses legacy per-animal-type Cook/Release choices.
   * @param {Object} player - The player receiving animals
   * @param {Object} animals - Map of animal type to count, e.g. { sheep: 3, boar: 1 }
   */
  handleAnimalPlacement(player, animals, options = {}) {
    // Version 4+: New unified modal flow
    // Try to place as many as possible first (unless forced to show modal)
    const overflow = {}
    if (options.forceModal) {
      Object.assign(overflow, animals)
    }
    else {
      for (const [animalType, count] of Object.entries(animals)) {
        let remaining = count
        while (remaining > 0 && player.canPlaceAnimals(animalType, 1)) {
          player.addAnimals(animalType, 1)
          remaining--
        }
        if (remaining > 0) {
          overflow[animalType] = remaining
        }
      }

      // If everything fit, we're done
      if (Object.keys(overflow).length === 0) {
        return
      }
    }


    // There's overflow - show placement modal
    const locations = player.getAnimalPlacementLocationsWithAvailability()
    const cookingRates = this.getCookingRates(player)

    const choices = ['Place Animals']
    if (player.hasCookingAbility()) {
      choices.push('Cook', 'Release')
    }
    else {
      choices.push('Release')
    }

    const result = this.choose(player, choices, {
      type: 'animal-placement',
      incoming: overflow,
      locations,
      cookingRates,
    })

    // Check response format - new modal returns object with action/placements
    if (result && result.action === 'animal-placement' && result.placements) {
      const applyResult = player.applyAnimalPlacements({
        placements: result.placements,
        overflow: result.overflow,
        incoming: overflow,
      })

      if (applyResult.success) {
        this.logAnimalPlacements(player, result, applyResult)
      }
      else {
        this.log.add({
          template: 'Error placing animals: {error}',
          args: { error: applyResult.error },
        })
      }
      return
    }

    // Fallback for simple Cook/Release response
    const selection = Array.isArray(result) ? result : [result]

    for (const [animalType, remaining] of Object.entries(overflow)) {
      this.log.add({
        template: '{player} cannot house {count} {animal}',
        args: { player, count: remaining, animal: animalType },
      })

      if (selection.includes('Cook') && player.hasCookingAbility()) {
        const food = player.cookAnimal(animalType, remaining)
        this.log.add({
          template: '{player} cooks {count} {animal} for {food} food',
          args: { player, count: remaining, animal: animalType, food },
        })
      }
      else {
        this.log.add({
          template: '{player} releases {count} {animal}',
          args: { player, count: remaining, animal: animalType },
        })
      }
    }
  }

  /**
   * Get cooking rates for the player's cooking improvement.
   * @param {Object} player
   * @returns {Object|null} { improvementName, rates: { sheep: n, boar: n, cattle: n } }
   */
  getCookingRates(player) {
    const imp = player.getCookingImprovement()
    if (!imp || !imp.abilities || !imp.abilities.cookingRates) {
      return null
    }
    return {
      improvementName: imp.name,
      rates: imp.abilities.cookingRates,
    }
  }

  /**
   * Log the results of animal placement.
   */
  logAnimalPlacements(player, result, applyResult) {
    // Log placements by location
    const placementsByLoc = {}
    for (const p of result.placements) {
      if (p.count > 0) {
        if (!placementsByLoc[p.locationId]) {
          placementsByLoc[p.locationId] = []
        }
        placementsByLoc[p.locationId].push(`${p.count} ${p.animalType}`)
      }
    }

    for (const [locId, placed] of Object.entries(placementsByLoc)) {
      this.log.add({
        template: '{player} places {animals} at {location}',
        args: { player, animals: placed.join(', '), location: locId },
      })
    }

    // Log cooking
    if (result.overflow?.cook) {
      for (const [animalType, count] of Object.entries(result.overflow.cook)) {
        if (count > 0) {
          this.log.add({
            template: '{player} cooks {count} {animal}',
            args: { player, count, animal: animalType },
          })
        }
      }
    }
    if (applyResult.cooked) {
      this.log.add({
        template: '{player} gains {food} food from cooking',
        args: { player, food: applyResult.cooked.food },
      })
    }

    // Log releases
    if (result.overflow?.release) {
      for (const [animalType, count] of Object.entries(result.overflow.release)) {
        if (count > 0) {
          this.log.add({
            template: '{player} releases {count} {animal}',
            args: { player, count, animal: animalType },
          })
        }
      }
    }
  }

  // Entry point for animal overflow - redirects to unified handler
  handleAnimalOverflow(player, animalType, count) {
    this.handleAnimalPlacement(player, { [animalType]: count })
  }

  giveResources(player, resources) {
    for (const [resource, amount] of Object.entries(resources)) {
      player.addResource(resource, amount)
      this.log.add({
        template: '{player} receives {amount} {resource}',
        args: { player, amount, resource },
      })
      this.game.callPlayerCardHook(player, 'onObtainResource', resource, amount)
    }

    if (resources.grain) {
      this.game.callPlayerCardHook(player, 'onGainGrain', resources.grain)
    }
  }

  // Handle action that lets player choose from resource options
  chooseResources(player, action) {
    const options = action.allowsResourceChoice
    const count = action.choiceCount || 1
    const mustBeDifferent = action.choiceMustBeDifferent || false

    if (count === 1) {
      // Single choice
      const selection = this.choose(player, options, {
        title: 'Choose a resource',
        min: 1,
        max: 1,
      })

      player.addResource(selection[0], 1)
      this.log.add({
        template: '{player} takes 1 {resource}',
        args: { player, resource: selection[0] },
      })
    }
    else if (count === 2 && mustBeDifferent) {
      // Two different choices (Resource Market)
      const firstSelection = this.choose(player, options, {
        title: 'Choose first resource',
        min: 1,
        max: 1,
      })

      const firstResource = firstSelection[0]
      player.addResource(firstResource, 1)

      const remainingOptions = options.filter(r => r !== firstResource)
      const secondSelection = this.choose(player, remainingOptions, {
        title: 'Choose second resource (must be different)',
        min: 1,
        max: 1,
      })

      const secondResource = secondSelection[0]
      player.addResource(secondResource, 1)

      this.log.add({
        template: '{player} takes 1 {first} and 1 {second}',
        args: { player, first: firstResource, second: secondResource },
      })
    }
    else {
      // Multiple same choices allowed
      for (let i = 0; i < count; i++) {
        const selection = this.choose(player, options, {
          title: `Choose resource ${i + 1} of ${count}`,
          min: 1,
          max: 1,
        })

        player.addResource(selection[0], 1)
        this.log.add({
          template: '{player} takes 1 {resource}',
          args: { player, resource: selection[0] },
        })
      }
    }

    return true
  }

  // ---------------------------------------------------------------------------
  // Building actions
  // ---------------------------------------------------------------------------

  buildRoomAndOrStable(player) {
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

  buildMultipleRooms(player, count) {
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

  buildRoom(player, opts = {}) {
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

  buildStable(player) {
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

  renovate(player) {
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

    const oldType = player.roomType
    player.renovate(targetType, chosenRenovationCost)
    const newType = player.roomType

    this.log.add({
      template: '{player} renovates from {old} to {new}',
      args: { player, old: oldType, new: newType },
    })

    // Call onRenovate hooks (Roughcaster)
    this.game.callPlayerCardHook(player, 'onRenovate', oldType, newType)

    // Call onAnyRenovate hooks on all players' cards (Margrave, RecycledBrick, PatternMaker, etc.)
    const roomCount = player.getRoomCount()
    for (const otherPlayer of this.game.players.all()) {
      const cards = this.game.getPlayerActiveCards(otherPlayer)
      for (const card of cards) {
        if (card.hasHook('onAnyRenovate')) {
          card.callHook('onAnyRenovate', this.game, player, otherPlayer, { oldType, newType, roomCount })
        }
      }
    }

    // Call onAnyRenovateToStone hooks on all players' cards (Recycled Brick)
    if (newType === 'stone') {
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

  offerRenovation(player, card) {
    if (!player.canRenovate() && !(player.roomType === 'wood' && player.canRenovateDirectlyToStone())) {
      this.log.add({
        template: '{player} cannot renovate ({card})',
        args: { player, card: card.name },
      })
      return false
    }
    return this.renovate(player)
  }

  // ---------------------------------------------------------------------------
  // Farming actions
  // ---------------------------------------------------------------------------

  plowField(player, options = {}) {
    const validSpaces = options.zigzagPattern
      ? this._getZigzagPlowSpaces(player)
      : options.allowNonAdjacent
        ? player.getEmptySpaces().filter(s => !player.isRestrictedByFutureBuildingSite(s.row, s.col))
        : player.getValidPlowSpaces()
    if (validSpaces.length === 0) {
      this.log.add({
        template: '{player} has no valid space to plow',
        args: { player },
      })
      return false
    }

    // Build choices as coordinate strings for dropdown fallback
    const spaceChoices = validSpaces.map(s => `${s.row},${s.col}`)

    // Request input - supports both dropdown selection and direct farm board clicks
    // UI can send either:
    //   - A selection like "0,1" from the dropdown
    //   - An action like { action: 'plow-space', row: 0, col: 1 } from clicking the board
    const selector = {
      type: 'select',
      actor: player.name,
      title: 'Choose where to plow a field',
      choices: spaceChoices,
      min: 1,
      max: 1,
      // Mark this as accepting action-based input for plowing
      allowsAction: 'plow-space',
      validSpaces: validSpaces,
    }

    const result = this.game.requestInputSingle(selector)

    // Handle action-based response (from clicking the farm board)
    let row, col
    if (result.action === 'plow-space') {
      row = result.row
      col = result.col
      // Validate that the selected space is valid
      const isValid = validSpaces.some(s => s.row === row && s.col === col)
      if (!isValid) {
        throw new Error(`Invalid plow space: (${row}, ${col}) is not a valid space to plow`)
      }
    }
    else {
      // Handle standard selection response
      [row, col] = result[0].split(',').map(Number)
    }

    if (options.allowNonAdjacent || options.zigzagPattern) {
      player.setSpace(row, col, { type: 'field', crop: null, cropCount: 0 })
    }
    else {
      player.plowField(row, col)
    }

    this.log.add({
      template: '{player} plows a field at ({row},{col})',
      args: { player, row, col },
    })

    this.game.callPlayerCardHook(player, 'onPlowField')

    return true
  }

  _getZigzagPlowSpaces(player) {
    // S/Z tetromino orientations (4 offsets each)
    const shapes = [
      [[0,0],[1,0],[1,1],[2,1]], // S vertical
      [[0,1],[1,1],[1,0],[2,0]], // Z vertical
      [[0,0],[0,1],[1,1],[1,2]], // S horizontal
      [[1,0],[1,1],[0,1],[0,2]], // Z horizontal
    ]
    const fields = player.getFieldSpaces()
    const fieldSet = new Set(fields.map(f => `${f.row},${f.col}`))
    const validSpaces = []
    const seen = new Set()

    for (const empty of player.getEmptySpaces()) {
      if (player.isRestrictedByFutureBuildingSite(empty.row, empty.col)) {
        continue
      }
      for (const shape of shapes) {
        for (let pos = 0; pos < 4; pos++) {
          // Translate so shape[pos] lands on the empty space
          const dr = empty.row - shape[pos][0]
          const dc = empty.col - shape[pos][1]
          // Check that the other 3 positions are existing fields
          let valid = true
          for (let i = 0; i < 4; i++) {
            if (i === pos) {
              continue
            }
            const r = shape[i][0] + dr
            const c = shape[i][1] + dc
            if (!fieldSet.has(`${r},${c}`)) {
              valid = false
              break
            }
          }
          if (valid) {
            const key = `${empty.row},${empty.col}`
            if (!seen.has(key)) {
              seen.add(key)
              validSpaces.push(empty)
            }
            break // No need to check other positions for this shape
          }
        }
      }
    }
    return validSpaces
  }

  sow(player) {
    const emptyFields = player.getEmptyFields()
    if (emptyFields.length === 0) {
      this.log.add({
        template: '{player} has no empty fields to sow',
        args: { player },
      })
      return false
    }

    this.game.callPlayerCardHook(player, 'onSow', true)

    this.callOnAnyBeforeSowHooks(player)

    let sowedAny = false
    let sowedVegetables = false
    const sowedTypes = []

    while (true) {
      const currentEmptyFields = player.getEmptyFields()
      // Separate regular fields from virtual fields for UI handling
      const regularEmptyFields = currentEmptyFields.filter(f => !f.isVirtualField)
      const emptyVirtualFields = player.getEmptyVirtualFields()

      if (currentEmptyFields.length === 0) {
        break
      }

      const canSowGrain = player.grain >= 1
      const canSowVeg = player.vegetables >= 1

      // Check if any virtual field can be sown with non-standard crops (wood, stone)
      const canSowVirtualField = emptyVirtualFields.some(vf => {
        if (!vf.cropRestriction) {
          return canSowGrain || canSowVeg
        }
        if (vf.cropRestriction === 'wood') {
          return player.wood >= 1
        }
        if (vf.cropRestriction === 'stone') {
          return player.stone >= 1
        }
        return canSowGrain || canSowVeg
      })

      if (!canSowGrain && !canSowVeg && !canSowVirtualField) {
        break
      }

      // Build nested choices showing crop types with their available fields
      const nestedChoices = []

      if (canSowGrain) {
        const grainFields = currentEmptyFields.map(f => `Field (${f.row},${f.col})`)
        nestedChoices.push({
          title: `Grain (${player.grain} available)`,
          choices: grainFields,
          min: 0,
          max: 1,
        })
      }

      if (canSowVeg) {
        const vegFields = currentEmptyFields.map(f => `Field (${f.row},${f.col})`)
        nestedChoices.push({
          title: `Vegetables (${player.vegetables} available)`,
          choices: vegFields,
          min: 0,
          max: 1,
        })
      }

      nestedChoices.push('Done Sowing')

      // Request input - supports both nested selector and direct farm board clicks
      const selector = {
        type: 'select',
        actor: player.name,
        title: 'Choose field to sow',
        choices: nestedChoices,
        min: 1,
        max: 1,
        // Mark this as accepting action-based input for sowing
        allowsAction: ['sow-field', 'sow-virtual-field'],
        validSpaces: regularEmptyFields,  // Only regular fields, virtual fields are handled separately in UI
        canSowGrain,
        canSowVeg,
        emptyVirtualFields,  // Virtual fields that can be sown
      }

      const result = this.game.requestInputSingle(selector)

      // Handle action-based response (from clicking the farm board)
      if (result.action === 'sow-field') {
        const { row, col, cropType } = result

        // Validate the space is a valid empty field
        const isValidField = regularEmptyFields.some(f => f.row === row && f.col === col)
        if (!isValidField) {
          throw new Error(`Invalid sow space: (${row}, ${col}) is not an empty field`)
        }

        // Validate player has the crop
        if (cropType === 'grain' && !canSowGrain) {
          throw new Error('No grain available to sow')
        }
        if (cropType === 'vegetables' && !canSowVeg) {
          throw new Error('No vegetables available to sow')
        }

        player.sowField(row, col, cropType)
        sowedAny = true
        sowedTypes.push(cropType)
        if (cropType === 'vegetables') {
          sowedVegetables = true
        }

        const amount = cropType === 'grain' ? res.constants.sowingGrain : res.constants.sowingVegetables
        this.log.add({
          template: '{player} sows {crop} at ({row},{col}) - {amount} total',
          args: { player, crop: cropType, row, col, amount },
        })
        continue
      }

      // Handle virtual field sowing (from clicking a virtual field cell)
      if (result.action === 'sow-virtual-field') {
        const { fieldId, cropType } = result
        const virtualField = player.getVirtualField(fieldId)

        if (!virtualField) {
          throw new Error(`Virtual field not found: ${fieldId}`)
        }
        if (!player.canSowVirtualField(fieldId, cropType)) {
          throw new Error(`Cannot sow ${cropType} in ${virtualField.label}`)
        }

        player.sowVirtualField(fieldId, cropType)
        sowedAny = true
        sowedTypes.push(cropType)
        if (cropType === 'vegetables') {
          sowedVegetables = true
        }

        const amount = cropType === 'grain' ? res.constants.sowingGrain : res.constants.sowingVegetables
        this.log.add({
          template: '{player} sows {crop} in {label} - {amount} total',
          args: { player, crop: cropType, label: virtualField.label, amount },
        })
        continue
      }

      // Handle standard selection response
      const choice = result[0]

      if (choice === 'Done Sowing') {
        break
      }

      // Handle nested selection (object with title and selection)
      if (typeof choice === 'object' && choice.title && choice.selection && choice.selection.length > 0) {
        const selectedField = choice.selection[0]
        const coordMatch = selectedField.match(/Field \((\d+),(\d+)\)/)

        if (coordMatch) {
          const row = parseInt(coordMatch[1])
          const col = parseInt(coordMatch[2])
          const cropType = choice.title.startsWith('Grain') ? 'grain' : 'vegetables'

          player.sowField(row, col, cropType)
          sowedAny = true
          sowedTypes.push(cropType)
          if (cropType === 'vegetables') {
            sowedVegetables = true
          }

          const amount = cropType === 'grain' ? res.constants.sowingGrain : res.constants.sowingVegetables
          this.log.add({
            template: '{player} sows {crop} at ({row},{col}) - {amount} total',
            args: { player, crop: cropType, row, col, amount },
          })
        }
      }
    }

    if (sowedVegetables) {
      this.game.callPlayerCardHook(player, 'onSowVegetables', true)
    }

    if (!sowedAny) {
      this.game.callPlayerCardHook(player, 'onDeclineSow')
      this.log.addDoNothing(player, 'sow')
    }
    else {
      this.game.callPlayerCardHook(player, 'onAfterSow', sowedTypes)
    }

    return true
  }

  sowSingleField(player, card) {
    const emptyFields = player.getEmptyFields()
    if (emptyFields.length === 0) {
      this.log.add({
        template: '{player} has no empty fields to sow',
        args: { player },
      })
      return false
    }

    const canSowGrain = player.grain >= 1
    const canSowVeg = player.vegetables >= 1
    const regularEmptyFields = emptyFields.filter(f => !f.isVirtualField)
    const emptyVirtualFields = player.getEmptyVirtualFields()

    // Check if any virtual field can be sown with non-standard crops (wood, stone)
    const canSowVirtualField = emptyVirtualFields.some(vf => {
      if (!vf.cropRestriction) {
        return canSowGrain || canSowVeg
      }
      if (vf.cropRestriction === 'wood') {
        return player.wood >= 1
      }
      if (vf.cropRestriction === 'stone') {
        return player.stone >= 1
      }
      return canSowGrain || canSowVeg
    })

    if (!canSowGrain && !canSowVeg && !canSowVirtualField) {
      this.log.add({
        template: '{player} has no crops to sow',
        args: { player },
      })
      return false
    }

    const selector = {
      type: 'select',
      actor: player.name,
      title: `${card.name}: Choose field to sow`,
      choices: emptyFields.map(f => `Field (${f.row},${f.col})`),
      min: 1,
      max: 1,
      allowsAction: ['sow-field', 'sow-virtual-field'],
      validSpaces: regularEmptyFields,
      canSowGrain,
      canSowVeg,
      emptyVirtualFields,
    }

    const result = this.game.requestInputSingle(selector)

    if (result.action === 'sow-field') {
      const { row, col, cropType } = result
      player.sowField(row, col, cropType)
      const amount = cropType === 'grain' ? res.constants.sowingGrain : res.constants.sowingVegetables
      this.log.add({
        template: '{player} sows {crop} at ({row},{col}) - {amount} total ({card})',
        args: { player, crop: cropType, row, col, amount, card: card.name },
      })
    }
    else if (result.action === 'sow-virtual-field') {
      const { fieldId, cropType } = result
      player.sowVirtualField(fieldId, cropType)
      const virtualField = player.getVirtualField(fieldId)
      const amount = cropType === 'grain' ? res.constants.sowingGrain : res.constants.sowingVegetables
      this.log.add({
        template: '{player} sows {crop} in {label} - {amount} total ({card})',
        args: { player, crop: cropType, label: virtualField.label, amount, card: card.name },
      })
    }
    else {
      const choice = result[0]
      const coordMatch = choice.match(/Field \((\d+),(\d+)\)/)
      if (coordMatch) {
        const row = parseInt(coordMatch[1])
        const col = parseInt(coordMatch[2])
        // Need to determine crop type — if only one is available, use it
        let cropType
        if (canSowGrain && !canSowVeg) {
          cropType = 'grain'
        }
        else if (!canSowGrain && canSowVeg) {
          cropType = 'vegetables'
        }
        else {
          // Both available — ask
          const cropSelection = this.choose(player, ['Grain', 'Vegetables'], {
            title: 'Choose crop type',
            min: 1,
            max: 1,
          })
          cropType = cropSelection[0].toLowerCase()
        }
        player.sowField(row, col, cropType)
        const amount = cropType === 'grain' ? res.constants.sowingGrain : res.constants.sowingVegetables
        this.log.add({
          template: '{player} sows {crop} at ({row},{col}) - {amount} total ({card})',
          args: { player, crop: cropType, row, col, amount, card: card.name },
        })
      }
    }

    return true
  }

  bakeBread(player) {
    this.game.callPlayerCardHook(player, 'onBeforeBake')

    // onBakeBreadAction: cards can replace baking (e.g., Freshman plays occupation instead)
    const replaceResults = this.game.callPlayerCardHook(player, 'onBakeBreadAction')
    if (replaceResults.some(r => r.result === true)) {
      return true
    }

    if (!player.hasBakingAbility()) {
      this.log.add({
        template: '{player} has no baking improvement',
        args: { player },
      })
      return false
    }

    if (player.grain < 1) {
      this.log.add({
        template: '{player} has no grain to bake',
        args: { player },
      })
      return false
    }

    const imp = player.getBakingImprovement()

    // Ask how much to bake (function wrapper: grain count may change via anytime conversion)
    const selection = this.choose(player, () => {
      const maxBake = imp.abilities.bakingLimit || player.grain
      const choices = []
      for (let i = 1; i <= Math.min(maxBake, player.grain); i++) {
        choices.push(`Bake ${i} grain`)
      }
      choices.push('Do not bake')
      return choices
    }, {
      title: 'How much grain to bake?',
      min: 1,
      max: 1,
    })

    if (selection[0] === 'Do not bake') {
      this.log.addDoNothing(player, 'bake bread')
      return true
    }

    const amount = parseInt(selection[0].split(' ')[1])
    const food = player.bakeGrain(amount)

    this.log.add({
      template: '{player} bakes {grain} grain into {food} food',
      args: { player, grain: amount, food },
    })

    // Call onBake hooks (Dutch Windmill gives bonus food after harvest)
    this.game.callPlayerCardHook(player, 'onBake', amount)

    return true
  }

  sowAndOrBake(player) {
    this.game.callPlayerCardHook(player, 'onBeforeSow')

    const canSow = player.canSowAnything()
    const canBake = player.hasBakingAbility() && player.grain >= 1

    // Check for Agrarian Fences
    const hasAgrarianFences = player.playedMinorImprovements.some(cardId => {
      const card = this.game.cards.byId(cardId)
      return card && card.definition.modifyGrainUtilization
    })
    const canBuildFences = hasAgrarianFences && (player.wood >= 1 || player.getFreeFenceCount() > 0)

    if (!canSow && !canBake && !canBuildFences) {
      this.log.addDoNothing(player, 'sow or bake')
      return true
    }

    // Agrarian Fences: offer to replace one action with Build Fences
    if (canBuildFences) {
      if (!canSow && !canBake) {
        // Can only build fences
        this.buildFences(player)
        return true
      }

      const choices = ['Sow and/or Bake Bread']
      if (canSow) {
        choices.push('Build Fences instead of Sowing')
      }
      if (canBake) {
        choices.push('Build Fences instead of Baking')
      }

      const selection = this.choose(player, choices, { title: 'Agrarian Fences', min: 1, max: 1 })
      const choice = selection[0]

      if (choice === 'Build Fences instead of Sowing') {
        this.buildFences(player)
        const canBakeNow = player.hasBakingAbility() && player.grain >= 1
        if (canBakeNow) {
          this.bakeBread(player)
        }
        return true
      }
      if (choice === 'Build Fences instead of Baking') {
        if (canSow) {
          this.sow(player)
        }
        this.buildFences(player)
        return true
      }
      // "Sow and/or Bake Bread" — fall through to normal flow
    }

    // Normal flow: Sow first (player can select "Done Sowing" to skip)
    if (canSow) {
      this.sow(player)
    }

    // Then bake (player can select "Do not bake" to skip)
    // Re-check canBake since sowing might have used grain
    const canBakeNow = player.hasBakingAbility() && player.grain >= 1
    if (canBakeNow) {
      this.bakeBread(player)
    }

    return true
  }

  plowAndOrSow(player) {
    const canPlow = player.getValidPlowSpaces().length > 0
    const canSow = player.canSowAnything()

    if (!canPlow && !canSow) {
      this.log.addDoNothing(player, 'plow or sow')
      return true
    }

    // Ask if player wants to plow (if possible)
    if (canPlow) {
      const plowChoices = ['Plow a field', 'Skip plowing']
      const plowSelection = this.choose(player, plowChoices, {
        title: 'Plow a field?',
        min: 1,
        max: 1,
      })

      if (plowSelection[0] === 'Plow a field') {
        let plowCount = 1
        for (const card of this.game.getPlayerActiveCards(player)) {
          if (card.hasHook('modifyPlowCount')) {
            plowCount = card.callHook('modifyPlowCount', this.game, player, plowCount, 'plow-sow')
          }
        }
        for (let i = 0; i < plowCount; i++) {
          if (!this.plowField(player)) {
            break
          }
        }
      }
    }

    // Fire onBeforeSow hook (e.g. Drill Harrow can plow before sowing)
    this.game.callPlayerCardHook(player, 'onBeforeSow')

    // Then sow (player can select "Done Sowing" to skip)
    // Re-check canSow since plowing or hooks might have created a new field
    const canSowNow = player.getEmptyFields().length > 0 && (player.grain >= 1 || player.vegetables >= 1)
    if (canSowNow) {
      this.sow(player)
    }

    return true
  }

  // ---------------------------------------------------------------------------
  // Fencing action
  // ---------------------------------------------------------------------------

  buildFences(player) {
    let totalFencesBuilt = 0
    let continueBuilding = true

    while (continueBuilding) {
      // Check if player can build any fences (accounting for free fences from cards)
      const hasFreeOverhaulFences = (player._overhaulFreeFences || 0) > 0
      const hasFieldFenceDiscount = !!player._fieldFencesActive
      const hasFarmRedevFreeFences = (player._farmRedevelopmentFreeFences || 0) > 0
      const hasCardFreeFences = player.getActiveCards().some(c => c.hasHook('getFreeFences') && c.callHook('getFreeFences', this.game) > 0)
      if (player.wood < 1 && player.getFreeFenceCount() === 0 && !hasFreeOverhaulFences && !hasFieldFenceDiscount && !hasFarmRedevFreeFences && !hasCardFreeFences) {
        if (totalFencesBuilt === 0) {
          this.log.add({
            template: '{player} has no wood for fences',
            args: { player },
          })
        }
        break
      }

      const remainingFences = res.constants.maxFences - player.getFenceCount()
      if (remainingFences <= 0) {
        if (totalFencesBuilt === 0) {
          this.log.add({
            template: '{player} has no fences remaining',
            args: { player },
          })
        }
        break
      }

      // Build pasture selection choices
      const result = this.selectPastureSpaces(player)

      if (!result.built) {
        if (totalFencesBuilt === 0 && !result.skipped) {
          this.log.addDoNothing(player, 'build fences')
        }
        break
      }

      totalFencesBuilt += result.fencesBuilt

      // Ask if player wants to build another pasture
      const canAffordMore = player.wood >= 1 || player.getFreeFenceCount() > 0
        || (player._overhaulFreeFences || 0) > 0 || !!player._fieldFencesActive
        || (player._farmRedevelopmentFreeFences || 0) > 0
      if (canAffordMore && remainingFences - result.fencesBuilt > 0) {
        const continueChoice = this.choose(player, ['Build another pasture', 'Done building fences'], {
          title: 'Continue fencing?',
          min: 1,
          max: 1,
        })
        continueBuilding = continueChoice[0] === 'Build another pasture'
      }
      else {
        continueBuilding = false
      }
    }

    if (totalFencesBuilt > 0) {
      this.game.callPlayerCardHook(player, 'onBuildFences', totalFencesBuilt)
    }

    return totalFencesBuilt > 0
  }

  selectPastureSpaces(player) {
    // Get fenceable spaces
    const fenceableSpaces = player.getFenceableSpaces()

    if (fenceableSpaces.length === 0) {
      this.log.add({
        template: '{player} has no spaces available for fencing',
        args: { player },
      })
      return { built: false }
    }

    // Use action-type selector - client manages selection locally and sends final result
    const response = this.choose(player, ['Cancel fencing'], {
      title: 'Select spaces for pasture',
      min: 1,
      max: 1,
      allowsAction: 'build-pasture',
      fenceableSpaces,
    })

    // Check if response is an action (spaces array) or a choice
    if (response.action === 'build-pasture' && response.spaces) {
      const selectedSpaces = response.spaces

      if (selectedSpaces.length === 0) {
        return { built: false, skipped: true }
      }

      // Validate the selection
      const validation = player.validatePastureSelection(selectedSpaces)
      if (!validation.valid) {
        this.log.add({
          template: 'Invalid pasture selection: {error}',
          args: { error: validation.error },
        })
        return { built: false }
      }

      // Build the pasture
      const result = player.buildPasture(selectedSpaces)
      if (result.success) {
        this.log.add({
          template: '{player} builds a pasture with {spaces} spaces using {fences} fences',
          args: { player, spaces: selectedSpaces.length, fences: result.fencesBuilt },
        })

        // Call onBuildPasture hooks (Shepherd's Crook)
        this.game.callPlayerCardHook(player, 'onBuildPasture', { spaces: selectedSpaces })

        return { built: true, fencesBuilt: result.fencesBuilt }
      }
      else {
        this.log.add({
          template: 'Failed to build pasture: {error}',
          args: { error: result.error },
        })
        return { built: false }
      }
    }

    // User cancelled
    return { built: false, skipped: true }
  }

  getAdjacentUnselectedSpaces(selectedSpaces, allFenceableSpaces) {
    const selectedSet = new Set(selectedSpaces.map(s => `${s.row},${s.col}`))
    const adjacent = []

    for (const selected of selectedSpaces) {
      // Check all 4 directions
      const neighbors = [
        { row: selected.row - 1, col: selected.col },
        { row: selected.row + 1, col: selected.col },
        { row: selected.row, col: selected.col - 1 },
        { row: selected.row, col: selected.col + 1 },
      ]

      for (const n of neighbors) {
        const key = `${n.row},${n.col}`
        if (!selectedSet.has(key)) {
          // Check if this is a valid fenceable space
          const isFenceable = allFenceableSpaces.some(
            f => f.row === n.row && f.col === n.col
          )
          if (isFenceable && !adjacent.some(a => a.row === n.row && a.col === n.col)) {
            adjacent.push(n)
          }
        }
      }
    }

    return adjacent
  }

  // ---------------------------------------------------------------------------
  // Family growth action
  // ---------------------------------------------------------------------------

  familyGrowth(player, requiresRoom = true) {
    if (!player.canGrowFamily(requiresRoom)) {
      // Check if a card allows growth without room (e.g., FieldDoctor, DeliveryNurse)
      let allowedByCard = false
      if (requiresRoom && player.canGrowFamily(false)) {
        for (const card of this.game.getPlayerActiveCards(player)) {
          if (card.hasHook('allowsFamilyGrowthWithoutRoom') &&
              card.callHook('allowsFamilyGrowthWithoutRoom', this.game, player)) {
            allowedByCard = true
            card.callHook('onFamilyGrowthWithoutRoom', this.game, player)
            break
          }
        }
      }
      if (!allowedByCard) {
        if (player.familyMembers >= res.constants.maxFamilyMembers) {
          this.log.add({
            template: '{player} already has maximum family members',
            args: { player },
          })
        }
        else {
          this.log.add({
            template: '{player} needs more rooms for family growth',
            args: { player },
          })
        }
        return false
      }
    }

    player.growFamily()

    this.log.add({
      template: '{player} grows their family (now {count} members)',
      args: { player, count: player.familyMembers },
    })

    this.game.callPlayerCardHook(player, 'afterFamilyGrowth')

    // Call onAnyFamilyGrowth for all players (e.g., PartyOrganizer)
    for (const other of this.game.players.all()) {
      const cards = this.game.getPlayerActiveCards(other)
      for (const card of cards) {
        if (card.hasHook('onAnyFamilyGrowth')) {
          card.callHook('onAnyFamilyGrowth', this.game, player, other)
        }
      }
    }

    return true
  }

  // ---------------------------------------------------------------------------
  // Improvement actions
  // ---------------------------------------------------------------------------

  buyMajorImprovement(player, availableImprovements) {
    const affordableIds = availableImprovements
      .filter(id => player.canBuyMajorImprovement(id))

    if (affordableIds.length === 0) {
      this.log.add({
        template: '{player} cannot afford any major improvements',
        args: { player },
      })
      return false
    }

    const selection = this.choose(player, () => {
      const curAffordable = availableImprovements
        .filter(id => player.canBuyMajorImprovement(id))
      const choices = curAffordable.map(id => {
        const imp = this.game.cards.byId(id)
        return imp.name + ` (${id})`
      })
      choices.push('Do not buy')
      return choices
    }, {
      title: 'Choose a major improvement',
      min: 1,
      max: 1,
    })

    if (selection[0] === 'Do not buy') {
      this.log.addDoNothing(player, 'buy an improvement')
      return true
    }

    // Extract ID from selection
    const idMatch = selection[0].match(/\(([^)]+)\)/)
    const improvementId = idMatch ? idMatch[1] : null

    if (improvementId) {
      const imp = this.game.cards.byId(improvementId)
      const result = player.buyMajorImprovement(improvementId)
      this._recordCardPlayed(player, imp)

      this.log.add({
        template: '{player} buys {card}',
        args: { player, card: imp },
      })
      let impCost = result.upgraded ? {} : player.getMajorImprovementCost(improvementId)
      if (!result.upgraded && (player._houseRedevelopmentDiscount || 0) > 0) {
        impCost = this._applyBuildingResourceDiscount(player, impCost, player._houseRedevelopmentDiscount)
      }
      if (!result.upgraded) {
        player.payCost(impCost)
      }

      // Execute onBuy effect if present (e.g., Well schedules food, Ovens bake bread)
      if (imp.hasHook('onBuy')) {
        imp.callHook('onBuy', this.game, player)
      }

      // Call onBuildImprovement hooks (BrickHammer checks clay cost)
      this.game.callPlayerCardHook(player, 'onBuildImprovement', impCost, imp)
      this.callOnAnyBuildImprovementHooks(player, impCost, imp)

      // Call onBuildMajor hooks (Farm Building schedules food, Craft Teacher)
      this.game.callPlayerCardHook(player, 'onBuildMajor', improvementId)
      this.callOnAnyBuildMajorHooks(player, improvementId)

      if (imp.upgradesFrom && imp.upgradesFrom.some(id => id.startsWith('fireplace'))) {
        this.game.callPlayerCardHook(player, 'onUpgradeFireplace')
      }

      return improvementId
    }

    return false
  }

  offerFreeOccupations(player, card, maxCount) {
    for (let i = 0; i < maxCount; i++) {
      const played = this.playOccupation(player, { free: true })
      if (!played) {
        break
      }
    }
  }

  offerUseOtherSpace(player, card, otherActionId, opts = {}) {
    const action = res.getActionById(otherActionId)
    if (!action) {
      return
    }
    const costLabel = opts.cost ? ` (pay ${Object.entries(opts.cost).map(([r, n]) => `${n} ${r}`).join(', ')})` : ''
    const choices = [`Use ${action.name}${costLabel}`, 'Skip']
    const selection = this.choose(player, choices, {
      title: `${card.name}: Use other space with same person?`,
      min: 1,
      max: 1,
    })
    if (selection[0] === 'Skip') {
      return
    }
    if (opts.cost) {
      player.payCost(opts.cost)
    }
    this.executeAction(player, otherActionId)
  }

  // ---------------------------------------------------------------------------
  // Occupation action
  // ---------------------------------------------------------------------------

  playOccupation(player, options = {}) {
    if (player.cannotPlayOccupations) {
      this.log.add({
        template: '{player} cannot play occupations (Blighter)',
        args: { player },
      })
      return false
    }

    // Get occupations from player's hand
    const occupationsInHand = player.hand.filter(cardId => {
      const card = this.game.cards.byId(cardId)
      return card && card.type === 'occupation'
    })

    if (occupationsInHand.length === 0) {
      this.log.add({
        template: '{player} has no occupations in hand',
        args: { player },
      })
      return false
    }

    // Occupation cost: first is free, subsequent cost 1 food each
    // Action spaces like Lessons B/C override with a fixed cost (e.g., 2 food)
    // but the first two occupations may use a reduced cost (firstTwoCost)
    let baseFoodCost
    if (options.free) {
      baseFoodCost = 0
    }
    else if (options.costOverride != null) {
      if (options.firstTwoCost != null && player.getOccupationCount() < 2) {
        baseFoodCost = options.firstTwoCost
      }
      else {
        baseFoodCost = options.costOverride
      }
    }
    else {
      baseFoodCost = player.getOccupationCount() === 0 ? 0 : 1
    }
    let costObj = baseFoodCost > 0 ? { food: baseFoodCost } : {}

    // Apply modifyOccupationCost hooks (e.g., ForestSchool: food → woodOrFood)
    if (!options.free) {
      for (const card of player.getActiveCards()) {
        if (card.hasHook('modifyOccupationCost')) {
          costObj = card.callHook('modifyOccupationCost', player, costObj)
        }
      }
    }

    const cost = baseFoodCost // Keep for display/gating
    const hasWoodOrFood = costObj.woodOrFood > 0

    if (cost > 0 && !hasWoodOrFood && player.food < cost) {
      // Art Teacher: check if Traveling Players has food to supplement
      let tpFood = 0
      if (player.getActiveCards().some(c => c.definition.canUseTravelingPlayersFood)) {
        for (const tpId of ['traveling-players', 'traveling-players-5']) {
          const tpState = this.game.state.actionSpaces[tpId]
          if (tpState) {
            tpFood += tpState.accumulated || 0
          }
        }
      }
      if (player.food + tpFood < cost) {
        // Relax gate: allow entry if anytime conversions can produce food
        const canConvert = this.game.getAnytimeFoodConversionOptions(player).length > 0
        if (!canConvert) {
          this.log.add({
            template: '{player} cannot afford to play an occupation (needs {cost} food)',
            args: { player, cost },
          })
          return false
        }
      }
    }

    if (cost > 0 && hasWoodOrFood && player.food < costObj.woodOrFood && player.wood < costObj.woodOrFood) {
      const canConvert = this.game.getAnytimeFoodConversionOptions(player).length > 0
      if (!canConvert) {
        this.log.add({
          template: '{player} cannot afford to play an occupation',
          args: { player },
        })
        return false
      }
    }

    // Filter to playable occupations (meet prerequisites)
    const playableOccupations = occupationsInHand.filter(cardId => {
      return player.meetsCardPrereqs(cardId)
    })

    if (playableOccupations.length === 0) {
      this.log.add({
        template: '{player} has no occupations that meet prerequisites',
        args: { player },
      })
      return false
    }

    // Build choices with card names
    const choices = playableOccupations.map(cardId => {
      const card = this.game.cards.byId(cardId)
      return card ? card.name : cardId
    })

    // Add option to not play
    choices.push('Do not play an occupation')

    const selection = this.choose(player, choices, {
      title: options.free ? 'Play an Occupation (free)' : (cost > 0 ? `Play an Occupation (costs ${cost} food)` : 'Play an Occupation (free)'),
      min: 1,
      max: 1,
    })

    const selectedName = selection[0]

    if (selectedName === 'Do not play an occupation') {
      this.log.addDoNothing(player, 'play an occupation')
      return false
    }

    // Find the card id by name
    const cardId = playableOccupations.find(id => {
      const card = this.game.cards.byId(id)
      return card && card.name === selectedName
    })

    if (!cardId) {
      return false
    }

    // Fire onBeforePlayOccupation hooks (e.g. WhaleOil: get stored food before paying)
    this.game.callPlayerCardHook(player, 'onBeforePlayOccupation')

    // Pay the occupation cost
    if (cost > 0) {
      if (hasWoodOrFood) {
        // Player can pay with wood or food (e.g., Forest School)
        const amount = costObj.woodOrFood
        const canPayFood = player.food >= amount
        const canPayWood = player.wood >= amount

        if (canPayFood && canPayWood) {
          const paySelection = this.choose(player, () => {
            const payChoices = []
            if (player.food >= amount) {
              payChoices.push(`Pay ${amount} food`)
            }
            if (player.wood >= amount) {
              payChoices.push(`Pay ${amount} wood`)
            }
            if (payChoices.length === 0) {
              payChoices.push(`Pay ${amount} food`)
            }
            return payChoices
          }, {
            title: 'Choose payment for occupation',
            min: 1,
            max: 1,
          })
          if (paySelection[0] === `Pay ${amount} wood`) {
            player.payCost({ wood: amount })
          }
          else {
            player.payCost({ food: amount })
          }
        }
        else if (canPayWood) {
          player.payCost({ wood: amount })
        }
        else {
          player.payCost({ food: amount })
        }
      }
      else {
        // Art Teacher: can use food from Traveling Players accumulation space
        let remainingCost = cost
        const hasTravelingPlayersFoodFlag = player.getActiveCards().some(c => c.definition.canUseTravelingPlayersFood)
        if (hasTravelingPlayersFoodFlag) {
          const tpIds = ['traveling-players', 'traveling-players-5']
          for (const tpId of tpIds) {
            const tpState = this.game.state.actionSpaces[tpId]
            if (tpState && tpState.accumulated > 0 && remainingCost > 0) {
              const take = Math.min(remainingCost, tpState.accumulated)
              tpState.accumulated -= take
              remainingCost -= take
              this.log.add({
                template: '{player} uses {amount} food from Traveling Players via Art Teacher',
                args: { player, amount: take },
              })
            }
          }
        }
        if (remainingCost > 0) {
          player.payCost({ food: remainingCost })
        }
      }
    }

    // Play the card (moves from hand to playedOccupations)
    const card = this.game.cards.byId(cardId)
    player.playCard(cardId)
    this._recordCardPlayed(player, card)

    this.log.add({
      template: '{player} plays {card}',
      args: { player, card: card },
    })
    player.payCardCost(cardId)

    // Execute onPlay effect if present
    if (card.hasHook('onPlay')) {
      card.callHook('onPlay', this.game, player)
    }

    this.game.registerCardActionSpace(player, card)

    // Call onPlayOccupation hooks on all active cards
    this.game.callPlayerCardHook(player, 'onPlayOccupation', card)

    return true
  }

  // ---------------------------------------------------------------------------
  // Minor Improvement action
  // ---------------------------------------------------------------------------

  /**
   * Scan the player's played cards for allowsMajorOnMinorAction / allowsMajorsOnMinorAction.
   * Returns:
   *   null      — at least one card allows ALL majors (e.g. Ambition)
   *   Set<id>   — specific major IDs allowed
   *   undefined — no played card grants this ability
   */
  getAllowedMajorsForMinorAction(player) {
    let allowAll = false
    const allowedIds = new Set()

    for (const cardId of player.getPlayedCards()) {
      const card = this.game.cards.byId(cardId)
      if (!card) {
        continue
      }
      const def = card.definition

      if (def.allowsMajorOnMinorAction) {
        if (def.allowedMajors) {
          for (const id of def.allowedMajors) {
            allowedIds.add(id)
          }
        }
        else {
          allowAll = true
        }
      }
      if (Array.isArray(def.allowsMajorsOnMinorAction)) {
        for (const id of def.allowsMajorsOnMinorAction) {
          allowedIds.add(id)
        }
      }
    }

    if (allowAll) {
      return null
    }
    return allowedIds.size > 0 ? allowedIds : undefined
  }

  buyMinorImprovement(player) {
    // Get minor improvements from player's hand (exclude cards requiring major improvement action)
    const minorInHand = player.hand.filter(cardId => {
      const card = this.game.cards.byId(cardId)
      return card && card.type === 'minor' && !card.definition.requiresMajorImprovementAction
    })

    // Check if any played cards allow major improvements on minor action
    const allowedMajors = this.getAllowedMajorsForMinorAction(player)
    const hasMajorAbility = allowedMajors !== undefined

    // Get affordable allowed majors
    const getAffordableMajorIds = () => {
      if (!hasMajorAbility) {
        return []
      }
      const available = this.game.getAvailableMajorImprovements()
      const filtered = allowedMajors === null
        ? available
        : available.filter(id => allowedMajors.has(id))
      return filtered.filter(id => player.canBuyMajorImprovement(id))
    }

    // Check if there's anything to do at all
    const hasAnyPossibility = () => {
      if (getAffordableMajorIds().length > 0) {
        return true
      }
      if (minorInHand.some(cardId => player.canPlayCard(cardId))) {
        return true
      }
      return false
    }

    if (minorInHand.length === 0 && !hasMajorAbility) {
      this.log.add({
        template: '{player} has no minor improvements in hand',
        args: { player },
      })
      return false
    }

    if (!hasAnyPossibility()) {
      const canConvert = this.game.getAnytimeFoodConversionOptions(player).length > 0
      if (!canConvert) {
        this.log.add({
          template: '{player} has no affordable improvements',
          args: { player },
        })
        return false
      }
    }

    // If majors are available, use nested choices (same pattern as buyImprovement)
    if (hasMajorAbility) {
      const selection = this.choose(player, () => {
        const nestedChoices = []

        // Get affordable allowed major improvements
        const affordableMajorIds = getAffordableMajorIds()
        if (affordableMajorIds.length > 0) {
          const majorChoices = affordableMajorIds.map(id => {
            const imp = this.game.cards.byId(id)
            return imp.name + ` (${id})`
          })
          nestedChoices.push({
            title: 'Major Improvement',
            choices: majorChoices,
            min: 0,
            max: 1,
          })
        }

        // Get playable minor improvements
        const playableMinorIds = minorInHand.filter(cardId => player.canPlayCard(cardId))
        if (playableMinorIds.length > 0) {
          const minorChoices = playableMinorIds.map(cardId => {
            const card = this.game.cards.byId(cardId)
            return card ? card.name : cardId
          })
          nestedChoices.push({
            title: 'Minor Improvement',
            choices: minorChoices,
            min: 0,
            max: 1,
          })
        }

        nestedChoices.push('Do not play an improvement')
        return nestedChoices
      }, {
        title: 'Play a Minor Improvement',
        min: 1,
        max: 1,
      })

      const choice = selection[0]

      if (choice === 'Do not play an improvement') {
        this.log.addDoNothing(player, 'play an improvement')
        return false
      }

      if (typeof choice === 'object' && choice.title) {
        const selectedName = choice.selection[0]

        if (choice.title === 'Major Improvement') {
          const idMatch = selectedName.match(/\(([^)]+)\)/)
          const improvementId = idMatch ? idMatch[1] : null

          if (improvementId) {
            const imp = this.game.cards.byId(improvementId)
            const result = player.buyMajorImprovement(improvementId)
            this._recordCardPlayed(player, imp)

            this.log.add({
              template: '{player} buys {card}',
              args: { player, card: imp },
            })
            let impCost = result.upgraded ? {} : player.getMajorImprovementCost(improvementId)
            if (!result.upgraded && (player._houseRedevelopmentDiscount || 0) > 0) {
              impCost = this._applyBuildingResourceDiscount(player, impCost, player._houseRedevelopmentDiscount)
            }
            if (!result.upgraded) {
              player.payCost(impCost)
            }

            if (imp.hasHook('onBuy')) {
              imp.callHook('onBuy', this.game, player)
            }

            this.game.callPlayerCardHook(player, 'onBuildImprovement', impCost, imp)
            this.callOnAnyBuildImprovementHooks(player, impCost, imp)

            // Call onBuildMajor hooks (Farm Building schedules food, Craft Teacher)
            this.game.callPlayerCardHook(player, 'onBuildMajor', improvementId)
            this.callOnAnyBuildMajorHooks(player, improvementId)
            return improvementId
          }
        }

        if (choice.title === 'Minor Improvement') {
          const playableMinorIds = minorInHand.filter(cardId => player.canPlayCard(cardId))
          const cardId = playableMinorIds.find(id => {
            const card = this.game.cards.byId(id)
            return card && card.name === selectedName
          })

          if (cardId) {
            this._playMinorWithCostChoice(player, cardId)
            return true
          }
        }
      }

      return false
    }

    // Original flow: no major ability, only minor improvements

    // Filter to playable minor improvements (can afford and meet prerequisites)
    // Relax gate: if conversions exist, enter choose anyway (function rebuilds list after conversion)
    const playableMinor = minorInHand.filter(cardId => {
      return player.canPlayCard(cardId)
    })

    if (playableMinor.length === 0) {
      const canConvert = this.game.getAnytimeFoodConversionOptions(player).length > 0
      if (!canConvert) {
        this.log.add({
          template: '{player} cannot afford any minor improvements',
          args: { player },
        })
        return false
      }
    }

    // Build choices with function wrapper (minor affordability may change via anytime conversion)
    const selection = this.choose(player, () => {
      const currentPlayable = minorInHand.filter(cardId => player.canPlayCard(cardId))
      const choices = currentPlayable.map(cardId => {
        const card = this.game.cards.byId(cardId)
        return card ? card.name : cardId
      })
      choices.push('Do not play a minor improvement')
      return choices
    }, {
      title: 'Play a Minor Improvement',
      min: 1,
      max: 1,
    })

    const selectedName = selection[0]

    if (selectedName === 'Do not play a minor improvement') {
      this.log.addDoNothing(player, 'play a minor improvement')
      return false
    }

    // Find the card id by name (re-filter to get current playable list)
    const currentPlayable = minorInHand.filter(cardId => player.canPlayCard(cardId))
    const cardId = currentPlayable.find(id => {
      const card = this.game.cards.byId(id)
      return card && card.name === selectedName
    })

    if (!cardId) {
      return false
    }

    this._playMinorWithCostChoice(player, cardId)

    return true
  }

  // ---------------------------------------------------------------------------
  // Major or Minor Improvement action
  // ---------------------------------------------------------------------------

  buildImprovement(player, options = {}) {
    return this.buyImprovement(player, true, true, options)
  }

  buyImprovement(player, allowMajor, allowMinor, options = {}) {
    // Check if cards grant access to specific majors on minor improvement actions
    const cardAllowedMajors = allowMinor ? this.getAllowedMajorsForMinorAction(player) : undefined
    const hasCardMajorAbility = cardAllowedMajors !== undefined

    const getCardAllowedAffordableMajors = () => {
      if (!hasCardMajorAbility) {
        return []
      }
      const available = this.game.getAvailableMajorImprovements()
      const filtered = cardAllowedMajors === null
        ? available
        : available.filter(id => cardAllowedMajors.has(id))
      return filtered.filter(id => player.canBuyMajorImprovement(id))
    }

    // Check if any improvements are available at all (relaxed gate for anytime conversions)
    const hasAnyPossibility = () => {
      if (allowMajor) {
        const availableImprovements = this.game.getAvailableMajorImprovements()
        if (availableImprovements.some(id => player.canBuyMajorImprovement(id))) {
          return true
        }
      }
      if (hasCardMajorAbility && getCardAllowedAffordableMajors().length > 0) {
        return true
      }
      if (allowMinor) {
        const minorInHand = player.hand.filter(cardId => {
          const card = this.game.cards.byId(cardId)
          return card && card.type === 'minor'
        })
        if (minorInHand.some(cardId => player.canPlayCard(cardId))) {
          return true
        }
      }
      return false
    }

    if (!hasAnyPossibility()) {
      const canConvert = this.game.getAnytimeFoodConversionOptions(player).length > 0
      if (!canConvert) {
        this.log.add({
          template: '{player} has no affordable improvements',
          args: { player },
        })
        return false
      }
    }

    // Build nested choices with function wrapper (minor affordability may change via anytime conversion)
    const selection = this.choose(player, () => {
      const nestedChoices = []

      // Get affordable major improvements
      if (allowMajor || hasCardMajorAbility) {
        const availableImprovements = this.game.getAvailableMajorImprovements()
        const affordableMajorIds = availableImprovements.filter(id => {
          if (!player.canBuyMajorImprovement(id)) {
            return false
          }
          // If only card-granted access (not full major action), filter to allowed IDs
          if (!allowMajor && hasCardMajorAbility) {
            if (cardAllowedMajors !== null && !cardAllowedMajors.has(id)) {
              return false
            }
          }
          if (options.requireStone) {
            const cost = player.getMajorImprovementCost(id)
            if (!(cost.stone > 0)) {
              return false
            }
          }
          return true
        })
        if (affordableMajorIds.length > 0) {
          const majorChoices = affordableMajorIds.map(id => {
            const imp = this.game.cards.byId(id)
            return imp.name + ` (${id})`
          })
          nestedChoices.push({
            title: 'Major Improvement',
            choices: majorChoices,
            min: 0,
            max: 1,
          })
        }
      }

      // Get playable minor improvements
      if (allowMinor) {
        const minorInHand = player.hand.filter(cardId => {
          const card = this.game.cards.byId(cardId)
          return card && card.type === 'minor'
        })
        const playableMinorIds = minorInHand.filter(cardId => {
          if (!player.canPlayCard(cardId)) {
            return false
          }
          if (options.requireStone) {
            const card = this.game.cards.byId(cardId)
            if (!((card.definition.cost?.stone || 0) > 0)) {
              return false
            }
          }
          return true
        })
        if (playableMinorIds.length > 0) {
          const minorChoices = playableMinorIds.map(cardId => {
            const card = this.game.cards.byId(cardId)
            return card ? card.name : cardId
          })
          nestedChoices.push({
            title: 'Minor Improvement',
            choices: minorChoices,
            min: 0,
            max: 1,
          })
        }
      }

      // Add option to not play
      nestedChoices.push('Do not play an improvement')

      return nestedChoices
    }, {
      title: 'Choose an Improvement',
      min: 1,
      max: 1,
    })

    const choice = selection[0]

    // Handle "do not play" choice
    if (choice === 'Do not play an improvement') {
      this.log.addDoNothing(player, 'play an improvement')
      return false
    }

    // Handle nested selection (object with title and selection)
    if (typeof choice === 'object' && choice.title) {
      const selectedName = choice.selection[0]

      if (choice.title === 'Major Improvement') {
        // Extract ID from selection (format: "Name (id)")
        const idMatch = selectedName.match(/\(([^)]+)\)/)
        const improvementId = idMatch ? idMatch[1] : null

        if (improvementId) {
          const imp = this.game.cards.byId(improvementId)
          const result = player.buyMajorImprovement(improvementId)
          this._recordCardPlayed(player, imp)

          this.log.add({
            template: '{player} buys {card}',
            args: { player, card: imp },
          })
          let impCost = result.upgraded ? {} : player.getMajorImprovementCost(improvementId)
          if (!result.upgraded && (player._houseRedevelopmentDiscount || 0) > 0) {
            impCost = this._applyBuildingResourceDiscount(player, impCost, player._houseRedevelopmentDiscount)
          }
          if (!result.upgraded) {
            player.payCost(impCost)
          }

          // Execute onBuy effect if present (e.g., Well schedules food, Ovens bake bread)
          if (imp.hasHook('onBuy')) {
            imp.callHook('onBuy', this.game, player)
          }

          // Call onBuildImprovement hooks (BrickHammer checks clay cost)
          this.game.callPlayerCardHook(player, 'onBuildImprovement', impCost, imp)
          this.callOnAnyBuildImprovementHooks(player, impCost, imp)

          // Call onBuildMajor hooks (Farm Building schedules food, Craft Teacher)
          this.game.callPlayerCardHook(player, 'onBuildMajor', improvementId)
          this.callOnAnyBuildMajorHooks(player, improvementId)

          if (imp.upgradesFrom && imp.upgradesFrom.some(id => id.startsWith('fireplace'))) {
            this.game.callPlayerCardHook(player, 'onUpgradeFireplace')
          }

          this._offerSecondMajorFromCard(player, improvementId)

          return improvementId
        }
      }

      if (choice.title === 'Minor Improvement') {
        // Find the card id by name (re-filter for current state)
        const minorInHand = player.hand.filter(cardId => {
          const card = this.game.cards.byId(cardId)
          return card && card.type === 'minor'
        })
        const playableMinorIds = minorInHand.filter(cardId => player.canPlayCard(cardId))
        const cardId = playableMinorIds.find(id => {
          const card = this.game.cards.byId(id)
          return card && card.name === selectedName
        })

        if (cardId) {
          this._playMinorWithCostChoice(player, cardId)
          return true
        }
      }
    }

    return false
  }

  _offerSecondMajorFromCard(player, justBoughtId) {
    // Only on Major/Minor Improvement action (not House Redevelopment)
    if (this.game.state.currentActionId !== 'major-minor-improvement') {
      return
    }

    for (const card of this.game.getPlayerActiveCards(player)) {
      const list = card.definition.allowsBothMajorsOnMajorAction
      if (!list || !list.includes(justBoughtId)) {
        continue
      }

      // Find other majors in the list that are still available and affordable
      const available = this.game.getAvailableMajorImprovements()
      const otherIds = list.filter(id =>
        id !== justBoughtId && available.includes(id) && player.canBuyMajorImprovement(id)
      )
      if (otherIds.length === 0) {
        continue
      }

      const choices = otherIds.map(id => {
        const imp = this.game.cards.byId(id)
        return `Also build ${imp.name}`
      })
      choices.push('Skip')

      const selection = this.choose(player, choices, {
        title: card.name,
        min: 1,
        max: 1,
      })

      if (selection[0] === 'Skip') {
        return
      }

      // Extract the chosen improvement
      const chosenName = selection[0].replace('Also build ', '')
      const chosenId = otherIds.find(id => this.game.cards.byId(id).name === chosenName)
      if (!chosenId) {
        return
      }

      const imp = this.game.cards.byId(chosenId)
      const result = player.buyMajorImprovement(chosenId)
      this._recordCardPlayed(player, imp)

      this.log.add({
        template: '{player} also buys {card} via {source}',
        args: { player, card: imp, source: card },
      })

      const impCost = result.upgraded ? {} : player.getMajorImprovementCost(chosenId)
      if (!result.upgraded) {
        player.payCost(impCost)
      }

      if (imp.hasHook('onBuy')) {
        imp.callHook('onBuy', this.game, player)
      }

      this.game.callPlayerCardHook(player, 'onBuildImprovement', impCost, imp)
      this.callOnAnyBuildImprovementHooks(player, impCost, imp)
      this.game.callPlayerCardHook(player, 'onBuildMajor')
      return
    }
  }

  _offerRecruitmentFamilyGrowth(player) {
    // Check if player has a card with modifyMinorImprovementAction
    const hasRecruitment = this.game.getPlayerActiveCards(player).some(
      c => c.definition.modifyMinorImprovementAction
    )
    if (!hasRecruitment) {
      return false
    }
    if (!player.canGrowFamily(true)) {
      return false
    }

    const card = this.game.getPlayerActiveCards(player).find(
      c => c.definition.modifyMinorImprovementAction
    )

    const selection = this.choose(player, [
      `Family Growth (${card.name})`,
      'Play an Improvement',
    ], {
      title: card.name,
      min: 1,
      max: 1,
    })

    if (selection[0] === 'Play an Improvement') {
      return false
    }

    this.familyGrowth(player, true)
    return true
  }

  // ---------------------------------------------------------------------------
  // Starting player action
  // ---------------------------------------------------------------------------

  takeStartingPlayer(player) {
    this.game.state.startingPlayer = player.name
    // Note: Food is given separately by action.gives, not here

    this.log.add({
      template: '{player} becomes starting player',
      args: { player },
    })

    return true
  }

  // ---------------------------------------------------------------------------
  // Renovation + Improvement action (House Redevelopment)
  // ---------------------------------------------------------------------------

  renovationAndImprovement(player, availableImprovements, allowMinor = false) {
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

  renovationAndOrFencing(player) {
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

  executeAction(player, actionId) {
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

    if (action.allowsPlowing) {
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

  executeCardActionSpace(player, actionId, state) {
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

  /**
   * Call onAnyAction hook on ALL players' cards
   */
  callOnAnyActionHooks(actingPlayer, actionId, detailsOrResources) {
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
  callOnAnyBuildImprovementHooks(actingPlayer, cost, improvement) {
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
  callOnAnyBuildMajorHooks(actingPlayer, improvementId) {
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
  callOnAnyBeforeSowHooks(actingPlayer) {
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
  offerWoodForFoodExchange(player, card, exchange) {
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
  offerBuyBonusPoint(player, card, foodCost) {
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
  offerBuyAnimal(player, card, animalType) {
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
      player.addAnimals(animalType, 1)
      this.log.add({
        template: '{player} buys 1 {animal} for 1 food using {card}',
        args: { player, animal: animalType, card: card },
      })
    }
  }

  /**
   * Offer resource choice (Seasonal Worker, Animal Tamer)
   */
  offerResourceChoice(player, card, resources) {
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
  buildFreeStable(player, card) {
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
  offerExtraPerson(player, card, opts = {}) {
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
  offerBuildStableForWood(player, card) {
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
  offerPlayOccupation(player, card, options = {}) {
    const costObj = options.cost || {}
    const foodCost = costObj.food || 0
    return this.playOccupation(player, { costOverride: foodCost })
  }

  /**
   * Pass a minor improvement card to the player on the left, if it has passLeft.
   * Moves the card from the current player's minorImprovements zone to
   * the left player's hand zone.
   */
  maybePassLeft(player, cardId) {
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
  houseBuilding(player) {
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
  animalMarket(player) {
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
      player.addAnimals('sheep', 1)
      player.addResource('food', 1)
      this.log.add({
        template: '{player} takes 1 sheep and 1 food from the Animal Market',
        args: { player },
      })
    }
    else if (selection[0] === 'Pay 1 food for 1 cattle') {
      player.payCost({ food: 1 })
      player.addAnimals('cattle', 1)
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
  farmSupplies(player) {
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
  buildingSupplies(player) {
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
  corral(player) {
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

    player.addAnimals(animalToGet, 1)
    this.log.add({
      template: '{player} takes 1 {animal} from the Corral',
      args: { player, animal: animalToGet },
    })

    return true
  }

  /**
   * Side Job action: Build 1 stable for 1 wood + optional bake bread
   */
  sideJob(player) {
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

  offerPlow(player, card) {
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

  improvementSix(player) {
    const currentRound = this.game.state.round
    const allowMajor = currentRound >= 5

    if (allowMajor) {
      return this.buyImprovement(player, true, true)
    }
    else {
      return this.buyMinorImprovement(player)
    }
  }

  returnWorkerHome(player, workerIndex) {
    if (workerIndex === 0 && player._firstActionThisRound) {
      const actionId = player._firstActionThisRound
      const state = this.game.state.actionSpaces[actionId]
      if (state && state.occupiedBy === player.name) {
        state.occupiedBy = null
      }
      player.availableWorkers++
    }
  }

  buildFreeRoom(player, card) {
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

  familyGrowthWithoutRoom(player) {
    return this.familyGrowth(player, false)
  }

}

module.exports = { AgricolaActionManager }
