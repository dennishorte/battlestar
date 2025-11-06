module.exports = {
  id: `Emmy Noether`,  // Card names are unique in Innovation
  name: `Emmy Noether`,
  color: `green`,
  age: 8,
  expansion: `figs`,
  biscuits: `*iih`,
  dogmaBiscuit: `i`,
  karma: [
    `Each {i} on your board provides an additional number of points equal to the number of {i} on your board.`
  ],
  karmaImpl: [
    {
      trigger: 'calculate-score',
      func: (game, player) => {
        const biscuits = player.biscuits()
        return biscuits.i * biscuits.i
      }
    }
  ]
}
