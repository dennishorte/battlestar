module.exports = {
  id: `Shen Kuo`,  // Card names are unique in Innovation
  name: `Shen Kuo`,
  color: `green`,
  age: 3,
  expansion: `figs`,
  biscuits: `ch*c`,
  dogmaBiscuit: `c`,
  echo: ``,
  karma: [
    `Each splayed color on your board provides three additional points towards your score.`
  ],
  dogma: [],
  dogmaImpl: [],
  echoImpl: [],
  karmaImpl: [
    {
      trigger: 'calculate-score',
      func: (game, player) => {
        return game
          .utilColors()
          .filter(color => game.getZoneByPlayer(player, color).splay !== 'none')
          .length * 3
      }
    }
  ]
}
