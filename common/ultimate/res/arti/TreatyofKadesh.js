module.exports = {
  name: `Treaty of Kadesh`,
  color: `blue`,
  age: 1,
  expansion: `arti`,
  biscuits: `ckhk`,
  dogmaBiscuit: `k`,
  dogma: [
    `I compel you to return all top cards from your board with a demand effect!`,
    `Score a top, non-blue card from your board with a demand effect.`
  ],
  dogmaImpl: [
    (game, player) => {
      const toReturn = game
        .getTopCards(player)
        .filter(card => card.checkHasDemand())
      game.aReturnMany(player, toReturn)
    },

    (game, player) => {
      const choices = game
        .getTopCards(player)
        .filter(card => card.checkHasDemand())
        .filter(card => card.color !== 'blue')
      game.aChooseAndScore(player, choices)
    },
  ],
}
