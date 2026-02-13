module.exports = {
  id: "stone-house-reconstruction-e013",
  name: "Stone House Reconstruction",
  deck: "minorE",
  number: 13,
  type: "minor",
  cost: { stone: 1 },
  vps: 1,
  text: "At any time, you can renovate your clay house to a stone house without placing a person.",
  allowsAnytimeAction: true,

  getAnytimeActions(game, player) {
    if (player.roomType !== 'clay') {
      return []
    }
    if (!player.canRenovate('stone')) {
      return []
    }

    const cost = player.getRenovationCost('stone')
    const costDesc = Object.entries(cost).filter(([, n]) => n > 0).map(([r, n]) => `${n} ${r}`).join(', ')
    return [{
      type: 'card-custom',
      cardId: this.id,
      cardName: this.name,
      actionKey: 'activate',
      description: `${this.name}: Renovate to stone (${costDesc})`,
    }]
  },

  activate(game, player) {
    if (player.roomType !== 'clay') {
      return
    }

    player.renovate('stone')

    game.log.add({
      template: '{player} uses {card} to renovate from clay to stone',
      args: { player, card: this },
    })
  },
}
