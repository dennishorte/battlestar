module.exports = {
  id: `J.P. Morgan`,  // Card names are unique in Innovation
  name: `J.P. Morgan`,
  color: `green`,
  age: 8,
  expansion: `figs`,
  biscuits: `c&hc`,
  dogmaBiscuit: `c`,
  karma: [
    `You may issue a Trade Decree with any two figures.`,
    `Each biscuit in each color you have splayed up provides an additional biscuit of the same type.`
  ],
  karmaImpl: [
    {
      trigger: 'decree-for-two',
      decree: 'Trade'
    },
    {
      trigger: 'calculate-biscuits',
      func: (game, player) => {
        let output = game.utilEmptyBiscuits()
        for (const color of game.util.colors()) {
          const zone = game.zones.byPlayer(player, color)
          if (zone.splay === 'up') {
            const biscuits = zone.biscuits()
            output = game.utilCombineBiscuits(output, biscuits)
          }
        }
        return output
      }
    }
  ]
}
