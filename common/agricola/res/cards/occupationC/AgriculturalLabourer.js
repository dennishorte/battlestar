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
  matches_onAction(game, player, actionId) {
    return actionId === 'take-grain'
  },
  onAction(game, player, _actionId) {
    const s = game.cardState(this.id)
    const clayToGive = Math.min(1, s.clay || 0)
    if (clayToGive > 0) {
      s.clay -= clayToGive
      player.addResource('clay', clayToGive)
      game.log.add({
        template: '{player} gets {amount} clay',
        args: { player, amount: clayToGive },
      })
    }
  },
}
