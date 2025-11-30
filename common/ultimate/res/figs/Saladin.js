module.exports = {
  id: `Saladin`,  // Card names are unique in Innovation
  name: `Saladin`,
  color: `red`,
  age: 3,
  expansion: `figs`,
  biscuits: `3hpk`,
  dogmaBiscuit: `k`,
  karma: [
    `You may issue a War Decree with any two figures.`,
    `If you would dogma a card with a demand effect, instead score a top card with {k} of each color on each opponent's board.`,
  ],
  karmaImpl: [
    {
      trigger: 'decree-for-two',
      decree: 'War',
    },
    {
      trigger: 'dogma',
      kind: 'would-instead',
      matches: (game, player, { card }) => card.checkHasBiscuit('k'),
      func: (game, player) => {
        const toScore = game
          .players
          .opponents(player)
          .flatMap(opponent => game.cards.tops(opponent))
          .filter(card => card.checkHasBiscuit('k'))
        game.actions.scoreMany(player, toScore)
      }
    }
  ]
}
