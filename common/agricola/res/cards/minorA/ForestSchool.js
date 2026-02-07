module.exports = {
  id: "forest-school-a028",
  name: "Forest School",
  deck: "minorA",
  number: 28,
  type: "minor",
  cost: { wood: 1, clay: 1 },
  vps: 1,
  category: "Actions Booster",
  text: "You can consider the \"Lessons\" action spaces not occupied. You can replace each food that an occupation costs with wood.",
  allowIgnoreLessonsOccupied: true,
  modifyOccupationCost(player, cost) {
    if (cost.food) {
      return { ...cost, food: 0, woodOrFood: cost.food }
    }
    return cost
  },
}
