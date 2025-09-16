module.exports = {
  id: `Gilgamesh`,  // Card names are unique in Innovation
  name: `Gilgamesh`,
  color: `red`,
  age: 1,
  expansion: `figs`,
  biscuits: `*h1k`,
  dogmaBiscuit: `k`,
  echo: ``,
  karma: [
    `Each bonus on your board provides one additional {k} for every top card on your board.`
  ],
  dogma: [],
  dogmaImpl: [],
  echoImpl: [],
  karmaImpl: [
    {
      trigger: 'calculate-biscuits',
      func: (game, player) => {
        const bonuses = game.getBonuses(player)
        const topCards = game.getTopCards(player)
        const biscuits = game.utilEmptyBiscuits()
        biscuits.k = bonuses.length * topCards.length
        return biscuits
      }
    }
  ]
}
