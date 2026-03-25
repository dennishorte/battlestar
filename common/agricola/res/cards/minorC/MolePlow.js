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
  matches_onAction(game, player, actionId) {
    return actionId === 'plow-field' || actionId === 'plow-sow'
  },
  onAction(game, player, _actionId) {
    game.actions.plowField(player, { immediate: true })
  },
}
