import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  name: `Where's Waldo`,
  color: `yellow`,
  age: 10,
  expansion: `arti`,
  biscuits: `lphl`,
  dogmaBiscuit: `l`,
  dogma: [
    `You win.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      game.youWin(player, self.name)
    }

  ],
} satisfies AgeCardData
