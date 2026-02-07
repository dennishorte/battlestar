module.exports = {
  id: "catcher-a107",
  name: "Catcher",
  deck: "occupationA",
  number: 107,
  type: "occupation",
  players: "1+",
  text: "Each time you place your 1st/2nd/3rd person in a round on a building resource accumulation space with exactly 5/4/3 building resources, you get 1 food.",
  onPlacePerson(game, player, actionId, personNumber) {
    const thresholds = { 1: 5, 2: 4, 3: 3 }
    if (personNumber <= 3 && game.isBuildingResourceAccumulationSpace(actionId)) {
      const resources = game.getAccumulatedBuildingResources(actionId)
      if (resources === thresholds[personNumber]) {
        player.addResource('food', 1)
        game.log.add({
          template: '{player} gets 1 food from Catcher',
          args: { player },
        })
      }
    }
  },
}
