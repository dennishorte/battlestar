import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  id: `Huang Di`,  // Card names are unique in Innovation
  name: `Huang Di`,
  color: `blue`,
  age: 1,
  expansion: `figs`,
  biscuits: `ssph`,
  dogmaBiscuit: `s`,
  karma: [
    `You may issue an advancement decree with any two figures.`,
    `If you would dogma a card using {l} as a featured icon, first draw a {2}`,
  ],
  karmaImpl: [
    {
      trigger: 'decree-for-two',
      decree: 'Advancement',
    },
    {
      trigger: 'dogma',
      matches: (game) => {
        return game.state.dogmaInfo.featuredBiscuit === 'l'
      },
      func: (game, player, { self }) => {
        game.actions.draw(player, { age: game.getEffectAge(self, 2) })
      }

    }
  ]
} satisfies AgeCardData
