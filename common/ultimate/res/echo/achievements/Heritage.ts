import type { AgeCardData } from '../../../UltimateAgeCard.js'

export default {
  name: 'Heritage',
  shortName: 'hrtg',
  expansion: 'echo',
  text: 'Have eight visible hexes in one color.',
  alt: 'Loom',
  isSpecialAchievement: true,
  checkPlayerIsEligible: function(game, player, reduceCost) {
    const targetCount = reduceCost ? 7 : 8
    return game
      // Grab each stack
      .zones
      .colorStacks(player)

      // Convert each stack to a count of hexes
      .map(stack => {
        return stack.cardlist().map(card => card.checkBiscuitIsVisible('h')).filter(bool => bool).length
      })
      .some(count => count >= targetCount)
  },
} satisfies AgeCardData
