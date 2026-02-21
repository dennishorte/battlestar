module.exports = {
  id: "small-scale-farmer-b118",
  name: "Small-scale Farmer",
  deck: "occupationB",
  number: 118,
  type: "occupation",
  players: "1+",
  text: "As long as you live in a house with exactly 2 rooms, at the start of each round, you get 1 wood.",
  onRoundStart(game, player) {
    if (player.getRoomCount() === 2) {
      player.addResource('wood', 1)
      game.log.add({
        template: '{player} gets 1 wood from {card}',
        args: { player , card: this},
      })
    }
  },
}
