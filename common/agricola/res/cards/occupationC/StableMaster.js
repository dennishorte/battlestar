module.exports = {
  id: "stable-master-c089",
  name: "Stable Master",
  deck: "occupationC",
  number: 89,
  type: "occupation",
  players: "1+",
  text: "When you play this card, you can immediately build exactly 1 stable for 1 wood. Exactly one of your unfenced stables can hold up to 3 animals of one type.",
  onPlay(game, player) {
    if (player.wood >= 1) {
      game.actions.offerBuildStableForWood(player, this)
    }
  },
  modifyStableCapacity(game, player, capacity, inPasture) {
    if (inPasture) {
      return capacity
    }
    return 3
  },
}
