module.exports = {
  id: "stone-importer-c124",
  name: "Stone Importer",
  deck: "occupationC",
  number: 124,
  type: "occupation",
  players: "1+",
  text: "In the breeding phase of the 1st/2nd/3rd/4th/5th/6th harvest, you can use this card to buy exactly 2 stone for 2/2/3/3/4/1 food.",
  onBreedingPhase(game, player) {
    const harvestNumber = game.getHarvestNumber()
    const costs = { 1: 2, 2: 2, 3: 3, 4: 3, 5: 4, 6: 1 }
    const cost = costs[harvestNumber]
    if (cost && player.food >= cost) {
      game.actions.offerBuyStone(player, this, 2, cost)
    }
  },
}
