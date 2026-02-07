module.exports = {
  id: "bricklayer-c122",
  name: "Bricklayer",
  deck: "occupationC",
  number: 122,
  type: "occupation",
  players: "1+",
  text: "Each improvement and each renovation costs you 1 clay less. Each room costs you 2 clay less.",
  modifyImprovementCost(player, cost) {
    if (cost.clay && cost.clay > 0) {
      return { ...cost, clay: cost.clay - 1 }
    }
    return cost
  },
  modifyRenovationCost(player, cost) {
    if (cost.clay && cost.clay > 0) {
      return { ...cost, clay: cost.clay - 1 }
    }
    return cost
  },
  modifyRoomCost(player, cost) {
    if (cost.clay && cost.clay > 0) {
      return { ...cost, clay: Math.max(0, cost.clay - 2) }
    }
    return cost
  },
}
