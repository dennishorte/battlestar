module.exports = {
  id: "pigswill-d083",
  name: "Pigswill",
  deck: "minorD",
  number: 83,
  type: "minor",
  cost: { food: 2 },
  costAlternative: { grain: 1 },
  category: "Livestock Provider",
  text: "Each time you use the \"Fencing\" action space, you also get 1 wild boar.",
  matches_onAction(game, player, actionId) {
    return actionId === 'fencing' || actionId === 'build-fences'
  },
  onAction(game, player, _actionId) {
    game.actions.handleAnimalPlacement(player, { boar: 1 })
    game.log.add({
      template: '{player} gets 1 wild boar',
      args: { player },
    })
  },
}
