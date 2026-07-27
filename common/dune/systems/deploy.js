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
 * Deploy troops from the player's garrison to the Conflict.
 * Count must already be chosen by the caller (choice UI stays at call sites).
 * Returns the number of troops actually deployed.
 */
function deployFromGarrison(game, player, count, opts = {}) {
  if (count <= 0) {
    return 0
  }

  const actual = Math.min(count, player.troopsInGarrison)
  if (actual <= 0) {
    return 0
  }

  player.decrementCounter('troopsInGarrison', actual, { silent: true })
  deployToConflict(game, player, actual)
  if (!opts.silent) {
    game.log.add({
      template: '{player} deploys {count} troop(s) to the Conflict',
      args: { player, count: actual },
    })
  }
  return actual
}

/**
 * Recruit troops from supply.
 * Default destination is garrison; pass { to: 'conflict' } to deploy directly
 * (e.g. Sardaukar Coordination, Treachery).
 * Returns the number of troops actually recruited.
 */
function recruitTroops(game, player, count, opts = {}) {
  if (count <= 0) {
    return 0
  }

  const to = opts.to || 'garrison'
  const actual = Math.min(count, player.troopsInSupply)
  if (actual <= 0) {
    return 0
  }

  player.decrementCounter('troopsInSupply', actual, { silent: true })
  if (to === 'conflict') {
    deployToConflict(game, player, actual)
    if (!opts.silent) {
      game.log.add({
        template: '{player} recruits {amount} troop(s) to Conflict',
        args: { player, amount: actual },
      })
    }
  }
  else {
    player.incrementCounter('troopsInGarrison', actual, { silent: true })
    if (!opts.silent) {
      game.log.add({
        template: '{player} recruits {amount} troop(s)',
        args: { player, amount: actual },
      })
    }
  }
  return actual
}

/**
 * Retreat troops from the Conflict to the player's garrison.
 * Distinct from losing troops (which returns them to supply).
 * Returns the number of troops actually retreated.
 *
 * Future: Chani Tactician should hook here and in loseTroops({ from: 'conflict' }).
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

/**
 * Lose troops, returning them to supply.
 * from: 'garrison' (default) or 'conflict'.
 * Distinct from retreat (which returns Conflict troops to garrison).
 * Returns the number of troops actually lost.
 *
 * Future: Chani Tactician should hook loseTroops({ from: 'conflict' })
 * alongside retreatTroops.
 */
function loseTroops(game, player, count, opts = {}) {
  if (count <= 0) {
    return 0
  }

  const from = opts.from || 'garrison'
  let actual = 0

  if (from === 'conflict') {
    const conflict = game.state.conflict
    const deployed = conflict.deployedTroops[player.name] || 0
    actual = Math.min(count, deployed)
    if (actual <= 0) {
      return 0
    }
    conflict.deployedTroops[player.name] = deployed - actual
  }
  else {
    actual = Math.min(count, player.troopsInGarrison)
    if (actual <= 0) {
      return 0
    }
    player.decrementCounter('troopsInGarrison', actual, { silent: true })
  }

  player.incrementCounter('troopsInSupply', actual, { silent: true })
  if (!opts.silent) {
    game.log.add({
      template: '{player} loses {count} troop(s)',
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
  deployFromGarrison,
  recruitTroops,
  retreatTroops,
  loseTroops,
  checkDistractionTrigger,
}
