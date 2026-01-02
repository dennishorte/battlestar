module.exports = {
  id: `Amina Sukhera`,  // Card names are unique in Innovation
  name: `Amina Sukhera`,
  color: `red`,
  age: 4,
  expansion: `figs`,
  biscuits: `fpfh`,
  dogmaBiscuit: `f`,
  karma: [
    `If you would dogma a card as your second action, first score a figure from an opponent's hand.`,
    `Each top card with a {k} on your board counts as an available achievement for you.`
  ],
  karmaImpl: [
    {
      trigger: 'dogma',
      kind: 'would-first',
      matches: (game, player) => game.state.actionNumber === 2,
      func: (game, player) => {
        const options = game
          .players
          .opponents(player)
          .flatMap(opponent => game.cards.byPlayer(opponent, 'hand'))
          .filter(card => card.checkIsFigure())
        game.actions.chooseAndScore(player, options)
      },
    },
    {
      trigger: 'list-achievements',
      func(game, player) {
        return game
          .cards.tops(player)
          .filter(card => card.biscuits.includes('k'))
      }
    }
  ]
}
