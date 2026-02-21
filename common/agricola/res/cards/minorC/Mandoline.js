module.exports = {
  id: "mandoline-c046",
  name: "Mandoline",
  deck: "minorC",
  number: 46,
  type: "minor",
  cost: { wood: 1 },
  category: "Points Provider",
  text: "Once per round, you can pay 1 vegetable to get 1 bonus point. If you do, place 1 food on each of the next 2 round spaces. At the start of these rounds, you get the food.",
  allowsAnytimePurchase: true,
  getAnytimeActions(game, player) {
    const state = game.cardState(this.id)
    if (state.lastUsedRound === game.state.round) {
      return []
    }
    if (player.vegetables < 1) {
      return []
    }
    return [{
      type: 'card-custom',
      cardId: this.id,
      cardName: this.name,
      actionKey: 'activate',
      oncePerRound: true,
      description: 'Mandoline: Pay 1 vegetable \u2192 1 BP + 1 food/round for 2 rounds',
    }]
  },
  activate(game, player) {
    player.removeResource('vegetables', 1)
    player.addBonusPoints(1)
    game.cardState(this.id).lastUsedRound = game.state.round
    for (let i = 1; i <= 2; i++) {
      game.scheduleResource(player, 'food', game.state.round + i, 1)
    }
    game.log.add({
      template: '{player} uses {card}: pays 1 vegetable for 1 bonus point and 2 food over 2 rounds',
      args: { player , card: this},
    })
  },
}
