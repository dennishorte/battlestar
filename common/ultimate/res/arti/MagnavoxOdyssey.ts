import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  name: `Magnavox Odyssey`,
  color: `yellow`,
  age: 9,
  expansion: `arti`,
  biscuits: `slhs`,
  dogmaBiscuit: `s`,
  dogma: [
    `Draw and meld two {0}. If they are the same color, you win.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const card1 = game.actions.drawAndMeld(player, game.getEffectAge(self, 10))
      const card2 = game.actions.drawAndMeld(player, game.getEffectAge(self, 10))

      if (card1.color === card2.color) {
        game.youWin(player, self.name)
      }

      else {
        game.log.add({ template: 'Colors do not match' })
      }
    }
  ],
} satisfies AgeCardData
