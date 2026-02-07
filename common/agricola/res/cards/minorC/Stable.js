module.exports = {
  id: "stable-c002",
  name: "Stable",
  deck: "minorC",
  number: 2,
  type: "minor",
  cost: { wood: 1 },
  category: "Farm Planner",
  text: "Immediately build 1 stable. (The stable costs you nothing, but you must pay the cost shown on this card.)",
  onPlay(game, player) {
    game.actions.buildFreeStable(player, this)
  },
}
