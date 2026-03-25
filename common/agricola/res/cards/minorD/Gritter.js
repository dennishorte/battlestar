module.exports = {
  id: "gritter-d058",
  name: "Gritter",
  deck: "minorD",
  number: 58,
  type: "minor",
  cost: { wood: 1 },
  prereqs: { minRound: 5 },
  category: "Food Provider",
  text: "At the end of each action in which you sow vegetables in a field, you get 1 food for each vegetable field you have (including the new ones).",
  matches_onSowVegetables(_game, player) {
    return player.getVegetableFieldCount() > 0
  },
  onSowVegetables(game, player) {
    const vegFields = player.getVegetableFieldCount()
    player.addResource('food', vegFields)
    game.log.add({
      template: '{player} gets {amount} food',
      args: { player, amount: vegFields },
    })
  },
}
