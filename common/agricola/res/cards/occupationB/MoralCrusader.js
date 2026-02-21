module.exports = {
  id: "moral-crusader-b106",
  name: "Moral Crusader",
  deck: "occupationB",
  number: 106,
  type: "occupation",
  players: "1+",
  text: "Immediately before the start of each round, if there are goods on remaining round spaces that are promised to you, you get 1 food.",
  onRoundStart(game, player) {
    const scheduledKeys = Object.keys(game.state).filter(k => k.startsWith('scheduled'))
    const hasGoods = scheduledKeys.some(key => {
      const byPlayer = game.state[key]
      if (!byPlayer || !byPlayer[player.name]) {
        return false
      }
      const byRound = byPlayer[player.name]
      // Check for goods on future round spaces (current round already collected)
      return Object.keys(byRound).some(r => Number(r) > game.state.round && byRound[r] > 0)
    })
    if (hasGoods) {
      player.addResource('food', 1)
      game.log.add({
        template: '{player} gets 1 food from {card}',
        args: { player , card: this},
      })
    }
  },
}
