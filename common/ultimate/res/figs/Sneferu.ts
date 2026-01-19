import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  id: `Sneferu`,  // Card names are unique in Innovation
  name: `Sneferu`,
  color: `yellow`,
  age: 1,
  expansion: `figs`,
  biscuits: `hkkp`,
  dogmaBiscuit: `k`,
  karma: [
    `You may issue an Expansion decree with any two figures.`,
    `If you would meld a card, first draw and tuck a {2}. If the tucked card has no {k}, return it.`,
  ],
  karmaImpl: [
    {
      trigger: 'decree-for-two',
      decree: 'Expansion'
    },
    {
      trigger: 'meld',
      kind: 'would-first',
      matches: () => true,
      func(game, player, { self }) {
        const card = game.actions.drawAndTuck(player, game.getEffectAge(self, 2))
        if (!card.checkHasBiscuit('k')) {
          game.actions.return(player, card)
        }

      }
    }
  ]
} satisfies AgeCardData
