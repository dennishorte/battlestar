import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  name: `Corvette Challenger`,
  color: `blue`,
  age: 7,
  expansion: `arti`,
  biscuits: `lshl`,
  dogmaBiscuit: `l`,
  dogma: [
    `Draw and tuck an {8}. Splay up the color of the tucked card. Draw and score a card of value equal to the number of cards of that color on your board. Junk all cards in the deck of that value.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const card = game.actions.drawAndTuck(player, game.getEffectAge(self, 8))
      game.actions.splay(player, card.color, 'up')
      const numCards = game.cards.byPlayer(player, card.color).length
      game.actions.drawAndScore(player, numCards)
      game.actions.junkDeck(player, numCards)
    }

  ],
} satisfies AgeCardData
