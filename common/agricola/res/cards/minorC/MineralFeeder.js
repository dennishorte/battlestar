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
  onRoundStart(game, player, round) {
    if (!game.isHarvestRound(round) && player.getSheepInPastures() >= 1) {
      player.addResource('grain', 1)
      game.log.add({
        template: '{player} gets 1 grain from Mineral Feeder',
        args: { player },
      })
    }
  },
}
