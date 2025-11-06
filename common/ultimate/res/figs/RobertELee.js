module.exports = {
  id: `Robert E. Lee`,  // Card names are unique in Innovation
  name: `Robert E. Lee`,
  color: `red`,
  age: 7,
  expansion: `figs`,
  biscuits: `&hll`,
  dogmaBiscuit: `l`,
  karma: [
    `You may issue a War Decree with any two figures.`,
    `Each seven {l} on your board counts as an achievement.`
  ],
  karmaImpl: [
    {
      trigger: 'decree-for-two',
      decree: 'War',
    },
    {
      trigger: 'extra-achievements',
      func: (game, player) => {
        const leafBiscuits = player.biscuits().l
        return Math.floor(leafBiscuits / 7)
      }
    }
  ]
}
