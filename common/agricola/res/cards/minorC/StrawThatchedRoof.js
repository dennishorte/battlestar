module.exports = {
  id: "straw-thatched-roof-c014",
  name: "Straw-thatched Roof",
  deck: "minorC",
  number: 14,
  type: "minor",
  cost: {},
  vps: 1,
  prereqs: { grainFields: 3 },
  category: "Farm Planner",
  text: "You no longer need reed to renovate or build a room.",
  modifyBuildCost(player, cost, action) {
    if (action === 'build-room' || action === 'renovate') {
      const newCost = { ...cost }
      delete newCost.reed
      return newCost
    }
    return cost
  },
}
