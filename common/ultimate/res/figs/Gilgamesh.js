module.exports = {
  id: `Gilgamesh`,  // Card names are unique in Innovation
  name: `Gilgamesh`,
  color: `red`,
  age: 1,
  expansion: `figs`,
  biscuits: `*h1k`,
  dogmaBiscuit: `k`,
  karma: [
    `Each bonus on your board provides one additional {k} for every top card on your board.`
  ],
  karmaImpl: [
    {
      trigger: 'calculate-biscuits',
      func: (game, player) => {
        const bonuses = game.getBonuses(player)
        const topCards = game.cards.tops(player)
        const biscuits = game.utilEmptyBiscuits()
        biscuits.k = bonuses.length * topCards.length
        return biscuits
      }
    }
  ]
}
