module.exports = {
  id: "dutch-windmill-a063",
  name: "Dutch Windmill",
  deck: "minorA",
  number: 63,
  type: "minor",
  cost: { wood: 2, stone: 2 },
  vps: 2,
  category: "Food Provider",
  text: "Each time you take a \"Bake Bread\" action in a round immediately following a harvest, you get 3 additional food.",
  onBake(game, player) {
    const lastHarvest = game.state.lastHarvestRound || 0
    if (game.state.round === lastHarvest + 1) {
      player.addResource('food', 3)
      game.log.add({
        template: '{player} gets 3 additional food from Dutch Windmill',
        args: { player },
      })
    }
  },
}
