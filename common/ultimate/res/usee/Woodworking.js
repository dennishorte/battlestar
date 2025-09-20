module.exports = {
  name: `Woodworking`,
  color: `yellow`,
  age: 1,
  expansion: `usee`,
  biscuits: `llhs`,
  dogmaBiscuit: `l`,
  dogma: [
    `Draw and meld a {2}. If the melded card is a bottom card on your board, score it.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const card = game.actions.drawAndMeld(player, game.getEffectAge(self, 2))

      if (card) {
        const isBottom = game.cards.bottom(player, card.color).name === card.name
        if (isBottom) {
          game.actions.score(player, card)
        }
      }
    },
  ],
}
