module.exports = {
  name: `The Wealth of Nations`,
  color: `green`,
  age: 6,
  expansion: `arti`,
  biscuits: `cfhc`,
  dogmaBiscuit: `c`,
  dogma: [
    `Draw and score a {1}. Add up the values of all the cards in your score pile, divide by five, and round up. Draw and score a card of value equal to the result.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      game.aDrawAndScore(player, game.getEffectAge(self, 1))

      const totalValue = game
        .getCardsByZone(player, 'score')
        .map(card => card.getAge())
        .reduce((agg, next) => agg + next, 0)

      const age = Math.ceil(totalValue / 5)
      game.aDrawAndScore(player, age)
    }
  ],
}
