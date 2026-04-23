'use strict'

module.exports = {
  name: 'Paul Atreides',
  source: 'Base',
  compatibility: 'All',
  house: 'Atreides',
  startingEffect: null,
  leaderAbility: 'Prescience\nYou may look at the top card of your deck at any time.',
  signetRingAbility: 'Discipline\n· Draw 1 card',
  complexity: 1,

  onAgentTurnStart(game, player) {
    const deckZone = game.zones.byId(`${player.name}.deck`)
    const topCards = deckZone.cardlist()
    if (topCards.length > 0) {
      game.log.add({
        template: '{player}: Prescience — top of deck is {card}',
        args: { player, card: topCards[0] },
        visibility: [player.name],
        redacted: '{player}: Prescience — looks at the top card of their deck',
      })
    }
  },
}
