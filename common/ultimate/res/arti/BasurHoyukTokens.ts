import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  name: `Basur Hoyuk Tokens`,
  color: `blue`,
  age: 1,
  expansion: `arti`,
  biscuits: `chll`,
  dogmaBiscuit: `l`,
  dogma: [
    `Draw and reveal a {4}. If you have a top card of the drawn card's color that comes before it in the alphabet, return the drawn card and all cards from your score pile.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const card = game.actions.drawAndReveal(player, game.getEffectAge(self, 4))
      if (card) {
        const matchingTopCard = game.cards.top(player, card.color)
        if (matchingTopCard && matchingTopCard.name < card.name) {
          const toReturn = game.cards.byPlayer(player, 'score')
          toReturn.push(card)
          game.actions.returnMany(player, toReturn)
        }

      }
    }
  ],
} satisfies AgeCardData
