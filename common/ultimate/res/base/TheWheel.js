module.exports = {
  name: `The Wheel`,
  color: `green`,
  age: 1,
  expansion: `base`,
  biscuits: `hkkk`,
  dogmaBiscuit: `k`,
  dogma: [
    `Draw two {1}.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      game.aDraw(player, { age: game.getEffectAge(self, 1) })
      game.aDraw(player, { age: game.getEffectAge(self, 1) })
    }
  ],
}
