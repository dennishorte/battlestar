const util = require('../../lib/util.js')

module.exports = function(context) {
  initializeOnce(context)
  nextStep(context)
}

function nextStep(context) {
  const { game, actor } = context
  const {
    sharing,
    demanding,
    effect,
    returned,
  } = context.data

  const card = game.getCardData(effect.card)
  const players = getPlayersOrdered(context)
  const impl = getEffectImpl(context)

  // Clear this each time so that it doesn't get transmitted incorrectly forward.
  if (returned) {
    game.rk.removeKey(context.data, 'returned')
  }

  // Advance to the next unfinished step in this dogma/echo effect.
  game.rk.increment(context.data, 'stepIndex')

  // If all steps are completed, advance to the next player who should do this effect.
  if (context.data.stepIndex >= impl.steps.length) {
    game.rk.put(context.data, 'stepIndex', 0)
    game.rk.increment(context.data, 'playerIndex')
  }

  // If all players are finished, this dogma/echo effect is completed.
  if (context.data.playerIndex >= players.length) {
    return context.done()
  }

  const player = players[context.data.playerIndex]

  // Demand effects special cases.
  if (impl.demand) {
    // Don't make demands of self or teammates
    if (game.checkPlayersAreTeammates(effect.leader, player)) {
      return skipCurrentPlayer(context)
    }

    // Can't make demands of this player.
    if (!demanding.includes(player.name)) {
      return skipCurrentPlayer(context)
    }
  }

  // Non-demand effects special cases (sharing).
  else {
    if (effect.leader === player.name) {
      // No special case. This player is just doing their own effect.
    }

    // This player doesn't get to share.
    else if (!sharing.includes(player.name)) {
      return skipCurrentPlayer(context)
    }
  }

  const payload = {
    effect,
    playerName: player.name,
    stepIndex: context.data.stepIndex,
  }
  if (returned !== undefined) {
    payload.returned = returned
  }

  return context.push('action-dogma-one-step', payload)
}

function initializeOnce(context) {
  if (context.data.initialized) {
    return
  }

  const { game } = context
  const { effect } = context.data

  game.rk.addKey(context.data, 'playerIndex', -1)
  game.rk.addKey(context.data, 'stepIndex', 99)
  game.rk.addKey(context.data, 'initialized', true)

  const card = game.getCardData(effect.card)
  const impl = getEffectImpl(context)

  game.mLog({
    template: '{card} {kind}: {text}',
    args: {
      card,
      kind: effect.kind,
      text: impl.dogma,
    }
  })
}

function getEffectImpl(context) {
  const { game } = context
  const { effect } = context.data
  const card = game.getCardData(effect.card)
  return card.getImpl(effect.kind)[effect.implIndex]
}

function getPlayersOrdered(context) {
  const { game } = context
  const { effect } = context.data
  const firstPlayer = game.getPlayerFollowing(effect.leader)
  return game.getPlayerAllFrom(firstPlayer)
}

function skipCurrentPlayer(context) {
  const { game } = context
  game.rk.put(context.data, 'stepIndex', 99)
  return nextStep(context)
}
