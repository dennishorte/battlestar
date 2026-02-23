module.exports = {
  canTradeWithNonNeighbors() {
    return true
  },
  canSkipTradeSecondaryCost() {
    return true
  },
  canTradeActionCards() {
    return true
  },

  commanderEffect: {
    timing: 'transaction-bonus',
    apply: (player, _context) => {
      player.addTradeGoods(1)
    },
  },
}
