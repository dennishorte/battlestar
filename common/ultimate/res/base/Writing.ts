import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  name: `Writing`,
  color: `blue`,
  age: 1,
  expansion: `base`,
  biscuits: `hssc`,
  dogmaBiscuit: `s`,
  dogma: [
    `Draw a {2}.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      game.actions.draw(player, { age: game.getEffectAge(self, 2) })
    },
  ],
} satisfies AgeCardData
