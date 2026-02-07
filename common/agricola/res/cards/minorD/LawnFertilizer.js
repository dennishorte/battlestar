module.exports = {
  id: "lawn-fertilizer-d011",
  name: "Lawn Fertilizer",
  deck: "minorD",
  number: 11,
  type: "minor",
  cost: {},
  category: "Livestock Provider",
  text: "Your pastures of size 1 can hold up to 3 animals of the same type. (With a stable, they can hold up to 6 animals of the same type.)",
  modifyPastureCapacity(game, player, capacity, pastureSize, hasStable) {
    if (pastureSize === 1) {
      const base = 3
      return hasStable ? base * 2 : base
    }
    return capacity
  },
}
