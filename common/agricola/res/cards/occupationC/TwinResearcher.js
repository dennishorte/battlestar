module.exports = {
  id: "twin-researcher-c154",
  name: "Twin Researcher",
  deck: "occupationC",
  number: 154,
  type: "occupation",
  players: "3+",
  text: "Each time you use one of the two accumulation spaces for the same type of good containing exactly the same number of goods, you can also buy 1 bonus point for 1 food.",
  onAction(game, player, actionId) {
    const otherSpace = game.getMatchingAccumulationSpace(actionId)
    if (otherSpace) {
      const thisCount = game.getAccumulatedCount(actionId)
      const otherCount = game.getAccumulatedCount(otherSpace)
      if (thisCount === otherCount && player.food >= 1) {
        game.actions.offerBuyBonusPoint(player, this, 1)
      }
    }
  },
}
