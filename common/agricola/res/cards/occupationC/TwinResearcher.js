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
      const thisState = game.state.actionSpaces[actionId]
      const otherState = game.state.actionSpaces[otherSpace]
      if (thisState && otherState) {
        const thisCount = Object.values(thisState).reduce((sum, v) => typeof v === 'number' ? sum + v : sum, 0)
        const otherCount = Object.values(otherState).reduce((sum, v) => typeof v === 'number' ? sum + v : sum, 0)
        if (thisCount === otherCount) {
          game.actions.offerBuyBonusPoint(player, this, 1)
        }
      }
    }
  },
}
