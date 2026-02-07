module.exports = {
  id: "beer-stall-c049",
  name: "Beer Stall",
  deck: "minorC",
  number: 49,
  type: "minor",
  cost: { wood: 1 },
  category: "Food Provider",
  text: "In the feeding phase of each harvest, for each empty unfenced stable you have, you can exchange 1 grain for 5 food.",
  onFeedingPhase(game, player) {
    const emptyUnfencedStables = player.getEmptyUnfencedStableCount()
    if (emptyUnfencedStables > 0 && player.grain >= 1) {
      game.actions.offerBeerStall(player, this, emptyUnfencedStables)
    }
  },
}
