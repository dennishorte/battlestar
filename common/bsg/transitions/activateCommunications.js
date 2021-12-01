const { repeatSteps, transitionFactory2 } = require('./factory.js')
const bsgutil = require('../util.js')
const util = require('../../lib/util.js')

module.exports = transitionFactory2({
  data: {
  },
  steps: [
    ...repeatSteps(2, [
      {
        name: 'selectShip',
        func: _selectShip,
        resp: _selectShipDo,
      },
      {
        name: 'maybeMoveShip',
        func: _maybeMove,
        resp: _maybeMoveDo,
      },
    ])
  ]
})

function _selectShip(context) {
  const game = context.state

  const civilians = game.getDeployedCivilians()
  const options = civilians.map(([zoneName, card]) => {
    return {
      name: card.id,
      meta: {
        location: zoneName,
      }
    }
  })

  return context.wait({
    actor: context.data.playerName,
    actions: [{
      name: 'View Civilian',
      options,
    }]
  })
}

function _selectShipDo(context) {
  const game = context.state
  const shipId = context.response.option[0]
  const civilian = game.getCardById(shipId)

  game.rk.addKey(context.data, 'selectedCardId', shipId)
  game.rk.pushUnique(civilian.visibility, context.data.playerName)
  game.mLog({
    template: '{player} looks at civilian {card}',
    args: {
      player: context.data.playerName,
      card: civilian
    }
  })
}

function _maybeMove(context) {
  return context.wait({
    actor: context.data.playerName,
    actions: [{
      name: 'Move Civilian',
      meta: {
        cardId: context.data.selectedCardId
      },
      options: [
        'clockwise',
        'counter-clockwise',
        'do nothing',
      ]
    }]
  })
}

function _maybeMoveDo(context) {
  const game = context.state
  const civilian = game.getCardById(context.data.selectedCardId)
  const selection = bsgutil.optionName(context.response.option[0])

  if (selection === 'do nothing') {
    game.mLog({
      template: '{player} chooses not to move {card}',
      args: {
        player: context.data.playerName,
        card: civilian
      }
    })
  }

  else {
    game.aMoveCivilian(context.data.playerName, civilian, selection)
  }
}
