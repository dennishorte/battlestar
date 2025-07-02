module.exports = {
  name: `Jackalope`,
  color: `yellow`,
  age: 8,
  expansion: `usee`,
  biscuits: `lhll`,
  dogmaBiscuit: `l`,
  dogma: [
    `I demand you transfer the highest card on your board without {i} to my board! If you do, unsplay the transferred card's color on your board!`,
    `Unsplay the color on your board with the most visible cards.`
  ],
  dogmaImpl: [
    (game, player, { leader }) => {
      const choices = game.utilHighestCards(
        game
          .getTopCards(player)
          .filter(card => !card.checkHasBiscuit('i'))
      )

      const card = game.actions.chooseCard(player, choices)
      if (card) {
        const transferred = game.aTransfer(player, card, game.getZoneByPlayer(leader, card.color))
        if (transferred) {
          game.aUnsplay(player, card.color)
        }
      }
    },
    (game, player) => {
      const colors = game.utilColors()
      const colorCounts = colors.map(color => ({
        color,
        count: game.getVisibleCardsByZone(player, color)
      }))
      const maxCount = Math.max(...colorCounts.map(c => c.count))
      const maxColors = colorCounts.filter(c => c.count === maxCount).map(c => c.color)

      game.aChooseAndUnsplay(player, maxColors)
    }
  ],
}
