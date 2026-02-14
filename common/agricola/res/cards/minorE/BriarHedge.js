module.exports = {
  id: "briar-hedge-e016",
  name: "Briar Hedge",
  deck: "minorE",
  number: 16,
  type: "minor",
  cost: {},
  prereqs: { animalTypes: 3 },
  text: "You do not need to pay wood for fences that you build on the edge of your farmyard board.",
  modifyFenceCost(player, fenceCount, edgeFenceCount) {
    return Math.max(0, fenceCount - edgeFenceCount)
  },
}
