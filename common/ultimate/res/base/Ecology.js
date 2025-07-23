module.exports = {
  name: `Ecology`,
  color: `yellow`,
  age: 9,
  expansion: `base`,
  biscuits: `lssh`,
  dogmaBiscuit: `s`,
  dogma: [
    `You may return a card from your hand. If you do, score a card from your hand and draw two {0}.`,
    `You may junk all cards in the {0} deck.`,
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const cards = game.actions.chooseAndReturn(
        player,
        game.cards.byPlayer(player, 'hand'),
        { min: 0, max: 1 }
      )

      if (cards && cards.length > 0) {
        game.actions.chooseAndScore(player, game.cards.byPlayer(player, 'hand'))
        game.actions.draw(player, { age: game.getEffectAge(self, 10) })
        game.actions.draw(player, { age: game.getEffectAge(self, 10) })
      }
    },

    (game, player) => {
      game.aJunkDeck(player, 10, { optional: true })
    },
  ],
}
