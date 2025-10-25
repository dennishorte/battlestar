module.exports = {
  name: `Philips Compact Cassette`,
  color: `green`,
  age: 9,
  expansion: `arti`,
  biscuits: `hlll`,
  dogmaBiscuit: `l`,
  dogma: [
    `I compel you to unsplay all splayed colors on your board!`,
    `Splay up two colors on your board.`
  ],
  dogmaImpl: [
    (game, player) => {
      for (const color of game.util.colors()) {
        game.actions.unsplay(player, color)
      }
    },

    (game, player) => {
      game.actions.chooseAndSplay(player, null, 'up', { count: 2 })
    },
  ],
}
