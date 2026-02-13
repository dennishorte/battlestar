module.exports = {
  id: "emissary-d124",
  name: "Emissary",
  deck: "occupationD",
  number: 124,
  type: "occupation",
  players: "1+",
  text: "At any time, you can place a good from your supply on this card to get 1 stone. You must place different goods on this card. (Food is also considered a good.)",
  allowsAnytimeAction: true,
  getAnytimeActions(game, player) {
    const actions = []
    const goods = ['wood', 'clay', 'reed', 'stone', 'grain', 'vegetables', 'food']
    for (const good of goods) {
      if (this.canPlaceGood(game, player, good)) {
        actions.push({
          type: 'card-custom',
          cardId: this.id,
          cardName: this.name,
          actionKey: 'placeGood',
          actionArg: good,
          description: `Emissary: Exchange 1 ${good} for 1 stone`,
        })
      }
    }
    return actions
  },
  onPlay(game, _player) {
    game.cardState(this.id).placedGoods = []
  },
  canPlaceGood(game, player, goodType) {
    const s = game.cardState(this.id)
    return !s.placedGoods?.includes(goodType) && player[goodType] >= 1
  },
  placeGood(game, player, goodType) {
    player.payCost({ [goodType]: 1 })
    player.addResource('stone', 1)
    const s = game.cardState(this.id)
    if (!s.placedGoods) {
      s.placedGoods = []
    }
    s.placedGoods.push(goodType)
    game.log.add({
      template: '{player} exchanges 1 {good} for 1 stone via Emissary',
      args: { player, good: goodType },
    })
  },
}
