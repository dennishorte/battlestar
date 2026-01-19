import type { AgeCardData } from '../../../UltimateAgeCard.js'

export default {
  name: 'Empire',
  shortName: 'empr',
  expansion: 'base',
  text: 'Have three biscuits of each of the six non-person biscuit types.',
  alt: 'Construction',
  isSpecialAchievement: true,
  checkPlayerIsEligible: function(game, player, reduceCost) {
    const biscuits = player.biscuits()
    delete biscuits['p']
    const targetCount = reduceCost ? 2 : 3
    const targetBiscuitCount = reduceCost ? 5 : 6

    delete biscuits.p

    const numMatches = Object.values(biscuits).filter(count => count >= targetCount).length
    return numMatches >= targetBiscuitCount
  },
} satisfies AgeCardData
