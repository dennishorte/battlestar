import util from '../../../lib/util.js'
import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  id: `Marie Curie`,  // Card names are unique in Innovation
  name: `Marie Curie`,
  color: `blue`,
  age: 8,
  expansion: `figs`,
  biscuits: `f&hf`,
  dogmaBiscuit: `f`,
  karma: [
    `Each different value present in your score pile above 6 counts as an achievement.`,
    `If you would draw a card of a value not present in your hand, first draw a {9}.`
  ],
  karmaImpl: [
    {
      trigger: 'extra-achievements',
      func: (game, player) => {
        const ages = game
          .cards
          .byPlayer(player, 'score')
          .filter(card => card.getAge() > 6)
          .map(card => card.getAge())
        return util.array.distinct(ages).length
      }

    },
    {
      trigger: 'draw',
      kind: 'would-first',
      matches: (game, player, { age }) => {
        const handAges = game.cards.byPlayer(player, 'hand').map(handCard => handCard.getAge())
        return !handAges.includes(age)
      },
      func: (game, player, { self }) => {
        game.actions.draw(player, { age: game.getEffectAge(self, 9) })
      },
    },
  ]
} satisfies AgeCardData
