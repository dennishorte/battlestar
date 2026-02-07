module.exports = {
  id: "dwelling-mound-c037",
  name: "Dwelling Mound",
  deck: "minorC",
  number: 37,
  type: "minor",
  cost: { food: 1 },
  vps: 3,
  prereqs: { maxRound: 3 },
  category: "Points Provider",
  text: "From now on, you must pay 1 food for each new field tile that you place in your farmyard.",
  modifyFieldCost(player, cost) {
    return { ...cost, food: (cost.food || 0) + 1 }
  },
}
