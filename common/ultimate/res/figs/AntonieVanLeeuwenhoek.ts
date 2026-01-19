import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  id: `Antonie Van Leeuwenhoek`,  // Card names are unique in Innovation
  name: `Antonie Van Leeuwenhoek`,
  color: `yellow`,
  age: 5,
  expansion: `figs`,
  biscuits: `pshs`,
  dogmaBiscuit: `s`,
  karma: [
    `Each card in hand counts as ten points towards the cost of claiming an achievement of that card's value.`,
    `If you would draw a card, first you may return a {5} from your hand. If you do, draw a {6}.`
  ],
  karmaImpl: [
    {
      trigger: 'achievement-cost-discount',
      func(game, player, { card }) {
        return game
          .cards
          .byPlayer(player, 'hand')
          .filter(other => other.getAge() === card.getAge())
          .length * 10
      }

    },
    {
      trigger: 'draw',
      kind: 'would-first',
      matches: (game, player, { self }) => {
        return game
          .cards
          .byPlayer(player, 'hand')
          .some(card => card.getAge() === game.getEffectAge(self, 5))
      },
      func: (game, player, { self }) => {
        const options = game
          .cards
          .byPlayer(player, 'hand')
          .filter(card => card.getAge() === game.getEffectAge(self, 5))
        const card = game.actions.chooseCard(player, options, { min: 0 })
        if (card) {
          game.actions.return(player, card)
          game.actions.draw(player, { age: game.getEffectAge(self, 6) })
        }
      }
    }
  ]
} satisfies AgeCardData
