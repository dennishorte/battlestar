module.exports = {
  id: `Antoine Van Leeuwenhoek`,  // Card names are unique in Innovation
  name: `Antoine Van Leeuwenhoek`,
  color: `yellow`,
  age: 5,
  expansion: `figs`,
  biscuits: `&shs`,
  dogmaBiscuit: `s`,
  echo: `Draw a {6}.`,
  karma: [
    `Each card in hand counts as ten points towards the cost of claiming an achievement of that card's value.`
  ],
  dogma: [],
  dogmaImpl: [],
  echoImpl: (game, player) => {
    game.actions.draw(player, { age: 6 })
  },
  karmaImpl: [
    {
      trigger: 'achievement-cost-discount',
      func(game, player, { card }) {
        return game
          .getCardsByZone(player, 'hand')
          .filter(other => other.getAge() === card.getAge())
          .length * 10
      }
    }
  ]
}
