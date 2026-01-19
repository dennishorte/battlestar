import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  name: `Quantum Theory`,
  color: `blue`,
  age: 8,
  expansion: `base`,
  biscuits: `iiih`,
  dogmaBiscuit: `i`,
  dogma: [
    `You may return up to two cards from your hand. If you return two, draw a {0} and then draw and score a {0}.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const returned = game.actions.chooseAndReturn(
        player,
        game.cards.byPlayer(player, 'hand'),
        { min: 0, max: 2 }

      )

      if (returned && returned.length == 2) {
        game.actions.draw(player, { age: game.getEffectAge(self, 10) })
        game.actions.drawAndScore(player, game.getEffectAge(self, 10))
      }
    }
  ],
} satisfies AgeCardData
