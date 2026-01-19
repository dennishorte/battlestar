import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  name: `Rock Around the Clock`,
  color: `yellow`,
  age: 9,
  expansion: `arti`,
  biscuits: `lihi`,
  dogmaBiscuit: `i`,
  dogma: [
    `For each top card on your board with a {i}, draw and score a {9}.`,
    `Junk all cards in the deck ofvalue equal to the number of cards in your score pile.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const matchingCards = game
        .cards.tops(player)
        .filter(card => card.checkHasBiscuit('i'))
        .length

      for (let i = 0; i < matchingCards; i++) {
        game.actions.drawAndScore(player, game.getEffectAge(self, 9))
      }

    },

    (game, player) => {
      const age = game.cards.byPlayer(player, 'score').length
      game.actions.junkDeck(player, age)
    },
  ],
} satisfies AgeCardData
