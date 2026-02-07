module.exports = {
  id: "carpenters-hammer-a014",
  name: "Carpenter's Hammer",
  deck: "minorA",
  number: 14,
  type: "minor",
  cost: { wood: 1 },
  category: "Building Resource Provider",
  text: "Each time you build at least 2 wood/clay/stone rooms at once, you get a total discount of 2 reed as well as 2 wood/3 clay/4 stone.",
  modifyMultiRoomCost(player, cost, roomCount, roomType) {
    if (roomCount >= 2) {
      const discount = {
        reed: 2,
        [roomType]: roomType === 'wood' ? 2 : (roomType === 'clay' ? 3 : 4),
      }
      return {
        ...cost,
        reed: Math.max(0, (cost.reed || 0) - discount.reed),
        [roomType]: Math.max(0, (cost[roomType] || 0) - discount[roomType]),
      }
    }
    return cost
  },
}
