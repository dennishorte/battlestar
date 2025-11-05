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
      const color = game.actions.chooseColor(player)
      const toTransfer = game.cards.byPlayer(player, color)

      game.actions.transferMany(player, toTransfer, game.zones.byPlayer(player, 'hand'), { ordered: true })
    },
    (game, player, { self }) => {
      const card = game.actions.drawAndMeld(player, game.getEffectAge(self, 3))

      if (game.cards.bottoms(player).includes(card)) {
        game.actions.score(player, card)

        const sameColorInHand = game
          .cards.byPlayer(player, 'hand')
          .filter(c => c.color === card.color)

        game.actions.chooseAndScore(player, sameColorInHand, { min: 0, max: sameColorInHand.length })
      }
    }
  ],
}
