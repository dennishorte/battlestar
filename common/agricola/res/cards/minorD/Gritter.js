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
  onSowVegetables(game, player) {
    const vegFields = player.getVegetableFieldCount()
    if (vegFields > 0) {
      player.addResource('food', vegFields)
      game.log.add({
        template: '{player} gets {amount} food from {card}',
        args: { player, amount: vegFields , card: this},
      })
    }
  },
}
