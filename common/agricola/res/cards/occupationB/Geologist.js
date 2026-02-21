module.exports = {
  id: "geologist-b121",
  name: "Geologist",
  deck: "occupationB",
  number: 121,
  type: "occupation",
  players: "1+",
  text: "Each time you use the \"Forest\" or \"Reed Bank\" accumulation space, you also get 1 clay. In games with 3 or more players, this also applies to the \"Clay Pit\".",
  onAction(game, player, actionId) {
    if (actionId === 'take-wood' || actionId === 'take-reed') {
      player.addResource('clay', 1)
      game.log.add({
        template: '{player} gets 1 clay from {card}',
        args: { player , card: this},
      })
    }
    else if (actionId === 'take-clay' && game.players.all().length >= 3) {
      player.addResource('clay', 1)
      game.log.add({
        template: '{player} gets 1 clay from {card}',
        args: { player , card: this},
      })
    }
  },
}
