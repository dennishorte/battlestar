module.exports = {
  id: "furniture-carpenter-b101",
  name: "Furniture Carpenter",
  deck: "occupationB",
  number: 101,
  type: "occupation",
  players: "1+",
  text: "Each harvest, if any player (including you) owns the Joinery or an upgrade thereof, you can buy exactly 1 bonus point for 2 food.",
  matches_onHarvest(game, player) {
    const joineryIds = ['joinery', 'joinery-2']
    const anyOwns = game.players.all().some(p =>
      p.majorImprovements.some(id => joineryIds.includes(id))
    )
    return anyOwns && player.food >= 2
  },
  onHarvest(game, player) {
    game.actions.offerBuyBonusPoint(player, this, 2)
  },
}
