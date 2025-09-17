module.exports = {
  id: `Alexander the Great`,  // Card names are unique in Innovation
  name: `Alexander the Great`,
  color: `red`,
  age: 2,
  expansion: `figs`,
  biscuits: `2*hk`,
  dogmaBiscuit: `k`,
  echo: ``,
  karma: [
    `When you meld this card, score all opponent's top figures of value 1 or 2.`,
    `If you would take a Dogma action, instead of using the featured icon use each player's current score.`
  ],
  dogma: [],
  dogmaImpl: [],
  echoImpl: [],
  karmaImpl: [
    {
      trigger: 'when-meld',
      func(game, player) {
        const topFigures = game
          .players.opponents(player)
          .flatMap(opp => game.cards.tops(opp))
          .filter(card => card.checkIsFigure())
          .filter(card => card.getAge() === 1 || card.getAge() === 2)

        game.actions.scoreMany(player, topFigures)
      }
    },
    {
      trigger: 'featured-biscuit',
      matches: () => true,
      func: () => 'score'
    },
  ]
}
