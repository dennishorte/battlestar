module.exports = {
  id: "stall-holder-c101",
  name: "Stall Holder",
  deck: "occupationC",
  number: 101,
  type: "occupation",
  players: "1+",
  text: "Once per round, if you have 0/1/2/3/4 unfenced stables on your farm, you can exchange 2 grain for 1 bonus point and 1/2/3/4/5 food.",
  allowsAnytimeAction: true,
  getAnytimeActions(game, player) {
    if (player.grain >= 2 && game.cardState(this.id).lastUsedRound !== game.state.round) {
      const unfencedStables = player.getUnfencedStableCount()
      const food = Math.min(5, unfencedStables + 1)
      return [{
        type: 'card-custom',
        cardId: this.id,
        cardName: this.name,
        actionKey: 'exchange',
        oncePerRound: true,
        description: `Stall Holder: 2 grain \u2192 1 BP + ${food} food`,
      }]
    }
    return []
  },
  exchange(game, player) {
    const unfencedStables = player.getUnfencedStableCount()
    const food = Math.min(5, unfencedStables + 1)
    player.payCost({ grain: 2 })
    player.addResource('food', food)
    player.addBonusPoints(1)
    game.cardState(this.id).lastUsedRound = game.state.round
    game.log.add({
      template: '{player} exchanges 2 grain for 1 bonus point and {food} food via {card}',
      args: { player, food , card: this},
    })
  },
}
