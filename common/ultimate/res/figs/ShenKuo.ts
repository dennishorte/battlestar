import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  id: `Shen Kuo`,  // Card names are unique in Innovation
  name: `Shen Kuo`,
  color: `green`,
  age: 3,
  expansion: `figs`,
  biscuits: `chpc`,
  dogmaBiscuit: `c`,
  karma: [
    `If you would score a non-figure, instead splay that card's color right.`,
    `If you would splay a color left, instead splay that color right.`,
    `Each visible card on your board provides an additional point towards your score.`
  ],
  karmaImpl: [
    {
      trigger: 'score',
      kind: 'would-instead',
      matches: (game, player, { card }) => !card.checkIsFigure(),
      func: (game, player, { card }) => game.actions.splay(player, card.color, 'right')
    },
    {
      trigger: 'splay',
      kind: 'would-instead',
      matches: (game, player, { direction }) => direction === 'left',
      func: (game, player, { color }) => game.actions.splay(player, color, 'right')
    },
    {
      trigger: 'calculate-score',
      func: (game, player) => {
        return game
          .util
          .colors()
          .map(color => game.zones.byPlayer(player, color))
          .map(zone => {
            if (zone.splay === 'none') {
              return zone.cardlist().length > 0 ? 1 : 0
            }

            else {
              return zone.cardlist().length
            }
          })
          .reduce((count, acc) => count + acc, 0)
      }
    }
  ]
} satisfies AgeCardData
