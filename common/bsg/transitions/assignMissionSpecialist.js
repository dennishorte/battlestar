const { transitionFactory2 } = require('./factory.js')
const bsgutil = require('../util.js')
const util = require('../../lib/util.js')

module.exports = transitionFactory2({
  steps: [
    {
      name: 'selectMissionSpecialist',
      func: _selectMissionSpecialist,
      resp: _assignMissionSpecialist,
    },
  ],
})

function _selectMissionSpecialist(context) {
  const game = context.state
  const players = game
    .getPlayerAll()
    .filter(p => p.name !== context.data.playerName)
    .map(p => p.name)
    .sort()

  return context.wait({
    actor: context.data.playerName,
    name: 'Assign Mission Specialist',
    description: 'The next time the fleet jumps, the selected player (not the admiral) will choose the destination from among 3 destination cards.',
    options: players
  })
}

function _assignMissionSpecialist(context) {
  const game = context.state
  const playerName = bsgutil.optionName(context.response.option[0])
  const player = game.getPlayerByName(playerName)

  game.mExile('Assign Mission Specialist')
  game.rk.put(player, 'isMissionSpecialist', true)
  game.mLog({
    template: '{player1} assigns {player2} as the Mission Specialist',
    args: {
      player1: context.data.playerName,
      player2: player.name
    }
  })
}
