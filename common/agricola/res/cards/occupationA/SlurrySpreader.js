module.exports = {
  id: "slurry-spreader-a106",
  name: "Slurry Spreader",
  deck: "occupationA",
  number: 106,
  type: "occupation",
  players: "1+",
  text: "In the field phase of each harvest, each time you take the last grain/vegetable from a field, you also get 2 food/1 food.",
  onHarvestLastCrop(game, player, cropType) {
    const food = cropType === 'grain' ? 2 : 1
    player.addResource('food', food)
    game.log.add({
      template: '{player} gets {amount} food from {card}',
      args: { player, amount: food , card: this},
    })
  },
}
