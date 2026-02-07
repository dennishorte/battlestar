module.exports = {
  id: "brushwood-collector-b145",
  name: "Brushwood Collector",
  deck: "occupationB",
  number: 145,
  type: "occupation",
  players: "3+",
  text: "Each time you renovate or build a room, you can replace the required 1 or 2 reed with a total of 1 wood.",
  modifyReedCost(player, cost) {
    if (cost.reed && cost.reed > 0) {
      return { ...cost, reed: 0, reedAlternative: { wood: 1 } }
    }
    return cost
  },
}
