module.exports = {
  id: "steam-machine-c025",
  name: "Steam Machine",
  deck: "minorC",
  number: 25,
  type: "minor",
  cost: { wood: 2 },
  vps: 1,
  category: "Actions Booster",
  text: "Each work phase, if the last action space you use is an accumulation space, you can immediately afterward take a \"Bake Bread\" action.",
  onWorkPhaseEnd(game, player, lastActionId) {
    if (game.isAccumulationSpace(lastActionId)) {
      game.actions.bakeBread(player)
    }
  },
}
