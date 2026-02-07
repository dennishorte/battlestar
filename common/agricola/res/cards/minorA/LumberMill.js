module.exports = {
  id: "lumber-mill-a075",
  name: "Lumber Mill",
  deck: "minorA",
  number: 75,
  type: "minor",
  cost: { stone: 2 },
  vps: 2,
  prereqs: { occupations: 3, occupationsAtMost: true },
  category: "Building Resource Provider",
  text: "Every improvement costs you 1 wood less.",
  modifyImprovementCost(player, cost) {
    if (cost.wood && cost.wood > 0) {
      return { ...cost, wood: cost.wood - 1 }
    }
    return cost
  },
}
