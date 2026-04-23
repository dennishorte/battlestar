'use strict'

const deckEngine = require('../../systems/deckEngine.js')

module.exports = {
  name: 'Archduke Armand Ecaz',
  source: 'Rise of Ix',
  compatibility: 'All',
  house: 'Ecaz',
  startingEffect: null,
  leaderAbility: 'Coordination\nReveal Turn:\n· You may trash one of your cards In Play',
  signetRingAbility: 'Conscript\n· Acquire a card that costs 3 Persuasion or less',
  complexity: 2,

  onRevealTurn(game, player) {
    const playedZone = game.zones.byId(`${player.name}.played`)
    const playedCards = playedZone.cardlist()
    if (playedCards.length === 0) {
      return
    }
    const choices = ['Pass', ...playedCards.map(c => c.name)]
    const [choice] = game.actions.choose(player, choices, {
      title: 'Coordination: Trash a card in play?',
    })
    if (choice !== 'Pass') {
      const card = playedCards.find(c => c.name === choice)
      if (card) {
        deckEngine.trashCard(game, card)
        game.log.add({
          template: '{player}: Coordination — trashes {card}',
          args: { player, card },
        })
      }
    }
  },
}
