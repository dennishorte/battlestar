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
    if (!imp || !imp.cookingRates) {
      return null
    }
    return {
      improvementName: imp.name,
      rates: imp.cookingRates,
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


}

module.exports = { AgricolaActionManager }

require('./actions/building')
require('./actions/farming')
require('./actions/fencing')
require('./actions/familyGrowth')
require('./actions/cards')
require('./actions/startingPlayer')
require('./actions/execute')
require('./actions/hooks')
