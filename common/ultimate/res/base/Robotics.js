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
      const card = game.getTopCard(player, 'green')
      if (card) {
        game.actions.score(player, card)
      }
    },
    (game, player, { self }) => {
      const card = game.actions.drawAndMeld(player, game.getEffectAge(self, 10))
      if (card.checkHasBiscuit('f') || card.checkHasBiscuit('i')) {
        game.aSelfExecute(player, card)
      }
    },
  ],
}
