const util = require('../../lib/util.js')

module.exports = function(context) {
  if (!context.data.initialized) {
    const { game } = context
    game.rk.addKey(context.data, 'initialized', true)
    game.rk.addKey(context.data, 'firstPicks', {})
    const logId = game.mLog({
      template: 'Choose Starting Cards'
    })
    game.rk.addKey(context.data, 'parentLogId', logId)
  }

  if (context.response) {
    handleResponse(context)
  }
  else {
    generateOptions(context)
  }
}

function generateOptions(context) {
  const { game } = context

  const waiting = game
    .getPlayerAll()
    .filter(player => !context.data.firstPicks[player.name])
    .map(player => {
      return {
        actor: player.name,
        name: 'Choose Initial Card',
        options: game.getHand(player).cards,
      }
    })

  util.assert(waiting.length > 0)

  return context.waitMany(waiting)
}

function handleResponse(context) {
  const { game, options } = context
  const player = game.getPlayerByName(context.response.actor)
  game.rk.addKey(context.data.firstPicks, player.name, options[0])

  const allPlayersHaveChosen =
    Object.keys(context.data.firstPicks).length === game.getPlayerAll().length

  if (allPlayersHaveChosen) {
    _playFirstPicks(context)
    return context.done()
  }
  else {
    return generateOptions(context)
  }
}

function _playFirstPicks(context) {
  const { game } = context

  const picks = Object.entries(context.data.firstPicks)

  // Play the cards
  for (const [playerName, card] of picks) {
    const data = game.getCardData(card)

    // No side effects, so just move card.
    game.mMoveCard(
      game.getHand(playerName),
      game.getZoneColorByPlayer(playerName, data.color),
      card,
    )

    game.mLog({
      template: '{player} melds {card}',
      args: {
        player: playerName,
        card
      },
      parent: context.data.parentLogId,
    })
  }

  // Set first player
  picks.sort((l, r) => l[1].localeCompare(r[1]))
  game.mSetStartingPlayer(picks[0][0])
  game.mLog({
    template: "{card} was first in alphabetical order, so {player} will go first",
    args: {
      player: picks[0][0],
      card: picks[0][1],
    },
    parent: context.data.parentLogId,
  })
}
