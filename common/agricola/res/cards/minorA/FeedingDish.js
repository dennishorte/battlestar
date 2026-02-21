module.exports = {
  id: "feeding-dish-a066",
  name: "Feeding Dish",
  deck: "minorA",
  number: 66,
  type: "minor",
  cost: { wood: 1 },
  category: "Crop Provider",
  text: "Each time you use an animal accumulation space while already having an animal of that type, you get 1 grain.",
  onAction(game, player, actionId) {
    const animalMarkets = {
      'take-sheep': 'sheep',
      'take-boar': 'boar',
      'take-cattle': 'cattle',
    }
    const animalType = animalMarkets[actionId]
    if (animalType && player.getTotalAnimals(animalType) > 0) {
      player.addResource('grain', 1)
      game.log.add({
        template: '{player} gets 1 grain from {card}',
        args: { player , card: this},
      })
    }
  },
}
