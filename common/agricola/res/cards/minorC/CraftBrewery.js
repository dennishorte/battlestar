module.exports = {
  id: "craft-brewery-c063",
  name: "Craft Brewery",
  deck: "minorC",
  number: 63,
  type: "minor",
  cost: { wood: 2, clay: 1 },
  category: "Food Provider",
  text: "In the feeding phase of each harvest, you can use this card to exchange 1 grain from your supply plus 1 grain from a field for 2 bonus points and 4 food.",
  onFeedingPhase(game, player) {
    if (player.grain >= 1 && player.hasGrainField()) {
      game.actions.offerCraftBrewery(player, this)
    }
  },
}
