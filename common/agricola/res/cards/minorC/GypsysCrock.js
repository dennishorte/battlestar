module.exports = {
  id: "gypsys-crock-c053",
  name: "Gypsy's Crock",
  deck: "minorC",
  number: 53,
  type: "minor",
  cost: { clay: 2 },
  vps: 1,
  category: "Food Provider",
  text: "For each two goods you turn into food on the same turn with the same cooking improvement, gain 1 additional food.",
  onCook(game, player, resource, count) {
    const state = game.cardState(this.id)
    const prevCooked = state.cookedThisTurn || 0
    state.cookedThisTurn = prevCooked + count

    const prevPairs = Math.floor(prevCooked / 2)
    const newPairs = Math.floor(state.cookedThisTurn / 2)
    const bonusFood = newPairs - prevPairs

    if (bonusFood > 0) {
      player.addResource('food', bonusFood)
      game.log.add({
        template: '{player} gets {amount} food from {card}',
        args: { player, amount: bonusFood, card: this },
      })
    }
  },
  afterPlayerAction(game, _player) {
    game.cardState(this.id).cookedThisTurn = 0
  },
  onFeedingPhase(game, _player) {
    game.cardState(this.id).cookedThisTurn = 0
  },
}
