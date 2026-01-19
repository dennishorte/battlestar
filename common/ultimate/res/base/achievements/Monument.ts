import type { AgeCardData } from '../../../UltimateAgeCard.js'

export default {
  name: 'Monument',
  shortName: 'monu',
  expansion: 'base',
  text: 'Have at least four top cards with a demand effect.',
  alt: 'Masonry',
  isSpecialAchievement: true,
  checkPlayerIsEligible: function(game, player, reduceCost) {
    const topDemands = game
      .cards.tops(player)
      .filter(c => c.checkHasDemand())

    const targetCount = reduceCost ? 3 : 4
    return topDemands.length >= targetCount
  },
} satisfies AgeCardData
