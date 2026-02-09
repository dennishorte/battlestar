module.exports = {
  id: "stall-holder-c101",
  name: "Stall Holder",
  deck: "occupationC",
  number: 101,
  type: "occupation",
  players: "1+",
  text: "Once per round, if you have 0/1/2/3/4 unfenced stables on your farm, you can exchange 2 grain for 1 bonus point and 1/2/3/4/5 food.",
  oncePerRound: true,
  canExchange(player) {
    return player.grain >= 2
  },
  doExchange(game, player) {
    const unfencedStables = player.getUnfencedStableCount()
    const food = Math.min(5, unfencedStables + 1)
    player.payCost({ grain: 2 })
    player.addResource('food', food)
    player.bonusPoints = (player.bonusPoints || 0) + 1
    game.log.add({
      template: '{player} exchanges 2 grain for 1 bonus point and {food} food via Stall Holder',
      args: { player, food },
    })
  },
}
