module.exports = {
  id: "grain-sieve-d065",
  name: "Grain Sieve",
  deck: "minorD",
  number: 65,
  type: "minor",
  cost: { wood: 1 },
  category: "Crop Provider",
  text: "In the field phase of each harvest, if you harvest at least 2 grain, you get 1 additional grain from the general supply.",
  onHarvestGrain(game, player, amount) {
    if (amount >= 2) {
      player.addResource('grain', 1)
      game.log.add({
        template: '{player} gets 1 grain from {card}',
        args: { player , card: this},
      })
    }
  },
}
