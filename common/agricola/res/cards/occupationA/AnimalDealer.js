module.exports = {
  id: "animal-dealer-a147",
  name: "Animal Dealer",
  deck: "occupationA",
  number: 147,
  type: "occupation",
  players: "3+",
  text: "Each time you use the \"Sheep Market\", \"Pig Market\", or \"Cattle Market\" accumulation space, you can buy 1 additional animal of the respective type for 1 food.",
  onAction(game, player, actionId) {
    const animalMarkets = {
      'take-sheep': 'sheep',
      'take-boar': 'boar',
      'take-cattle': 'cattle',
    }
    if (animalMarkets[actionId] && (player.food >= 1 || game.getAnytimeFoodConversionOptions(player).length > 0)) {
      game.actions.offerBuyAnimal(player, this, animalMarkets[actionId])
    }
  },
}
