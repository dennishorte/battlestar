import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  id: `Shennong`,  // Card names are unique in Innovation
  name: `Shennong`,
  color: `yellow`,
  age: 1,
  expansion: `figs`,
  biscuits: `llhp`,
  dogmaBiscuit: `l`,
  karma: [
    `If you would draw a {1} during your first action, first draw an score a card of value equal to the number of {1} in your hand.`
  ],
  karmaImpl: [
    {
      trigger: 'draw',
      kind: 'would-first',
      matches: (game, player, { age, self }) => {
        return game.state.actionNumber === 1 && age === game.getEffectAge(self, 1)
      },
      func(game, player, { self }) {
        const effectAge = game.getEffectAge(self, 1)
        const count = game
          .cards
          .byPlayer(player, 'hand')
          .filter(card => card.getAge() === effectAge)
          .length
        game.actions.drawAndScore(player, count)
      },
    }

  ]
} satisfies AgeCardData
