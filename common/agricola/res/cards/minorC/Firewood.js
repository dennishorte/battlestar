module.exports = {
  id: "firewood-c075",
  name: "Firewood",
  deck: "minorC",
  number: 75,
  type: "minor",
  cost: { food: 2 },
  category: "Building Resource Provider",
  text: "In the returning home phase of each round, place 1 wood on this card. Each time before you build a Fireplace, Cooking Hearth, or oven, move up to 4 wood from this card to your supply.",
  onReturnHome(game, player) {
    player.firewoodWood = (player.firewoodWood || 0) + 1
    game.log.add({
      template: '{player} places 1 wood on {card} ({total} total)',
      args: { player, total: player.firewoodWood , card: this},
    })
  },
  onBeforeBuildCooking(game, player) {
    if (player.firewoodWood > 0) {
      const woodToMove = Math.min(4, player.firewoodWood)
      player.firewoodWood -= woodToMove
      player.addResource('wood', woodToMove)
      game.log.add({
        template: '{player} moves {amount} wood from {card} to supply',
        args: { player, amount: woodToMove , card: this},
      })
    }
  },
}
