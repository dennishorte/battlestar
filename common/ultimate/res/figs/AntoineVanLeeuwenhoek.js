module.exports = {
  id: `Antoine Van Leeuwenhoek`,  // Card names are unique in Innovation
  name: `Antoine Van Leeuwenhoek`,
  color: `yellow`,
  age: 5,
  expansion: `figs`,
  biscuits: `&shs`,
  dogmaBiscuit: `s`,
  karma: [
    `Each card in hand counts as ten points towards the cost of claiming an achievement of that card's value.`
  ],
  karmaImpl: [
    {
      trigger: 'achievement-cost-discount',
      func(game, player, { card }) {
        return game
          .cards.byPlayer(player, 'hand')
          .filter(other => other.getAge() === card.getAge())
          .length * 10
      }
    }
  ]
}
