module.exports = {
  id: "carpenters-apprentice-c088",
  name: "Carpenter's Apprentice",
  deck: "occupationC",
  number: 88,
  type: "occupation",
  players: "1+",
  text: "Wood rooms cost you 2 woods less. Your 3rd and 4th stable each cost you 1 wood less. Your 13th to 15th fence each cost you nothing.",
  modifyRoomCost(player, cost) {
    if (player.roomType === 'wood' && cost.wood) {
      return { ...cost, wood: Math.max(0, cost.wood - 2) }
    }
    return cost
  },
  modifyStableCost(player, cost, stableNumber) {
    if ((stableNumber === 3 || stableNumber === 4) && cost.wood) {
      return { ...cost, wood: Math.max(0, cost.wood - 1) }
    }
    return cost
  },
  modifyFenceCost(player, fenceNumber) {
    if (fenceNumber >= 13 && fenceNumber <= 15) {
      return 0
    }
    return 1
  },
}
