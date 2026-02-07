module.exports = {
  id: "tinsmith-master-b115",
  name: "Tinsmith Master",
  deck: "occupationB",
  number: 115,
  type: "occupation",
  players: "1+",
  text: "You can hold 1 additional animal in each pasture without a stable. Each time you sow in a field, you can place 1 additional crop of the respective type in that field.",
  modifyPastureCapacity(player, pasture, baseCapacity) {
    if (!pasture.hasStable) {
      return baseCapacity + 1
    }
    return baseCapacity
  },
  modifySowAmount(game, player, amount) {
    return amount + 1
  },
}
