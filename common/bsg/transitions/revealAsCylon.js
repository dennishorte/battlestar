const { transitionFactory2 } = require('./factory.js')
const bsgutil = require('../util.js')
const util = require('../../lib/util.js')

module.exports = transitionFactory2({
  steps: [
    {
      name: 'setup',
      func: _setup,
      resp: _setupDo,
    },
    {
      name: 'titles',
      func: _titles,
    },
    {
      name: 'resurrect',
      func: _resurrect,
    },
    {
      name: 'discard',
      func: _discard,
    },
  ],
})

function _setup(context) {
  const game = context.state
  const card = game.getCardById(context.data.cardId)
  const player = game.getPlayerByName(context.data.playerName)
  game.mLog({
    template: '{player} reveals themself to be a Cylon!',
    args: {
      player: player.name
    }
  })
  game.mSetPlayerIsRevealedCylon(player)

  const humanPlayers = game
    .getPlayerAll()
    .filter(p => !game.checkPlayerIsRevealedCylon(p))
    .map(p => p.name)

  if (game.getZoneByPlayerLocation(player).name === 'locations.brig') {
    game.mLog({
      template: '{player} is in the brig, and so cannot sabotage Galactica',
      args: {
        player: player.name
      }
    })
  }

  else if (card.effect === 'cylon-morale') {
    game.mAdjustCounterByName('morale', -1)
  }

  else if (card.effect === 'cylon-brig') {
    return context.wait({
      actor: player.name,
      name: 'Frame Player',
      description: 'Selected player will be sent to the brig',
      options: humanPlayers,
    })
  }

  else if (card.effect === 'cylon-sickbay') {
    return context.wait({
      actor: player.name,
      name: 'Attack Player',
      description: 'Selected player will discard 5 skill cards and be sent to sickbay',
      options: humanPlayers,
    })
  }

  else if (card.effect === 'cylon-damage') {
    // Draw 5 damage tokens
    const damageZone = game.getZoneByName('decks.damageGalactica')
    const playerZone = game.getZoneByPlayer(player)
    for (let i = 0; i < 5; i++) {
      if (damageZone.cards.length > 0) {
        game.mMoveCard(damageZone, playerZone)
      }
    }

    const tokenIds = playerZone
      .cards
      .filter(c => c.kind === 'damageGalactica')
      .map(c => c.id)

    return context.wait({
      actor: player.name,
      name: 'Sabotage Galactica',
      count: 2,
      options: tokenIds
    })
  }

  else {
    throw new Error(`Unhandled cylon loyalty effect: ${card.effect}`)
  }
}

function _setupDo(context) {
  const game = context.state
  const card = game.getCardById(context.data.cardId)

  if (card.effect === 'cylon-brig') {
    const framedPlayerName = bsgutil.optionName(context.response.option[0])
    game.mLog({
      template: '{player1} frames {player2}',
      args: {
        player1: context.data.playerName,
        player2: framedPlayerName
      }
    })
    game.mMovePlayer(framedPlayerName, 'locations.brig')
  }

  else if (card.effect === 'cylon-sickbay') {
    const attackedPlayerName = bsgutil.optionName(context.response.option[0])
    game.mLog({
      template: '{player1} attacks {player2}',
      args: {
        player1: context.data.playerName,
        player2: attackedPlayerName
      }
    })
    game.mMovePlayer(attackedPlayerName, 'locations.sickbay')
    return context.push('discard-skill-cards', {
      countsByPlayer: [{
        player: attackedPlayerName,
        count: 5
      }]
    })
  }

  else if (card.effect === 'cylon-damage') {
    game.mLog({
      template: '{player} sabotages Galactica',
      args: {
        player: context.data.playerName
      }
    })
    context
      .response
      .option
      .map(bsgutil.optionName)
      .forEach(game.aDamageGalactica)
  }

  else {
    throw new Error(`Unhandled cylon loyalty effect: ${card.effect}`)
  }
}

function _discard(context) {
  const game = context.state
  const playerSkillCards = game.getCardsKindByPlayer('skill', context.data.playerName)
  const numberToDiscard = playerSkillCards.length - 3

  if (numberToDiscard > 0) {
    return context.push('discard-skill-cards', {
      countsByPlayer: [{
        player: context.data.playerName,
        count: numberToDiscard,
      }]
    })
  }
}

function _titles(context) {
  const game = context.state
  const player = game.getPlayerByName(context.data.playerName)

  if (game.checkPlayerIsAdmiral(player)) {
    game.aAssignAdmiral(game.getPlayerAdmiralNext())
  }

  if (game.checkPlayerIsPresident(player)) {
    game.aAssignPresident(game.getPlayerPresidentNext())
  }
}

function _resurrect(context) {
  const game = context.state
  const playerZone = game.getZoneByPlayer(context.data.playerName)

  game.mLog({
    template: '{player} is moved to the Resurrection Ship',
    args: {
      player: context.data.playerName
    }
  })
  game.mMovePlayer(context.data.playerName, 'locations.resurrectionShip')

  game.mLog({
    template: '{player} draws a super crisis card',
    args: {
      player: context.data.playerName
    }
  })
  game.mMoveCard('decks.superCrisis', playerZone)
}
