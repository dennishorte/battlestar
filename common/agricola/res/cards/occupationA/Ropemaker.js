module.exports = {
  id: "ropemaker-a145",
  name: "Ropemaker",
  deck: "occupationA",
  number: 145,
  type: "occupation",
  players: "3+",
  text: "At the end of each harvest, you get 1 reed from the general supply.",
  onHarvestEnd(game, player) {
    player.addResource('reed', 1)
    game.log.add({
      template: '{player} gets 1 reed from {card}',
      args: { player , card: this},
    })
  },
}
