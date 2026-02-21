module.exports = {
  id: "whisky-distiller-d106",
  name: "Whisky Distiller",
  deck: "occupationD",
  number: 106,
  type: "occupation",
  players: "1+",
  text: "At any time, you can pay 1 grain. If you do, add 2 to the current round and place 4 food on the corresponding round space. At the start of that round, you get the food.",
  allowsAnytimeAction: true,
  getAnytimeActions(game, player) {
    if (this.canActivate(player)) {
      const targetRound = game.state.round + 2
      return [{
        type: 'card-custom',
        cardId: this.id,
        cardName: this.name,
        actionKey: 'activate',
        description: `Whisky Distiller: Pay 1 grain → 4 food in round ${targetRound}`,
      }]
    }
    return []
  },
  canActivate(player) {
    return player.grain >= 1
  },
  activate(game, player) {
    player.payCost({ grain: 1 })
    const targetRound = game.state.round + 2
    game.scheduleResource(player, 'food', targetRound, 4)
    game.log.add({
      template: '{player} schedules 4 food for round {round} via {card}',
      args: { player, round: targetRound , card: this},
    })
  },
}
