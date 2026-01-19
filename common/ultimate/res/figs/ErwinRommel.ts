import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  id: `Erwin Rommel`,  // Card names are unique in Innovation
  name: `Erwin Rommel`,
  color: `red`,
  age: 8,
  expansion: `figs`,
  biscuits: `fhfp`,
  dogmaBiscuit: `f`,
  karma: [
    `You may issue a War Decree with any two figures.`,
    `If you would score a non-figure, instead score the top card of its color from all boards, and score a card in any score pile.`
  ],
  karmaImpl: [
    {
      trigger: 'decree-for-two',
      decree: 'War',
    },
    {
      trigger: 'score',
      kind: 'would-instead',
      matches: (game, player, { card }) => !card.checkIsFigure(),
      func: (game, player, { card }) => {
        const cards = game
          .players
          .all()
          .map(player => game.cards.top(player, card.color))
          .filter(topCard => Boolean(topCard))
        game.actions.scoreMany(player, cards)

        const scorePileCards = game
          .players
          .other(player)
          .flatMap(other => game.cards.byPlayer(other, 'score'))

        game.actions.chooseAndScore(player, scorePileCards)
      }

    }
  ]
} satisfies AgeCardData
