const { Agricola } = require('./agricola')

function formatExchange(from, to) {
  const fromStr = Object.entries(from).map(([r, a]) => `${a} ${r}`).join(' + ')
  const toStr = Object.entries(to).map(([r, a]) => `${a} ${r}`).join(' + ')
  return `${fromStr} → ${toStr}`
}

function canAffordCost(player, cost) {
  return Object.entries(cost).every(([res, amt]) => {
    if (['sheep', 'boar', 'cattle'].includes(res)) {
      return player.getTotalAnimals(res) >= amt
    }
    return (player[res] || 0) >= amt
  })
}

Agricola.prototype.getAnytimeFoodConversionOptions = function(player) {
  const options = []

  // Basic conversions (always available, 1:1 ratio)
  if (player.grain > 0) {
    options.push({
      type: 'basic',
      resource: 'grain',
      count: 1,
      food: 1,
      description: 'Convert 1 grain to 1 food',
    })
  }
  if (player.vegetables > 0) {
    options.push({
      type: 'basic',
      resource: 'vegetables',
      count: 1,
      food: 1,
      description: 'Convert 1 vegetable to 1 food',
    })
  }

  // Cooking conversions (requires Fireplace or Cooking Hearth)
  if (player.hasCookingAbility()) {
    const imp = player.getCookingImprovement()
    const rates = imp.cookingRates
    const animals = player.getAllAnimals()

    for (const [type, count] of Object.entries(animals)) {
      if (count > 0) {
        const food = rates[type]
        options.push({
          type: 'cook',
          resource: type,
          count: 1,
          food,
          description: `Cook 1 ${type} for ${food} food`,
        })
      }
    }

    // Cook vegetables at improvement rate (better than basic 1:1)
    if (player.vegetables > 0) {
      const food = rates.vegetables
      options.push({
        type: 'cook-vegetable',
        resource: 'vegetables',
        count: 1,
        food,
        description: `Cook 1 vegetable for ${food} food`,
      })
    }
  }

  // Card-based anytime conversions (e.g., Oriental Fireplace)
  for (const cardId of player.playedMinorImprovements) {
    const card = this.cards.byId(cardId)
    if (!card || !card.definition.anytimeConversions) {
      continue
    }
    for (const conv of card.definition.anytimeConversions) {
      if (['sheep', 'boar', 'cattle'].includes(conv.from)) {
        if (player.getTotalAnimals(conv.from) > 0) {
          options.push({
            type: 'card-cook',
            cardName: card.name,
            resource: conv.from,
            count: 1,
            food: conv.rate,
            description: `${card.name}: ${conv.from} → ${conv.rate} food`,
          })
        }
      }
      else {
        const resourceKey = conv.from
        if ((player[resourceKey] || 0) > 0) {
          options.push({
            type: 'card-convert',
            cardName: card.name,
            resource: resourceKey,
            count: 1,
            food: conv.rate,
            description: `${card.name}: ${resourceKey} → ${conv.rate} food`,
          })
        }
      }
    }
  }

  // Scan occupations for anytimeConversions (old format) and allowsAnytimeConversion (new format)
  for (const cardId of player.playedOccupations) {
    const card = this.cards.byId(cardId)
    if (!card) {
      continue
    }
    const def = card.definition

    if (def.anytimeConversions) {
      for (const conv of def.anytimeConversions) {
        if (['sheep', 'boar', 'cattle'].includes(conv.from)) {
          if (player.getTotalAnimals(conv.from) > 0) {
            options.push({
              type: 'card-cook',
              cardName: card.name,
              resource: conv.from,
              count: 1,
              food: conv.rate,
              description: `${card.name}: ${conv.from} → ${conv.rate} food`,
            })
          }
        }
        else {
          const resourceKey = conv.from
          if ((player[resourceKey] || 0) > 0) {
            options.push({
              type: 'card-convert',
              cardName: card.name,
              resource: resourceKey,
              count: 1,
              food: conv.rate,
              description: `${card.name}: ${resourceKey} → ${conv.rate} food`,
            })
          }
        }
      }
    }

    if (def.allowsAnytimeConversion) {
      const conversions = Array.isArray(def.allowsAnytimeConversion)
        ? def.allowsAnytimeConversion
        : [def.allowsAnytimeConversion]
      for (const conv of conversions) {
        if (!conv.to.food) {
          continue
        }
        if (!canAffordCost(player, conv.from)) {
          continue
        }
        const fromEntries = Object.entries(conv.from)
        const resource = fromEntries[0][0]
        const count = fromEntries[0][1]
        options.push({
          type: 'card-convert',
          cardName: card.name,
          resource,
          count,
          food: conv.to.food,
          description: `${card.name}: ${formatExchange(conv.from, conv.to)}`,
        })
      }
    }
  }

  // Scan minor improvements for allowsAnytimeConversion (new format, food output only)
  for (const cardId of player.playedMinorImprovements) {
    const card = this.cards.byId(cardId)
    if (!card) {
      continue
    }
    const def = card.definition
    if (!def.allowsAnytimeConversion) {
      continue
    }

    const conversions = Array.isArray(def.allowsAnytimeConversion)
      ? def.allowsAnytimeConversion
      : [def.allowsAnytimeConversion]
    for (const conv of conversions) {
      if (!conv.to.food) {
        continue
      }
      if (!canAffordCost(player, conv.from)) {
        continue
      }
      const fromEntries = Object.entries(conv.from)
      const resource = fromEntries[0][0]
      const count = fromEntries[0][1]
      options.push({
        type: 'card-convert',
        cardName: card.name,
        resource,
        count,
        food: conv.to.food,
        description: `${card.name}: ${formatExchange(conv.from, conv.to)}`,
      })
    }
  }

  return options
}

