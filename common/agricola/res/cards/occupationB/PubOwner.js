module.exports = {
  id: "pub-owner-b160",
  name: "Pub Owner",
  deck: "occupationB",
  number: 160,
  type: "occupation",
  players: "4+",
  text: "Immediately, when you play this card, and at the end of each work phase, in which the \"Forest\", \"Clay Pit\", and \"Reed Bank\" accumulation spaces are all occupied, you get 1 grain.",
  onPlay(game, player) {
    if (game.isActionOccupied('take-wood') && game.isActionOccupied('take-clay') && game.isActionOccupied('take-reed')) {
      player.addResource('grain', 1)
      game.log.add({
        template: '{player} gets 1 grain from {card}',
        args: { player , card: this},
      })
    }
  },
  onWorkPhaseEnd(game, player) {
    if (game.isActionOccupied('take-wood') && game.isActionOccupied('take-clay') && game.isActionOccupied('take-reed')) {
      player.addResource('grain', 1)
      game.log.add({
        template: '{player} gets 1 grain from {card}',
        args: { player , card: this},
      })
    }
  },
}
