module.exports = {
  id: `Benjamin Franklin`,  // Card names are unique in Innovation
  name: `Benjamin Franklin`,
  color: `blue`,
  age: 6,
  expansion: `figs`,
  biscuits: `sph6`,
  dogmaBiscuit: `s`,
  karma: [
    `You may issue an Advancement Decree with any two figures.`,
    `If you would meld a card, first if there is a top figure of the same color on any opponent's board, transfer that figure to your hand.`
  ],
  karmaImpl: [
    {
      trigger: 'decree-for-two',
      decree: 'Advancement',
    },
    {
      trigger: 'meld',
      kind: 'would-first',
      matches: () => true,
      func(game, player, { card }) {
        const mayTransfer = game
          .players
          .opponents(player)
          .flatMap(opponent => game.cards.tops(opponent))
          .filter(card => card.checkIsFigure())
          .filter(topCard => card.color === topCard.color)
        game.actions.chooseAndTransfer(player, mayTransfer, game.zones.byPlayer(player, 'hand'))
      }
    }
  ]
}
