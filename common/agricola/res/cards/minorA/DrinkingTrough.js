module.exports = {
  id: "drinking-trough-a012",
  name: "Drinking Trough",
  deck: "minorA",
  number: 12,
  type: "minor",
  cost: { clay: 1 },
  category: "Farm Planner",
  text: "Each of your pastures (with or without a stable) can hold up to 2 more animals.",
  modifyPastureCapacity(player, pasture, baseCapacity) {
    return baseCapacity + 2
  },
}
