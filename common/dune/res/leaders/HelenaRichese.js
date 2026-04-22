'use strict'

const deckEngine = require('../../systems/deckEngine.js')

module.exports = {
  name: 'Helena Richese',
  source: 'Base',
  compatibility: 'All',
  house: 'Richese',
  startingEffect: null,
  leaderAbility: 'Eyes Everywhere\nEnemy Agents don\'t block your Agents at Green or Blue board spaces.',
  signetRingAbility: 'Manipulate\n· Remove a card in the Imperium Row\n· You may acquire it for 1 Persuasion less',
  complexity: 2,

  ignoresOccupancy(_game, _player, space) {
    return space.icon === 'green' || space.icon === 'purple'
  },

  resolveSignetRing(game, player, _resolveEffectFn) {
    const rowZone = game.zones.byId('common.imperiumRow')
    const rowCards = rowZone.cardlist()
    if (rowCards.length === 0) {
      return
    }
    const choices = ['Pass', ...rowCards.map(c => c.name)]
    const [choice] = game.actions.choose(player, choices, {
      title: 'Manipulate: Remove a card from the Imperium Row',
    })
    if (choice === 'Pass') {
      return
    }
    const card = rowCards.find(c => c.name === choice)
    if (!card) {
      return
    }
    const reservedZone = game.zones.byId('common.helenaReserved')
    card.moveTo(reservedZone)
    game.state.helenaReserved = {
      player: player.name,
      round: game.state.round,
    }
    deckEngine.refillImperiumRow(game)
    game.log.add({
      template: '{player}: Manipulate — reserves {card} (-1 Persuasion to acquire this round)',
      args: { player, card: card.name },
    })
  },
}
