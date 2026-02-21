module.exports = {
  id: "whale-oil-e051",
  name: "Whale Oil",
  deck: "minorE",
  number: 51,
  type: "minor",
  cost: { wood: 1 },
  text: "Each time you use \"Fishing\", place 1 food from the general supply on this card. Each time before you play an occupation, you get food equal to the amount on this card.",
  storedResource: "food",
  onAction(game, player, actionId) {
    if (actionId === 'fishing') {
      const s = game.cardState(this.id)
      s.stored = (s.stored || 0) + 1
    }
  },
  onBeforePlayOccupation(game, player) {
    const stored = game.cardState(this.id).stored || 0
    if (stored > 0) {
      player.addResource('food', stored)
      game.log.add({
        template: '{player} gets {amount} food from {card}',
        args: { player, amount: stored , card: this},
      })
    }
  },
}
