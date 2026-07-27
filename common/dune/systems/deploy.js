'use strict'

const spies = require('./spies.js')

function deployToConflict(game, player, count) {
  if (count <= 0) {
    return
  }

  const conflict = game.state.conflict
  conflict.deployedTroops[player.name] = (conflict.deployedTroops[player.name] || 0) + count

  if (game.state.turnTracking) {
    game.state.turnTracking.unitsDeployedThisTurn =
      (game.state.turnTracking.unitsDeployedThisTurn || 0) + count
    checkDistractionTrigger(game, player)
  }
}

/**
 * Retreat troops from the Conflict to the player's garrison.
 * Distinct from losing troops (which returns them to supply).
 * Returns the number of troops actually retreated.
 */
function retreatTroops(game, player, count, opts = {}) {
  if (count <= 0) {
    return 0
  }

  const conflict = game.state.conflict
  const deployed = conflict.deployedTroops[player.name] || 0
  const actual = Math.min(count, deployed)
  if (actual <= 0) {
    return 0
  }

  conflict.deployedTroops[player.name] = deployed - actual
  player.incrementCounter('troopsInGarrison', actual, { silent: true })
  if (!opts.silent) {
    game.log.add({
      template: '{player} retreats {count} troop(s)',
      args: { player, count: actual },
    })
  }
  return actual
}

function checkDistractionTrigger(game, player) {
  const tt = game.state.turnTracking
  if (!tt?.distractionArmed || tt.distractionFired) {
    return
  }
  if ((tt.unitsDeployedThisTurn || 0) < 3) {
    return
  }
  if (player.spiesInSupply <= 0) {
    tt.distractionFired = true
    return
  }

  tt.distractionFired = true
  game.log.add({
    template: '{player} triggers Distraction: +1 Spy (may co-locate)',
    args: { player },
  })
  spies.placeSpy(game, player, { allowOccupied: true })
}

module.exports = {
  deployToConflict,
  retreatTroops,
  checkDistractionTrigger,
}
