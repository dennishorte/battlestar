const { transitionFactory2 } = require('./factory.js')
const bsgutil = require('../util.js')
const util = require('../../lib/util.js')

module.exports = transitionFactory2({
  steps: [
    {
      name: 'initialize',
      func: _initialize,
    },
    {
      name: 'execute',
      func: _execute,
      resp: _executeDo,
    },
  ],
})

function _initialize(context) {
  const game = context.state
  const player = game.getPlayerByName(context.data.playerName)
  game.mSetOncePerGameAbilityUsed(player)
}

function _execute(context) {
  const game = context.state
  const player = game.getPlayerByName(context.data.playerName)
  const character = game.getCardCharacterByPlayer(player)

  if (character.name === 'Gaius Baltar') {
    const otherPlayers = game
      .getPlayerAll()
      .filter(p => p.name !== player.name)
      .map(p => p.name)

    return context.wait({
      actor: player.name,
      name: 'Cylon Detector',
      description: 'View all loyalty cards of selected player',
      options: otherPlayers
    })
  }

  else if (character.name === 'Laura Roslin') {
    const playerHand = game.getZoneByPlayer(player)
    const quorumZone = game.getZoneByName('decks.quorum')
    const cards = quorumZone.cards.slice(0, 4)
    const cardIds = cards.map(c => c.id)
    for (const card of cards) {
      game.mMoveCard(quorumZone, playerHand, card)
    }
    game.rk.addKey(context.data, 'cardIds', cardIds)

    return context.wait({
      actor: player.name,
      name: 'Skilled Politician',
      options: cardIds
    })
  }

  else if (character.name === 'Lee "Apollo" Adama') {
    return context.push('lee-apollo-cag', {
      playerName: player.name
    })
  }

  else if (character.name === 'Saul Tigh') {
    game.mLog({
      template: '{player} declares martial law',
      args: {
        player: player.name
      }
    })
    game.aAssignPresident(game.getPlayerAdmiral())
  }

  else if (character.name === 'Tom Zarek') {
    return context.wait({
      actor: player.name,
      name: 'Unconventional Tactics',
      description: 'The selected resource will go up by one',
      options: [
        'food',
        'fuel',
        'morale',
      ],
    })
  }

  else {
    throw new Error(`Unhandled once per game action for ${character.name}`)
  }
}

function _executeDo(context) {
  const game = context.state
  const player = game.getPlayerByName(context.data.playerName)
  const character = game.getCardCharacterByPlayer(player)

  if (character.name === 'Gaius Baltar') {
    const targetName = bsgutil.optionName(context.response.option[0])
    const target = game.getPlayerByName(targetName)
    game.mLog({
      template: "{player1} uses Gaius Baltar's Cylon Detector ability on {player2}",
      args: {
        player1: player.name,
        player2: target.name,
      }
    })
    game.aRevealLoyaltyCards(target, player, 999)
  }

  else if (character.name === 'Laura Roslin') {
    const playerHand = game.getZoneByPlayer(player)
    const quorumZone = game.getZoneByName('decks.quorum')

    const selectedCardId = bsgutil.optionName(context.response.option[0])
    const selectedCard = game.getCardById(selectedCardId)

    // Put the unused cards on the bottom of the deck
    for (const cardId of context.data.cardIds) {
      if (cardId !== selectedCardId) {
        const card = game.getCardById(cardId)
        game.mMoveCard(playerHand, quorumZone, card)
      }
    }

    return context.push('play-quorum-card', {
      playerName: player.name,
      cardId: selectedCardId,
    })
  }

  else if (character.name === 'Tom Zarek') {
    const resource = bsgutil.optionName(context.response.option[0])
    game.mLog({
      template: '{player} uses Unconvential Tactics to increase {resource}',
      args: {
        player: player.name,
        resource
      }
    })
    game.mAdjustCounterByName('population', -1)
    game.mAdjustCounterByName(resource, +1)
  }

  else {
    throw new Error(`Unhandled once per game character action for ${character.name}`)
  }
}
