module.exports = {
  id: "cubbyhole-e052",
  name: "Cubbyhole",
  deck: "minorE",
  number: 52,
  type: "minor",
  cost: { reed: 1, wood: 1 },
  vps: 1,
  text: "For each room that you add to your house, place 1 food from the general supply on this card. At the start of each feeding phase, you get food equal to the amount on this card.",
  storedResource: "food",
  onBuildRoom(game, player, count) {
    this.stored = (this.stored || 0) + count
  },
  onFeedingPhase(game, player) {
    const stored = this.stored || 0
    if (stored > 0) {
      player.addResource('food', stored)
      game.log.add({
        template: '{player} gets {amount} food from Cubbyhole',
        args: { player, amount: stored },
      })
    }
  },
}
