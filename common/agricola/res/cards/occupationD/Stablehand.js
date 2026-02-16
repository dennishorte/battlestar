module.exports = {
  id: "stablehand-d089",
  name: "Stablehand",
  deck: "occupationD",
  number: 89,
  type: "occupation",
  players: "1+",
  text: "Each time you build at least 1 fence, you can also build a stable without paying wood for the stable.",
  onBuildFences(game, player, fenceCount) {
    if (fenceCount >= 1) {
      game.actions.offerBuildFreeStable(player, this)
    }
  },
}
