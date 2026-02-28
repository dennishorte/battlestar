const { AgricolaActionManager } = require('../AgricolaActionManager.js')
const res = require('../res/index.js')

AgricolaActionManager.prototype.plowField = function(player, options = {}) {
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
    help: 'You can also click on the farmyard to select.',
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

AgricolaActionManager.prototype._getZigzagPlowSpaces = function(player) {
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

// Helper: handle one sow iteration (build selector, parse response, execute sow, log)
// Returns { cropType, row, col } for regular fields, { cropType } for virtual fields,
// or false if "Done Sowing" was selected.
AgricolaActionManager.prototype._sowOneField = function(player, options) {
  const {
    fields,
    regularFields,
    emptyVirtualFields,
    canSowGrain,
    canSowVeg,
    title = 'Choose field to sow',
    card,
    canDone = false,
  } = options

  // Build nested choices showing crop types with their available fields
  const nestedChoices = []

  if (canSowGrain) {
    const grainFields = fields
      .filter(f => !f.cropRestriction || f.cropRestriction === 'grain')
      .map(f => f.isVirtualField ? `Field (${f.label})` : `Field (${f.row},${f.col})`)
    if (grainFields.length > 0) {
      nestedChoices.push({
        title: 'Grain',
        choices: grainFields,
        min: 0,
        max: 1,
      })
    }
  }

  if (canSowVeg) {
    const vegFields = fields
      .filter(f => !f.cropRestriction || f.cropRestriction === 'vegetables')
      .map(f => f.isVirtualField ? `Field (${f.label})` : `Field (${f.row},${f.col})`)
    if (vegFields.length > 0) {
      nestedChoices.push({
        title: 'Vegetables',
        choices: vegFields,
        min: 0,
        max: 1,
      })
    }
  }

  if (canDone) {
    nestedChoices.push('Done Sowing')
  }

  const logSuffix = card ? ' ({card})' : ''
  const logCardArg = card ? { card } : {}

  const selector = {
    type: 'select',
    actor: player.name,
    title,
    choices: nestedChoices,
    min: 1,
    max: 1,
    allowsAction: ['sow-field', 'sow-virtual-field'],
    validSpaces: regularFields,
    canSowGrain,
    canSowVeg,
    emptyVirtualFields,
  }

  const result = this.game.requestInputSingle(selector)

  // Handle action-based response for regular field
  if (result.action === 'sow-field') {
    const { row, col, cropType } = result

    const isValidField = regularFields.some(f => f.row === row && f.col === col)
    if (!isValidField) {
      throw new Error(`Invalid sow space: (${row}, ${col}) is not a valid field`)
    }
    if (cropType === 'grain' && !canSowGrain) {
      throw new Error('No grain available to sow')
    }
    if (cropType === 'vegetables' && !canSowVeg) {
      throw new Error('No vegetables available to sow')
    }

    player.sowField(row, col, cropType)
    const amount = cropType === 'grain' ? res.constants.sowingGrain : res.constants.sowingVegetables
    this.log.add({
      template: `{player} sows {crop} at ({row},{col}) - {amount} total${logSuffix}`,
      args: { player, crop: cropType, row, col, amount, ...logCardArg },
    })
    return { cropType, row, col }
  }

  // Handle virtual field sowing action
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
    const amount = cropType === 'grain' ? res.constants.sowingGrain : res.constants.sowingVegetables
    this.log.add({
      template: `{player} sows {crop} in {label} - {amount} total${logSuffix}`,
      args: { player, crop: cropType, label: virtualField.label, amount, ...logCardArg },
    })
    return { cropType }
  }

  // Handle standard selection response
  const choice = result[0]

  if (choice === 'Done Sowing') {
    return false
  }

  // Handle nested selection (object with title and selection)
  if (typeof choice === 'object' && choice.title && choice.selection && choice.selection.length > 0) {
    const selectedField = choice.selection[0]
    const cropType = choice.title.startsWith('Grain') ? 'grain' : 'vegetables'
    const coordMatch = selectedField.match(/Field \((\d+),(\d+)\)/)

    if (coordMatch) {
      const row = parseInt(coordMatch[1])
      const col = parseInt(coordMatch[2])

      player.sowField(row, col, cropType)
      const amount = cropType === 'grain' ? res.constants.sowingGrain : res.constants.sowingVegetables
      this.log.add({
        template: `{player} sows {crop} at ({row},{col}) - {amount} total${logSuffix}`,
        args: { player, crop: cropType, row, col, amount, ...logCardArg },
      })
      return { cropType, row, col }
    }
    else {
      // Virtual field — match "Field (Label)"
      const labelMatch = selectedField.match(/Field \((.+)\)/)
      if (labelMatch) {
        const label = labelMatch[1]
        const vf = emptyVirtualFields.find(f => f.label === label)
        if (vf) {
          player.sowVirtualField(vf.id, cropType)
          const amount = cropType === 'grain' ? res.constants.sowingGrain : res.constants.sowingVegetables
          this.log.add({
            template: `{player} sows {crop} in {label} - {amount} total${logSuffix}`,
            args: { player, crop: cropType, label: vf.label, amount, ...logCardArg },
          })
          return { cropType }
        }
      }
    }
  }

  return false
}

AgricolaActionManager.prototype.sow = function(player) {
  const sowableFields = player.getSowableFields()
  if (sowableFields.length === 0) {
    this.log.add({
      template: '{player} has no fields to sow',
      args: { player },
    })
    return false
  }

  this.game.callPlayerCardHook(player, 'onSow', true)

  this.callOnAnyBeforeSowHooks(player)

  let sowedAny = false
  let sowedVegetables = false
  const sowedTypes = []
  const sownFieldKeys = new Set()  // Track fields sown in this action

  while (true) {
    const currentSowableFields = player.getSowableFields()
      .filter(f => !sownFieldKeys.has(`${f.row},${f.col}`))
    // Separate regular fields from virtual fields for UI handling
    const regularSowableFields = currentSowableFields.filter(f => !f.isVirtualField)
    const emptyVirtualFields = player.getEmptyVirtualFields()

    if (currentSowableFields.length === 0) {
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

    const result = this._sowOneField(player, {
      fields: currentSowableFields,
      regularFields: regularSowableFields,
      emptyVirtualFields,
      canSowGrain,
      canSowVeg,
      canDone: true,
    })

    if (!result) {
      break
    }

    if (result.row !== undefined) {
      sownFieldKeys.add(`${result.row},${result.col}`)
    }
    sowedAny = true
    sowedTypes.push(result.cropType)
    if (result.cropType === 'vegetables') {
      sowedVegetables = true
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

AgricolaActionManager.prototype.sowSingleField = function(player, card) {
  const sowableFields = player.getSowableFields()
  if (sowableFields.length === 0) {
    this.log.add({
      template: '{player} has no fields to sow',
      args: { player },
    })
    return false
  }

  const canSowGrain = player.grain >= 1
  const canSowVeg = player.vegetables >= 1
  const regularSowableFields = sowableFields.filter(f => !f.isVirtualField)
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

  const result = this._sowOneField(player, {
    fields: sowableFields,
    regularFields: regularSowableFields,
    emptyVirtualFields,
    canSowGrain,
    canSowVeg,
    title: `${card.name}: Choose field to sow`,
    card: card.name,
  })

  return !!result
}

AgricolaActionManager.prototype.bakeBread = function(player) {
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
    const maxBake = imp.bakingConversion.limit || player.grain
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

AgricolaActionManager.prototype.sowAndOrBake = function(player) {
  this.game.callPlayerCardHook(player, 'onBeforeSow')

  const canSow = player.canSowAnything()
  const hasBakeReplacement = this.game.getPlayerActiveCards(player).some(c => c.hasHook('onBakeBreadAction'))
  const canBake = (player.hasBakingAbility() && player.grain >= 1) || hasBakeReplacement

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
      const canBakeNow = (player.hasBakingAbility() && player.grain >= 1) || hasBakeReplacement
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
  const canBakeNow = (player.hasBakingAbility() && player.grain >= 1) || hasBakeReplacement
  if (canBakeNow) {
    this.bakeBread(player)
  }

  return true
}

AgricolaActionManager.prototype.plowAndOrSow = function(player) {
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
  const canSowNow = player.getSowableFields().length > 0 && (player.grain >= 1 || player.vegetables >= 1)
  if (canSowNow) {
    this.sow(player)
  }

  return true
}

