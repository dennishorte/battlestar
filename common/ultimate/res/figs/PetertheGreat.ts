import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  id: `Peter the Great`,  // Card names are unique in Innovation
  name: `Peter the Great`,
  color: `red`,
  age: 5,
  expansion: `figs`,
  biscuits: `fp5h`,
  dogmaBiscuit: `f`,
  karma: [
    `You may issue a War Decree with any two figures.`,
    `If you would return a card, first score you bottom green card. If the scored card has {c}, achieve your bottom green card, if eligible.`,
  ],
  karmaImpl: [
    {
      trigger: 'decree-for-two',
      decree: 'War',
    },
    {
      trigger: 'return',
      kind: 'would-first',
      matches: () => true,
      func: (game, player) => {
        const card = game.cards.bottom(player, 'green')
        if (card) {
          game.actions.score(player, card)
          if (card.checkHasBiscuit('c')) {
            const toAchieve = game.cards.bottom(player, 'green')
            if (toAchieve) {
              if (game.checkAchievementEligibility(player, toAchieve)) {
                game.actions.claimAchievement(player, toAchieve)
              }

              else {
                game.log.add({
                  template: 'Not eligible to claim bottom green card.'
                })
              }
            }
            else {
              game.log.add({
                template: 'No bottom green cards remaining to achieve',
              })
            }
          }
        }
        else {
          game.log.add({
            template: 'No bottom green cards remaining to score',
          })
        }
      }
    }
  ]
} satisfies AgeCardData
