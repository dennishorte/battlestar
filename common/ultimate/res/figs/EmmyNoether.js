module.exports = {
  id: `Emmy Noether`,  // Card names are unique in Innovation
  name: `Emmy Noether`,
  color: `green`,
  age: 8,
  expansion: `figs`,
  biscuits: `*iih`,
  dogmaBiscuit: `i`,
  echo: ``,
  karma: [
    `Each {i} on your board provides an additional number of points equal to the number of {i} on your board.`
  ],
  dogma: [],
  dogmaImpl: [],
  echoImpl: [],
  karmaImpl: [
    {
      trigger: 'calculate-score',
      func: (game, player) => {
        const biscuits = game.getBiscuitsByPlayer(player)
        return biscuits.i * biscuits.i
      }
    }
  ]
}
