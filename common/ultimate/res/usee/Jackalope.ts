export default {
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
      const choices = game.util.highestCards(
        game
          .cards.tops(player)
          .filter(card => !card.checkHasBiscuit('i'))
      )

      const card = game.actions.chooseCard(player, choices)
      if (card) {
        const transferred = game.actions.transfer(player, card, game.zones.byPlayer(leader, card.color))
        if (transferred) {
          game.actions.unsplay(player, card.color)
        }
      }
    },
    (game, player) => {
      const colors = game.util.colors()
      const colorCounts = colors.map(color => ({
        color,
        count: game.zones.byPlayer(player, color).numVisibleCards()
      }))
      const maxCount = Math.max(...colorCounts.map(c => c.count))
      const maxColors = colorCounts.filter(c => c.count === maxCount).map(c => c.color)

      game.actions.chooseAndUnsplay(player, maxColors)
    }
  ],
}
