module.exports = {
  id: "twin-researcher-c154",
  name: "Twin Researcher",
  deck: "occupationC",
  number: 154,
  type: "occupation",
  players: "3+",
  text: "Each time you use one of the two accumulation spaces for the same type of good containing exactly the same number of goods, you can also buy 1 bonus point for 1 food.",
  onAction(game, player, actionId) {
    // Matching accumulation spaces: take-stone-1 <-> take-stone-2
    const matchingPairs = {
      'take-stone-1': 'take-stone-2',
      'take-stone-2': 'take-stone-1',
    }
    const otherSpace = matchingPairs[actionId]
    if (otherSpace && player.food >= 1) {
      const thisAmount = game.getAccumulatedResources(actionId).stone || 0
      const otherAmount = game.getAccumulatedResources(otherSpace).stone || 0
      if (thisAmount > 0 && thisAmount === otherAmount) {
        game.actions.offerBuyBonusPoint(player, this, 1)
      }
    }
  },
}
