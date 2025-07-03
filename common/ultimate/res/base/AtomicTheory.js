module.exports = {
  name: `Atomic Theory`,
  color: `blue`,
  age: 6,
  expansion: `base`,
  biscuits: `sssh`,
  dogmaBiscuit: `s`,
  dogma: [
    `You may splay your blue cards right.`,
    `Draw and meld a {7}.`
  ],
  dogmaImpl: [
    (game, player) => {
      game.aChooseAndSplay(player, ['blue'], 'right')
    },

    (game, player, { self }) => {
      game.aDrawAndMeld(player, game.getEffectAge(self, 7))
    },
  ],
}