Agricola.prototype.executeAnytimeFoodConversion = function(player, option) {
  if (option.type === 'basic') {
    player.convertToFood(option.resource, option.count)
    this.log.add({
      template: '{player} converts {count} {resource} to {food} food',
      args: { player, count: option.count, resource: option.resource, food: option.food },
    })
  }
  else if (option.type === 'cook') {
    player._usedCookingThisTurn = true
    const food = player.cookAnimal(option.resource, option.count)
    this.log.add({
      template: '{player} cooks {count} {resource} for {food} food',
      args: { player, count: option.count, resource: option.resource, food },
    })
    this.callPlayerCardHook(player, 'onCookAnimal', option.resource, option.count, food)
    this.callPlayerCardHook(player, 'onCook', option.resource, option.count, food)
    this.callPlayerCardHook(player, 'onConvertAnimalToFood', option.resource, option.count, food)
  }
  else if (option.type === 'cook-vegetable') {
    player._usedCookingThisTurn = true
    const food = player.cookVegetable(option.count)
    this.log.add({
      template: '{player} cooks {count} vegetable(s) for {food} food',
      args: { player, count: option.count, food },
    })
    this.callPlayerCardHook(player, 'onCook', 'vegetable', option.count, food)
  }
  else if (option.type === 'craft') {
    player.removeResource(option.resource, option.count)
    player.addResource('food', option.food)
    this.log.add({
      template: '{player} uses {improvement} to convert {resource} to {food} food',
      args: { player, improvement: option.improvement, resource: option.resource, food: option.food },
    })
    // Call onUseCraftConversion hooks (e.g., PlowBuilder offers plow when using Joinery)
    this.callPlayerCardHook(player, 'onUseCraftConversion', option.improvement, option.resource)
  }
  else if (option.type === 'card-cook') {
    player._usedCookingThisTurn = true
    player.removeAnimals(option.resource, option.count)
    player.addResource('food', option.food)
    this.log.add({
      template: '{player} uses {card} to cook {count} {resource} for {food} food',
      args: { player, card: option.cardName, count: option.count, resource: option.resource, food: option.food },
    })
    this.callPlayerCardHook(player, 'onCookAnimal', option.resource, option.count, option.food)
    this.callPlayerCardHook(player, 'onCook', option.resource, option.count, option.food)
    this.callPlayerCardHook(player, 'onConvertAnimalToFood', option.resource, option.count, option.food)
  }
  else if (option.type === 'card-convert') {
    player.removeResource(option.resource, option.count)
    player.addResource('food', option.food)
    this.log.add({
      template: '{player} uses {card} to convert {resource} to {food} food',
      args: { player, card: option.cardName, resource: option.resource, food: option.food },
    })
  }
}

