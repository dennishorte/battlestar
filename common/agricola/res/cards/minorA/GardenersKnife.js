module.exports = {
  id: "gardeners-knife-a007",
  name: "Gardener's Knife",
  deck: "minorA",
  number: 7,
  type: "minor",
  cost: { wood: 1 },
  category: "Food Provider",
  text: "You immediately get 1 food for each grain field you have and 1 grain for each vegetable field you have.",
  onPlay(game, player) {
    const grainFields = player.getGrainFieldCount()
    const vegFields = player.getVegetableFieldCount()
    if (grainFields > 0) {
      player.addResource('food', grainFields)
      game.log.add({
        template: '{player} gets {amount} food from Gardener\'s Knife',
        args: { player, amount: grainFields },
      })
    }
    if (vegFields > 0) {
      player.addResource('grain', vegFields)
      game.log.add({
        template: '{player} gets {amount} grain from Gardener\'s Knife',
        args: { player, amount: vegFields },
      })
    }
  },
}
