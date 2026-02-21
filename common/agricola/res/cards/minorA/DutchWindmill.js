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
    const lastRoundWasHarvest = game.isHarvestRound(game.state.round - 1)
    if (lastRoundWasHarvest) {
      player.addResource('food', 3)
      game.log.add({
        template: '{player} gets 3 additional food from {card}',
        args: { player , card: this},
      })
    }
  },
}
