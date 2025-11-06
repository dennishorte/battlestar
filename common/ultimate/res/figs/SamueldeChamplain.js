module.exports = {
  id: `Samuel de Champlain`,  // Card names are unique in Innovation
  name: `Samuel de Champlain`,
  color: `green`,
  age: 5,
  expansion: `figs`,
  biscuits: `c5h*`,
  dogmaBiscuit: `c`,
  karma: [
    `If you would draw a fifth card into your hand, first claim an achievement of that card's value or below, regardless of eligibility.`
  ],
  karmaImpl: [
    {
      trigger: 'draw',
      kind: 'would-first',
      matches: (game, player) => game.cards.byPlayer(player, 'hand').length === 4,
      func: (game, player, { age }) => {
        const choices = game
          .getAvailableAchievements(player)
          .filter(ach => ach.getAge() <= age)
        game.actions.chooseAndAchieve(player, choices, { nonAction: true })
      }
    }
  ]
}
