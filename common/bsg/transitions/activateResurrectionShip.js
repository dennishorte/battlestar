const { markDone, transitionFactory2 } = require('./factory.js')
const bsgutil = require('../util.js')
const util = require('../../lib/util.js')

module.exports = transitionFactory2({
  steps: [
    {
      name: 'swapSuperCrisis',
      func: _swapSuperCrisis,
      resp: _swapSuperCrisisResp,
    },
    {
      name: 'giveLoyaltyCards',
      func: _giveLoyaltyCards,
      resp: _giveLoyaltyCardsResp,
    },
  ]
})

function _swapSuperCrisis(context) {
  const game = context.state
  const player = game.getPlayerByName(context.data.playerName)
  const superCrisis = game.getCardsKindByPlayer('superCrisis', player)

  if (superCrisis.length > 0) {
    return context.wait({
      actor: player.name,
      name: 'Swap Super Crisis?',
      options: ['Yes', 'No']
    })
  }
}

function _swapSuperCrisisResp(context) {
  const game = context.state
  const player = game.getPlayerByName(context.data.playerName)
  const superCrisis = game.getCardsKindByPlayer('superCrisis', player)

  const doSwap = bsgutil.optionName(context.response.option[0]) === 'Yes'
  if (doSwap) {
    game.mLog({
      template: '{player} chooses exchange his super crisis card for a different one',
      args: {
        player: player.name
      }
    })
    game.mDiscard(superCrisis[0])
    game.mMoveCard('decks.superCrisis', game.getZoneByPlayer(player))
  }
  else {
    game.mLog({
      template: '{player} chooses not to get a different super crisis card',
      args: {
        player: player.name
      }
    })
  }
}

function _giveLoyaltyCards(context) {
  const game = context.state
  const player = game.getPlayerByName(context.data.playerName)
  const players = game.getPlayerAll()
  const unrevealedLoyaltyCards = game
    .getCardsLoyaltyByPlayer(player)
    .filter(c => c.visibility.length !== players.length && c.visibility[0] !== 'all')

  if (game.getCounterByName('distance') >= 8) {
    game.mLog({
      template: 'Cannot give loyalty cards because distance is greater than 7'
    })
  }
  else if (unrevealedLoyaltyCards.length > 0) {
    const humanPlayers = players
      .filter(p => !game.checkPlayerIsRevealedCylon(p))
      .map(p => p.name)

    return context.wait({
      actor: player.name,
      name: 'Give Away Loyalty Cards',
      options: [...humanPlayers, 'Skip']
    })
  }
  else {
    game.mLog({
      template: '{player} has no unrevealed loyalty cards to give away',
      args: {
        player: player.name
      }
    })
  }
}

function _giveLoyaltyCardsResp(context) {
  const game = context.state
  const player = game.getPlayerByName(context.data.playerName)
  const players = game.getPlayerAll()
  const unrevealedLoyaltyCards = game
    .getCardsLoyaltyByPlayer(player)
    .filter(c => c.visibility.length !== players.length && c.visibility[0] !== 'all')

  const selection = bsgutil.optionName(context.response.option[0])

  if (selection === 'Skip') {
    game.mLog({
      template: '{player} choose not to give away unrevealed loyalty cards',
      args: {
        player: player.name
      }
    })
  }
  else {
    game.mLog({
      template: '{player1} gives his unrevealed loyalty cards to {player2}',
      args: {
        player1: player.name,
        player2: selection,
      }
    })
    const playerZone = game.getZoneByPlayer(player)
    const targetZone = game.getZoneByPlayer(selection)
    for (const card of unrevealedLoyaltyCards) {
      game.mMoveCard(playerZone, targetZone, card)
    }
  }
}
