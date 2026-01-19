import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  name: `Battleship Bismark`,
  color: `red`,
  age: 8,
  expansion: `arti`,
  biscuits: `hfff`,
  dogmaBiscuit: `f`,
  dogma: [
    `I compel you to draw and reveal an {8}! Return all cards of the drawn card's color from your board!`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const card = game.actions.drawAndReveal(player, game.getEffectAge(self, 8))
      if (card) {
        const toReturn = game.cards.byPlayer(player, card.color)
        game.actions.returnMany(player, toReturn, { ordered: true })
      }

    }
  ],
} satisfies AgeCardData
