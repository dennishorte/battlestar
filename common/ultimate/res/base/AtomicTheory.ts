import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  name: `Atomic Theory`,
  color: `blue`,
  age: 6,
  expansion: `base`,
  biscuits: `sssh`,
  dogmaBiscuit: `s`,
  dogma: [
    `You may splay your blue cards right.`,
    `Draw and meld a {7}.`
  ],
  dogmaImpl: [
    (game, player) => {
      game.actions.chooseAndSplay(player, ['blue'], 'right')
    },

    (game, player, { self }) => {
      game.actions.drawAndMeld(player, game.getEffectAge(self, 7))
    },
  ],
} satisfies AgeCardData
