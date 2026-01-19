
export default {
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
        game.zones.byDeck('base', game.getEffectAge(self, 9)).cardlist()[0],
        game.zones.byDeck('base', game.getEffectAge(self, 10)).cardlist()[0],
      ].filter(x => x)

      cards.forEach(card => game.actions.reveal(player, card))

      game.actions.chooseAndReturn(player, cards, {
        title: 'Choose a card to put on the bottom of its deck',
      })
    },

    (game, player, { self }) => {
      const numBoardCards = game.cards.tops(player).length

      if (numBoardCards === 0) {
        game.youWin(player, self.name)
      }
      else {
        const valuedJunkCards = game
          .zones.byId('junk')
          .cardlist()
          .filter(card => card.age !== undefined)

        game.actions.transferMany(player, valuedJunkCards, game.zones.byPlayer(player, 'hand'), { ordered: true })
      }
    }
  ],
}
