module.exports = {
  id: "threshing-board-a024",
  name: "Threshing Board",
  deck: "minorA",
  number: 24,
  type: "minor",
  cost: { wood: 1 },
  vps: 1,
  prereqs: { occupations: 2 },
  category: "Actions Booster",
  text: "Each time you use the \"Farmland\" or \"Cultivation\" action space, you get an additional \"Bake Bread\" action.",
  matches_onAction(game, player, actionId) {
    return actionId === 'plow-field' || actionId === 'plow-sow'
  },
  onAction(game, player, _actionId) {
    game.log.add({
      template: '{player} gets an additional Bake Bread action',
      args: { player },
    })
    game.actions.bakeBread(player)
  },
}
