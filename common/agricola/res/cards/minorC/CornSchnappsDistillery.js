module.exports = {
  id: "corn-schnapps-distillery-c064",
  name: "Corn Schnapps Distillery",
  deck: "minorC",
  number: 64,
  type: "minor",
  cost: { wood: 1, clay: 2 },
  vps: 1,
  category: "Food Provider",
  text: "Once per round, you can pay 1 grain to place 1 food on each of the next 4 round spaces. At the start of these rounds, you get the food.",
  allowsAnytimePurchase: true,
  getAnytimeActions(game, player) {
    const state = game.cardState(this.id)
    if (state.lastUsedRound === game.state.round) {
      return []
    }
    if (player.grain < 1) {
      return []
    }
    return [{
      type: 'card-custom',
      cardId: this.id,
      cardName: this.name,
      actionKey: 'activate',
      oncePerRound: true,
      description: 'Corn Schnapps Distillery: Pay 1 grain \u2192 1 food/round for 4 rounds',
    }]
  },
  activate(game, player) {
    player.removeResource('grain', 1)
    game.cardState(this.id).lastUsedRound = game.state.round
    for (let i = 1; i <= 4; i++) {
      game.scheduleResource(player, 'food', game.state.round + i, 1)
    }
    game.log.add({
      template: '{player} uses {card}: pays 1 grain for 4 food over 4 rounds',
      args: { player , card: this},
    })
  },
}
