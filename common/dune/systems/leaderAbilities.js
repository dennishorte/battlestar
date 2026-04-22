/**
 * Leader ability dispatcher.
 *
 * Every leader object in res/leaders/ may expose hook methods (onRevealTurn,
 * modifySpaceCost, resolveSignetRing, etc.). The functions below locate the
 * acting player's leader and delegate to the matching hook if one exists.
 *
 * Keeping the dispatcher shallow means adding or adjusting behavior is a
 * matter of editing a single leader file.
 */
const leaders = require('./leaders.js')

function callHook(game, player, hookName, ...args) {
  const leader = leaders.getLeader(game, player)
  if (!leader || typeof leader[hookName] !== 'function') {
    return undefined
  }
  return leader[hookName](game, player, ...args)
}

function onAgentTurnStart(game, player) {
  callHook(game, player, 'onAgentTurnStart')
}

function onRevealTurn(game, player) {
  callHook(game, player, 'onRevealTurn')
}

function onPaySolariForSpace(game, player) {
  callHook(game, player, 'onPaySolariForSpace')
}

function onGainHighCouncil(game, player) {
  callHook(game, player, 'onGainHighCouncil')
}

function onGainInfluence(game, player, faction, newLevel) {
  callHook(game, player, 'onGainInfluence', faction, newLevel)
}

function onGainSolari(game, player, amount) {
  callHook(game, player, 'onGainSolari', amount)
}

function modifySpaceCost(game, player, space, baseCost) {
  if (!baseCost) {
    return baseCost
  }
  const leader = leaders.getLeader(game, player)
  if (!leader || typeof leader.modifySpaceCost !== 'function') {
    return baseCost
  }
  return leader.modifySpaceCost(game, player, space, baseCost)
}

function ignoresOccupancy(game, player, space) {
  const leader = leaders.getLeader(game, player)
  if (!leader || typeof leader.ignoresOccupancy !== 'function') {
    return false
  }
  return Boolean(leader.ignoresOccupancy(game, player, space))
}

function modifyHarvestAmount(game, player, total) {
  const leader = leaders.getLeader(game, player)
  if (!leader || typeof leader.modifyHarvestAmount !== 'function') {
    return total
  }
  return leader.modifyHarvestAmount(game, player, total)
}

function modifyStartingDeck(game, player, starterCardNames) {
  const leader = leaders.getLeader(game, player)
  if (!leader || typeof leader.modifyStartingDeck !== 'function') {
    return starterCardNames
  }
  return leader.modifyStartingDeck(game, player, starterCardNames)
}

/**
 * Iterate every non-acting player whose leader has an onOpponentVisitsMakerSpace
 * hook (currently: Staban Tuek).
 */
function onOpponentVisitsMakerSpace(game, opponent, space) {
  for (const player of game.players.all()) {
    if (player.name === opponent.name) {
      continue
    }
    const leader = leaders.getLeader(game, player)
    if (!leader || typeof leader.onOpponentVisitsMakerSpace !== 'function') {
      continue
    }
    leader.onOpponentVisitsMakerSpace(game, opponent, space, player)
  }
}

function onAgentPlaced(game, player, space, resolveBoardSpaceEffectsFn) {
  callHook(game, player, 'onAgentPlaced', space, resolveBoardSpaceEffectsFn)
}

module.exports = {
  onAgentTurnStart,
  onRevealTurn,
  onPaySolariForSpace,
  onGainHighCouncil,
  onGainInfluence,
  onGainSolari,
  modifySpaceCost,
  ignoresOccupancy,
  modifyHarvestAmount,
  modifyStartingDeck,
  onOpponentVisitsMakerSpace,
  onAgentPlaced,
}
