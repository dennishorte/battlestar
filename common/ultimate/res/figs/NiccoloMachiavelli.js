module.exports = {
  id: `Niccolo Machiavelli`,  // Card names are unique in Innovation
  name: `Niccolo Machiavelli`,
  color: `purple`,
  age: 4,
  expansion: `figs`,
  biscuits: `pssh`,
  dogmaBiscuit: `s`,
  karma: [
    `Each color splayed right only on your board counts as an achievement for you.`,
    `If you would splay a color on your board, first unsplay that color on all opponent's boards.`,
  ],
  karmaImpl: [
    {
      trigger: 'extra-achievements',
      func: (game, player) => {
        const achievements = game
          .util
          .colors()
          .filter(color => {
            if (game.zones.byPlayer(player, color).splay !== 'right') {
              return false
            }
            else {
              return !game.players.other(player).some(other => {
                return game.zones.byPlayer(other, color).splay === 'right'
              })
            }
          })
          .length

        return achievements
      }
    },
    {
      trigger: 'splay',
      kind: 'would-first',
      matches: () => true,
      func: (game, player, { color }) => {
        for (const opponent of game.players.opponents(player)) {
          game.actions.unsplay(player, game.zones.byPlayer(opponent, color))
        }
      }
    },
  ]
}
