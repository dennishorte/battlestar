const { transitionFactory2 } = require('./factory.js')
const bsgutil = require('../util.js')
const util = require('../../lib/util.js')

module.exports = transitionFactory2({
  steps: [
    {
      name: 'selectArbitrator',
      func: _selectArbitrator,
      resp: _assignArbitrator,
    },
  ],
})

function _selectArbitrator(context) {
  const game = context.state
  const players = game
    .getPlayerAll()
    .filter(p => p.name !== context.data.playerName)
    .map(p => p.name)
    .sort()

  return context.wait({
    actor: context.data.playerName,
    actions: [{
      name: 'Assign Arbitrator',
      description: `The selected player will be able to reduce or increase the difficulty of an Admiral's Quarters action by 3`,
      options: players
    }]
  })
}

function _assignArbitrator(context) {
  const game = context.state
  const playerName = bsgutil.optionName(context.response.option[0])
  const player = game.getPlayerByName(playerName)

  game.mExile('Assign Arbitrator')
  game.rk.put(player, 'isArbitrator', true)
  game.mLog({
    template: '{player1} assigns {player2} as the Arbitrator',
    args: {
      player1: context.data.playerName,
      player2: player.name
    }
  })
}
