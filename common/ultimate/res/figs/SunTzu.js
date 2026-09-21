module.exports = {
  id: `Sun Tzu`,  // Card names are unique in Innovation
  name: `Sun Tzu`,
  color: `red`,
  age: 2,
  expansion: `figs`,
  biscuits: `pkhk`,
  dogmaBiscuit: `k`,
  karma: [
    `You may issue a War Decree with any two figures.`,
    `If you would draw for a share bonus, first meld any number of cards from your hand matching the Dogma action's featured biscuit.`
  ],
  karmaImpl: [
    {
      trigger: 'decree-for-two',
      decree: 'War',
    },
    {
      trigger: 'draw',
      kind: 'would-first',
      matches: (game, player, { share }) => share,
      func: (game, player, { featuredBiscuit }) => {
        const hand = game.cards.byPlayer(player, 'hand')
        game.actions.chooseAndMeld(player, hand, {
          min: 0,
          max: hand.length,
          filter: card => card.checkHasBiscuit(featuredBiscuit),
        })
      }
    },
  ]
}
