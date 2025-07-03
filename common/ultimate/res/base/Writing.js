module.exports = {
  name: `Writing`,
  color: `blue`,
  age: 1,
  expansion: `base`,
  biscuits: `hssc`,
  dogmaBiscuit: `s`,
  dogma: [
    `Draw a {2}.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      game.aDraw(player, { age: game.getEffectAge(self, 2) })
    },
  ],
}
