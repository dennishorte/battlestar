module.exports = {
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
      const revealed = game.actions.chooseCard(player, game.getZoneByPlayer(player, 'hand').cards())
      if (revealed) {
        game
          .mReveal(player, revealed)

        // Take cards into hand
        game
          .players.opponentsOf(player)
          .flatMap(opp => game.getZoneByPlayer(opp, 'hand').cards())
          .filter(card => card.color === revealed.color)
          .forEach(card => game.mTake(player, card))

        // Meld cards
        const cardsToMeld = game
          .getZoneByPlayer(player, 'hand')
          .cards()
          .filter(card => card.color === revealed.color)

        game.aMeldMany(player, cardsToMeld)
      }
    }
  ],
}
