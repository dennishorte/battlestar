export default {
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
      game.actions.draw(player, { age: game.getEffectAge(self, 1) })
      game.actions.draw(player, { age: game.getEffectAge(self, 1) })
    }
  ],
}
