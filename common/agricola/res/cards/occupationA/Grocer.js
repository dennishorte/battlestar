module.exports = {
  id: "grocer-a102",
  name: "Grocer",
  deck: "occupationA",
  number: 102,
  type: "occupation",
  players: "1+",
  text: "Pile the following goods on this card (wood, grain, reed, stone, vegetable, clay, reed, vegetable). At any time, you can buy the top good for 1 food.",
  allowsAnytimePurchase: true,
  onPlay(game, _player) {
    const state = game.cardState(this.id)
    state.goods = ['wood', 'grain', 'reed', 'stone', 'vegetables', 'clay', 'reed', 'vegetables']
  },
  getAnytimeActions(game, player) {
    const state = game.cardState(this.id)
    if (!state.goods || state.goods.length === 0) {
      return []
    }
    if (player.food < 1) {
      return []
    }
    const topGood = state.goods[state.goods.length - 1]
    return [{
      type: 'card-custom',
      cardId: this.id,
      cardName: this.name,
      actionKey: 'buyGood',
      description: `Grocer: Buy 1 ${topGood} for 1 food`,
    }]
  },
  buyGood(game, player) {
    const state = game.cardState(this.id)
    if (!state.goods || state.goods.length === 0) {
      return
    }
    const good = state.goods.pop()
    player.removeResource('food', 1)
    player.addResource(good, 1)
    game.log.add({
      template: '{player} uses Grocer: buys 1 {good} for 1 food',
      args: { player, good },
    })
  },
}
