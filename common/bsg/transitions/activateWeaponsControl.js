const { transitionFactory2 } = require('./factory.js')
const bsgutil = require('../util.js')
const util = require('../../lib/util.js')

module.exports = transitionFactory2({
  steps: [
    {
      name: 'chooseTarget',
      func: _chooseTarget,
      resp: _attackTarget,
    },
  ]
})

function _chooseTarget(context) {
  const game = context.state
  const options = []
  for (const zone of game.getZonesSpace()) {
    for (const card of zone.cards) {
      if (card.name === 'raider' || card.name === 'heavy raider' || card.name.startsWith('Basestar')) {
        options.push(card.id)
      }
    }
  }

  return context.wait({
    actor: context.data.playerName,
    actions: [{
      name: 'Weapons Control: Select Target',
      options,
    }]
  })
}

function _attackTarget(context) {
  const game = context.state
  const shipId = context.response.option[0]
  const ship = game.getCardById(shipId)
  const zone = game.getZoneByCard(ship)

  game.aAttackCylonByKind(
    context.data.playerName,
    zone,
    ship.name,
    'Galactica'
  )
}
