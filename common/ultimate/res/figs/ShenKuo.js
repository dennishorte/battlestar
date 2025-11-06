module.exports = {
  id: `Shen Kuo`,  // Card names are unique in Innovation
  name: `Shen Kuo`,
  color: `green`,
  age: 3,
  expansion: `figs`,
  biscuits: `ch*c`,
  dogmaBiscuit: `c`,
  karma: [
    `Each splayed color on your board provides three additional points towards your score.`
  ],
  karmaImpl: [
    {
      trigger: 'calculate-score',
      func: (game, player) => {
        return game
          .util.colors()
          .filter(color => game.zones.byPlayer(player, color).splay !== 'none')
          .length * 3
      }
    }
  ]
}
