module.exports = {
  id: `Confucius`,  // Card names are unique in Innovation
  name: `Confucius`,
  color: `purple`,
  age: 2,
  expansion: `figs`,
  biscuits: `hl&3`,
  dogmaBiscuit: `l`,
  echo: `Score an opponent's top figure of value 1.`,
  karma: [
    `If you would take a Dogma action and activate a card with a {k} as a featured icon, instead choose any other icon on your board as the featured icon.`
  ],
  dogma: [],
  dogmaImpl: [],
  echoImpl: (game, player) => {
    const choices = game
      .players.opponents(player)
      .flatMap(opp => game.cards.tops(opp))
      .filter(card => card.checkIsFigure())
      .filter(card => card.getAge() === 1)
    game.actions.chooseAndScore(player, choices)
  },
  karmaImpl: [
    {
      trigger: 'featured-biscuit',
      matches: (game, player, { biscuit }) => biscuit === 'k',
      func: (game, player) => {
        const biscuits = game.getBiscuitsByPlayer(player)
        const choices = Object
          .entries(biscuits)
          .filter(([biscuit, count]) => count > 0)
          .map(([biscuit, count]) => biscuit)
          .filter(biscuit => biscuit !== 'k')

        const biscuit = game.requestInputSingle({
          actor: player.name,
          title: 'Choose a Biscuit',
          choices,
        })[0]

        return biscuit
      }
    }
  ]
}
