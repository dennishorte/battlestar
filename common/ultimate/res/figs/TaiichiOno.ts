import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  id: `Taiichi Ono`,  // Card names are unique in Innovation
  name: `Taiichi Ono`,
  color: `green`,
  age: 9,
  expansion: `figs`,
  biscuits: `hiip`,
  dogmaBiscuit: `i`,
  karma: [
    `If you would dogma a card, first you may achieve a card from your hand with featured biscuit matching that card's featured biscuit, regardless of eligibility. If you don't, draw an {e}.`
  ],
  karmaImpl: [
    {
      trigger: 'dogma',
      kind: 'would-first',
      matches: () => true,
      func: (game, player, { card, self }) => {
        const choices = game
          .cards
          .byPlayer(player, 'hand')
          .filter(other => other.dogmaBiscuit === card.dogmaBiscuit)
        const achieved = game.actions.chooseAndAchieve(player, choices, { min: 0 })[0]

        if (!achieved) {
          game.actions.draw(player, { age: game.getEffectAge(self, 11) })
        }

      }
    }
  ]
} satisfies AgeCardData
