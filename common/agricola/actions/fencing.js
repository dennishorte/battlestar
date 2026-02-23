const { AgricolaActionManager } = require('../AgricolaActionManager.js')
const res = require('../res/index.js')

AgricolaActionManager.prototype.buildFences = function(player) {
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

AgricolaActionManager.prototype.selectPastureSpaces = function(player) {
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
    help: 'You can also click on the farmyard to select.',
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

AgricolaActionManager.prototype.getAdjacentUnselectedSpaces = function(selectedSpaces, allFenceableSpaces) {
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

