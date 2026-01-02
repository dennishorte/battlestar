module.exports = {
  id: `Daedalus`,  // Card names are unique in Innovation
  name: `Daedalus`,
  color: `blue`,
  age: 1,
  expansion: `figs`,
  biscuits: `phkk`,
  dogmaBiscuit: `k`,
  karma: [
    `Each unsplayed color on your board adds one to the value of yoru highest top card for the purpose of claiming achievements.`
  ],
  karmaImpl: [
    {
      trigger: 'add-highest-top-age',
      reason: 'achieve',
      func(game, player) {
        return game.zones.colorStacks(player).filter(zone => zone.splay === 'none').length
      },
    },
  ]
}
