const { transitionFactory2 } = require('./factory.js')
const bsgutil = require('../util.js')
const util = require('../../lib/util.js')

module.exports = transitionFactory2({
  steps: [
    {
      name: 'roll-die',
      func: _rollDie,
    },
    {
      name: 'select-deck',
      func: _selectDeck,
      resp: _selectDeckHandleResponse,
    },
    {
      name: 'select-top-or-bottom',
      func: _selectTopOrBottom,
      resp: _selectTopOrBottomHandleResponse,
    },
  ],
})

function _rollDie(context) {
  const game = context.state
  const dieRoll = game.mRollDie()

  if (dieRoll <= 2) {
    game.mLog({ template: 'Scouting failed; raptor lost' })
    game.mAdjustCounterByName('raptors', -1)
    return context.done()
  }
}

function _selectDeck(context) {
  return context.wait({
    actor: context.data.playerName,
    name: 'Select Deck',
    options: ['crisis', 'destination']
  })
}

function _selectDeckHandleResponse(context) {
  const game = context.state
  const playerHandZone = game.getZoneByPlayer(context.data.playerName)
  const option = context.response.option[0]
  const card = game.mMoveCard(`decks.${option}`, playerHandZone)

  game.rk.addKey(context.data, 'deck', option)
  game.rk.addKey(context.data, 'cardId', card.id)
}

function _selectTopOrBottom(context) {
  return context.wait({
    actor: context.data.playerName,
    name: 'Top or Bottom',
    options: ['back on top', 'move to bottom']
  })
}

function _selectTopOrBottomHandleResponse(context) {
  const game = context.state
  const card = game.getCardById(context.data.cardId)
  const option = context.response.option[0]

  if (option === 'back on top') {
    game.mReturnCardToTop(card)
  }
  else {
    game.mReturnCardToBottom(card)
  }
}
