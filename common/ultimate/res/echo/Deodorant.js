module.exports = {
  name: `Deodorant`,
  color: `yellow`,
  age: 3,
  expansion: `echo`,
  biscuits: `c&ch`,
  dogmaBiscuit: `c`,
  echo: `Draw and meld a {3}.`,
  dogma: [
    `If you have a top card with {k}, draw and meld a {3}. Otherwise, draw a {4}.`,
    `If you have a top card with {f}, junk all cards in the {4} deck.`,
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const hasTopWithCastle = game
        .cards
        .tops(player)
        .some(card => card.checkHasBiscuit('k'))

      if (hasTopWithCastle) {
        game.actions.drawAndMeld(player, game.getEffectAge(self, 3))
      }
      else {
        game.actions.draw(player, { age: game.getEffectAge(self, 4) })
      }
    },

    (game, player, { self }) => {
      const hasTopWithFactory = game
        .cards
        .tops(player)
        .some(card => card.checkHasBiscuit('f'))

      if (hasTopWithFactory) {
        game.actions.junkDeck(player, game.getEffectAge(self, 4))
      }
    },
  ],
  echoImpl: (game, player, { self }) => {
    game.actions.drawAndMeld(player, game.getEffectAge(self, 3))
  },
}
