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
    `Draw and tuck a {5}. You may return a top card from your board.`
  ],
  dogmaImpl: [
    (game, player) => {
      const card = game.actions.drawAndTuck(player, game.getEffectAge(this, 5))
      if (card) {
        game.aReturn(player, game.getTopCard(player, card.color))
      }
    },

    (game, player) => {
      game.actions.drawAndTuck(player, game.getEffectAge(this, 5))
      game.aChooseAndReturn(player, game.cards.tops(player), { min: 0, max: 1 })
    },
  ],
  echoImpl: (game, player) => {
    game.actions.drawAndTuck(player, game.getEffectAge(this, 5))
  },
}
