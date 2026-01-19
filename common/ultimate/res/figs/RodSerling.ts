import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  id: `Rod Serling`,  // Card names are unique in Innovation
  name: `Rod Serling`,
  color: `purple`,
  age: 9,
  expansion: `figs`,
  biscuits: `chp9`,
  dogmaBiscuit: `c`,
  karma: [
    `If a player would transfer, return, draw, score, meld, tuck, or junk a card of value less than 4, instead that player loses.`
  ],
  karmaImpl: [
    {
      trigger: ['transfer', 'return', 'draw', 'score', 'meld', 'tuck', 'junk'],
      triggerAll: true,
      kind: 'would-instead',
      matches: (game, player, { age, card }) => {
        if (age && age < 4) {
          return true
        }

        if (card && card.getAge() < 4) {
          return true
        }
        return false
      },
      func: (game, player, { self }) => {
        game.aYouLose(player, self)
      }
    }
  ]
} satisfies AgeCardData
