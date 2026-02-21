module.exports = {
  id: "informant-b117",
  name: "Informant",
  deck: "occupationB",
  number: 117,
  type: "occupation",
  players: "1+",
  text: "After each work phase, if you have more stone than clay in your supply, you get 1 wood.",
  onWorkPhaseEnd(game, player) {
    if (player.stone > player.clay) {
      player.addResource('wood', 1)
      game.log.add({
        template: '{player} gets 1 wood from {card}',
        args: { player , card: this},
      })
    }
  },
}
