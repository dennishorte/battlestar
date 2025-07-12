module.exports = {
  name: `Astrology`,
  color: `blue`,
  age: 2,
  expansion: `usee`,
  biscuits: `cchl`,
  dogmaBiscuit: `c`,
  dogma: [
    `You may splay left the color of which you have the most cards on your board.`,
    `Draw and meld a card of value equal to the number of visible purple cards on your board. If the melded card has no {c}, tuck it.`
  ],
  dogmaImpl: [
    (game, player) => {
      const cardsPerColor = game
        .utilColors()
        .map(color => game.cards.byPlayer(player, color).length)
      const mostCount = Math.max(...cardsPerColor)
      const choices = game
        .utilColors()
        .filter(color => game.cards.byPlayer(player, color).length === mostCount)

      game.aChooseAndSplay(player, choices, 'left', { min: 0, max: 1 })
    },
    (game, player) => {
      const numPurpleCards = game.getVisibleCardsByZone(player, 'purple')
      const card = game.aDrawAndMeld(player, numPurpleCards)

      if (card && !card.checkHasBiscuit('c')) {
        game.aTuck(player, card)
      }
    }
  ],
}
