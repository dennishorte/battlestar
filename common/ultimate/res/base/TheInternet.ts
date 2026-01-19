import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  name: `The Internet`,
  color: `purple`,
  age: 10,
  expansion: `base`,
  biscuits: `hipp`,
  dogmaBiscuit: `p`,
  dogma: [
    `You may splay your green cards up.`,
    `Draw and score a {0}.`,
    `Draw and meld 2 {0}.`
  ],
  dogmaImpl: [
    (game, player) => {
      game.actions.chooseAndSplay(player, ['green'], 'up')
    },

    (game, player, { self }) => {
      game.actions.drawAndScore(player, game.getEffectAge(self, 10))
    },

    (game, player, { self }) => {
      game.actions.drawAndMeld(player, game.getEffectAge(self, 10))
      game.actions.drawAndMeld(player, game.getEffectAge(self, 10))
    },
  ],
} satisfies AgeCardData
