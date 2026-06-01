const { Agricola } = require('../agricola.js')


Agricola.prototype.feedingPhase = function() {
  this.log.add({ template: 'Feeding Phase', event: 'phase-start' })
  this.log.indent()

  for (const player of this.players.all()) {
    if (this.state.skipFeeding?.includes(player.name)) {
      continue
    }

    const required = player.getFoodRequired()

    this.log.add({
      template: '{player} needs {food} food',
      args: { player, food: required },
    })

    this.callPlayerCardHook(player, 'onFeedingPhase')

    // If the player has anytime actions and already enough food,
    // give them a chance to use anytime actions before feeding.
    // Only for v5 and below - v6 handles this in allowFoodConversion.
    if (this.settings.version < 6) {
      const hasAnytimeActions = this.getAnytimeActions(player).some(a => !a.passive)
      if (hasAnytimeActions && player.food >= required) {
        this.actions.choose(player, [
          this.actions.option({ id: 'feed', title: 'Feed family' }),
        ], {
          title: `Feed family (${player.food}/${required} food)`,
          min: 1, max: 1,
        })
      }
    }

    // Allow player to convert resources to food (optional)
    // Revised Edition rule: Players can withhold other goods (grain, vegetables, animals)
    // but cannot withhold food tokens. feedFamily() automatically uses all food tokens.
    this.allowFoodConversion(player, required)

    // Feed the family
    // Revised Edition rule: All food tokens are automatically used before taking begging cards.
    // Players cannot intentionally withhold food tokens to beg more than necessary.
    const result = player.feedFamily()

    if (result.beggingCards > 0) {
      this.log.add({
        template: '{player} takes {count} begging cards',
        args: { player, count: result.beggingCards },
      })
    }
    else {
      this.log.add({
        template: '{player} feeds their family',
        args: { player },
      })
    }

    this.callPlayerCardHook(player, 'onFeedingPhaseEnd')
  }

  this.log.outdent()
}

function _foodOptionId(opt) {
  if (opt.type === 'organize-farmyard') {
    return 'organize-farmyard'
  }
  const parts = [opt.type]
  if (opt.improvementId) {
    parts.push(opt.improvementId)
  }
  if (opt.cardName) {
    parts.push(opt.cardName.toLowerCase().replace(/\s+/g, '-'))
  }
  if (opt.resource) {
    parts.push(opt.resource)
  }
  return parts.join(':')
}

Agricola.prototype.allowFoodConversion = function(player, required) {
  const canContinueAfterEnoughFood = this.settings.version >= 6
  const craftUsage = {}  // Track how many times each craft improvement has been used

  while (canContinueAfterEnoughFood || player.food < required) {
    // Use function wrapper so options are recalculated after anytime actions
    const getOptions = () => {
      const options = this.getAnytimeFoodConversionOptions(player)

      // Add crafting improvements (harvest-only conversions)
      const harvestCardIds = [...player.majorImprovements, ...player.playedMinorImprovements]
      for (const impId of harvestCardIds) {
        const imp = this.cards.byId(impId)
        if (imp && imp.harvestConversion) {
          const conv = imp.harvestConversion
          const used = craftUsage[impId] || 0
          const limit = typeof conv.limit === 'function' ? conv.limit(this, player) : conv.limit
          if (player[conv.resource] > 0 && used < limit) {
            options.push({
              type: 'craft',
              improvement: imp.name,
              improvementId: impId,
              resource: conv.resource,
              count: 1,
              food: conv.food,
              description: `Use ${imp.name}: convert ${conv.resource} to ${conv.food} food`,
            })
          }
        }
      }

      // Organize farmyard (move animals between locations)
      const totalAnimals = player.getTotalAnimals('sheep') + player.getTotalAnimals('boar') + player.getTotalAnimals('cattle')
      if (totalAnimals > 0) {
        options.push({
          type: 'organize-farmyard',
          description: 'Organize Farmyard',
        })
      }

      return options
    }

    const options = getOptions()
    if (options.length === 0) {
      if (player.food >= required) {
        break
      }

      // Not enough food, no conversion options
      // For v6: show prompt so anytime panel is accessible
      if (canContinueAfterEnoughFood) {
        const hasAnytimeActions = this.getAnytimeActions(player).length > 0
        if (hasAnytimeActions) {
          this.actions.choose(player, [
            this.actions.option({ id: 'done', title: 'Done converting' }),
          ], {
            title: `Need ${required - player.food} more food`,
            min: 1, max: 1,
          })
        }
      }
      break
    }

    // Build choice options with function wrapper so they refresh after anytime actions
    const choicesFn = () => {
      const currentOptions = getOptions()
      const choices = currentOptions.map(opt => this.actions.option({
        id: _foodOptionId(opt),
        title: opt.description,
      }))
      const exitId = 'done'
      const exitTitle = player.food >= required ? 'Feed family' : 'Done converting'
      choices.push(this.actions.option({ id: exitId, title: exitTitle }))
      return choices
    }

    const hasEnoughFood = player.food >= required
    const selection = this.actions.choose(player, choicesFn, {
      title: hasEnoughFood
        ? `Feed family (${player.food}/${required} food)`
        : `Need ${required - player.food} more food`,
      min: 1,
      max: 1,
    })

    const sel = selection[0]
    const choiceId = (sel && typeof sel === 'object') ? sel.id : sel

    // Legacy bare-string responses (test mocks): match by title.
    if (choiceId === 'done' || choiceId === 'Feed family' || choiceId === 'Done converting') {
      break
    }

    // Find the matching option and execute it (match by id or by description for legacy mocks).
    const currentOptions = getOptions()
    const selectedOption = currentOptions.find(opt =>
      _foodOptionId(opt) === choiceId || opt.description === choiceId
    )
    if (selectedOption) {
      if (selectedOption.type === 'organize-farmyard') {
        this.actions.promptAnimalReorganization(player)
      }
      else {
        this.executeAnytimeFoodConversion(player, selectedOption)
        if (selectedOption.type === 'craft') {
          craftUsage[selectedOption.improvementId] = (craftUsage[selectedOption.improvementId] || 0) + 1
        }
      }
    }
  }
}
