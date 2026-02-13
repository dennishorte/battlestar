module.exports = {
  id: "clay-carrier-d122",
  name: "Clay Carrier",
  deck: "occupationD",
  number: 122,
  type: "occupation",
  players: "1+",
  text: "When you play this card, you immediately get 2 clay. At any time, but only once per round, you can buy 2 clay for 2 food.",
  oncePerRound: true,
  allowsAnytimeAction: true,
  onPlay(game, player) {
    player.addResource('clay', 2)
    game.log.add({
      template: '{player} gets 2 clay from Clay Carrier',
      args: { player },
    })
  },
  canBuyClay(game, player, round) {
    return player.food >= 2 && game.cardState(this.id).lastUsedRound !== round
  },
  buyClay(game, player) {
    player.payCost({ food: 2 })
    player.addResource('clay', 2)
    game.cardState(this.id).lastUsedRound = game.state.round
    game.log.add({
      template: '{player} buys 2 clay from Clay Carrier',
      args: { player },
    })
  },
}
