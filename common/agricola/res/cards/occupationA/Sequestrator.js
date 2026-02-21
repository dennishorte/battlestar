module.exports = {
  id: "sequestrator-a144",
  name: "Sequestrator",
  deck: "occupationA",
  number: 144,
  type: "occupation",
  players: "3+",
  text: "Place 3 reed and 4 clay on this card. The next player to have 3 pastures/5 field tiles get the 3 reed/4 clay (not retroactively).",
  onPlay(game, _player) {
    const s = game.cardState(this.id)
    s.reedAvailable = 3
    s.clayAvailable = 4
  },
  checkTrigger(game, _owner) {
    const s = game.cardState(this.id)
    if (s.reedAvailable > 0 || s.clayAvailable > 0) {
      for (const player of game.players.all()) {
        if (s.reedAvailable > 0 && player.getPastureCount() >= 3) {
          player.addResource('reed', 3)
          s.reedAvailable = 0
          game.log.add({
            template: '{player} gets 3 reed from {card}',
            args: { player , card: this},
          })
        }
        if (s.clayAvailable > 0 && player.getFieldCount() >= 5) {
          player.addResource('clay', 4)
          s.clayAvailable = 0
          game.log.add({
            template: '{player} gets 4 clay from {card}',
            args: { player , card: this},
          })
        }
      }
    }
  },
}
