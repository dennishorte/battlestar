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
  checkDistractionTrigger,
}
