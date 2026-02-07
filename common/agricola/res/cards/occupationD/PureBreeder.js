module.exports = {
  id: "pure-breeder-d167",
  name: "Pure Breeder",
  deck: "occupationD",
  number: 167,
  type: "occupation",
  players: "1+",
  text: "You immediately get 1 wood. After each round that does not end with a harvest, you can breed exactly one type of animal. (This is not considered a breeding phase.)",
  onPlay(game, player) {
    player.addResource('wood', 1)
    game.log.add({
      template: '{player} gets 1 wood from Pure Breeder',
      args: { player },
    })
  },
  onRoundEnd(game, player, round) {
    if (!game.isHarvestRound(round)) {
      game.actions.offerPureBreederBreeding(player, this)
    }
  },
}
