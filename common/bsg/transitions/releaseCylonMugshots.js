const { transitionFactory2 } = require('./factory.js')
const bsgutil = require('../util.js')
const util = require('../../lib/util.js')

module.exports = transitionFactory2({
  steps: [
    {
      name: 'choosePlayer',
      func: _choosePlayer,
      resp: _choosePlayerDo,
    },
  ],
})

function _choosePlayer(context) {
  const game = context.state
  const options = game
    .getPlayerAll()
    .filter(p => p.name !== context.data.playerName)
    .map(p => p.name)

  return context.wait({
    actor: context.data.playerName,
    name: 'Choose Player',
    description: 'You will view a random loyalty card of the chosen player',
    options,
  })
}

function _choosePlayerDo(context) {
  const game = context.state
  const chosenPlayerName = bsgutil.optionName(context.response.option[0])
  const chosenPlayer = game.getPlayerByName(chosenPlayerName)

  game.mLog({
    template: '{player1} views a random loyalty card of {player2}',
    args: {
      player1: context.data.playerName,
      player2: chosenPlayerName,
    }
  })

  // Reveal a loyalty card
  game.aRevealLoyaltyCards(chosenPlayer, context.data.playerName, 1)

  // Check if morale is lost
  const dieRoll = game.mRollDie(context.data.playerName)
  if (dieRoll <= 3) {
    game.mLog({
      template: 'The release of Cylon Mugshots has created panic among the people',
    })
    game.mAdjustCounterByName('morale', -1)
  }

  // Discard the used card
  const card = game.getCardByName('Release Cylon Mugshots')
  game.mDiscard(card)
}
