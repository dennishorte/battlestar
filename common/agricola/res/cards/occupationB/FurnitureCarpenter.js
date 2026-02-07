module.exports = {
  id: "furniture-carpenter-b101",
  name: "Furniture Carpenter",
  deck: "occupationB",
  number: 101,
  type: "occupation",
  players: "1+",
  text: "Each harvest, if any player (including you) owns the Joinery or an upgrade thereof, you can buy exactly 1 bonus point for 2 food.",
  onHarvest(game, player) {
    if (game.anyPlayerOwnsJoinery() && player.food >= 2) {
      game.actions.offerBuyBonusPoint(player, this, 2)
    }
  },
}
