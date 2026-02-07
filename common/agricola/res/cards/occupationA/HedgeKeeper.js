module.exports = {
  id: "hedge-keeper-a088",
  name: "Hedge Keeper",
  deck: "occupationA",
  number: 88,
  type: "occupation",
  players: "1+",
  text: "Each time you take a \"Build Fences\" action, you do not have to pay wood for 3 of the fences you build.",
  modifyFenceCost(player, fenceCount) {
    return Math.max(0, fenceCount - 3)
  },
}
