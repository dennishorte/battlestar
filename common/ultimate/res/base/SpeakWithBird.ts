import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  name: `Speak with Bird`,
  color: `purple`,
  age: 0,
  expansion: `base`,
  biscuits: `hllk`,
  dogmaBiscuit: `l`,
  dogma: [
    `If you have five top cards of value 0 on your board, you win.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const topCards = game.cards.tops(player)
      const topValues = topCards.map(card => card.getAge())

      if (topValues.length === 5 && topValues.every(value => value === 0)) {
        game.youWin(player, self.name)
      }

    }
  ],
} satisfies AgeCardData
