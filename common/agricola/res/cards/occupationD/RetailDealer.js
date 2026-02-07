module.exports = {
  id: "retail-dealer-d156",
  name: "Retail Dealer",
  deck: "occupationD",
  number: 156,
  type: "occupation",
  players: "1+",
  text: "Place 3 grain and 3 food on this card. Each time you use the \"Resource Market\" action space, you also get 1 grain and 1 food from this card.",
  onPlay(_game, _player) {
    this.grain = 3
    this.food = 3
  },
  onAction(game, player, actionId) {
    if (actionId === 'resource-market' && ((this.grain || 0) > 0 || (this.food || 0) > 0)) {
      if (this.grain > 0) {
        player.addResource('grain', 1)
        this.grain--
      }
      if (this.food > 0) {
        player.addResource('food', 1)
        this.food--
      }
      game.log.add({
        template: '{player} gets resources from Retail Dealer',
        args: { player },
      })
    }
  },
}
