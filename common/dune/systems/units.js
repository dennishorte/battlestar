// A unit in the conflict is a troop, a sandworm, or a dreadnought.
// A dreadnought still in the garrison is not in the conflict.

function counts(game, player) {
  const name = player.name
  return {
    troops: game.state.conflict?.deployedTroops?.[name] || 0,
    sandworms: game.state.conflict?.deployedSandworms?.[name] || 0,
    dreadnoughts: player.dreadnoughtsInConflict || 0,
  }
}

function hasUnitInConflict(game, player) {
  const c = counts(game, player)
  return (c.troops + c.sandworms + c.dreadnoughts) > 0
}

function dreadnoughtsAreFour(game, player) {
  return game.state.leaders?.[player.name]?.name === 'Prince Rhombur Vernius'
}

function dreadnoughtStrength(game, player) {
  const ships = player.dreadnoughtsInConflict || 0
  if (ships <= 0) {
    return 0
  }
  return ships * (dreadnoughtsAreFour(game, player) ? 4 : 3)
}

module.exports = {
  counts,
  hasUnitInConflict,
  dreadnoughtStrength,
}
