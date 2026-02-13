module.exports = {
  id: "muddy-puddles-b083",
  name: "Muddy Puddles",
  deck: "minorB",
  number: 83,
  type: "minor",
  cost: { clay: 2 },
  category: "Livestock Provider",
  text: "Pile (from bottom to top) 1 wild boar, 1 food, 1 cattle, 1 food, and 1 sheep on this card. At any time, you can pay 1 clay to take the top good.",
  allowsAnytimePurchase: true,
  onPlay(game, player) {
    const state = game.cardState(this.id)
    state.stack = ['boar', 'food', 'cattle', 'food', 'sheep']
    game.log.add({
      template: '{player} places goods on Muddy Puddles',
      args: { player },
    })
  },
  getAnytimeActions(game, player) {
    const state = game.cardState(this.id)
    if (!state.stack || state.stack.length === 0) {
      return []
    }
    if (player.clay < 1) {
      return []
    }
    const topGood = state.stack[state.stack.length - 1]
    return [{
      type: 'card-custom',
      cardId: this.id,
      cardName: this.name,
      actionKey: 'takeGood',
      description: `Muddy Puddles: Pay 1 clay \u2192 get 1 ${topGood}`,
    }]
  },
  takeGood(game, player) {
    const state = game.cardState(this.id)
    if (!state.stack || state.stack.length === 0) {
      return
    }
    const good = state.stack.pop()
    player.removeResource('clay', 1)
    if (['sheep', 'boar', 'cattle'].includes(good)) {
      player.addAnimals(good, 1)
    }
    else {
      player.addResource(good, 1)
    }
    game.log.add({
      template: '{player} uses Muddy Puddles: pays 1 clay for 1 {good}',
      args: { player, good },
    })
  },
}
