module.exports = {
  id: "food-merchant-d113",
  name: "Food Merchant",
  deck: "occupationD",
  number: 113,
  type: "occupation",
  players: "1+",
  text: "For each grain you harvest from a field, you can buy 1 vegetable for 3 food. If you harvest the last grain from a field, the vegetable costs you only 2 food.",
  onHarvestGrain(game, player, grainCount, isLastFromField) {
    const cost = isLastFromField ? 2 : 3
    if (player.food >= cost) {
      game.actions.offerBuyVegetable(player, this, cost, grainCount)
    }
  },
}
