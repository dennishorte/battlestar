module.exports = {
  id: "master-bricklayer-b095",
  name: "Master Bricklayer",
  deck: "occupationB",
  number: 95,
  type: "occupation",
  players: "1+",
  text: "Each time you build a major improvement, reduce the stone cost by the number of rooms you have built onto your initial house.",
  modifyImprovementCost(player, cost) {
    const additionalRooms = player.getRoomCount() - 2 // Initial 2 rooms
    if (cost.stone && cost.stone > 0 && additionalRooms > 0) {
      return { ...cost, stone: Math.max(0, cost.stone - additionalRooms) }
    }
    return cost
  },
}
