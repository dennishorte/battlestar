module.exports = {
  id: `Erwin Rommel`,  // Card names are unique in Innovation
  name: `Erwin Rommel`,
  color: `red`,
  age: 8,
  expansion: `figs`,
  biscuits: `fhf&`,
  dogmaBiscuit: `f`,
  karma: [
    `You may issue a War Decree with any two figures.`,
    `If you would score a card, instead score the top card of its color from all boards.`
  ],
  karmaImpl: [
    {
      trigger: 'decree-for-two',
      decree: 'War',
    },
    {
      trigger: 'score',
      kind: 'would-instead',
      matches: () => true,
      func: (game, player, { card }) => {
        const cards = game
          .players.all()
          .flatMap(player => game.cards.tops(player))
          .filter(other => other.color === card.color)
        game.actions.scoreMany(player, cards)
      }
    }
  ]
}
