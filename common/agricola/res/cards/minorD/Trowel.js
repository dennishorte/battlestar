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

    game.actions._completeRenovation(player, 'stone', {
      cost,
      logTemplate: '{player} uses {card} to renovate from {old} to stone',
      logArgs: { card: this },
    })
  },
}
