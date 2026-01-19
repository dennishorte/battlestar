import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  id: `Nikola Tesla`,  // Card names are unique in Innovation
  name: `Nikola Tesla`,
  color: `yellow`,
  age: 8,
  expansion: `figs`,
  biscuits: `8psh`,
  dogmaBiscuit: `s`,
  karma: [
    `You may issue an Expansion Decree with any two figures.`,
    `If you would meld a card, first score an opponent's top card with neither {s} nor {i}. If no card in your score pile has a higher value than the scored card, draw a {9}.`
  ],
  karmaImpl: [
    {
      trigger: 'decree-for-two',
      decree: 'Expansion',
    },
    {
      trigger: 'meld',
      kind: 'would-first',
      matches: () => true,
      func: (game, player, { self }) => {
        const choices = game
          .players
          .opponents(player)
          .flatMap(opp => game.cards.tops(opp))
          .filter(card => !card.checkHasBiscuit('s') && !card.checkHasBiscuit('i'))
        const scoredCards = game.actions.chooseAndScore(player, choices)

        if (scoredCards && scoredCards.length > 0) {
          const scoredCard = scoredCards[0]
          const scoreAges = game.cards.byPlayer(player, 'score').map(card => card.getAge())
          const highestAge = scoreAges.reduce((max, age) => age > max ? age : max, 0)
          if (highestAge <= scoredCard.getAge()) {
            game.actions.draw(player, { age: game.getEffectAge(self, 9) })
          }

        }
      }
    }
  ]
} satisfies AgeCardData
