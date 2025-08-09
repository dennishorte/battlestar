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
    (game, player) => {
      const hasTopWithCastle = game
        .cards.tops(player)
        .some(card => card.checkHasBiscuit('k'))
      if (hasTopWithCastle) {
        game.actions.drawAndMeld(player, game.getEffectAge(this, 3))
      }
      else {
        game.aDraw(player, { age: game.getEffectAge(this, 4) })
      }
    },

    (game, player) => {
      const topCardsWithFactory = game
        .cards.tops(player)
        .filter(card => card.checkHasBiscuit('f'))
        .length

      if (topCardsWithFactory > 0) {
        game.aJunkDeck(player, game.getEffectAge(this, 4))
      }
    }
  ],
  echoImpl: (game, player) => {
    game.actions.drawAndMeld(player, game.getEffectAge(this, 3))
  },
}
