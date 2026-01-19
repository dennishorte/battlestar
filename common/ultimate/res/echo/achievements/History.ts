import type { AgeCardData } from '../../../UltimateAgeCard.js'

export default {
  name: 'History',
  shortName: 'hist',
  expansion: 'echo',
  text: 'Have four echo effects visible in one color.',
  alt: 'Photography',
  isSpecialAchievement: true,
  checkPlayerIsEligible: function(game, player, reduceCost) {
    const targetCount = reduceCost ? 3 : 4

    return game
      // Grab each stack
      .util.colors()
      .map(color => game.zones.byPlayer(player, color))

      // Convert each stack to a count of echo effects
      .map(zone => zone
        .cardlist()
        .flatMap(card => card.checkBiscuitIsVisible('&'))
        .filter(bool => bool)
        .length
      )
      .some(count => count >= targetCount)
  },
} satisfies AgeCardData
