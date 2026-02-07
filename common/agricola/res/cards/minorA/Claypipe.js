module.exports = {
  id: "claypipe-a053",
  name: "Claypipe",
  deck: "minorA",
  number: 53,
  type: "minor",
  cost: { clay: 1 },
  category: "Food Provider",
  text: "In the returning home phase of each round, if you gained at least 7 building resources in the preceding work phase, you get 2 food.",
  onReturnHome(game, player) {
    const gained = player.resourcesGainedThisRound || {}
    const buildingResources = (gained.wood || 0) + (gained.clay || 0) +
                                (gained.stone || 0) + (gained.reed || 0)
    if (buildingResources >= 7) {
      player.addResource('food', 2)
      game.log.add({
        template: '{player} gets 2 food from Claypipe',
        args: { player },
      })
    }
  },
}
