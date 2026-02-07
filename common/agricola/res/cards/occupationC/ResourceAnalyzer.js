module.exports = {
  id: "resource-analyzer-c157",
  name: "Resource Analyzer",
  deck: "occupationC",
  number: 157,
  type: "occupation",
  players: "4+",
  text: "Before the start of each round, if you have more building resources than all other players of at least two types, you get 1 food.",
  onBeforeRoundStart(game, player) {
    const typesLeading = game.getBuildingResourceTypesPlayerLeads(player)
    if (typesLeading >= 2) {
      player.addResource('food', 1)
      game.log.add({
        template: '{player} gets 1 food from Resource Analyzer',
        args: { player },
      })
    }
  },
}
