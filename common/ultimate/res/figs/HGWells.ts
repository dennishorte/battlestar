import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  id: `H.G. Wells`,  // Card names are unique in Innovation
  name: `H.G. Wells`,
  color: `purple`,
  age: 8,
  expansion: `figs`,
  biscuits: `lphl`,
  dogmaBiscuit: `l`,
  karma: [
    `If you would dogma a card using {s} as a featured icon, instead draw and junk a {0}, then super-execute the junked card.`
  ],
  karmaImpl: [
    {
      trigger: 'dogma',
      kind: 'would-instead',
      matches: (game) => game.state.dogmaInfo.featuredBiscuit === 's',
      func: (game, player, { self }) => {
        const junkedCard = game.actions.drawAndJunk(player, game.getEffectAge(self, 10))
        game.aSuperExecute(self, player, junkedCard)
      }

    }
  ]
} satisfies AgeCardData
