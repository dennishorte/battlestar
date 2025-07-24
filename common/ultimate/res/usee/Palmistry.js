module.exports = {
  name: `Palmistry`,
  color: `blue`,
  age: 1,
  expansion: `usee`,
  biscuits: `lkhk`,
  dogmaBiscuit: `l`,
  dogma: [
    `Draw and meld a {1}.`,
    `Return two cards from your hand. If you do, draw and score a {2}.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      game.actions.drawAndMeld(player, game.getEffectAge(self, 1))
    },
    (game, player, { self }) => {
      const hand = game.zones.byPlayer(player, 'hand')
      const returned = game.actions.chooseAndReturn(player, hand.cardlist(), { count: 2 })

      if (returned.length === 2) {
        game.actions.drawAndScore(player, game.getEffectAge(self, 2))
      }
    }
  ],
}
