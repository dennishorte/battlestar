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
      game.actions.offerBuildStable(player, this, { cost: { wood: 1 } })
    }
  },
  modifyUnfencedStableCapacity(player, stableIndex) {
    if (stableIndex === 0) {
      return 3
    }
    return 1
  },
}
