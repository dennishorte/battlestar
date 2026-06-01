const { AgricolaActionManager } = require('../AgricolaActionManager.js')
const res = require('../res/index.js')

/**
 * Centralised helper that performs all post-selection major-improvement
 * purchase steps: pay cost, log, fire onBuy / onBuildImprovement /
 * onBuildMajor hooks, check fireplace upgrade, and offer second major.
 *
 * @param {object} player
 * @param {string} improvementId
 * @param {object} [options]
 * @param {object} [options.customCost]         — override cost (e.g. OvenSite)
 * @param {string} [options.logTemplate]        — custom log template
 * @param {object} [options.logArgs]            — extra log args (merged with { player, card })
 * @param {boolean} [options.skipSecondMajorOffer] — suppress recursion from _offerSecondMajorFromCard
 */
AgricolaActionManager.prototype._completeMajorPurchase = function(player, improvementId, options = {}) {
  const imp = this.game.cards.byId(improvementId)
  if (!imp) {
    return false
  }

  let result
  if (options.customCost) {
    // customCost bypasses the standard canBuyMajorImprovement affordability
    // check, but we still verify availability and affordability ourselves.
    const available = this.game.getAvailableMajorImprovements()
    if (!available.includes(improvementId)) {
      return false
    }
    if (!player.canAffordCost(options.customCost)) {
      return false
    }
    imp.moveTo(this.game.zones.byPlayer(player, 'majorImprovements'))
    result = { upgraded: false }
  }
  else {
    if (!player.canBuyMajorImprovement(improvementId)) {
      return false
    }
    result = player.buyMajorImprovement(improvementId)
  }
  this._recordCardPlayed(player, imp)

  // --- Log ---
  if (options.logTemplate) {
    this.log.add({
      template: options.logTemplate,
      args: { player, card: imp, ...(options.logArgs || {}) },
    })
  }
  else {
    this.log.add({
      template: '{player} buys {card}',
      args: { player, card: imp },
    })
  }

  // --- Cost ---
  let impCost
  if (options.customCost) {
    impCost = options.customCost
    player.payCost(impCost)
  }
  else if (result.upgraded) {
    impCost = {}
  }
  else {
    const affordableOptions = player.getAffordableMajorImprovementCostOptions(improvementId)
    if (affordableOptions.length > 1) {
      const costChoices = affordableOptions.map((opt, idx) => this.option({
        id: `cost-${idx}`,
        title: this._formatCostLabel(opt.cost),
      }))
      const selection = this.choose(player, costChoices, {
        title: `Choose payment for ${imp.name}`,
        min: 1,
        max: 1,
      })
      const selectedIdx = Number(selection[0].id.slice('cost-'.length))
      impCost = affordableOptions[selectedIdx].cost
    }
    else {
      impCost = affordableOptions[0].cost
    }
    if ((player._houseRedevelopmentDiscount || 0) > 0) {
      impCost = this._applyBuildingResourceDiscount(player, impCost, player._houseRedevelopmentDiscount)
    }
    if ((player._anyResourceDiscount || 0) > 0) {
      impCost = this._applyAnyResourceDiscount(player, impCost, player._anyResourceDiscount)
    }
    player.payCost(impCost)
  }

  // --- onBuy hook (e.g. Ovens bake bread, Well schedules food) ---
  if (imp.hasHook('onBuy')) {
    imp.callHook('onBuy', this.game, player)
  }

  // --- onBuildImprovement hooks (BrickHammer checks clay cost) ---
  this.game.callPlayerCardHook(player, 'onBuildImprovement', impCost, imp)
  this.callOnAnyBuildImprovementHooks(player, impCost, imp)

  // --- onBuildMajor hooks (Farm Building schedules food, Craft Teacher) ---
  this.game.callPlayerCardHook(player, 'onBuildMajor', improvementId)
  this.callOnAnyBuildMajorHooks(player, improvementId)

  // --- Fireplace upgrade hook ---
  if (imp.upgradesFrom && imp.upgradesFrom.some(id => id.startsWith('fireplace'))) {
    this.game.callPlayerCardHook(player, 'onUpgradeFireplace')
  }

  // --- Offer second major from card (unless suppressed) ---
  if (!options.skipSecondMajorOffer) {
    this._offerSecondMajorFromCard(player, improvementId)
  }

  return improvementId
}

