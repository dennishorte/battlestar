module.exports = {
  id: "harvest-house-b071",
  name: "Harvest House",
  deck: "minorB",
  number: 71,
  type: "minor",
  cost: { wood: 1, clay: 1, reed: 1 },
  vps: 2,
  category: "Crop Provider",
  text: "When you play this card, if the number of completed harvests is equal to the number of occupations you played, you immediately get 1 food, 1 grain and 1 vegetable.",
  onPlay(game, player) {
    const harvests = game.getCompletedHarvestCount()
    const occs = player.occupationsPlayed || 0
    if (harvests === occs) {
      player.addResource('food', 1)
      player.addResource('grain', 1)
      player.addResource('vegetables', 1)
      game.log.add({
        template: '{player} gets 1 food, 1 grain, and 1 vegetable from Harvest House',
        args: { player },
      })
    }
  },
}
