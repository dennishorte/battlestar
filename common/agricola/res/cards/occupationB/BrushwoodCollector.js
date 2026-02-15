module.exports = {
  id: "brushwood-collector-b145",
  name: "Brushwood Collector",
  deck: "occupationB",
  number: 145,
  type: "occupation",
  players: "3+",
  text: "Each time you renovate or build a room, you can replace the required 1 or 2 reed with a total of 1 wood.",
  modifyBuildCost(player, cost, action) {
    if ((action === 'build-room' || action === 'renovate') && cost.reed && cost.reed > 0) {
      return { ...cost, reed: 0, wood: (cost.wood || 0) + 1 }
    }
    return cost
  },
}
