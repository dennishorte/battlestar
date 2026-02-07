module.exports = {
  id: "shifting-cultivation-a002",
  name: "Shifting Cultivation",
  deck: "minorA",
  number: 2,
  type: "minor",
  cost: { food: 2 },
  passLeft: true,
  category: "Farm Planner",
  text: "Immediately plow 1 field.",
  onPlay(game, player) {
    game.actions.plowField(player, { immediate: true })
  },
}
