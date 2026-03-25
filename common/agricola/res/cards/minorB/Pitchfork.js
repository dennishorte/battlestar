module.exports = {
  id: "pitchfork-b062",
  name: "Pitchfork",
  deck: "minorB",
  number: 62,
  type: "minor",
  cost: { wood: 1 },
  category: "Food Provider",
  text: "Each time you use the \"Grain Seeds\" action space, if the \"Farmland\" action space is occupied you also get 3 food.",
  matches_onAction(game, player, actionId) {
    return actionId === 'take-grain'
  },
  onAction(game, player, _actionId) {
    const plowSpace = game.state.actionSpaces['plow-field']
    if (plowSpace && plowSpace.occupiedBy) {
      player.addResource('food', 3)
      game.log.add({
        template: '{player} gets 3 food',
        args: { player },
      })
    }
  },
}
