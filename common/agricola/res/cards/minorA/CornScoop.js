module.exports = {
  id: "corn-scoop-a067",
  name: "Corn Scoop",
  deck: "minorA",
  number: 67,
  type: "minor",
  cost: { wood: 1 },
  category: "Crop Provider",
  text: "Each time you use the \"Grain Seeds\" action space, you get 1 additional grain.",
  matches_onAction(game, player, actionId) {
    return actionId === 'take-grain'
  },
  onAction(game, player, _actionId) {
    player.addResource('grain', 1)
    game.log.add({
      template: '{player} gets 1 additional grain',
      args: { player },
    })
  },
}
