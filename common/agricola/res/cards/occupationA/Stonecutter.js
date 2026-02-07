module.exports = {
  id: "stonecutter-a143",
  name: "Stonecutter",
  deck: "occupationA",
  number: 143,
  type: "occupation",
  players: "3+",
  text: "Every improvement, room, and renovation costs you 1 stone less.",
  modifyAnyCost(player, cost) {
    if (cost.stone && cost.stone > 0) {
      return { ...cost, stone: cost.stone - 1 }
    }
    return cost
  },
}
