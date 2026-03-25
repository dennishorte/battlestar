module.exports = {
  id: "carter-e140",
  name: "Carter",
  deck: "occupationE",
  number: 140,
  type: "occupation",
  players: "1+",
  text: "Next round, each time you use a building resource accumulation space, you also get 1 food for each building resource that you take from the space.",
  onPlay(game, _player) {
    game.cardState(this.id).activeRound = game.state.round + 1
  },
  matches_onAction(game, player, actionId) {
    return game.state.round === game.cardState(this.id).activeRound && game.isBuildingResourceAccumulationSpace(actionId)
  },
  onAction(game, player, actionId, resources) {
    const total = (resources.wood || 0) + (resources.clay || 0) + (resources.reed || 0) + (resources.stone || 0)
    if (total > 0) {
      player.addResource('food', total)
      game.log.add({
        template: '{player} gets {amount} food',
        args: { player, amount: total },
      })
    }
  },
}
