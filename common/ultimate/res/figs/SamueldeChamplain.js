module.exports = {
  id: `Samuel de Champlain`,  // Card names are unique in Innovation
  name: `Samuel de Champlain`,
  color: `green`,
  age: 5,
  expansion: `figs`,
  biscuits: `c5hp`,
  dogmaBiscuit: `c`,
  karma: [
    `If you would draw a fifth card into your hand, first claim an achievement of that card's value or below, regardless of eligibility.`,
    `If you would draw a first card into your hand, first draw a {6}.`
  ],
  karmaImpl: [
    {
      trigger: 'draw',
      kind: 'would-first',
      matches: (game, player) => game.cards.byPlayer(player, 'hand').length === 4,
      func: (game, player, { age }) => {
        const choices = player
          .availableAchievements()
          .filter(ach => ach.getAge() <= age)
        game.actions.chooseAndAchieve(player, choices, { nonAction: true })
      }
    },
    {
      trigger: 'draw',
      kind: 'would-first',
      matches: (game, player) => game.cards.byPlayer(player, 'hand').length === 0,
      func: (game, player, { self }) => {
        game.actions.draw(player, { age: game.getEffectAge(self, 6) })
      },
    },
  ]
}
