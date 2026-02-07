module.exports = {
  id: "farm-store-c041",
  name: "Farm Store",
  deck: "minorC",
  number: 41,
  type: "minor",
  cost: { wood: 2, clay: 2 },
  category: "Building Resource Provider",
  text: "After the feeding phase of each harvest, you can exchange exactly 1 food for 2 different building resources of your choice or 1 vegetable.",
  onFeedingPhaseEnd(game, player) {
    if (player.food >= 1) {
      game.actions.offerFarmStore(player, this)
    }
  },
}
