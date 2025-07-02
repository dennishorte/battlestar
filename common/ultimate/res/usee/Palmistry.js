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
      game.aDrawAndMeld(player, game.getEffectAge(self, 1))
    },
    (game, player, { self }) => {
      const hand = game.getZoneByPlayer(player, 'hand')
      const returned = game.aChooseAndReturn(player, hand.cards(), { count: 2 })

      if (returned.length === 2) {
        game.aDrawAndScore(player, game.getEffectAge(self, 2))
      }
    }
  ],
}
