module.exports = {
  id: "reed-seller-d159",
  name: "Reed Seller",
  deck: "occupationD",
  number: 159,
  type: "occupation",
  players: "1+",
  text: "At any time, you can turn 1 reed into 3 food. Any other player can prevent this by buying the reed for 2 food from you. If multiple players are interested, choose one.",
  allowsAnytimeAction: true,
  getAnytimeActions(_game, player) {
    if (player.reed < 1) {
      return []
    }
    return [{
      type: 'card-custom',
      cardId: this.id,
      cardName: this.name,
      actionKey: 'activate',
      description: `${this.name}: Sell 1 reed for 3 food (or 2 food if bought)`,
    }]
  },
  activate(game, player) {
    game.actions.offerReedSellerConversion(player, this)
  },
}
