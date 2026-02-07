module.exports = {
  id: "studio-c055",
  name: "Studio",
  deck: "minorC",
  number: 55,
  type: "minor",
  cost: { clay: 1, reed: 1 },
  vps: 1,
  category: "Food Provider",
  text: "In the feeding phase of each harvest, you can use this card to turn exactly 1 wood/clay/stone into 2/2/3 food.",
  onFeedingPhase(game, player) {
    if (player.wood >= 1 || player.clay >= 1 || player.stone >= 1) {
      game.actions.offerStudio(player, this)
    }
  },
}
