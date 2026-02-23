module.exports = {
  id: "blueprint-c027",
  name: "Blueprint",
  deck: "minorC",
  number: 27,
  type: "minor",
  cost: { food: 1 },
  category: "Actions Booster",
  text: "You can build the major improvements \"Joinery\", \"Pottery\", and \"Basketmaker's Workshop\" even when taking a \"Minor Improvement\" action. They each cost you 1 stone less.",
  allowsMajorsOnMinorAction: ["joinery", "pottery", "basketmakers-workshop"],
  modifyMajorCost(player, majorId, cost) {
    if (['joinery', 'pottery', 'basketmakers-workshop'].includes(majorId)) {
      const newCost = { ...cost }
      if (newCost.stone) {
        newCost.stone = Math.max(0, newCost.stone - 1)
      }
      return newCost
    }
    return cost
  },
}
