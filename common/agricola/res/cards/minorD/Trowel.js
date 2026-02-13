module.exports = {
  id: "trowel-d013",
  name: "Trowel",
  deck: "minorD",
  number: 13,
  type: "minor",
  cost: { wood: 1 },
  category: "Farm Planner",
  text: "At any time, you can renovate your house to stone. From a wooden house, this costs 1 stone, 1 reed, and 1 food per room. From a clay house, this costs 1 stone per room.",
  allowsAnytimeAction: true,

  _getTrowelCost(player) {
    const rooms = player.getRoomCount()
    if (player.roomType === 'wood') {
      return { stone: rooms, reed: rooms, food: rooms }
    }
    if (player.roomType === 'clay') {
      return { stone: rooms }
    }
    return null
  },

  getAnytimeActions(game, player) {
    if (player.roomType === 'stone') {
      return []
    }
    const cost = this._getTrowelCost(player)
    if (!cost || !player.canAffordCost(cost)) {
      return []
    }

    const costDesc = Object.entries(cost).map(([r, n]) => `${n} ${r}`).join(', ')
    return [{
      type: 'card-custom',
      cardId: this.id,
      cardName: this.name,
      actionKey: 'activate',
      description: `${this.name}: Renovate to stone (${costDesc})`,
    }]
  },

  activate(game, player) {
    const cost = this._getTrowelCost(player)
    if (!cost) {
      return
    }

    const oldType = player.roomType
    player.payCost(cost)
    player.roomType = 'stone'

    // Update all room spaces
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 5; col++) {
        if (player.farmyard.grid[row][col].type === 'room') {
          player.farmyard.grid[row][col].roomType = 'stone'
        }
      }
    }

    game.log.add({
      template: '{player} uses {card} to renovate from {old} to stone',
      args: { player, card: this, old: oldType },
    })

    game.callPlayerCardHook(player, 'onRenovate', oldType, 'stone')
  },
}