Agricola.prototype.getAnytimeActions = function(player) {
  const options = []

  // Cooking conversions (requires Fireplace or Cooking Hearth)
  if (player.hasCookingAbility()) {
    const imp = player.getCookingImprovement()
    const rates = imp.cookingRates
    const animals = player.getAllAnimals()

    for (const [type, count] of Object.entries(animals)) {
      if (count > 0) {
        const food = rates[type]
        options.push({
          type: 'cook',
          resource: type,
          count: 1,
          food,
          description: `Cook 1 ${type} for ${food} food`,
        })
      }
    }

    // Cook vegetables at improvement rate (better than basic 1:1)
    if (player.vegetables > 0) {
      const food = rates.vegetables
      options.push({
        type: 'cook-vegetable',
        resource: 'vegetables',
        count: 1,
        food,
        description: `Cook 1 vegetable for ${food} food`,
      })
    }
  }

  // Card-based anytime conversions (e.g., Oriental Fireplace)
  for (const cardId of player.playedMinorImprovements) {
    const card = this.cards.byId(cardId)
    if (!card || !card.definition.anytimeConversions) {
      continue
    }
    for (const conv of card.definition.anytimeConversions) {
      if (['sheep', 'boar', 'cattle'].includes(conv.from)) {
        if (player.getTotalAnimals(conv.from) > 0) {
          options.push({
            type: 'card-cook',
            cardName: card.name,
            resource: conv.from,
            count: 1,
            food: conv.rate,
            description: `${card.name}: ${conv.from} → ${conv.rate} food`,
          })
        }
      }
      else {
        const resourceKey = conv.from
        if ((player[resourceKey] || 0) > 0) {
          options.push({
            type: 'card-convert',
            cardName: card.name,
            resource: resourceKey,
            count: 1,
            food: conv.rate,
            description: `${card.name}: ${resourceKey} → ${conv.rate} food`,
          })
        }
      }
    }
  }

  // Non-food anytime actions (e.g., Clearing Spade crop move)
  for (const cardId of player.playedMinorImprovements) {
    const card = this.cards.byId(cardId)
    if (!card || !card.definition.allowsAnytimeCropMove) {
      continue
    }
    const fieldSpaces = player.getFieldSpaces()
    const hasGridSource = fieldSpaces.some(f => f.crop && f.cropCount >= 2)
    const hasGridTarget = fieldSpaces.some(f => !f.crop || f.cropCount === 0)

    const sownVFs = player.getSownVirtualFields().filter(vf => vf.cropCount >= 2)
    const emptyVFs = player.getEmptyVirtualFields()

    const hasSource = hasGridSource || sownVFs.length > 0
    const hasTarget = hasGridTarget || emptyVFs.length > 0
    if (hasSource && hasTarget) {
      options.push({
        type: 'crop-move',
        cardName: card.name,
        description: `${card.name}: Move 1 crop to empty field`,
      })
    }
  }

  // Scan all cards for exchange, custom action, and purchase flags
  const allCardIds = [...player.playedMinorImprovements, ...player.playedOccupations]
  for (const cardId of allCardIds) {
    const card = this.cards.byId(cardId)
    if (!card) {
      continue
    }
    const def = card.definition

    // allowsAnytimeConversion (new structured format)
    if (def.allowsAnytimeConversion) {
      const conversions = Array.isArray(def.allowsAnytimeConversion)
        ? def.allowsAnytimeConversion
        : [def.allowsAnytimeConversion]
      for (const conv of conversions) {
        if (!canAffordCost(player, conv.from)) {
          continue
        }
        const foodOnly = Object.keys(conv.to).length === 1 && conv.to.food
        if (foodOnly) {
          // Food-only conversion — use card-convert type (matches feeding-phase pattern)
          const fromEntries = Object.entries(conv.from)
          const resource = fromEntries[0][0]
          const count = fromEntries[0][1]
          if (['sheep', 'boar', 'cattle'].includes(resource)) {
            options.push({
              type: 'card-cook',
              cardName: card.name,
              resource,
              count,
              food: conv.to.food,
              description: `${card.name}: ${formatExchange(conv.from, conv.to)}`,
            })
          }
          else {
            options.push({
              type: 'card-convert',
              cardName: card.name,
              resource,
              count,
              food: conv.to.food,
              description: `${card.name}: ${formatExchange(conv.from, conv.to)}`,
            })
          }
        }
        else {
          // Non-food exchange
          options.push({
            type: 'card-exchange',
            cardId: card.id,
            cardName: card.name,
            from: conv.from,
            to: conv.to,
            description: `${card.name}: ${formatExchange(conv.from, conv.to)}`,
          })
        }
      }
    }

    // allowsAnytimeExchange + exchangeOptions (array format)
    if (def.allowsAnytimeExchange && Array.isArray(def.exchangeOptions)) {
      for (const opt of def.exchangeOptions) {
        if (!canAffordCost(player, opt.from)) {
          continue
        }
        const action = {
          type: 'card-exchange',
          cardId: card.id,
          cardName: card.name,
          from: opt.from,
          to: opt.to,
          description: `${card.name}: ${formatExchange(opt.from, opt.to)}`,
        }
        if (opt.bonusPoints) {
          action.bonusPoints = opt.bonusPoints
        }
        options.push(action)
      }
    }

    // allowsAnytimeAction (custom card methods)
    if (def.allowsAnytimeAction && typeof def.getAnytimeActions === 'function') {
      const cardActions = def.getAnytimeActions.call(def, this, player)
      if (cardActions) {
        options.push(...cardActions)
      }
    }

    // allowsAnytimePurchase (custom purchase logic)
    if (def.allowsAnytimePurchase && typeof def.getAnytimeActions === 'function') {
      const cardActions = def.getAnytimeActions.call(def, this, player)
      if (cardActions) {
        options.push(...cardActions)
      }
    }
  }

  return options
}

