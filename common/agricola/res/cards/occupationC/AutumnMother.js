module.exports = {
  id: "autumn-mother-c092",
  name: "Autumn Mother",
  deck: "occupationC",
  number: 92,
  type: "occupation",
  players: "1+",
  text: "Immediately before each harvest, if you have room in your house, you can take a \"Family Growth\" action for 3 food.",
  onBeforeHarvest(game, player) {
    if (player.hasRoomForFamilyGrowth() && player.food >= 3) {
      game.actions.offerFamilyGrowthForFood(player, this, 3)
    }
  },
}
