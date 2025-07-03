module.exports = {
  name: `The Internet`,
  color: `purple`,
  age: 10,
  expansion: `base`,
  biscuits: `hipp`,
  dogmaBiscuit: `p`,
  dogma: [
    `You may splay your green cards up.`,
    `Draw and score a {0}.`,
    `Draw and meld 2 {0}.`
  ],
  dogmaImpl: [
    (game, player) => {
      game.aChooseAndSplay(player, ['green'], 'up')
    },

    (game, player, { self }) => {
      game.aDrawAndScore(player, game.getEffectAge(self, 10))
    },

    (game, player, { self }) => {
      game.aDrawAndMeld(player, game.getEffectAge(self, 10))
      game.aDrawAndMeld(player, game.getEffectAge(self, 10))
    },
  ],
}
