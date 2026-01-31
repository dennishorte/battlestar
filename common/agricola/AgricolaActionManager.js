const { BaseActionManager } = require('../lib/game/index.js')
const res = require('./res/index.js')


class AgricolaActionManager extends BaseActionManager {
  constructor(game) {
    super(game)
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
      if (resource === 'sheep' || resource === 'boar' || resource === 'cattle') {
        // Animals need placement
        const count = actionState.accumulated
        if (player.canPlaceAnimals(resource, count)) {
          player.addAnimals(resource, count)
          this.log.add({
            template: '{player} takes {amount} {resource}',
            args: { player, amount: count, resource },
          })
        }
        else {
          // Must convert to food or release
          this.handleAnimalOverflow(player, resource, count)
        }
      }
      else {
        player.addResource(resource, actionState.accumulated)
        this.log.add({
          template: '{player} takes {amount} {resource}',
          args: { player, amount: actionState.accumulated, resource },
        })
      }
    }

    actionState.accumulated = 0
    return true
  }

  handleAnimalOverflow(player, animalType, count) {
    let remaining = count

    // Try to place as many as possible
    while (remaining > 0 && player.canPlaceAnimals(animalType, 1)) {
      player.addAnimals(animalType, 1)
      remaining--
    }

    if (remaining > 0) {
      this.log.add({
        template: '{player} cannot house all {animal}',
        args: { player, animal: animalType },
      })

      // Ask player what to do with excess
      if (player.hasCookingAbility()) {
        const choices = ['Cook', 'Release']
        const selection = this.choose(player, choices, {
          title: `What to do with ${remaining} ${animalType}?`,
        })

        if (selection[0] === 'Cook') {
          const food = player.cookAnimal(animalType, remaining)
          this.log.add({
            template: '{player} cooks {animal} for {food} food',
            args: { player, animal: animalType, food },
          })
        }
        else {
          this.log.add({
            template: '{player} releases {count} {animal}',
            args: { player, count: remaining, animal: animalType },
          })
        }
      }
      else {
        this.log.add({
          template: '{player} releases {count} {animal}',
          args: { player, count: remaining, animal: animalType },
        })
      }
    }
  }

  giveResources(player, resources) {
    for (const [resource, amount] of Object.entries(resources)) {
      player.addResource(resource, amount)
      this.log.add({
        template: '{player} receives {amount} {resource}',
        args: { player, amount, resource },
      })
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

    // Let player choose what to build
    const choices = []
    if (canBuildRoom) {
      choices.push('Build Room')
    }
    if (canBuildStable) {
      choices.push('Build Stable')
    }
    if (canBuildRoom && canBuildStable) {
      choices.push('Build Room and Stable')
    }
    choices.push('Do Nothing')

    const selection = this.choose(player, choices, {
      title: 'Choose what to build',
      min: 1,
      max: 1,
    })

    const choice = selection[0]

    if (choice === 'Do Nothing') {
      this.log.addDoNothing(player, 'build')
      return true
    }

    if (choice === 'Build Room' || choice === 'Build Room and Stable') {
      this.buildRoom(player)
    }

    if (choice === 'Build Stable' || choice === 'Build Room and Stable') {
      this.buildStable(player)
    }

    return true
  }

  buildRoom(player) {
    const validSpaces = player.getValidRoomBuildSpaces()
    if (validSpaces.length === 0) {
      this.log.add({
        template: '{player} has no valid space for a room',
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

    const cost = player.getRoomCost()
    const roomType = player.roomType
    player.payCost(cost)
    player.buildRoom(row, col)

    this.log.add({
      template: '{player} builds a {type} room at ({row},{col})',
      args: { player, type: roomType, row, col },
    })

    // Call onBuildRoom hooks (Roughcaster, Wall Builder)
    this.callOnBuildRoomHooks(player, roomType)

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

    const spaceChoices = validSpaces.map(s => `${s.row},${s.col}`)
    const selection = this.choose(player, spaceChoices, {
      title: 'Choose where to build the stable',
      min: 1,
      max: 1,
    })

    const [row, col] = selection[0].split(',').map(Number)
    player.payCost(res.buildingCosts.stable)
    player.buildStable(row, col)

    this.log.add({
      template: '{player} builds a stable at ({row},{col})',
      args: { player, row, col },
    })

    return true
  }

  renovate(player) {
    if (!player.canRenovate()) {
      this.log.add({
        template: '{player} cannot afford to renovate',
        args: { player },
      })
      return false
    }

    const oldType = player.roomType
    player.renovate()
    const newType = player.roomType

    this.log.add({
      template: '{player} renovates from {old} to {new}',
      args: { player, old: oldType, new: newType },
    })

    // Call onRenovate hooks (Roughcaster)
    this.callOnRenovateHooks(player, oldType, newType)

    return true
  }

  // ---------------------------------------------------------------------------
  // Farming actions
  // ---------------------------------------------------------------------------

  plowField(player) {
    const validSpaces = player.getValidPlowSpaces()
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

    player.plowField(row, col)

    this.log.add({
      template: '{player} plows a field at ({row},{col})',
      args: { player, row, col },
    })

    return true
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

    let sowedAny = false

    while (true) {
      const currentEmptyFields = player.getEmptyFields()
      if (currentEmptyFields.length === 0) {
        break
      }

      const canSowGrain = player.grain >= 1
      const canSowVeg = player.vegetables >= 1

      if (!canSowGrain && !canSowVeg) {
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
        allowsAction: 'sow-field',
        validSpaces: currentEmptyFields,
        canSowGrain,
        canSowVeg,
      }

      const result = this.game.requestInputSingle(selector)

      // Handle action-based response (from clicking the farm board)
      if (result.action === 'sow-field') {
        const { row, col, cropType } = result

        // Validate the space is a valid empty field
        const isValidField = currentEmptyFields.some(f => f.row === row && f.col === col)
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

        const amount = cropType === 'grain' ? res.constants.sowingGrain : res.constants.sowingVegetables
        this.log.add({
          template: '{player} sows {crop} at ({row},{col}) - {amount} total',
          args: { player, crop: cropType, row, col, amount },
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

          const amount = cropType === 'grain' ? res.constants.sowingGrain : res.constants.sowingVegetables
          this.log.add({
            template: '{player} sows {crop} at ({row},{col}) - {amount} total',
            args: { player, crop: cropType, row, col, amount },
          })
        }
      }
    }

    if (!sowedAny) {
      this.log.addDoNothing(player, 'sow')
    }

    return true
  }

  bakeBread(player) {
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
    const maxBake = imp.abilities.bakingLimit || player.grain

    // Ask how much to bake
    const choices = []
    for (let i = 1; i <= Math.min(maxBake, player.grain); i++) {
      choices.push(`Bake ${i} grain`)
    }
    choices.push('Do not bake')

    const selection = this.choose(player, choices, {
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
    this.callOnBakeHooks(player)

    return true
  }

  sowAndOrBake(player) {
    const canSow = player.getEmptyFields().length > 0 && (player.grain >= 1 || player.vegetables >= 1)
    const canBake = player.hasBakingAbility() && player.grain >= 1

    if (!canSow && !canBake) {
      this.log.addDoNothing(player, 'sow or bake')
      return true
    }

    // Sow first (player can select "Done Sowing" to skip)
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
    const canSow = player.getEmptyFields().length > 0 && (player.grain >= 1 || player.vegetables >= 1)

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
        this.plowField(player)
      }
    }

    // Then sow (player can select "Done Sowing" to skip)
    // Re-check canSow since plowing might have created a new field
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
      // Check if player can build any fences
      if (player.wood < 1) {
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
      if (player.wood >= 1 && remainingFences - result.fencesBuilt > 0) {
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
        this.callOnBuildPastureHooks(player, { spaces: selectedSpaces })

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

    player.growFamily()

    this.log.add({
      template: '{player} grows their family (now {count} members)',
      args: { player, count: player.familyMembers },
    })

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

    const choices = affordableIds.map(id => {
      const imp = this.game.cards.byId(id)
      return imp.name + ` (${id})`
    })
    choices.push('Do not buy')

    const selection = this.choose(player, choices, {
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
      player.buyMajorImprovement(improvementId)

      this.log.add({
        template: '{player} buys {improvement}',
        args: { player, improvement: imp.name },
      })

      // Handle Well special effect
      if (improvementId === 'well') {
        this.activateWell(player)
      }

      // Call onBuildImprovement hooks (Junk Room gives food)
      this.callOnBuildImprovementHooks(player)

      return improvementId
    }

    return false
  }

  activateWell(player) {
    // Place 1 food on each of the next 5 round spaces
    const currentRound = this.game.state.round
    for (let i = 1; i <= 5; i++) {
      const round = currentRound + i
      if (round <= 14) {
        if (!this.game.state.wellFood) {
          this.game.state.wellFood = {}
        }
        if (!this.game.state.wellFood[player.name]) {
          this.game.state.wellFood[player.name] = {}
        }
        this.game.state.wellFood[player.name][round] =
          (this.game.state.wellFood[player.name][round] || 0) + 1
      }
    }

    this.log.add({
      template: '{player} places food on the next 5 round spaces',
      args: { player },
    })
  }

  // ---------------------------------------------------------------------------
  // Occupation action
  // ---------------------------------------------------------------------------

  playOccupation(player) {
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
    const cost = player.occupationsPlayed === 0 ? 0 : 1

    if (cost > 0 && player.food < cost) {
      this.log.add({
        template: '{player} cannot afford to play an occupation (needs {cost} food)',
        args: { player, cost },
      })
      return false
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
      title: cost > 0 ? `Play an Occupation (costs ${cost} food)` : 'Play an Occupation (free)',
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

    // Pay the food cost
    if (cost > 0) {
      player.food -= cost
    }

    // Play the card (moves from hand to playedOccupations)
    const card = this.game.cards.byId(cardId)
    player.playCard(cardId)

    this.log.add({
      template: '{player} plays {occupation}',
      args: { player, occupation: card.name },
    })

    // Execute onPlay effect if present
    if (card.hasHook('onPlay')) {
      card.callHook('onPlay', this.game, player)
    }

    return true
  }

  // ---------------------------------------------------------------------------
  // Minor Improvement action
  // ---------------------------------------------------------------------------

  buyMinorImprovement(player) {
    // Get minor improvements from player's hand
    const minorInHand = player.hand.filter(cardId => {
      const card = this.game.cards.byId(cardId)
      return card && card.type === 'minor'
    })

    if (minorInHand.length === 0) {
      this.log.add({
        template: '{player} has no minor improvements in hand',
        args: { player },
      })
      return false
    }

    // Filter to playable minor improvements (can afford and meet prerequisites)
    const playableMinor = minorInHand.filter(cardId => {
      return player.canPlayCard(cardId)
    })

    if (playableMinor.length === 0) {
      this.log.add({
        template: '{player} cannot afford any minor improvements',
        args: { player },
      })
      return false
    }

    // Build choices with card names and costs
    const choices = playableMinor.map(cardId => {
      const card = this.game.cards.byId(cardId)
      return card ? card.name : cardId
    })

    // Add option to not play
    choices.push('Do not play a minor improvement')

    const selection = this.choose(player, choices, {
      title: 'Play a Minor Improvement',
      min: 1,
      max: 1,
    })

    const selectedName = selection[0]

    if (selectedName === 'Do not play a minor improvement') {
      this.log.addDoNothing(player, 'play a minor improvement')
      return false
    }

    // Find the card id by name
    const cardId = playableMinor.find(id => {
      const card = this.game.cards.byId(id)
      return card && card.name === selectedName
    })

    if (!cardId) {
      return false
    }

    // Play the card (handles cost payment and moves from hand)
    const card = this.game.cards.byId(cardId)
    player.playCard(cardId)

    this.log.add({
      template: '{player} plays {improvement}',
      args: { player, improvement: card.name },
    })

    // Execute onPlay effect if present
    if (card.hasHook('onPlay')) {
      card.callHook('onPlay', this.game, player)
    }

    // Call onBuildImprovement hooks (Junk Room gives food)
    this.callOnBuildImprovementHooks(player)

    // Pass to left player if applicable
    this.maybePassLeft(player, cardId)

    return true
  }

  // ---------------------------------------------------------------------------
  // Major or Minor Improvement action
  // ---------------------------------------------------------------------------

  buyImprovement(player, allowMajor, allowMinor) {
    // Build nested choices for improvements
    const nestedChoices = []

    // Get affordable major improvements
    let affordableMajorIds = []
    if (allowMajor) {
      const availableImprovements = this.game.getAvailableMajorImprovements()
      affordableMajorIds = availableImprovements.filter(id => player.canBuyMajorImprovement(id))
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
    let playableMinorIds = []
    if (allowMinor) {
      const minorInHand = player.hand.filter(cardId => {
        const card = this.game.cards.byId(cardId)
        return card && card.type === 'minor'
      })
      playableMinorIds = minorInHand.filter(cardId => player.canPlayCard(cardId))
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

    if (nestedChoices.length === 0) {
      this.log.add({
        template: '{player} has no affordable improvements',
        args: { player },
      })
      return false
    }

    // Add option to not play
    nestedChoices.push('Do not play an improvement')

    const selection = this.choose(player, nestedChoices, {
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
          player.buyMajorImprovement(improvementId)

          this.log.add({
            template: '{player} buys {improvement}',
            args: { player, improvement: imp.name },
          })

          // Handle Well special effect
          if (improvementId === 'well') {
            this.activateWell(player)
          }

          // Call onBuildImprovement hooks (Junk Room gives food)
          this.callOnBuildImprovementHooks(player)

          return improvementId
        }
      }

      if (choice.title === 'Minor Improvement') {
        // Find the card id by name
        const cardId = playableMinorIds.find(id => {
          const card = this.game.cards.byId(id)
          return card && card.name === selectedName
        })

        if (cardId) {
          const card = this.game.cards.byId(cardId)
          player.playCard(cardId)

          this.log.add({
            template: '{player} plays {improvement}',
            args: { player, improvement: card.name },
          })

          // Execute onPlay effect if present
          if (card.hasHook('onPlay')) {
            card.callHook('onPlay', this.game, player)
          }

          // Call onBuildImprovement hooks (Junk Room gives food)
          this.callOnBuildImprovementHooks(player)

          // Pass to left player if applicable
          this.maybePassLeft(player, cardId)

          return true
        }
      }
    }

    return false
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
  // Renovation + Improvement action
  // ---------------------------------------------------------------------------

  renovationAndImprovement(player, availableImprovements, allowMinor = false) {
    const choices = []

    // Check for affordable major improvements
    const hasAffordableMajor = availableImprovements.some(id =>
      player.canBuyMajorImprovement(id)
    )

    // Check for playable minor improvements
    let hasAffordableMinor = false
    if (allowMinor) {
      hasAffordableMinor = player.hand.some(cardId => {
        const card = this.game.cards.byId(cardId)
        return card && card.type === 'minor' && player.canPlayCard(cardId)
      })
    }

    const hasAffordableImprovement = hasAffordableMajor || hasAffordableMinor

    if (player.canRenovate()) {
      choices.push('Renovate')
      if (hasAffordableImprovement) {
        choices.push('Renovate then Improvement')
      }
    }

    if (hasAffordableImprovement) {
      choices.push('Improvement Only')
    }

    if (choices.length === 0) {
      this.log.add({
        template: '{player} cannot renovate or afford improvements',
        args: { player },
      })
      return false
    }

    choices.push('Do Nothing')

    const selection = this.choose(player, choices, {
      title: 'Choose action',
      min: 1,
      max: 1,
    })

    const choice = selection[0]

    if (choice === 'Do Nothing') {
      this.log.addDoNothing(player, 'renovate or improve')
      return true
    }

    if (choice === 'Renovate' || choice === 'Renovate then Improvement') {
      this.renovate(player)
    }

    if (choice === 'Improvement Only' || choice === 'Renovate then Improvement') {
      this.buyImprovement(player, true, allowMinor)
    }

    return true
  }

  // ---------------------------------------------------------------------------
  // Renovation + Fencing action
  // ---------------------------------------------------------------------------

  renovationAndOrFencing(player) {
    const choices = []

    if (player.canRenovate()) {
      choices.push('Renovate')
    }
    if (player.wood >= 1) {
      choices.push('Build Fences')
    }
    if (player.canRenovate() && player.wood >= 1) {
      choices.push('Renovate then Fences')
    }

    if (choices.length === 0) {
      this.log.add({
        template: '{player} cannot renovate or build fences',
        args: { player },
      })
      return false
    }

    choices.push('Do Nothing')

    const selection = this.choose(player, choices, {
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
      this.buildFences(player)
    }

    return true
  }

  // ---------------------------------------------------------------------------
  // Execute action space
  // ---------------------------------------------------------------------------

  executeAction(player, actionId) {
    const action = res.getActionById(actionId)
    if (!action) {
      this.log.add({
        template: 'Unknown action: {actionId}',
        args: { actionId },
      })
      return false
    }

    this.log.add({
      template: '{player} takes action: {action}',
      args: { player, action: this.game.getActionDisplayName(action) },
    })

    // Handle accumulating actions
    if (action.type === 'accumulating') {
      const result = this.takeAccumulatedResource(player, actionId)
      if (result) {
        // Call hooks even for accumulating actions
        this.callOnActionHooks(player, actionId)
        this.callOnAnyActionHooks(player, actionId)
      }
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
      this.plowField(player)
    }

    if (action.allowsRoomBuilding || action.allowsStableBuilding) {
      this.buildRoomAndOrStable(player)
    }

    if (action.allowsFencing) {
      this.buildFences(player)
    }

    if (action.allowsSowing && action.allowsBaking) {
      this.sowAndOrBake(player)
    }
    else if (action.allowsSowing && action.allowsPlowing) {
      this.plowAndOrSow(player)
    }
    else if (action.allowsSowing) {
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
      this.buyImprovement(player, action.allowsMajorImprovement, action.allowsMinorImprovement)
    }

    // Minor improvement after family growth
    if (action.allowsMinorImprovement && action.allowsFamilyGrowth) {
      this.buyMinorImprovement(player)
    }

    if (action.allowsOccupation) {
      this.playOccupation(player)
    }

    // Call onAction hooks for this player's cards
    this.callOnActionHooks(player, actionId)

    // Call onAnyAction hooks for ALL players' cards
    this.callOnAnyActionHooks(player, actionId)

    return true
  }

  // ---------------------------------------------------------------------------
  // Card Hook Helpers
  // ---------------------------------------------------------------------------

  /**
   * Call onAction hook on player's active cards
   */
  callOnActionHooks(player, actionId) {
    const results = this.game.callPlayerCardHook(player, 'onAction', actionId)
    for (const { card, result } of results) {
      // Handle special return values from onAction
      if (result.additionalBake) {
        // Threshing Board: extra bake action
        this.log.add({
          template: '{player} gets an additional Bake Bread action from {card}',
          args: { player, card: card.name },
        })
        this.bake(player)
      }
      if (result.mayExchangeWoodForFood) {
        // Basket, Mushroom Collector: offer to exchange wood for food
        this.offerWoodForFoodExchange(player, card, result.mayExchangeWoodForFood)
      }
      if (result.mayBuyAnimal) {
        // Animal Dealer: offer to buy additional animal
        this.offerBuyAnimal(player, card, result.mayBuyAnimal)
      }
      if (result.mayPayWoodForBonus) {
        // Harpooner: offer to pay wood for food bonus
        this.offerHarpoonerBonus(player, card)
      }
      if (result.chooseResource) {
        // Seasonal Worker: choose grain or vegetable
        this.offerResourceChoice(player, card, result.chooseResource)
      }
    }
  }

  /**
   * Call onAnyAction hook on ALL players' cards
   */
  callOnAnyActionHooks(actingPlayer, actionId) {
    for (const player of this.game.players.all()) {
      const cards = this.game.getPlayerActiveCards(player)
      for (const card of cards) {
        if (card.hasHook('onAnyAction')) {
          card.callHook('onAnyAction', this.game, actingPlayer, actionId, player)
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
      player.spendResource('wood', exchange.wood)
      player.addResource('food', exchange.food)
      this.log.add({
        template: '{player} exchanges {wood} wood for {food} food using {card}',
        args: { player, wood: exchange.wood, food: exchange.food, card: card.name },
      })
      // Put wood back on accumulation space (per card text)
      const actionSpace = this.game.state.actionSpaces['take-wood']
      if (actionSpace) {
        actionSpace.accumulated += exchange.wood
      }
    }
  }

  /**
   * Offer to buy additional animal (Animal Dealer)
   */
  offerBuyAnimal(player, card, animalType) {
    if (player.food < 1) {
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
      player.spendResource('food', 1)
      player.addAnimals(animalType, 1)
      this.log.add({
        template: '{player} buys 1 {animal} for 1 food using {card}',
        args: { player, animal: animalType, card: card.name },
      })
    }
  }

  /**
   * Offer Harpooner bonus (pay 1 wood for food per person + 1 reed)
   */
  offerHarpoonerBonus(player, card) {
    if (player.wood < 1) {
      return
    }

    const foodBonus = player.familyMembers
    const choices = [
      `Pay 1 wood for ${foodBonus} food and 1 reed`,
      'Skip',
    ]
    const selection = this.choose(player, choices, {
      title: `${card.name}: Pay wood for bonus?`,
      min: 1,
      max: 1,
    })

    if (selection[0] !== 'Skip') {
      player.spendResource('wood', 1)
      player.addResource('food', foodBonus)
      player.addResource('reed', 1)
      this.log.add({
        template: '{player} pays 1 wood for {food} food and 1 reed using {card}',
        args: { player, food: foodBonus, card: card.name },
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
        args: { player, resource: chosen, card: card.name },
      })
    }
  }

  /**
   * Call onBake hook when player bakes bread
   */
  callOnBakeHooks(player) {
    this.game.callPlayerCardHook(player, 'onBake')
  }

  /**
   * Call onBuildRoom hook when player builds a room
   */
  callOnBuildRoomHooks(player, roomType) {
    this.game.callPlayerCardHook(player, 'onBuildRoom', roomType)
  }

  /**
   * Call onBuildPasture hook when player builds a pasture
   */
  callOnBuildPastureHooks(player, pasture) {
    this.game.callPlayerCardHook(player, 'onBuildPasture', pasture)
  }

  /**
   * Call onRenovate hook when player renovates
   */
  callOnRenovateHooks(player, fromType, toType) {
    this.game.callPlayerCardHook(player, 'onRenovate', fromType, toType)
  }

  /**
   * Call onBuildImprovement hook when player builds an improvement
   */
  callOnBuildImprovementHooks(player) {
    this.game.callPlayerCardHook(player, 'onBuildImprovement')
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
      template: '{improvement} is passed to {nextPlayer}',
      args: { improvement: card.name, nextPlayer: leftPlayer },
    })
  }
}

module.exports = { AgricolaActionManager }
