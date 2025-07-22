module.exports = {
  name: `Pottery`,
  color: `blue`,
  age: 1,
  expansion: `base`,
  biscuits: `hlll`,
  dogmaBiscuit: `l`,
  dogma: [
    `You may return up to three cards from your hand. If you returned any cards, draw and score a card of value equal to the number of cards you returned.`,
    `Draw a {1}.`
  ],
  dogmaImpl: [
    (game, player) => {
      const cards = game.actions.chooseAndReturn(
        player,
        game.cards.byPlayer(player, 'hand'),
        { min: 0, max: 3 }
      )

      if (cards && cards.length > 0) {
        game.aDrawAndScore(player, cards.length)
      }
    },

    (game, player, { self }) => {
      game.aDraw(player, { age: game.getEffectAge(self, 1) })
    }
  ],
}
