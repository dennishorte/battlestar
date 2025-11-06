module.exports = {
  id: `John Von Neumann`,  // Card names are unique in Innovation
  name: `John Von Neumann`,
  color: `red`,
  age: 8,
  expansion: `figs`,
  biscuits: `hii&`,
  dogmaBiscuit: `i`,
  karma: [
    `When you meld this card, return all opponents' top figures.`,
    `Each card in your hand provides two additional {i}.`
  ],
  karmaImpl: [
    {
      trigger: 'when-meld',
      func: (game, player) => {
        const figures = game
          .players.opponents(player)
          .flatMap(player => game.cards.tops(player))
          .filter(card => card.checkIsFigure())
        game.actions.returnMany(player, figures)
      }
    },
    {
      trigger: 'calculate-biscuits',
      func: (game, player) => {
        const output = game.utilEmptyBiscuits()
        output.i = game.cards.byPlayer(player, 'hand').length * 2
        return output
      }
    }
  ]
}
