const { AgricolaActionManager } = require('../AgricolaActionManager.js')
const res = require('../res/index.js')

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

