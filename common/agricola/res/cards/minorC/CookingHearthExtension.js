module.exports = {
  id: "cooking-hearth-extension-c062",
  name: "Cooking Hearth Extension",
  deck: "minorC",
  number: 62,
  type: "minor",
  cost: { clay: 2 },
  category: "Food Provider",
  text: "Each harvest, you can use each of your cooking improvements once to get double the amount of food for 1 animal or vegetable.",
  onHarvest(game, player) {
    game.actions.offerCookingHearthExtension(player, this)
  },
}
