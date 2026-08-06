module.exports = {
  id: "mineral-feeder-c067",
  name: "Mineral Feeder",
  deck: "minorC",
  number: 67,
  type: "minor",
  cost: { reed: 1 },
  vps: 1,
  category: "Crop Provider",
  text: "At the start of each round that does not end with a harvest, if you have at least 1 sheep in a pasture, you get 1 grain.",
  matches_onRoundStart(game, player, round) {
    return !game.isHarvestRound(round) && player.getTotalAnimals('sheep') >= 1
  },
  onRoundStart(game, player, _round) {
    player.addResource('grain', 1)
    game.log.add({
      template: '{player} gets 1 grain from {card}',
      args: { player , card: this},
    })
  },
}
