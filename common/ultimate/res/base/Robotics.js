module.exports = {
  name: `Robotics`,
  color: `red`,
  age: 10,
  expansion: `base`,
  biscuits: `hfpf`,
  dogmaBiscuit: `f`,
  dogma: [
    `Score your top green card.`,
    `Draw and meld a {0}. If it has a {f} or {i}, self-execute it.`,
  ],
  dogmaImpl: [
    (game, player) => {
      game.aScore(player, game.getTopCard(player, 'green'))
    },
    (game, player, { self }) => {
      const card = game.actions.drawAndMeld(player, game.getEffectAge(self, 10))
      if (card.checkHasBiscuit('f') || card.checkHasBiscuit('i')) {
        game.aSelfExecute(player, card)
      }
    },
  ],
}
