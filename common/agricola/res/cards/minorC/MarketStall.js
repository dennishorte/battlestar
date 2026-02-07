module.exports = {
  id: "market-stall-c054",
  name: "Market Stall",
  deck: "minorC",
  number: 54,
  type: "minor",
  cost: { stable: 1 },
  category: "Food Provider",
  text: "After the field phase of each harvest, you can exchange 1 grain plus 1 fence (both from your supply) for 5 food.",
  onFieldPhaseEnd(game, player) {
    if (player.grain >= 1 && player.fences >= 1) {
      game.actions.offerMarketStallC054(player, this)
    }
  },
}
