'use strict'

const deckEngine = require('../../../systems/deckEngine.js')

module.exports = {
  id: "manipulate",
  name: "Manipulate",
  source: "Uprising",
  compatibility: "All",
  count: 1,
  hasTech: false,
  hasShipping: false,
  hasResearch: false,
  hasSpies: false,
  hasSandworms: false,
  hasContracts: false,
  hasBattleIcons: false,
  hasSardaukar: false,
  isTwisted: false,
  vpsAvailable: 0,
  combatEffect: null,
  endgameEffect: null,
  plotText: "Remove and replace a card in the Imperium Row; during your Reveal turn this round, you may acquire the removed card for 1 less Persuasion",

  plotEffect(game, player) {
    const rowZone = game.zones.byId('common.imperiumRow')
    const rowCards = rowZone.cardlist()
    if (rowCards.length === 0) {
      return
    }
    const choices = [
      game.actions.option({ id: 'pass', title: 'Pass' }),
      ...rowCards.map(c => game.actions.cardOption(c, 'imperium-card')),
    ]
    const [choice] = game.actions.choose(player, choices, {
      title: 'Manipulate: Remove a card from the Imperium Row',
    })
    const choiceId = typeof choice === 'object' ? choice.id : choice
    if (choiceId === 'pass' || choice === 'Pass') {
      return
    }
    const card = typeof choice === 'object'
      ? rowCards.find(c => c.id === choice.id)
      : rowCards.find(c => c.name === choice)
    if (!card) {
      return
    }
    const reservedZone = game.zones.byId('common.reservedCards')
    card.moveTo(reservedZone)
    game.state.reservedCards.push({
      player: player.name,
      round: game.state.round,
      cardId: card.id,
    })
    deckEngine.refillImperiumRow(game)
    game.log.add({
      template: '{player}: Manipulate — reserves {card} (-1 Persuasion to acquire this round)',
      args: { player, card },
    })
  },

}
