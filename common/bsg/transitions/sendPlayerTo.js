const { transitionFactory2 } = require('./factory.js')
const bsgutil = require('../util.js')
const util = require('../../lib/util.js')

module.exports = transitionFactory2({
  steps: [
    {
      name: 'choosePlayer',
      func: _choosePlayer,
      resp: _movePlayer,
    },
  ],
})

function _choosePlayer(context) {
  const game = context.state
  const players = game
    .getPlayerAll()
    .filter(p => p.name !== context.data.playerName)
    .map(p => p.name)
    .sort()
  const reason = context.data.reason || `Send Player to ${context.data.location}`

  return context.wait({
    actor: context.data.playerName,
    actions: [{
      name: reason,
      description: `The selected player will be moved to ${context.data.location}`,
      options: players
    }]
  })
}

function _movePlayer(context) {
  const game = context.state
  const player = bsgutil.optionName(context.response.option[0])

  game.mLog({
    template: '{player1} moves {player2} to {location}',
    args: {
      player1: context.data.playerName,
      player2: player.name,
      location: context.data.location
    }
  })

  game.mMovePlayer(player, 'locations.brig')
}