AgricolaActionManager.prototype.buyMajorImprovement = function(player, availableImprovements) {
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
      return this.option({ id, title: `${imp.name} (${id})`, kind: 'major-improvement' })
    })
    choices.push(this.option({ id: 'do-not-buy', title: 'Do not buy' }))
    return choices
  }, {
    title: 'Choose a major improvement',
    min: 1,
    max: 1,
  })

  const improvementId = selection[0].id

  if (improvementId === 'do-not-buy') {
    this.log.addDoNothing(player, 'buy an improvement')
    return true
  }

  if (improvementId) {
    return this._completeMajorPurchase(player, improvementId)
  }

  return false
}

AgricolaActionManager.prototype.offerFreeOccupations = function(player, card, maxCount) {
  for (let i = 0; i < maxCount; i++) {
    const played = this.playOccupation(player, { free: true })
    if (!played) {
      break
    }
  }
}

AgricolaActionManager.prototype.offerUseOtherSpace = function(player, card, otherActionId, opts = {}) {
  const action = res.getActionById(otherActionId)
  if (!action) {
    return
  }
  const costLabel = opts.cost ? ` (pay ${Object.entries(opts.cost).map(([r, n]) => `${n} ${r}`).join(', ')})` : ''
  const choices = [
    this.option({ id: 'use', title: `Use ${action.name}${costLabel}` }),
    this.option({ id: 'skip', title: 'Skip' }),
  ]
  const selection = this.choose(player, choices, {
    title: `${card.name}: Use other space with same person?`,
    min: 1,
    max: 1,
  })
  if (selection[0].id === 'skip') {
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

/**
 * Central function for completing an occupation play (post-selection).
 * Handles before-hooks, cost payment, card play, logging, onPlay hook,
 * action-space registration, and onPlayOccupation hooks.
 *
 * @param {object} player
 * @param {string} cardId
 * @param {object} [options]
 * @param {object} [options.cost]             — cost to pay (e.g., { food: 2 })
 * @param {string} [options.logTemplate]      — custom log template
 * @param {object} [options.logArgs]          — extra log args merged with { player, card }
 * @param {boolean} [options.skipBeforeHooks] — suppress onBeforePlayOccupation (when caller already fired it)
 */
AgricolaActionManager.prototype._completeOccupationPlay = function(player, cardId, options = {}) {
  const card = this.game.cards.byId(cardId)
  if (!card) {
    return false
  }

  // Fire onBeforePlayOccupation hooks (e.g. Patron: get 2 food, WhaleOil: get stored food)
  if (!options.skipBeforeHooks) {
    this.game.callPlayerCardHook(player, 'onBeforePlayOccupation')
  }

  // Pay cost if provided
  if (options.cost) {
    player.payCost(options.cost)
  }

  // Play the card (moves from hand to playedOccupations)
  player.playCard(cardId)
  this._recordCardPlayed(player, card)

  // Log
  if (options.logTemplate) {
    this.log.add({
      template: options.logTemplate,
      args: { player, card, ...(options.logArgs || {}) },
    })
  }
  else {
    this.log.add({
      template: '{player} plays {card}',
      args: { player, card },
    })
  }

  // Pay card cost (e.g. prereq costs defined on the card itself)
  player.payCardCost(cardId)

  this.game.registerCardActionSpace(player, card)

  // Call onPlayOccupation hooks on all active cards (before onPlay so that
  // triggered effects like Scales resolve before the card's own effect)
  this.game.callPlayerCardHook(player, 'onPlayOccupation', card)

  // Execute onPlay effect if present
  if (card.hasHook('onPlay')) {
    this.game.log.indent()
    card.callHook('onPlay', this.game, player)
    this.game.log.outdent()
  }

  return true
}

AgricolaActionManager.prototype.playOccupation = function(player, options = {}) {
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

  // Working Gloves: can pay 1 building resource in place of up to 2 food
  const hasResourceSub = costObj.allowResourceSubstitution
  const buildingResources = ['wood', 'clay', 'stone', 'reed']
  const hasBuildingResource = hasResourceSub && buildingResources.some(r => player[r] >= 1)

  if (cost > 0 && !hasWoodOrFood && player.food < cost) {
    // Working Gloves: if player can substitute a building resource, reduce effective food needed
    if (hasBuildingResource) {
      const foodReduction = Math.min(cost, hasResourceSub.replaces)
      const effectiveFoodNeeded = cost - foodReduction
      if (player.food < effectiveFoodNeeded) {
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
    else {
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
  const choices = playableOccupations.map(id => {
    const card = this.game.cards.byId(id)
    return this.option({
      id,
      title: card ? card.name : id,
      kind: 'occupation',
    })
  })

  // Add option to not play
  choices.push(this.option({ id: 'do-not-play', title: 'Do not play an occupation' }))

  const selection = this.choose(player, choices, {
    title: options.free ? 'Play an Occupation (free)' : (cost > 0 ? `Play an Occupation (costs ${cost} food)` : 'Play an Occupation (free)'),
    min: 1,
    max: 1,
  })

  const selectedId = selection[0].id

  if (selectedId === 'do-not-play') {
    this.log.addDoNothing(player, 'play an occupation')
    return false
  }

  const cardId = playableOccupations.find(id => id === selectedId)

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
            payChoices.push(this.option({ id: 'pay-food', title: `Pay ${amount} food` }))
          }
          if (player.wood >= amount) {
            payChoices.push(this.option({ id: 'pay-wood', title: `Pay ${amount} wood` }))
          }
          if (payChoices.length === 0) {
            payChoices.push(this.option({ id: 'pay-food', title: `Pay ${amount} food` }))
          }
          return payChoices
        }, {
          title: 'Choose payment for occupation',
          min: 1,
          max: 1,
        })
        if (paySelection[0].id === 'pay-wood') {
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
    else if (hasResourceSub) {
      // Working Gloves: can pay 1 building resource in place of up to 2 food
      const foodReduction = Math.min(cost, hasResourceSub.replaces)
      const remainingFood = cost - foodReduction
      const affordableResources = buildingResources.filter(r => player[r] >= 1)

      if (affordableResources.length > 0 && (player.food < cost || affordableResources.length > 0)) {
        const payChoices = []
        // Standard food payment (if affordable)
        if (player.food >= cost) {
          payChoices.push(this.option({ id: 'pay-food', title: `Pay ${cost} food` }))
        }
        // Building resource substitution options
        for (const res of affordableResources) {
          const title = remainingFood > 0 ? `Pay 1 ${res} + ${remainingFood} food` : `Pay 1 ${res}`
          payChoices.push(this.option({ id: `pay-${res}`, title }))
        }

        const applyPayment = (id) => {
          if (id === 'pay-food') {
            player.payCost({ food: cost })
            return
          }
          const res = id.slice('pay-'.length)
          player.payCost({ [res]: 1, ...(remainingFood > 0 ? { food: remainingFood } : {}) })
          this.log.add({
            template: '{player} pays 1 {resource} in place of {amount} food via {card}',
            args: { player, resource: res, amount: foodReduction, card: 'Working Gloves' },
          })
        }

        if (payChoices.length === 1) {
          applyPayment(payChoices[0].id)
        }
        else {
          const paySelection = this.choose(player, payChoices, {
            title: 'Choose payment for occupation',
            min: 1,
            max: 1,
          })
          applyPayment(paySelection[0].id)
        }
      }
      else {
        // No building resources available, pay normally
        player.payCost({ food: cost })
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

  return this._completeOccupationPlay(player, cardId, { skipBeforeHooks: true })
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
AgricolaActionManager.prototype.getAllowedMajorsForMinorAction = function(player) {
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

AgricolaActionManager.prototype.buyMinorImprovement = function(player) {
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

      nestedChoices.push(this.option({ id: 'do-not-play', title: 'Do not play an improvement' }))
      return nestedChoices
    }, {
      title: 'Play a Minor Improvement',
      min: 1,
      max: 1,
    })

    const choice = selection[0]

    if (choice && choice.id === 'do-not-play') {
      this.log.addDoNothing(player, 'play an improvement')
      return false
    }

    if (typeof choice === 'object' && choice.title) {
      const selectedName = choice.selection[0]

      if (choice.title === 'Major Improvement') {
        const idMatch = selectedName.match(/\(([^)]+)\)/)
        const improvementId = idMatch ? idMatch[1] : null

        if (improvementId) {
          return this._completeMajorPurchase(player, improvementId)
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
    const choices = currentPlayable.map(id => {
      const card = this.game.cards.byId(id)
      return this.option({ id, title: card ? card.name : id, kind: 'minor-improvement' })
    })
    choices.push(this.option({ id: 'do-not-play', title: 'Do not play a minor improvement' }))
    return choices
  }, {
    title: 'Play a Minor Improvement',
    min: 1,
    max: 1,
  })

  const cardId = selection[0].id

  if (cardId === 'do-not-play') {
    this.log.addDoNothing(player, 'play a minor improvement')
    return false
  }

  const currentPlayable = minorInHand.filter(id => player.canPlayCard(id))
  if (!currentPlayable.includes(cardId)) {
    return false
  }

  this._playMinorWithCostChoice(player, cardId)

  return true
}

// ---------------------------------------------------------------------------
// Major or Minor Improvement action
// ---------------------------------------------------------------------------

AgricolaActionManager.prototype.buildImprovement = function(player, options = {}) {
  return this.buyImprovement(player, true, true, options)
}

AgricolaActionManager.prototype.buyImprovement = function(player, allowMajor, allowMinor, options = {}) {
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
    nestedChoices.push(this.option({ id: 'do-not-play', title: 'Do not play an improvement' }))

    return nestedChoices
  }, {
    title: 'Choose an Improvement',
    min: 1,
    max: 1,
  })

  const choice = selection[0]

  // Handle "do not play" choice
  if (choice && choice.id === 'do-not-play') {
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
        return this._completeMajorPurchase(player, improvementId)
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

AgricolaActionManager.prototype._offerSecondMajorFromCard = function(player, justBoughtId) {
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
      return this.option({ id, title: `Also build ${imp.name}`, kind: 'major-improvement' })
    })
    choices.push(this.option({ id: 'skip', title: 'Skip' }))

    const selection = this.choose(player, choices, {
      title: card.name,
      min: 1,
      max: 1,
    })

    const chosenId = selection[0].id
    if (chosenId === 'skip') {
      return
    }
    if (!otherIds.includes(chosenId)) {
      return
    }

    this._completeMajorPurchase(player, chosenId, {
      logTemplate: '{player} also buys {card} via {source}',
      logArgs: { source: card },
      skipSecondMajorOffer: true,
    })
    return
  }
}

AgricolaActionManager.prototype._offerRecruitmentFamilyGrowth = function(player) {
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
    this.option({ id: 'growth', title: `Family Growth (${card.name})` }),
    this.option({ id: 'improvement', title: 'Play an Improvement' }),
  ], {
    title: card.name,
    min: 1,
    max: 1,
  })

  if (selection[0].id === 'improvement') {
    return false
  }

  this.familyGrowth(player, true)
  return true
}

