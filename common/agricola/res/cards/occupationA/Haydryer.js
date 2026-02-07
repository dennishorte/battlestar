module.exports = {
  id: "haydryer-a166",
  name: "Haydryer",
  deck: "occupationA",
  number: 166,
  type: "occupation",
  players: "4+",
  text: "Immediately before each harvest, you can buy 1 cattle for 4 food minus 1 food for each pasture you have. (The minimum cost is 0).",
  onBeforeHarvest(game, player) {
    const pastures = player.getPastureCount()
    const cost = Math.max(0, 4 - pastures)
    if (player.food >= cost && player.canPlaceAnimals('cattle', 1)) {
      game.actions.offerBuyCattle(player, this, cost)
    }
  },
}
