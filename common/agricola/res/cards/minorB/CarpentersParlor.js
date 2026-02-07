module.exports = {
  id: "carpenters-parlor-b013",
  name: "Carpenter's Parlor",
  deck: "minorB",
  number: 13,
  type: "minor",
  cost: { wood: 1, stone: 1 },
  category: "Farm Planner",
  text: "Wooden rooms only cost you 2 wood and 2 reed each.",
  modifyBuildCost(player, cost, action) {
    if (player.roomType === 'wood' && action === 'build-room') {
      return { wood: 2, reed: 2 }
    }
    return cost
  },
}
