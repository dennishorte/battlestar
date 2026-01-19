import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  id: `Pedro Alvarez Cabral`,  // Card names are unique in Innovation
  name: `Pedro Alvarez Cabral`,
  color: `green`,
  age: 4,
  expansion: `figs`,
  biscuits: `4lhp`,
  dogmaBiscuit: `l`,
  karma: [
    `You may issue a Trade Decree with any two figures.`,
    `If you would dogma a {1}, instead claim the World achievement. If you can't, and Monotheism is a top card on your board, you win.`
  ],
  karmaImpl: [
    {
      trigger: 'decree-for-two',
      decree: 'Trade',
    },
    {
      trigger: 'dogma',
      kind: 'would-instead',
      matches: (game, player, { card, self }) => card.getAge() === game.getEffectAge(self, 1),
      func: (game, player, { self }) => {
        const claimed = game.actions.claimAchievement(player, { name: 'World' })
        if (!claimed) {
          const tops = game.cards.tops(player).filter(card => card.name === 'Monotheism')
          if (tops.length > 0) {
            game.youWin(player, self.name)
          }

        }
      }
    }
  ]
} satisfies AgeCardData
