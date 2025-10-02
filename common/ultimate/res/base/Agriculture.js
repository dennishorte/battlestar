module.exports = {
  name: `Agriculture`,
  color: `yellow`,
  age: 1,
  expansion: `base`,
  biscuits: `hlll`,
  dogmaBiscuit: `l`,
  dogma: [
    `You may return a card from your hand. If you do, draw and score a card of value one higher than the card you returned.`
  ],
  dogmaImpl: [
    (game, player) => {
      const cardsInHand = game.cards.byPlayer(player, 'hand')
      const returned = game.actions.chooseAndReturn(player, cardsInHand, { min: 0, max: 1 })

      if (returned.length > 0) {
        const card = returned[0]
        game.actions.drawAndScore(player, card.getAge() + 1)
      }
    },
  ],
}
