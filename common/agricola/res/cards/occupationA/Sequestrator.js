module.exports = {
  id: "sequestrator-a144",
  name: "Sequestrator",
  deck: "occupationA",
  number: 144,
  type: "occupation",
  players: "3+",
  text: "Place 3 reed and 4 clay on this card. The next player to have 3 pastures/5 field tiles get the 3 reed/4 clay (not retroactively).",
  onPlay(_game, _player) {
    this.reedAvailable = 3
    this.clayAvailable = 4
  },
  checkTriggers(game) {
    if (this.reedAvailable > 0 || this.clayAvailable > 0) {
      for (const player of game.players.all()) {
        if (this.reedAvailable > 0 && player.getPastureCount() >= 3) {
          player.addResource('reed', 3)
          this.reedAvailable = 0
          game.log.add({
            template: '{player} gets 3 reed from Sequestrator',
            args: { player },
          })
        }
        if (this.clayAvailable > 0 && player.getFieldCount() >= 5) {
          player.addResource('clay', 4)
          this.clayAvailable = 0
          game.log.add({
            template: '{player} gets 4 clay from Sequestrator',
            args: { player },
          })
        }
      }
    }
  },
}
