module.exports = {
  id: `Napoleon Bonaparte`,  // Card names are unique in Innovation
  name: `Napoleon Bonaparte`,
  color: `red`,
  age: 6,
  expansion: `figs`,
  biscuits: `h6f&`,
  dogmaBiscuit: `f`,
  karma: [
    `You may issue a War Decree with any two figures.`,
    `If you would score or return a card with a {f}, instead tuck it and score a top card of value 6 from anywhere.`
  ],
  karmaImpl: [
    {
      trigger: 'decree-for-two',
      decree: 'War'
    },
    {
      trigger: ['score', 'return'],
      kind: 'would-instead',
      matches: (game, player, { card }) => card.checkHasBiscuit('f'),
      func: (game, player, { card }) => {
        game.actions.tuck(player, card)

        const choices = game
          .cards.topsAll()
          .filter(card => card.getAge() === 6)
        game.actions.chooseAndScore(player, choices)
      }
    }
  ]
}
