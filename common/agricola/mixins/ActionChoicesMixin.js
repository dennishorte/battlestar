/**
 * ActionChoicesMixin - Generates valid action choices for the current player
 *
 * Usage: Object.assign(Agricola.prototype, ActionChoicesMixin)
 */

const res = require('../res/index.js')

const ActionChoicesMixin = {

  generateActionChoices(player) {
    const choices = []

    for (const actionId of this.state.activeActions) {
      const state = this.state.actionSpaces[actionId]

      // Skip occupied actions
      if (state.occupiedBy) {
        continue
      }

      const action = res.getActionById(actionId)
      if (!action) {
        continue
      }

      // Check prerequisites
      if (!this.checkActionPrerequisites(player, action)) {
        continue
      }

      // Build choice info
      const displayName = this.getActionDisplayName(action)
      const choice = {
        id: actionId,
        name: displayName,
        description: action.description,
        type: action.type,
      }

      // Add accumulated amount for accumulating actions
      if (action.type === 'accumulating' && state.accumulated > 0) {
        choice.accumulated = state.accumulated
        choice.displayName = `${displayName} (${state.accumulated})`
      }
      else {
        choice.displayName = displayName
      }

      // Add ability flags
      choice.canBuildRoom = action.allowsRoomBuilding && player.canAffordRoom() && player.getValidRoomBuildSpaces().length > 0
      choice.canBuildStable = action.allowsStableBuilding && player.canAffordStable() && player.getValidStableBuildSpaces().length > 0
      choice.canPlow = action.allowsPlowing && player.getValidPlowSpaces().length > 0
      choice.canSow = action.allowsSowing && player.getEmptyFields().length > 0 && (player.grain > 0 || player.vegetables > 0)
      choice.canBake = action.allowsBaking && player.hasBakingAbility() && player.grain > 0
      choice.canRenovate = action.allowsRenovation && player.canRenovate()
      choice.canFence = action.allowsFencing && player.wood > 0 && player.getFenceCount() < res.constants.maxFences
      choice.canGrowFamily = action.allowsFamilyGrowth && player.canGrowFamily(action.requiresRoom !== false)

      choices.push(choice)
    }

    return choices
  },

  checkActionPrerequisites(player, action) {
    // Family growth has specific prerequisites
    if (action.allowsFamilyGrowth) {
      const requiresRoom = action.requiresRoom !== false
      if (!player.canGrowFamily(requiresRoom)) {
        return false
      }
    }

    // House Redevelopment requires ability to renovate (mandatory renovation)
    // Note: Farm Redevelopment (renovation-fencing) allows renovation OR fencing, so it's not blocked
    if (action.allowsRenovation && action.allowsMajorImprovement) {
      if (!player.canRenovate()) {
        return false
      }
    }

    // All other actions can be taken
    return true
  },

  getActionDescription(actionId) {
    const action = res.getActionById(actionId)
    if (!action) {
      return ''
    }

    const parts = [action.description]

    if (action.type === 'accumulating') {
      const state = this.state.actionSpaces[actionId]
      if (state && state.accumulated > 0) {
        parts.push(`(${state.accumulated} available)`)
      }
    }

    return parts.join(' ')
  },

  // Get choices for building rooms
  getRoomBuildChoices(player) {
    const validSpaces = player.getValidRoomBuildSpaces()
    return validSpaces.map(space => ({
      row: space.row,
      col: space.col,
      displayName: `Position (${space.row}, ${space.col})`,
    }))
  },

  // Get choices for building stables
  getStableBuildChoices(player) {
    const validSpaces = player.getValidStableBuildSpaces()
    return validSpaces.map(space => ({
      row: space.row,
      col: space.col,
      displayName: `Position (${space.row}, ${space.col})`,
    }))
  },

  // Get choices for plowing fields
  getPlowFieldChoices(player) {
    const validSpaces = player.getValidPlowSpaces()
    return validSpaces.map(space => ({
      row: space.row,
      col: space.col,
      displayName: `Position (${space.row}, ${space.col})`,
    }))
  },

  // Get choices for sowing
  getSowChoices(player) {
    const choices = []
    const emptyFields = player.getEmptyFields()

    if (emptyFields.length > 0) {
      if (player.grain >= 1) {
        for (const field of emptyFields) {
          choices.push({
            row: field.row,
            col: field.col,
            crop: 'grain',
            displayName: `Sow grain at (${field.row}, ${field.col})`,
          })
        }
      }

      if (player.vegetables >= 1) {
        for (const field of emptyFields) {
          choices.push({
            row: field.row,
            col: field.col,
            crop: 'vegetables',
            displayName: `Sow vegetables at (${field.row}, ${field.col})`,
          })
        }
      }
    }

    return choices
  },

  // Get choices for major improvements
  getMajorImprovementChoices(player) {
    const available = this.getAvailableMajorImprovements()
    return available
      .filter(id => player.canBuyMajorImprovement(id))
      .map(id => {
        const imp = this.cards.byId(id)
        const costStr = Object.entries(imp.cost)
          .map(([r, a]) => `${a} ${r}`)
          .join(', ')

        return {
          id: id,
          name: imp.name,
          cost: imp.cost,
          victoryPoints: imp.victoryPoints,
          displayName: `${imp.name} (${costStr}) - ${imp.victoryPoints} VP`,
          description: imp.description,
        }
      })
  },

  // Get choices for animal cooking
  getCookingChoices(player) {
    if (!player.hasCookingAbility()) {
      return []
    }

    const choices = []
    const imp = player.getCookingImprovement()
    const animals = player.getAllAnimals()

    for (const [type, count] of Object.entries(animals)) {
      if (count > 0) {
        const food = imp.abilities.cookingRates[type]
        for (let i = 1; i <= count; i++) {
          choices.push({
            animalType: type,
            count: i,
            food: food * i,
            displayName: `Cook ${i} ${type} for ${food * i} food`,
          })
        }
      }
    }

    if (player.vegetables > 0) {
      const food = imp.abilities.cookingRates.vegetables
      for (let i = 1; i <= player.vegetables; i++) {
        choices.push({
          animalType: 'vegetables',
          count: i,
          food: food * i,
          displayName: `Cook ${i} vegetable(s) for ${food * i} food`,
        })
      }
    }

    return choices
  },

  // Get choices for baking
  getBakingChoices(player) {
    if (!player.hasBakingAbility()) {
      return []
    }
    if (player.grain < 1) {
      return []
    }

    const imp = player.getBakingImprovement()
    const maxBake = imp.abilities.bakingLimit || player.grain
    const rate = imp.abilities.bakingRate

    const choices = []
    for (let i = 1; i <= Math.min(maxBake, player.grain); i++) {
      choices.push({
        grain: i,
        food: i * rate,
        displayName: `Bake ${i} grain for ${i * rate} food`,
      })
    }

    return choices
  },
}

module.exports = { ActionChoicesMixin }
