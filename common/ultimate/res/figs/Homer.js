module.exports = {
  id: `Homer`,  // Card names are unique in Innovation
  name: `Homer`,
  color: `purple`,
  age: 1,
  expansion: `figs`,
  biscuits: `hp2k`,
  dogmaBiscuit: `k`,
  karma: [
    `If you would dogma a card of a color, first draw and tuck a {2}, then return your top card of the drawn card's color if it is different.`,
    `If you would junk or return a figure from your hand, instead tuck it.`
  ],
  karmaImpl: [
    {
      trigger: 'dogma',
      kind: 'would-first',
      matches: () => true,
      func(game, player, { card, self }) {
        const tucked = game.actions.drawAndTuck(player, game.getEffectAge(self, 2))
        if (tucked.color !== card.color) {
          const toReturn = game.cards.top(player, tucked.color)
          game.actions.return(player, toReturn)
        }
      }
    },
    {
      trigger: ['junk', 'return'],
      kind: 'would-instead',
      matches(game, player, { card }) {
        return card.checkIsFigure() && card.zone.isHandZone()
      },
      func(game, player, { card }) {
        return game.actions.tuck(player, card)
      }
    }
  ]
}
