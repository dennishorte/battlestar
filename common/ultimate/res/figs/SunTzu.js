module.exports = {
  id: `Sun Tzu`,  // Card names are unique in Innovation
  name: `Sun Tzu`,
  color: `red`,
  age: 2,
  expansion: `figs`,
  biscuits: `*khk`,
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
        const choices = game
          .cards.byPlayer(player, 'hand')
          .filter(card => card.checkHasBiscuit(featuredBiscuit))
        game.actions.chooseAndMeld(player, choices, { min: 0, max: choices.length })
      }
    },
  ]
}
