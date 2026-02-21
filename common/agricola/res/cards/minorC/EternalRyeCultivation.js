module.exports = {
  id: "eternal-rye-cultivation-c066",
  name: "Eternal Rye Cultivation",
  deck: "minorC",
  number: 66,
  type: "minor",
  cost: {},
  prereqs: { grainFields: 1 },
  category: "Crop Provider",
  text: "After each harvest in which you have 2 or 3+ grain in your supply, you get 1 food and 1 additional grain, respectively.",
  onHarvestEnd(game, player) {
    if (player.grain >= 3) {
      player.addResource('grain', 1)
      game.log.add({
        template: '{player} gets 1 grain from {card}',
        args: { player , card: this},
      })
    }
    else if (player.grain >= 2) {
      player.addResource('food', 1)
      game.log.add({
        template: '{player} gets 1 food from {card}',
        args: { player , card: this},
      })
    }
  },
}
