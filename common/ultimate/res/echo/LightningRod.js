module.exports = {
  name: `Lightning Rod`,
  color: `blue`,
  age: 5,
  expansion: `echo`,
  biscuits: `&fh6`,
  dogmaBiscuit: `f`,
  echo: `Draw and tuck a {5}.`,
  dogma: [
    `I demand you draw and tuck a {5}! Return your top card of the tucked card's color.`,
    `Return a top card from your board.`,
    `Junk all cards in the {6} deck.`,
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const card = game.actions.drawAndTuck(player, game.getEffectAge(self, 5))
      if (card) {
        game.actions.return(player, game.cards.top(player, card.color))
      }
    },

    (game, player) => {
      game.actions.chooseAndReturn(player, game.cards.tops(player))
    },

    (game, player, { self }) => {
      game.actions.junkDeck(player, game.getEffectAge(self, 6))
    },
  ],
  echoImpl: (game, player, { self }) => {
    game.actions.drawAndTuck(player, game.getEffectAge(self, 5))
  },
}
