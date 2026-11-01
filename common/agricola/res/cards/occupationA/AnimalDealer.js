module.exports = {
  id: "animal-dealer-a147",
  name: "Animal Dealer",
  deck: "occupationA",
  number: 147,
  type: "occupation",
  players: "3+",
  text: "Each time you use the \"Sheep Market\", \"Pig Market\", or \"Cattle Market\" accumulation space, you can buy 1 additional animal of the respective type for 1 food.",
  matches_onBeforePlaceAccumulatedAnimals(game, player, actionId) {
    const isMarket = actionId === 'take-sheep' || actionId === 'take-boar' || actionId === 'take-cattle'
    if (!isMarket) {
      return false
    }
    // Decide and pay before the market animals are placed, so cooking those
    // animals cannot produce the food that pays for this purchase.
    return player.food >= 1 || game.getAnytimeFoodConversionOptions(player).length > 0
  },
  onBeforePlaceAccumulatedAnimals(game, player, actionId) {
    const animalMarkets = {
      'take-sheep': 'sheep',
      'take-boar': 'boar',
      'take-cattle': 'cattle',
    }
    const bought = game.actions.offerBuyAnimal(player, this, animalMarkets[actionId], {
      deferPlacement: true,
    })
    return bought ? 1 : 0
  },
}
