import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  name: `Digital Pet`,
  color: `yellow`,
  age: 11,
  expansion: `echo`,
  biscuits: `hlil`,
  dogmaBiscuit: `l`,
  dogma: [
    `I demand you draw and reveal an {b}! Return all cards from your board and score pile of color matching the drawn card!`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const drawn = game.actions.drawAndReveal(player, game.getEffectAge(self, 11))
      const toReturn = [
        ...game.cards.byPlayer(player, drawn.color),
        ...game.cards.byPlayer(player, 'score').filter(card => card.color === drawn.color),
      ]

      game.actions.returnMany(player, toReturn)
    }

  ],
} satisfies AgeCardData
