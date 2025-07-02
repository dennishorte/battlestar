module.exports = {
  name: `Taqiyya`,
  color: `purple`,
  age: 3,
  expansion: `usee`,
  biscuits: `slhl`,
  dogmaBiscuit: `l`,
  dogma: [
    `Choose a color. Transfer all cards of that color on your board into your hand.`,
    `Draw and meld a {3}. If the melded card is a bottom card on your board, score it and any number of cards of its color in your hand.`
  ],
  dogmaImpl: [
    (game, player) => {
      const color = game.aChooseColor(player)[0]
      const toTransfer = game.getCardsByZone(player, color)

      game.aTransferMany(player, toTransfer, game.getZoneByPlayer(player, 'hand'), { ordered: true })
    },
    (game, player, { self }) => {
      const card = game.aDrawAndMeld(player, game.getEffectAge(self, 3))

      if (game.getBottomCards(player).includes(card)) {
        game.aScore(player, card)

        const sameColorInHand = game
          .getCardsByZone(player, 'hand')
          .filter(c => c.color === card.color)

        game.aChooseAndScore(player, sameColorInHand, { min: 0, max: sameColorInHand.length })
      }
    }
  ],
}
