const { transitionFactory2 } = require('./factory.js')
const bsgutil = require('../util.js')
const util = require('../../lib/util.js')

module.exports = transitionFactory2({
  steps: [
    {
      name: 'selectVicePresident',
      func: _selectVicePresident,
      resp: _assignVicePresident,
    },
  ],
})

function _selectVicePresident(context) {
  const game = context.state
  const players = game
    .getPlayerAll()
    .filter(p => p.name !== context.data.playerName)
    .map(p => p.name)
    .sort()

  return context.wait({
    actor: context.data.playerName,
    name: 'Assign Vice President',
    description: 'While the chosen player is not President, other players may not be chosen with the "Administration" location',
    options: players
  })
}

function _assignVicePresident(context) {
  const game = context.state
  const playerName = bsgutil.optionName(context.response.option[0])
  const player = game.getPlayerByName(playerName)

  game.mExile('Assign Vice President')
  game.rk.put(player, 'isVicePresident', true)
  game.mLog({
    template: '{player1} assigns {player2} as the Vice President',
    args: {
      player1: context.data.playerName,
      player2: player.name
    }
  })
}
