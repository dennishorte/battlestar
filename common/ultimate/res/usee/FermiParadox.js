const { GameOverEvent } = require('../../../lib/game.js')

module.exports = {
  name: `Fermi Paradox`,
  color: `blue`,
  age: 9,
  expansion: `usee`,
  biscuits: `hiis`,
  dogmaBiscuit: `i`,
  dogma: [
    `Reveal the top card of the {9} deck and the {0} deck. Return the top card of the {9} deck or the {0} deck.`,
    `If you have no cards on your board, you win. Otherwise, transfer all valued cards in the junk to your hand.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const cards = [
        game.getZoneByDeck('base', game.getEffectAge(self, 9)).cards()[0],
        game.getZoneByDeck('base', game.getEffectAge(self, 10)).cards()[0],
      ].filter(x => x)

      cards.forEach(card => game.mReveal(player, card))

      game.aChooseAndReturn(player, cards, {
        title: 'Choose a card to put on the bottom of its deck',
      })
    },

    (game, player, { self }) => {
      const numBoardCards = game.getTopCards(player).length

      if (numBoardCards === 0) {
        throw new GameOverEvent({
          player,
          reason: self.name,
        })
      }
      else {
        const valuedJunkCards = game
          .zones.byId('junk')
          .cards()
          .filter(card => card.age !== undefined)

        game.aTransferMany(player, valuedJunkCards, game.zones.byPlayer(player, 'hand'), { ordered: true })
      }
    }
  ],
}
