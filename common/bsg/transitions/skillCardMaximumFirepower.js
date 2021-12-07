const { transitionFactory2 } = require('./factory.js')
const { viperAttackOptions } = require('./util.js')
const bsgutil = require('../util.js')
const util = require('../../lib/util.js')

module.exports = transitionFactory2({
  steps: [
    {
      name: 'attack1',
      func: _attack,
      resp: _handleAttack
    },
    {
      name: 'attack2',
      func: _attack,
      resp: _handleAttack
    },
    {
      name: 'attack3',
      func: _attack,
      resp: _handleAttack
    },
    {
      name: 'attack4',
      func: _attack,
      resp: _handleAttack
    },
  ],
})

function _attack(context) {
  const game = context.state
  const player = game.getPlayerByName(context.data.playerName)
  const options = viperAttackOptions(game, player)

  if (!options) {
    game.mLog({ template: 'All enemies have been destroyed' })
    return context.done()
  }

  const numTargets = options.options.length

  if (numTargets === 0) {
    game.mLog({ template: 'All enemies have been destroyed' })
    return context.done()
  }

  else if (numTargets === 1) {
    game.aAttackCylonWithViperByKind(
      player,
      game.getZoneByPlayerLocation(player),
      options.options[0]
    )
  }

  else {
    return context.wait({
      actor: player.name,
      ...options
    })
  }
}

function _handleAttack(context) {
  const game = context.state
  const playerName = context.data.playerName
  game.attackCylonWithViperByKind(
    playerName,
    game.getZoneByPlayerLocation(playerName),
    bsgutil.optionName(context.response.option[0])
  )
}
