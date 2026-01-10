module.exports = {
  id: `Konstantin Novoselov`,  // Card names are unique in Innovation
  name: `Konstantin Novoselov`,
  color: `blue`,
  age: 11,
  expansion: `figs`,
  biscuits: `pihi`,
  dogmaBiscuit: `i`,
  karma: [
    `If you would take a Dogma action as your second action, instead super-execute each of your top cards, if you have one, in red, blue, green, yellow, purple order.`
  ],
  karmaImpl: [
    {
      trigger: 'dogma',
      kind: 'would-instead',
      matches: (game) => game.state.actionNumber === 2,
      func: (game, player, { self }) => {
        const colorOrder = ['red', 'blue', 'green', 'yellow', 'purple']
        for (const color of colorOrder) {
          const topCard = game.cards.top(player, color)
          if (topCard) {
            game.aSuperExecute(self, player, topCard)
          }
        }
      }
    }
  ]
}
