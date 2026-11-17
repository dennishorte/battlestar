'use strict'

function sheet(game, player) {
  if (!game.state.ilesa) {
    game.state.ilesa = {}
  }
  if (!game.state.ilesa[player.name]) {
    game.state.ilesa[player.name] = { cardId: null, turns: 0, bonusCardId: null }
  }
  return game.state.ilesa[player.name]
}

function setAsideCard(game, player, cardId) {
  const zone = game.zones.byId(`${player.name}.setAside`)
  return zone.cardlist().find(card => card.id === cardId) || null
}

module.exports = {
  name: 'Ilesa Ecaz',
  source: 'Rise of Ix',
  compatibility: 'All',
  house: 'Ecaz',
  startingEffect: null,
  leaderAbility: 'One Step Ahead\nRound Start:\n· Set aside a card from your hand\nAt the start of your second turn this round, reveal that card and return it to your hand\nIf you use it to send an Agent this turn:\n· Exactly one Agent icon: +1 Spice\n· Otherwise: +1 Solari',
  signetRingAbility: 'Guild Contacts\nPay 1 Solari:\n· +1 Foldspace card',
  complexity: 3,

  onAssign(game) {
    const deckEngine = require('../../systems/deckEngine.js')
    deckEngine.createFoldspacePile(game)
  },

  onRoundStart(game, player) {
    const info = sheet(game, player)
    info.turns = 0
    info.bonusCardId = null
    info.cardId = null

    const hand = game.zones.byId(`${player.name}.hand`).cardlist()
    if (hand.length === 0) {
      return
    }

    const [choice] = game.actions.choose(player, hand.map(card => (
      game.actions.cardOption(card, 'imperium-card')
    )), { title: 'One Step Ahead: set aside a card' })
    const choiceId = typeof choice === 'object' ? choice.id : null
    const choiceTitle = typeof choice === 'object' ? choice.title : choice
    const card = (choiceId && hand.find(candidate => candidate.id === choiceId))
      || hand.find(candidate => candidate.name === choiceTitle)
    if (!card) {
      return
    }

    card.moveTo(game.zones.byId(`${player.name}.setAside`))
    info.cardId = card.id
    game.log.add({
      template: '{player} sets aside {card}',
      args: { player, card },
    })
  },

  onTurnStart(game, player) {
    const info = sheet(game, player)
    info.turns += 1
    if (info.turns !== 2 || !info.cardId) {
      return
    }

    const card = setAsideCard(game, player, info.cardId)
    info.cardId = null
    if (!card) {
      return
    }
    card.moveTo(game.zones.byId(`${player.name}.hand`))
    info.bonusCardId = card.id
    game.log.add({
      template: '{player} reveals {card} and returns it to hand (One Step Ahead)',
      args: { player, card },
    })
  },

  onBeforeReveal(game, player) {
    const info = sheet(game, player)
    if (info.turns !== 1 || !info.cardId) {
      return
    }
    const card = setAsideCard(game, player, info.cardId)
    info.cardId = null
    info.bonusCardId = null
    if (!card) {
      return
    }
    card.moveTo(game.zones.byId(`${player.name}.hand`))
    game.log.add({
      template: '{player} reveals the set-aside {card} with the rest of the hand',
      args: { player, card },
    })
  },

  onAgentCard(game, player, card) {
    const info = sheet(game, player)
    if (!info.bonusCardId || info.bonusCardId !== card.id) {
      return
    }
    info.bonusCardId = null
    const icons = (card.agentIcons || []).length
    if (icons === 1) {
      player.incrementCounter('spice', 1, { silent: true })
      game.log.add({
        template: '{player}: One Step Ahead — +1 Spice',
        args: { player },
      })
      return
    }
    player.incrementCounter('solari', 1, { silent: true })
    game.log.add({
      template: '{player}: One Step Ahead — +1 Solari',
      args: { player },
    })
  },

  resolveSignetRing(game, player) {
    const pile = game.zones.byId('common.reserve.foldspace')
    if (!pile || pile.cardlist().length === 0 || player.solari < 1) {
      return
    }
    const [choice] = game.actions.choose(player, [
      game.actions.option({ id: 'pass', title: 'Do not pay' }),
      game.actions.option({ id: 'pay', title: 'Pay 1 Solari' }),
    ], { title: 'Guild Contacts' })
    const choiceId = typeof choice === 'object' ? choice.id : choice
    if (choiceId !== 'pay') {
      return
    }
    player.decrementCounter('solari', 1, { silent: true })
    const card = pile.cardlist()[0]
    card.moveTo(game.zones.byId(`${player.name}.discard`))
    game.log.add({
      template: '{player}: Guild Contacts — pays 1 Solari and gains {card}',
      args: { player, card },
    })
  },
}
