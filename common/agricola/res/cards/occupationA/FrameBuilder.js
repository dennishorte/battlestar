module.exports = {
  id: "frame-builder-a123",
  name: "Frame Builder",
  deck: "occupationA",
  number: 123,
  type: "occupation",
  players: "1+",
  text: "Each time you build a room/renovate, but only once per room/action, you can replace exactly 2 clay or 2 stone with 1 wood.",
  modifyBuildCost(player, cost, action) {
    if (action === 'build-room' || action === 'renovate') {
      return { ...cost, allowWoodSubstitution: true }
    }
    return cost
  },
}
