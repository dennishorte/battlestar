const { AgricolaActionManager } = require('../AgricolaActionManager.js')
const res = require('../res/index.js')

AgricolaActionManager.prototype.buildFences = function(player) {
  let totalFencesBuilt = 0
  let continueBuilding = true

  // Set up per-action fence cost counters (e.g. Hedge Keeper's 3 free fences per action)
  this.game.callPlayerCardHook(player, 'onStartFenceAction')

  while (continueBuilding) {
    // Check if player can build any fences (accounting for free fences from cards)
    const hasFreeOverhaulFences = (player._overhaulFreeFences || 0) > 0
    const hasFieldFenceDiscount = !!player._fieldFencesActive
    const hasFarmRedevFreeFences = (player._farmRedevelopmentFreeFences || 0) > 0
    const hasCardFreeFences = player.getActiveCards().some(c => c.hasHook('getFreeFences') && c.callHook('getFreeFences', this.game) > 0)
    const hasGrainSubstitution = player.grain > 0 && player._getGrainSubstitutionLimit() > 0
    if (player.wood < 1 && player.getFreeFenceCount() === 0 && !hasFreeOverhaulFences && !hasFieldFenceDiscount && !hasFarmRedevFreeFences && !hasCardFreeFences && !hasGrainSubstitution) {
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
      || (player.grain > 0 && player._getGrainSubstitutionLimit() > 0)
    if (canAffordMore && remainingFences - result.fencesBuilt > 0) {
      const continueChoice = this.choose(player, [
        this.option({ id: 'continue', title: 'Build another pasture' }),
        this.option({ id: 'done', title: 'Done building fences' }),
      ], {
        title: 'Continue fencing?',
        min: 1,
        max: 1,
      })
      // An action-type response (e.g. 'done-building-pastures') is not "continue"
      const sel = Array.isArray(continueChoice) ? continueChoice[0] : null
      const selId = (sel && typeof sel === 'object') ? sel.id : sel
      continueBuilding = selId === 'continue'
    }
    else {
      continueBuilding = false
    }
  }

  // Clean up per-action fence cost counters
  this.game.callPlayerCardHook(player, 'onEndFenceAction')

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
  const response = this.choose(player, [
    this.option({ id: 'cancel', title: 'Cancel fencing' }),
  ], {
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

    // WoodPalisades: ask player which edge fences to build as palisades (per-fence choice)
    const palisadeFenceKeys = new Set()
    if (player.hasWoodPalisadesCard()) {
      const fences = player.calculateFencesForPasture(selectedSpaces)
      const { edgeFences } = player._splitEdgeAndInternalFences(fences)
      if (edgeFences.length > 0) {
        const fenceOptions = edgeFences.map((f, i) => this.option({
          id: `p-${i}`,
          title: `${f.edge.charAt(0).toUpperCase() + f.edge.slice(1)} fence at row ${f.row1}, col ${f.col1}`,
        }))
        const selections = this.choose(player, fenceOptions, {
          title: 'Select edge fences to build as wood palisades (2 wood each, +1 bonus point each)',
          min: 0,
          max: edgeFences.length,
        })
        const selectedIds = new Set(
          (Array.isArray(selections) ? selections : selections ? [selections] : [])
            .map(s => (s && typeof s === 'object') ? s.id : s)
            .filter(Boolean)
        )
        for (const [i, f] of edgeFences.entries()) {
          if (selectedIds.has(`p-${i}`)) {
            palisadeFenceKeys.add(`${f.row1}:${f.col1}:${f.edge}`)
          }
        }
      }
    }

    // Validate the selection
    const validation = player.validatePastureSelection(selectedSpaces, { palisadeFenceKeys })
    if (!validation.valid) {
      this.log.add({
        template: 'Invalid pasture selection: {error}',
        args: { error: validation.error },
      })
      return { built: false }
    }

    // Build the pasture
    const result = player.buildPasture(selectedSpaces, { palisadeFenceKeys })
    if (result.success) {
      // Handle pending fence cost choice (Millwright grain substitution)
      if (player._pendingFenceCost) {
        const pending = player._pendingFenceCost
        delete player._pendingFenceCost
        const affordable = pending.options.filter(opt => player.canAffordCost(opt.cost))
        if (affordable.length > 1) {
          const costChoices = affordable.map((opt, idx) => this.option({
            id: `cost-${idx}`,
            title: this._formatCostLabel(opt.cost),
          }))
          const costSelection = this.choose(player, costChoices, {
            title: 'Choose payment for fences',
            min: 1,
            max: 1,
          })
          const selectedIdx = Number(costSelection[0].id.slice('cost-'.length))
          player.payCost(affordable[selectedIdx].cost)
        }
        else {
          player.payCost(affordable[0].cost)
        }
      }

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

