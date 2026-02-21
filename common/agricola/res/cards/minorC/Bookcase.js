module.exports = {
  id: "bookcase-c068",
  name: "Bookcase",
  deck: "minorC",
  number: 68,
  type: "minor",
  cost: { wood: 2 },
  prereqs: { occupations: 1 },
  category: "Crop Provider",
  text: "Each time after you play an occupation, you get 1 vegetable.",
  onPlayOccupation(game, player) {
    player.addResource('vegetables', 1)
    game.log.add({
      template: '{player} gets 1 vegetable from {card}',
      args: { player , card: this},
    })
  },
}
