module.exports = {
  name: `Philips Compact Cassette`,
  color: `green`,
  age: 9,
  expansion: `arti`,
  biscuits: `hlll`,
  dogmaBiscuit: `l`,
  dogma: [
    `I compel you to unsplay all colors on your board!`,
    `Splay up two colors on your board.`
  ],
  dogmaImpl: [
    (game, player) => {
      for (const color of game.utilColors()) {
        game.aUnsplay(player, color)
      }
    },

    (game, player) => {
      game.aChooseAndSplay(player, null, 'up', { count: 2 })
    },
  ],
}
