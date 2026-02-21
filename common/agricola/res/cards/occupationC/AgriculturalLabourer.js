module.exports = {
  id: "agricultural-labourer-c120",
  name: "Agricultural Labourer",
  deck: "occupationC",
  number: 120,
  type: "occupation",
  players: "1+",
  text: "Place 8 clay on this card. For each grain you obtain, you also get 1 clay from this card.",
  onPlay(game, _player) {
    game.cardState(this.id).clay = 8
  },
  onAction(game, player, actionId) {
    // Give clay when taking grain (Grain Seeds action)
    if (actionId === 'take-grain') {
      const s = game.cardState(this.id)
      const clayToGive = Math.min(1, s.clay || 0)
      if (clayToGive > 0) {
        s.clay -= clayToGive
        player.addResource('clay', clayToGive)
        game.log.add({
          template: '{player} gets {amount} clay from {card}',
          args: { player, amount: clayToGive , card: this},
        })
      }
    }
  },
}
