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
        .util.colors()
        .map(color => game.cards.byPlayer(player, color).length)
      const mostCount = Math.max(...cardsPerColor)
      const choices = game
        .util.colors()
        .filter(color => game.cards.byPlayer(player, color).length === mostCount)

      game.actions.chooseAndSplay(player, choices, 'left', { min: 0, max: 1 })
    },
    (game, player) => {
      const numPurpleCards = game.zones.byPlayer(player, 'purple').numVisibleCards()
      const card = game.actions.drawAndMeld(player, numPurpleCards)

      if (card && !card.checkHasBiscuit('c')) {
        game.actions.tuck(player, card)
      }
    }
  ],
}
