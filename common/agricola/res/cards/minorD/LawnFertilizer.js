module.exports = {
  id: "lawn-fertilizer-d011",
  name: "Lawn Fertilizer",
  deck: "minorD",
  number: 11,
  type: "minor",
  cost: {},
  category: "Livestock Provider",
  text: "Your pastures of size 1 can hold up to 3 animals of the same type. (With a stable, they can hold up to 6 animals of the same type.)",
  modifyPastureCapacity(player, pasture, capacity) {
    if (pasture.spaces.length === 1) {
      const space = player.getSpace(pasture.spaces[0].row, pasture.spaces[0].col)
      const hasStable = space && space.hasStable
      return hasStable ? 6 : 3
    }
    return capacity
  },
}
