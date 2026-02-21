module.exports = {
  id: "retail-dealer-d156",
  name: "Retail Dealer",
  deck: "occupationD",
  number: 156,
  type: "occupation",
  players: "1+",
  text: "Place 3 grain and 3 food on this card. Each time you use the \"Resource Market\" action space, you also get 1 grain and 1 food from this card.",
  onPlay(game, _player) {
    const s = game.cardState(this.id)
    s.grain = 3
    s.food = 3
  },
  onAction(game, player, actionId) {
    const s = game.cardState(this.id)
    if (actionId === 'resource-market' && ((s.grain || 0) > 0 || (s.food || 0) > 0)) {
      if (s.grain > 0) {
        player.addResource('grain', 1)
        s.grain--
      }
      if (s.food > 0) {
        player.addResource('food', 1)
        s.food--
      }
      game.log.add({
        template: '{player} gets resources from {card}',
        args: { player , card: this},
      })
    }
  },
}
