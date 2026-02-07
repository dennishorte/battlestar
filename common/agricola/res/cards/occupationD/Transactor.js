module.exports = {
  id: "transactor-d098",
  name: "Transactor",
  deck: "occupationD",
  number: 98,
  type: "occupation",
  players: "1+",
  text: "Immediately before the final harvest at the end of round 14, you can take all the building resources that are left on the entire game board.",
  onBeforeFinalHarvest(game, player) {
    const resources = game.collectAllBuildingResourcesFromBoard()
    for (const [resource, amount] of Object.entries(resources)) {
      player.addResource(resource, amount)
    }
    game.log.add({
      template: '{player} collects all building resources from board via Transactor',
      args: { player },
    })
  },
}
