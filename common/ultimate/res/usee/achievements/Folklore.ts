import type { AgeCardData } from '../../../UltimateAgeCard.js'

export default {
  name: 'Folklore',
  shortName: 'folk',
  expansion: 'usee',
  text: 'Have a top card on your board of value 8 or higher and no {f} on your board.',
  alt: "April Fool's Day",
  isSpecialAchievement: true,
  checkPlayerIsEligible: function(game, player, reduceCost) {
    const targetAge = reduceCost ? 7 : 8
    const topCardAges = game
      .cards.tops(player)
      .map(card => card.getAge())
    const topCardMaxAge = Math.max(...topCardAges)

    const targetFactories = reduceCost ? 1 : 0
    const numFactories = player.biscuits().f

    return topCardMaxAge >= targetAge && numFactories <= targetFactories
  },
} satisfies AgeCardData
