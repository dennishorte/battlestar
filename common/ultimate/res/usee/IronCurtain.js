module.exports = {
  name: `Iron Curtain`,
  color: `red`,
  age: 9,
  expansion: `usee`,
  biscuits: `hlil`,
  dogmaBiscuit: `l`,
  dogma: [
    `Unsplay each splayed color on your board. For each color you unsplay, return your top card of that color and safeguard an available standard achievement.`
  ],
  dogmaImpl: [
    (game, player) => {
      const splays = ['yellow', 'red', 'purple', 'green', 'blue']
        .filter(color => game.zones.byPlayer(player, color).splay !== 'none')

      const unsplayed = []
      for (const color of splays) {
        unsplayed.push(game.actions.unsplay(player, color))
      }

      const toReturn = unsplayed
        .filter(color => color)
        .map(color => game.cards.top(player, color))

      game.actions.returnMany(player, toReturn)
      game.actions.chooseAndSafeguard(player, game.getAvailableStandardAchievements(player), {
        count: toReturn.length,
        hidden: true
      })
    },
  ],
}
