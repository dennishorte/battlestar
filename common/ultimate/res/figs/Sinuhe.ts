export default {
  id: `Sinuhe`,  // Card names are unique in Innovation
  name: `Sinuhe`,
  color: `purple`,
  age: 1,
  expansion: `figs`,
  biscuits: `pllh`,
  dogmaBiscuit: `l`,
  karma: [
    `You may issue a Rivaly Decree with any two figures.`,
    `Each {k} on your board provides one additional point towards your score.`
  ],
  karmaImpl: [
    {
      trigger: 'decree-for-two',
      decree: 'Rivalry',
    },
    {
      trigger: 'calculate-score',
      func(game, player) {
        const biscuits = player.biscuits()
        return biscuits.k
      }
    }
  ]
}
