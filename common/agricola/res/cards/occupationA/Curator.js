module.exports = {
  id: "curator-a100",
  name: "Curator",
  deck: "occupationA",
  number: 100,
  type: "occupation",
  players: "1+",
  text: "In the returning home phase of each round, if you return at least 3 people from accumulation spaces, you can buy 1 bonus point for 1 food.",
  onReturnHome(game, player) {
    const workersFromAccumulation = player.getWorkersReturnedFromAccumulationSpaces()
    if (workersFromAccumulation >= 3 && player.food >= 1) {
      game.actions.offerBuyBonusPoint(player, this, 1)
    }
  },
}
