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
        canSkipToClay: false,
        canSkipToStone: true,
        stoneDiscount: 2,
      }
    }
    return options
  },
}
