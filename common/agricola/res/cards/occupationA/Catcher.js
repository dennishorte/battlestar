module.exports = {
  id: "catcher-a107",
  name: "Catcher",
  deck: "occupationA",
  number: 107,
  type: "occupation",
  players: "1+",
  text: "Each time you place your 1st/2nd/3rd person in a round on a building resource accumulation space with exactly 5/4/3 building resources, you get 1 food.",
  onAction(game, player, actionId) {
    if (!game.isBuildingResourceAccumulationSpace(actionId)) {
      return
    }

    const personNumber = player.getPersonPlacedThisRound()
    if (personNumber > 3) {
      return
    }

    const thresholds = { 1: 5, 2: 4, 3: 3 }
    // Get accumulated resources before they're taken
    const resources = game.getAccumulatedResources(actionId)
    const total = (resources.wood || 0) + (resources.clay || 0) + (resources.reed || 0) + (resources.stone || 0)
    if (total === thresholds[personNumber]) {
      player.addResource('food', 1)
      game.log.add({
        template: '{player} gets 1 food from Catcher',
        args: { player },
      })
    }
  },
}
