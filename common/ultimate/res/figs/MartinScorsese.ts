import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  id: `Martin Scorsese`,  // Card names are unique in Innovation
  name: `Martin Scorsese`,
  color: `purple`,
  age: 10,
  expansion: `figs`,
  biscuits: `fhap`,
  dogmaBiscuit: `f`,
  karma: [
    `If you would meld a figure, instead tuck the figure and claim an achievement, regardless of eligibility.`
  ],
  karmaImpl: [
    {
      trigger: 'meld',
      kind: 'would-instead',
      matches: (game, player, { card }) => card.checkIsFigure(),
      func: (game, player, { card }) => {
        game.actions.tuck(player, card)
        const choices = game.getAvailableStandardAchievements(player)
        game.actions.chooseAndAchieve(player, choices)
      }

    }
  ]
} satisfies AgeCardData
