module.exports = {
  name: `Mathematics`,
  color: `blue`,
  age: 2,
  expansion: `base`,
  biscuits: `hscs`,
  dogmaBiscuit: `s`,
  dogma: [
    `You may return a card from your hand. If you do, draw and meld a card of value one higher than the card you returned.`
  ],
  dogmaImpl: [
    (game, player) => {
      const cards = game.aChooseAndReturn(player, game.cards.byPlayer(player, 'hand'), { min: 0, max: 1 })
      if (cards && cards.length > 0) {
        const card = cards[0]
        game.aDrawAndMeld(player, card.getAge() + 1)
      }
    }
  ],
}
