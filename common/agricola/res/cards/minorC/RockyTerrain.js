module.exports = {
  id: "rocky-terrain-c080",
  name: "Rocky Terrain",
  deck: "minorC",
  number: 80,
  type: "minor",
  cost: { food: 1 },
  category: "Building Resource Provider",
  text: "Each time you plow a field (tile or card), you can also buy 1 stone for 1 food.",
  onPlowField(game, player) {
    if (player.food >= 1) {
      game.actions.offerRockyTerrain(player, this)
    }
  },
}
