module.exports = {
  name: `Password`,
  color: `red`,
  age: 2,
  expansion: `usee`,
  biscuits: `hckk`,
  dogmaBiscuit: `k`,
  dogma: [
    `Draw and reveal a {2}. You may safeguard another card from your hand of the color of the drawn card. If you do, score the drawn card. Otherwise, return all cards from your hand except the drawn card.`
  ],
  dogmaImpl: [
    (game, player, { self }) => {
      const drawnCard = game.aDrawAndReveal(player, game.getEffectAge(self, 2))

      const otherHandCards = game
        .getCardsByZone(player, 'hand')
        .filter(c => c.name !== drawnCard.name)
      const sameColorCards = otherHandCards.filter(c => c.color === drawnCard.color)

      const safeguarded = game.aChooseAndSafeguard(player, sameColorCards, {
        title: 'Choose a card to safeguard',
        min: 0,
        max: 1
      })[0]

      if (safeguarded) {
        game.aScore(player, drawnCard)
      }
      else {
        game.aReturnMany(player, otherHandCards)
      }
    },
  ],
}
