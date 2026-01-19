import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  id: `Yi Sun-Sin`,  // Card names are unique in Innovation
  name: `Yi Sun-Sin`,
  color: `red`,
  age: 4,
  expansion: `figs`,
  biscuits: `4hfp`,
  dogmaBiscuit: `f`,
  karma: [
    `If any player would transfer a card or exchange any number of cards, instead tuck that card or those cards, draw and tuck a {4}, and score a top card with a {k} from anywhere.`
  ],
  karmaImpl: [
    {
      trigger: ['transfer', 'exchange'],
      triggerAll: true,
      kind: 'would-instead',
      matches: () => true,
      func: (game, player, { card, cards1, cards2, owner, self, trigger }) => {
        const toTuck = trigger === 'transfer'
          ? [card]
          : [...cards1, ...cards2]

        game.actions.tuckMany(owner, toTuck)
        game.actions.drawAndTuck(owner, game.getEffectAge(self, 4))

        const topCastles = game
          .cards
          .topsAll()
          .filter(card => card.checkHasBiscuit('k'))

        game.actions.chooseAndScore(owner, topCastles)
      }

    }
  ]
} satisfies AgeCardData
