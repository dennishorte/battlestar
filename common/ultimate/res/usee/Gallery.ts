import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  name: `Gallery`,
  color: `yellow`,
  age: 5,
  expansion: `usee`,
  biscuits: `csch`,
  dogmaBiscuit: `c`,
  dogma: [
    `If you have a {2} in your score pile, draw a {6}.`,
    `If you have a {1} in your score pile, draw a {7}. Otherwise, draw a {5}.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const scoreCards = game.cards.byPlayer(player, 'score')
      if (scoreCards.some(card => card.age === game.getEffectAge(self, 2))) {
        game.actions.draw(player, { age: game.getEffectAge(self, 6) })
      }

      else {
        game.log.addNoEffect()
      }
    },
    (game, player, { self }) => {
      const scoreCards = game.cards.byPlayer(player, 'score')
      if (scoreCards.some(card => card.age === game.getEffectAge(self, 1))) {
        game.actions.draw(player, { age: game.getEffectAge(self, 7) })
      }
      else {
        game.actions.draw(player, { age: game.getEffectAge(self, 5) })
      }
    }
  ],
} satisfies AgeCardData
