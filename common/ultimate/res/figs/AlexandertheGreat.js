module.exports = {
  id: `Alexander the Great`,  // Card names are unique in Innovation
  name: `Alexander the Great`,
  color: `red`,
  age: 2,
  expansion: `figs`,
  biscuits: `2phk`,
  dogmaBiscuit: `k`,
  karma: [
    `When you meld this card, score all opponent's top figures.`,
    `If you would take a Dogma action, first draw and score a {2}. If it isn't a {2}, score Alexander the Great.`,
  ],
  karmaImpl: [
    {
      trigger: 'when-meld',
      func(game, player) {
        const topFigures = game
          .players.opponents(player)
          .flatMap(opp => game.cards.tops(opp))
          .filter(card => card.checkIsFigure())

        game.actions.scoreMany(player, topFigures)
      }
    },
    {
      trigger: 'dogma',
      kind: 'would-first',
      matches: () => true,
      func: (game, player, { self }) => {
        const scored = game.actions.drawAndScore(player, game.getEffectAge(self, 2))
        if (scored.getAge() !== game.getEffectAge(self, 2)) {
          game.actions.score(player, self)
        }
      },
    },
  ]
}
