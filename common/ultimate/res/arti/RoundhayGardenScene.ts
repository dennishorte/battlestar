import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  name: `Roundhay Garden Scene`,
  color: `purple`,
  age: 7,
  expansion: `arti`,
  biscuits: `lllh`,
  dogmaBiscuit: `l`,
  dogma: [
    `Meld the highest card from your score pile. Draw and score two cards of value equal to the melded card. Self-execute the melded card.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const choices = game.util.highestCards(game.cards.byPlayer(player, 'score'))
      const cards = game.actions.chooseAndMeld(player, choices)
      if (cards && cards.length > 0) {
        const card = cards[0]
        game.actions.drawAndScore(player, card.getAge())
        game.actions.drawAndScore(player, card.getAge())
        game.aSelfExecute(self, player, card)
      }

    }
  ],
} satisfies AgeCardData
