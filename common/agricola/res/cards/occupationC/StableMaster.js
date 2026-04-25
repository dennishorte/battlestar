module.exports = {
  id: "stable-master-c089",
  name: "Stable Master",
  deck: "occupationC",
  number: 89,
  type: "occupation",
  players: "1+",
  text: "When you play this card, you can immediately build exactly 1 stable for 1 wood. Exactly one of your unfenced stables can hold up to 3 animals of one type.",
  onPlay(game, player) {
    game.actions.offerBuildStableForWood(player, this)
  },
  modifyStableCapacity(game, player, capacity, inPasture, stable) {
    if (inPasture || !stable) {
      return capacity
    }
    // Pin the bonus to a single unfenced stable (deterministic: row-major first).
    const bonusStable = player.getStableSpaces()
      .find(s => !player.getPastureAtSpace(s.row, s.col))
    if (bonusStable && bonusStable.row === stable.row && bonusStable.col === stable.col) {
      return Math.max(capacity, 3)
    }
    return capacity
  },
}
