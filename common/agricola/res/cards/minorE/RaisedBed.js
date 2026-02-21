module.exports = {
  id: "raised-bed-e061",
  name: "Raised Bed",
  deck: "minorE",
  number: 61,
  type: "minor",
  cost: { clay: 2, stone: 2 },
  vps: 1,
  prereqs: { grainFields: 2 },
  text: "At the start of each harvest, you get 4 food.",
  onHarvestStart(game, player) {
    player.addResource('food', 4)
    game.log.add({
      template: '{player} gets 4 food from {card}',
      args: { player , card: this},
    })
  },
}
