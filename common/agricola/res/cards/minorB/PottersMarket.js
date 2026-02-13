module.exports = {
  id: "potters-market-b069",
  name: "Potter's Market",
  deck: "minorB",
  number: 69,
  type: "minor",
  cost: { wood: 2 },
  vps: 1,
  category: "Crop Provider",
  text: "At any time, you can pay 3 clay and 2 food. If you do, place 1 vegetable on each of the next 2 round spaces. At the start of these rounds, you get the vegetable.",
  allowsAnytimePurchase: true,
  getAnytimeActions(game, player) {
    if (player.clay < 3 || player.food < 2) {
      return []
    }
    return [{
      type: 'card-custom',
      cardId: this.id,
      cardName: this.name,
      actionKey: 'activate',
      description: "Potter's Market: Pay 3 clay + 2 food \u2192 1 vegetable/round for 2 rounds",
    }]
  },
  activate(game, player) {
    player.removeResource('clay', 3)
    player.removeResource('food', 2)
    for (let i = 1; i <= 2; i++) {
      game.scheduleResource(player, 'vegetables', game.state.round + i, 1)
    }
    game.log.add({
      template: "{player} uses Potter's Market: pays 3 clay + 2 food for 2 vegetables over 2 rounds",
      args: { player },
    })
  },
}
