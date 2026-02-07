module.exports = {
  id: "briar-hedge-e016",
  name: "Briar Hedge",
  deck: "minorE",
  number: 16,
  type: "minor",
  cost: {},
  prereqs: { animalTypes: 3 },
  text: "You do not need to pay wood for fences that you build on the edge of your farmyard board.",
  modifyFenceCost(game, player, cost, isEdge) {
    if (isEdge) {
      return { ...cost, wood: 0 }
    }
    return cost
  },
}
