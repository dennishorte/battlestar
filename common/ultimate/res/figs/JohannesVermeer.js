module.exports = {
  id: `Johannes Vermeer`,  // Card names are unique in Innovation
  name: `Johannes Vermeer`,
  color: `purple`,
  age: 5,
  expansion: `figs`,
  biscuits: `5hpc`,
  dogmaBiscuit: `c`,
  karma: [
    `If you would claim a standard achievement, first claim an available achievement of value one higher, regardless of eligibility.`,
    `If you would meld a card, first score all cards of a color on your board.`
  ],
  karmaImpl: [
    {
      trigger: 'achieve',
      kind: 'would-first',
      matches: (game, player, { isStandard }) => isStandard,
      func: (game, player, { age }) => {
        const choices = game
          .getAvailableAchievements(player)
          .filter(card => card.getAge() === age + 1)
        game.actions.chooseAndAchieve(player, choices)
      }
    },
    {
      trigger: 'meld',
      kind: 'would-first',
      matches: () => true,
      func: (game, player) => {
        const colors = game.cards.tops(player).map(card => card.color)
        const color = game.actions.chooseColor(player, colors)
        if (color) {
          game.actions.scoreMany(player, game.cards.byPlayer(player, color))
        }
      }
    },
  ]
}
