const { markDone, transitionFactory2 } = require('./factory.js')
const bsgutil = require('../util.js')
const util = require('../../lib/util.js')

module.exports = transitionFactory2({
  steps: [
    {
      name: 'choosePlayer',
      func: _choosePlayer,
      resp: _choosePlayerResp,
    },
    {
      name: 'chooseCard',
      func: _chooseCard,
      resp: _chooseCardResp,
    },
    {
      name: 'damageGalactica',
      func: _damageGalactica
    },
  ],
})

function _choosePlayer(context) {
  const game = context.state
  const humans = game
    .getPlayerAll()
    .filter(p => !game.checkPlayerIsRevealedCylon(p))
    .filter(p => game.getCardsKindByPlayer('skill', p).length > 0)
    .map(p => p.name)

  // Sometimes, there is nobody to steal cards from.
  if (humans.length === 0) {
    game.mLog({ template: 'There are no players with skill cards in hand to spy on' })
  }
  else {
    return context.wait({
      actor: context.data.playerName,
      name: 'Choose a Player to Spy On',
      options: humans
    })
  }
}

function _choosePlayerResp(context) {
  const game = context.state
  const chosenPlayerName = bsgutil.optionName(context.response.option[0])
  game.rk.addKey(context.data, 'chosenPlayerName', chosenPlayerName)
}

function _chooseCard(context) {
  const game = context.state

  // This can happen if no players had skill cards in hand
  if (!context.data.chosenPlayerName) {
    return
  }

  const cards = game
    .getCardsKindByPlayer('skill', context.data.chosenPlayerName)
    .map(c => c.id)
  return context.wait({
    actor: context.data.playerName,
    name: 'Select a Card to Steal',
    options: cards
  })
}

function _chooseCardResp(context) {
  const game = context.state
  const cardId = bsgutil.optionName(context.response.option[0])
  const card = game.getCardById(cardId)

  game.mLog({
    template: '{player1} steals a card from {player2}',
    args: {
      player1: context.data.playerName,
      player2: context.data.chosenPlayerName
    }
  })

  const playerZone = game.getZoneByPlayer(context.data.playerName)
  const targetZone = game.getZoneByPlayer(context.data.chosenPlayerName)

  game.mMoveCard(targetZone, playerZone, card)
}

function _damageGalactica(context) {
  const game = context.state
  const player = game.getPlayerByName(context.data.playerName)

  game.mLog({
    template: '{player} attempts to sabotage Galactica',
    args: {
      player: player.name
    }
  })

  const dieRoll = game.mRollDie(player)

  if (dieRoll < 5) {
    game.mLog({
      template: 'Sabotage failed'
    })
  }
  else {
    game.aDamageGalactica()
  }
}
