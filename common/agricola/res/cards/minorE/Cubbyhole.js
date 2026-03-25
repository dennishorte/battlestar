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
  onBuildRoom(game, _player, _roomType, count = 1) {
    const s = game.cardState(this.id)
    s.stored = (s.stored || 0) + count
  },
  matches_onFeedingPhase(game, _player) {
    return (game.cardState(this.id).stored || 0) > 0
  },
  onFeedingPhase(game, player) {
    const stored = game.cardState(this.id).stored || 0
    player.addResource('food', stored)
    game.log.add({
      template: '{player} gets {amount} food',
      args: { player, amount: stored },
    })
  },
}
