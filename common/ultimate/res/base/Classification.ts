import type { AgeCardData } from '../../UltimateAgeCard.js'

export default {
  name: `Classification`,
  color: `green`,
  age: 6,
  expansion: `base`,
  biscuits: `sssh`,
  dogmaBiscuit: `s`,
  dogma: [
    `Reveal the color of a card from your hand. Take into your hand all cards of that color from all opponent's hands. Then, meld all cards of that color from your hand.`
  ],
  dogmaImpl: [
    (game, player) => {
      const revealed = game.actions.chooseAndReveal(player, game.zones.byPlayer(player, 'hand').cardlist())[0]
      if (revealed) {
        game.actions.reveal(player, revealed)

        // Take cards into hand
        game
          .players.opponents(player)
          .flatMap(opp => game.zones.byPlayer(opp, 'hand').cardlist())
          .filter(card => card.color === revealed.color)
          .forEach(card => game.mTake(player, card))

        // Meld cards
        const cardsToMeld = game
          .zones.byPlayer(player, 'hand')
          .cardlist()
          .filter(card => card.color === revealed.color)

        game.actions.meldMany(player, cardsToMeld)
      }

    }
  ],
} satisfies AgeCardData
