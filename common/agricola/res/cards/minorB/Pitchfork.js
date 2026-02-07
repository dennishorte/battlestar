module.exports = {
  id: "pitchfork-b062",
  name: "Pitchfork",
  deck: "minorB",
  number: 62,
  type: "minor",
  cost: { wood: 1 },
  category: "Food Provider",
  text: "Each time you use the \"Grain Seeds\" action space, if the \"Farmland\" action space is occupied you also get 3 food.",
  onAction(game, player, actionId) {
    if (actionId === 'take-grain') {
      const plowSpace = game.state.actionSpaces['plow-field']
      if (plowSpace && plowSpace.occupiedBy) {
        player.addResource('food', 3)
        game.log.add({
          template: '{player} gets 3 food from Pitchfork',
          args: { player },
        })
      }
    }
  },
}
