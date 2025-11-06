module.exports = {
  id: `Che Guevara`,  // Card names are unique in Innovation
  name: `Che Guevara`,
  color: `yellow`,
  age: 9,
  expansion: `figs`,
  biscuits: `hl&l`,
  dogmaBiscuit: `l`,
  karma: [
    `When you meld this card, score all opponents' top figures.`,
    `If you would score a green card, instead remove it and all cards in all score piles from the game.`
  ],
  karmaImpl: [
    {
      trigger: 'when-meld',
      func: (game, player) => {
        const cards = game
          .players.opponents(player)
          .flatMap(opp => game.cards.tops(opp))
          .filter(card => card.checkIsFigure())
        game.actions.scoreMany(player, cards)
      }
    },

    {
      trigger: 'score',
      kind: 'would-instead',
      matches: (game, player, { card }) => card.color === 'green',
      func: (game, player, { card }) => {
        const cards = game
          .players.all()
          .flatMap(player => game.cards.byPlayer(player, 'score'))
        cards.push(card)
        game.aRemoveMany(player, cards)
      }
    }
  ]
}
