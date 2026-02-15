module.exports = {
  id: "tinsmith-master-b115",
  name: "Tinsmith Master",
  deck: "occupationB",
  number: 115,
  type: "occupation",
  players: "1+",
  text: "You can hold 1 additional animal in each pasture without a stable. Each time you sow in a field, you can place 1 additional crop of the respective type in that field.",
  modifyPastureCapacity(player, pasture, baseCapacity) {
    // Check if any space in the pasture has a stable
    let hasStable = false
    for (const coord of pasture.spaces) {
      const space = player.getSpace(coord.row, coord.col)
      if (space && space.hasStable) {
        hasStable = true
        break
      }
    }
    if (!hasStable) {
      return baseCapacity + 1
    }
    return baseCapacity
  },
  modifySowAmount(game, player, amount) {
    return amount + 1
  },
}