Agricola.prototype.executeAnytimeAction = function(player, action) {
  if (action.type === 'crop-move') {
    this.executeAnytimeCropMove(player, action)
    return
  }
  if (action.type === 'card-exchange') {
    this.executeAnytimeCardExchange(player, action)
    return
  }
  if (action.type === 'card-custom') {
    this.executeAnytimeCardCustom(player, action)
    return
  }
  // Delegate to executeAnytimeFoodConversion for all food-related types
  this.executeAnytimeFoodConversion(player, action)
}

Agricola.prototype.executeAnytimeCardExchange = function(player, action) {
  // Pay from resources
  for (const [res, amt] of Object.entries(action.from)) {
    if (['sheep', 'boar', 'cattle'].includes(res)) {
      player.removeAnimals(res, amt)
    }
    else {
      player.removeResource(res, amt)
    }
  }
  // Gain to resources
  for (const [res, amt] of Object.entries(action.to)) {
    if (['sheep', 'boar', 'cattle'].includes(res)) {
      player.addAnimals(res, amt)
    }
    else {
      player.addResource(res, amt)
    }
  }
  // Handle bonus points (e.g., Kettle)
  if (action.bonusPoints) {
    player.addBonusPoints(action.bonusPoints)
  }
  this.log.add({
    template: '{player} uses {card}: {exchange}',
    args: { player, card: action.cardName, exchange: formatExchange(action.from, action.to) },
  })
}

Agricola.prototype.executeAnytimeCardCustom = function(player, action) {
  const card = this.cards.byId(action.cardId)
  if (!card) {
    return
  }
  const def = card.definition
  if (typeof def[action.actionKey] === 'function') {
    def[action.actionKey](this, player, action.actionArg)
  }
}

Agricola.prototype.getUnusedOncePerRoundActions = function(player) {
  return this.getAnytimeActions(player).filter(action => {
    if (!action.oncePerRound) {
      return false
    }
    if (!action.cardId) {
      return false
    }
    const state = this.cardState(action.cardId)
    return state.lastUsedRound !== this.state.round
  })
}

