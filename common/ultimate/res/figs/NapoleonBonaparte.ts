import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  id: `Napoleon Bonaparte`,  // Card names are unique in Innovation
  name: `Napoleon Bonaparte`,
  color: `red`,
  age: 6,
  expansion: `figs`,
  biscuits: `h6fp`,
  dogmaBiscuit: `f`,
  karma: [
    `You may issue a War Decree with any two figures.`,
    `If you would meld, tuck, score, or return a card, instead meld it, then if the melded card is red or blue, tuck it. Score a top card of value 5 or 6 from anywhere.`
  ],
  karmaImpl: [
    {
      trigger: 'decree-for-two',
      decree: 'War'
    },
    {
      trigger: ['meld', 'tuck', 'score', 'return'],
      kind: 'would-instead',
      matches: () => true,
      func: (game, player, { card }) => {
        game.actions.meld(player, card)
        if (card.color === 'red' || card.color === 'blue') {
          game.actions.tuck(player, card)
        }

        const mayScore = game
          .cards
          .topsAll()
          .filter(card => card.getAge() === 5 || card.getAge() === 6)
        game.actions.chooseAndScore(player, mayScore)
      }
    }
  ]
} satisfies AgeCardData
