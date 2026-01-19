import type { AgeCardData } from '../../../UltimateAgeCard.js'

export default {
  id: 'Advancement',
  name: 'Advancement',
  shortName: 'advn',
  expansion: 'figs',
  text: 'Draw a card of value two higher than your highest top card.',
  alt: '',
  isSpecialAchievement: false,
  isDecree: true,
  decreeImpl: (game, player) => {
    const highestAge = game.getHighestTopAge(player)
    const decreeAge = highestAge + 2
    game.actions.draw(player, { age: decreeAge })
  }

} satisfies AgeCardData
