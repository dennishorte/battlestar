const { transitionFactory2 } = require('./factory.js')
const bsgutil = require('../util.js')
const util = require('../../lib/util.js')

module.exports = transitionFactory2({
  steps: [
    {
      name: 'ration',
      func: _ration,
    },
  ],
})

function _ration(context) {
  const game = context.state
  const dieRoll = game.mRollDie(context.data.playerName)
  const card = game
    .getZoneByPlayer(context.data.playerName)
    .cards
    .find(c => c.name === 'Food Rationing')

  if (dieRoll >= 6) {
    game.mLog({
      template: 'Food rationing is successful'
    })
    game.mAdjustCounterByName('food', +1)
    game.mExile(card)
  }

  else {
    game.mLog({
      template: 'Food rationing is unsuccessful'
    })
    game.mDiscard(card)
  }
}
