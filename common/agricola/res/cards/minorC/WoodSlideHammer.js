module.exports = {
  id: "wood-slide-hammer-c013",
  name: "Wood Slide Hammer",
  deck: "minorC",
  number: 13,
  type: "minor",
  cost: { wood: 1 },
  category: "Farm Planner",
  text: "On your first renovation, if you have at least 5 wood rooms, you can renovate to stone directly and you get a discount of 2 stone on the renovation cost.",
  modifyRenovation(player, options) {
    if (!player.hasRenovated && player.roomType === 'wood' && player.getRoomCount() >= 5) {
      return {
        ...options,
        canSkipToStone: true,
      }
    }
    return options
  },
  modifyRenovationCost(game, player, cost, { fromType, toType }) {
    if (!player.hasRenovated && fromType === 'wood' && toType === 'stone') {
      return {
        ...cost,
        stone: Math.max(0, (cost.stone || 0) - 2),
      }
    }
    return cost
  },
}
