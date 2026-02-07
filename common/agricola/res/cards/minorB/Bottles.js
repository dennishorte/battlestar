module.exports = {
  id: "bottles-b036",
  name: "Bottles",
  deck: "minorB",
  number: 36,
  type: "minor",
  cost: { special: true },
  vps: 4,
  category: "Points Provider",
  text: "For each person you have, you must pay an additional 1 clay and 1 food to play this card.",
  getSpecialCost(player) {
    const people = player.familyMembers
    return { clay: people, food: people }
  },
}
