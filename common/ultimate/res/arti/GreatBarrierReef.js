module.exports = {
  name: `Great Barrier Reef`,
  color: `blue`,
  age: 11,
  expansion: `arti`,
  biscuits: `lhls`,
  dogmaBiscuit: `l`,
  dogma: [
    `Junk all cards on your board other than the top five of each color.`,
    `Splay each color on your board aslant.`,
  ],
  dogmaImpl: [
    (game, player) => {
      const toJunk = game.util.colors().flatMap(color => {
        return game.cards.byPlayer(player, color).slice(5)
      })
      game.actions.junkMany(player, toJunk)
    },

    (game, player) => {
      for (const color of game.util.colors()) {
        game.actions.splay(player, color, 'aslant')
      }
    },
  ],
}