Agricola.prototype.executeAnytimeCropMove = function(player, action) {
  const fieldSpaces = player.getFieldSpaces()

  // Build source choices: grid fields + virtual fields with cropCount >= 2
  const sourceGridFields = fieldSpaces.filter(f => f.crop && f.cropCount >= 2)
  const sourceVFs = player.getSownVirtualFields().filter(vf => vf.cropCount >= 2)

  const sourceChoices = [
    ...sourceGridFields.map(f => `${f.row},${f.col} (${f.crop} x${f.cropCount})`),
    ...sourceVFs.map(vf => `[${vf.label}] (${vf.crop} x${vf.cropCount})`),
  ]

  const sourceSelection = this.actions.choose(player, sourceChoices, {
    title: `${action.cardName}: Pick source field`,
    min: 1, max: 1,
  })

  const sourceStr = Array.isArray(sourceSelection) ? sourceSelection[0] : sourceSelection

  // Determine source type and get crop info
  let cropType
  let sourceIsVirtual = false
  let sourceVF = null
  let sourceCell = null
  let sourceLabel

  if (sourceStr.startsWith('[')) {
    // Virtual field source
    sourceIsVirtual = true
    const labelMatch = sourceStr.match(/^\[(.+?)\]/)
    sourceLabel = labelMatch[1]
    sourceVF = [...sourceVFs].find(vf => vf.label === sourceLabel)
    cropType = sourceVF.crop
  }
  else {
    // Grid field source
    const [sourceRow, sourceCol] = sourceStr.split(' ')[0].split(',').map(Number)
    sourceCell = player.farmyard.grid[sourceRow][sourceCol]
    cropType = sourceCell.crop
    sourceLabel = `(${sourceRow},${sourceCol})`
  }

  // Build target choices: empty grid fields + empty virtual fields (respecting cropRestriction)
  const targetGridFields = fieldSpaces.filter(f => {
    if (f.crop && f.cropCount > 0) {
      return false
    }
    if (!sourceIsVirtual && f.row === Number(sourceStr.split(' ')[0].split(',')[0]) && f.col === Number(sourceStr.split(' ')[0].split(',')[1])) {
      return false
    }
    return true
  })
  const targetVFs = player.getEmptyVirtualFields().filter(vf => {
    if (sourceIsVirtual && vf.id === sourceVF.id) {
      return false
    }
    if (vf.cropRestriction && vf.cropRestriction !== cropType) {
      return false
    }
    return true
  })

  const targetChoices = [
    ...targetGridFields.map(f => `${f.row},${f.col}`),
    ...targetVFs.map(vf => `[${vf.label}]`),
  ]

  const targetSelection = this.actions.choose(player, targetChoices, {
    title: `${action.cardName}: Pick target field`,
    min: 1, max: 1,
  })

  const targetStr = Array.isArray(targetSelection) ? targetSelection[0] : targetSelection

  let targetLabel
  if (targetStr.startsWith('[')) {
    // Virtual field target
    const labelMatch = targetStr.match(/^\[(.+?)\]/)
    targetLabel = labelMatch[1]
    const targetVF = player.virtualFields.find(vf => vf.label === targetLabel)
    targetVF.crop = cropType
    targetVF.cropCount = 1
  }
  else {
    // Grid field target
    const [targetRow, targetCol] = targetStr.split(',').map(Number)
    const targetCell = player.farmyard.grid[targetRow][targetCol]
    targetCell.crop = cropType
    targetCell.cropCount = 1
    targetLabel = `(${targetRow},${targetCol})`
  }

  // Decrement source
  if (sourceIsVirtual) {
    sourceVF.cropCount -= 1
    if (sourceVF.cropCount === 0) {
      sourceVF.crop = null
    }
  }
  else {
    sourceCell.cropCount -= 1
    if (sourceCell.cropCount === 0) {
      sourceCell.crop = null
    }
  }

  this.log.add({
    template: '{player} uses {card} to move 1 {crop} from {source} to {target}',
    args: { player, card: action.cardName, crop: cropType, source: sourceLabel, target: targetLabel },
  })
}
