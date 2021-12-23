const { markDone, transitionFactory2 } = require('./factory.js')
const bsgutil = require('../util.js')
const util = require('../../lib/util.js')

module.exports = transitionFactory2({
  data: {
    standardCrisis: false,
    crisisId: '',
  },
  steps: [
    {
      name: 'chooseCardType',
      func: _chooseCardType,
      resp: _chooseCardTypeResp,
    },
    {
      name: 'chooseCrisisCard',
      func: _chooseCrisisCard,
      resp: _chooseCrisisCardResp,
    },
    {
      name: 'cleanup',
      func: _cleanup,
    },
  ],
})

function _chooseCardType(context) {
  const game = context.state
  const player = game.getPlayerByName(context.data.playerName)
  const superCrises = game.getCardsKindByPlayer('superCrisis', player)

  // The player has a super crisis card, so can choose between using that card or
  // drawing two standard crisis cards and selecting one of those.
  if (superCrises.length > 0) {
    return context.wait({
      actor: player.name,
      name: 'Choose Crisis Type',
      options: [
        {
          name: 'Standard Crisis',
          description: 'Draw two crisis cards and execute one of them',
        },
        ...superCrises.map(c => c.id)
      ]
    })
  }

  // Not having a super crisis card, the player will go directly to choosing a
  // standard crisis card.
  else {
    game.rk.put(context.data, 'standardCrisis', true)
  }
}

function _chooseCardTypeResp(context) {
  const game = context.state
  const option = bsgutil.optionName(context.response.option[0])
  if (option === 'Standard Crisis') {
    game.rk.put(context.data, 'standardCrisis', true)
  }

  // Since the player has selected to use their super crisis (and they only have the one)
  // skip directly to the evaluate crisis transition and mark this transition as complete.
  else {
    markDone(context)
    game.mSetCrisisActive(game.getCardById(option))
    return context.push('evaluate-crisis', {
      playerName: context.data.playerName,
    })
  }
}

function _chooseCrisisCard(context) {
  const game = context.state
  const player = game.getPlayerByName(context.data.playerName)
  const playerZone = game.getZoneByPlayer(player)

  game.mLog({
    template: '{player} chooses to use a standard crisis card',
    args: {
      player: player.name
    }
  })

  // Draw two crisis cards
  game.mMoveCard('decks.crisis', playerZone)
  game.mMoveCard('decks.crisis', playerZone)

  const crisisCardIds = game
    .getCardsKindByPlayer('crisis', player)
    .map(c => c.id)

  return context.wait({
    actor: player.name,
    name: 'Select Crisis',
    options: crisisCardIds,
  })
}

function _chooseCrisisCardResp(context) {
  const game = context.state
  const player = game.getPlayerByName(context.data.playerName)
  const playerZone = game.getZoneByPlayer(player)
  const crisisId = bsgutil.optionName(context.response.option[0])

  // Discard the unused crisis card
  const unusedCards = game
    .getCardsKindByPlayer('crisis', player)
    .filter(c => c.id !== crisisId)

  util.assert(unusedCards.length === 1)

  game.mDiscard(unusedCards[0])
  game.mSetCrisisActive(game.getCardById(crisisId))
  return context.push('evaluate-crisis', {
    playerName: context.data.playerName,
  })
}

function _cleanup(context) {
  game.mCleanupCrisis()
}
