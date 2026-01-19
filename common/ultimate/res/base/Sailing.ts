import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  name: `Sailing`,
  color: `green`,
  age: 1,
  expansion: `base`,
  biscuits: `cchl`,
  dogmaBiscuit: `c`,
  dogma: [
    `Draw and meld a {1}.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      game.actions.drawAndMeld(player, game.getEffectAge(self, 1))
    },
  ],
} satisfies AgeCardData
