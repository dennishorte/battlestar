export default {
  name: `Treaty of Kadesh`,
  color: `blue`,
  age: 1,
  expansion: `arti`,
  biscuits: `ckhk`,
  dogmaBiscuit: `k`,
  dogma: [
    `I compel you to return a top card with a demand effect of each color on your board!`,
    `Score a top, non-blue card with a demand effect from your board.`
  ],
  dogmaImpl: [
    (game, player) => {
      const toReturn = game
        .cards
        .tops(player)
        .filter(card => card.checkHasDemand())
      game.actions.returnMany(player, toReturn)
    },

    (game, player) => {
      const choices = game
        .cards
        .tops(player)
        .filter(card => card.checkHasDemand())
        .filter(card => card.color !== 'blue')
      game.actions.chooseAndScore(player, choices)
    },
  ],
}
