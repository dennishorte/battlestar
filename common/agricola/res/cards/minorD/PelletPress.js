module.exports = {
  id: "pellet-press-d046",
  name: "Pellet Press",
  deck: "minorD",
  number: 46,
  type: "minor",
  cost: { clay: 2 },
  prereqs: { occupations: 2 },
  category: "Food Provider",
  text: "Once per round, you can pay 1 reed. If you do, place 1 food on each of the next 4 round spaces. At the start of these rounds, you get the food.",
  allowsAnytimePurchase: true,
  getAnytimeActions(game, player) {
    const state = game.cardState(this.id)
    if (state.lastUsedRound === game.state.round) {
      return []
    }
    if (player.reed < 1) {
      return []
    }
    return [{
      type: 'card-custom',
      cardId: this.id,
      cardName: this.name,
      actionKey: 'activate',
      oncePerRound: true,
      description: 'Pellet Press: Pay 1 reed \u2192 1 food/round for 4 rounds',
    }]
  },
  activate(game, player) {
    player.removeResource('reed', 1)
    game.cardState(this.id).lastUsedRound = game.state.round
    for (let i = 1; i <= 4; i++) {
      game.scheduleResource(player, 'food', game.state.round + i, 1)
    }
    game.log.add({
      template: '{player} uses Pellet Press: pays 1 reed for 4 food over 4 rounds',
      args: { player },
    })
  },
}
