'use strict'

function intelligence(game, player) {
  const deck = game.zones.byId('common.intrigueDeck')
  const top = deck.cardlist().slice(0, 2)
  if (top.length < 2) {
    return
  }

  const [choice] = game.actions.choose(player, top.map(card => (
    game.actions.cardOption(card, 'intrigue')
  )), { title: 'Intelligence: keep one Intrigue card' })
  const choiceId = typeof choice === 'object' ? choice.id : null
  const choiceTitle = typeof choice === 'object' ? choice.title : choice
  const kept = (choiceId && top.find(card => card.id === choiceId))
    || top.find(card => card.name === choiceTitle)
  if (!kept) {
    return
  }
  const other = top.find(card => card.id !== kept.id)
  kept.moveTo(game.zones.byId(`${player.name}.intrigue`))
  if (other) {
    other.moveToTop(deck)
  }
  game.log.add({
    template: '{player} keeps {card} (Intelligence)',
    args: { player, card: kept },
  })
}

module.exports = {
  name: 'Viscount Hundro Moritani',
  source: 'Rise of Ix',
  compatibility: 'Rise of Ix',
  house: 'Moritani',
  startingEffect: null,
  leaderAbility: 'Intelligence\nAt game start:\n· Look at the top 2 cards of the Intrigue deck\n· Keep 1, put the other back on top',
  signetRingAbility: 'Couriers\nPay 1 Spice:\n· Move your Freighter once',
  complexity: 1,
  intelligence,

  onGameStart(game, player) {
    if (game.settings.useEpic && game.settings.useRiseOfIx) {
      return
    }
    intelligence(game, player)
  },

  resolveSignetRing(game, player) {
    if ((player.spice || 0) < 1) {
      return
    }
    const [choice] = game.actions.choose(player, [
      game.actions.option({ id: 'pass', title: 'Do not pay' }),
      game.actions.option({ id: 'pay', title: 'Pay 1 Spice' }),
    ], { title: 'Couriers' })
    const choiceId = typeof choice === 'object' ? choice.id : choice
    if (choiceId !== 'pay') {
      return
    }
    player.decrementCounter('spice', 1, { silent: true })
    require('../../systems/shipping.js').moveFreighter(game, player, 1)
  },
}
