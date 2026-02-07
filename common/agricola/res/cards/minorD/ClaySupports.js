module.exports = {
  id: "clay-supports-d015",
  name: "Clay Supports",
  deck: "minorD",
  number: 15,
  type: "minor",
  cost: { wood: 2 },
  category: "Farm Planner",
  text: "Each time you build a clay room, you can pay 2 clay, 1 wood, and 1 reed instead of 5 clay and 2 reed.",
  modifyBuildCost(player, cost, action) {
    if (action === 'build-room' && player.roomType === 'clay') {
      return { clay: 2, wood: 1, reed: 1 }
    }
    return cost
  },
}
