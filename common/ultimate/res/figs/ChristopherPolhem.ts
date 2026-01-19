import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  id: `Christopher Polhem`,  // Card names are unique in Innovation
  name: `Christopher Polhem`,
  color: `yellow`,
  age: 5,
  expansion: `figs`,
  biscuits: `hffp`,
  dogmaBiscuit: `f`,
  karma: [
    `You may issue an Expansion Decree with any two figures.`,
    `Each {f} on your board provides one additional points towards your score for each achievement you have.`
  ],
  karmaImpl: [
    {
      trigger: 'decree-for-two',
      decree: 'Expansion',
    },
    {
      trigger: 'calculate-score',
      func: (game, player) => {
        const factoryCount = player.biscuits().f
        const achievementCount = game.cards.byPlayer(player, 'achievements').length
        return factoryCount * achievementCount
      }

    },
  ]
} satisfies AgeCardData
