module.exports = {
  id: "mole-plow-c020",
  name: "Mole Plow",
  deck: "minorC",
  number: 20,
  type: "minor",
  cost: { wood: 3, food: 1 },
  prereqs: { minRound: 9 },
  category: "Farm Planner",
  text: "Each time you use the \"Farmland\" or \"Cultivation\" action space, you can plow 1 additional field.",
  onAction(game, player, actionId) {
    if (actionId === 'plow-field' || actionId === 'plow-sow') {
      game.actions.plowField(player, { immediate: true })
    }
  },
}
