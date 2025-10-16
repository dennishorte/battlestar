module.exports = {
  name: `The Wealth of Nations`,
  color: `green`,
  age: 6,
  expansion: `arti`,
  biscuits: `cfhc`,
  dogmaBiscuit: `c`,
  dogma: [
    `Draw and score a {1}. Add up the values of all the cards in your score pile, divide by five, and round up. Draw and score a card of value equal to the result. Junk all cards in the deck of that value.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      game.actions.drawAndScore(player, game.getEffectAge(self, 1))

      const totalValue = game
        .cards.byPlayer(player, 'score')
        .map(card => card.getAge())
        .reduce((agg, next) => agg + next, 0)

      const age = Math.ceil(totalValue / 5)
      game.actions.drawAndScore(player, age)

      game.actions.junkDeck(player, age)
    }
  ],
}
