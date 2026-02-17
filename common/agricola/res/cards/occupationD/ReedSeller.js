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
    const card = this
    const otherPlayers = game.players.all().filter(p => p !== player && p.food >= 2)
    let buyer = null

    if (otherPlayers.length > 0) {
      for (const other of otherPlayers) {
        const selection = game.actions.choose(other, ['Buy reed for 2 food', 'Pass'], {
          title: `${player.name} is selling 1 reed. Buy it for 2 food?`,
          min: 1,
          max: 1,
        })
        const sel = Array.isArray(selection) ? selection[0] : selection
        if (sel === 'Buy reed for 2 food') {
          buyer = other
          break
        }
      }
    }

    player.removeResource('reed', 1)

    if (buyer) {
      buyer.removeResource('food', 2)
      player.addResource('food', 2)
      buyer.addResource('reed', 1)
      game.log.add({
        template: '{player} sells 1 reed to {buyer} for 2 food via {card}',
        args: { player, buyer, card },
      })
    }
    else {
      player.addResource('food', 3)
      game.log.add({
        template: '{player} uses {card} to convert 1 reed into 3 food',
        args: { player, card },
      })
    }
  },
}
