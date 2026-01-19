import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  id: `Edward Jenner`,  // Card names are unique in Innovation
  name: `Edward Jenner`,
  color: `yellow`,
  age: 6,
  expansion: `figs`,
  biscuits: `pllh`,
  dogmaBiscuit: `l`,
  karma: [
    `If a player would execute a demand effect against you, instead return a card from your hand.`,
    `If a player would score a card, first junk an available achievement of the same value.`
  ],
  karmaImpl: [
    {
      trigger: 'demand-success',
      triggerAll: true,
      kind: 'would-instead',
      matches: (game, player, { owner }) => {
        return player.id === owner.id
      },
      func: (game, player) => {
        game.actions.chooseAndReturn(player, game.cards.byPlayer(player, 'hand'))
      }

    },
    {
      trigger: 'score',
      triggerAll: true,
      kind: 'would-first',
      matches: () => true,
      func: (game, player, { card }) => {
        game.actions.junkAvailableAchievement(player, card.getAge())
      },
    },
  ]
} satisfies AgeCardData
