module.exports = {
  id: "mill-wheel-b064",
  name: "Mill Wheel",
  deck: "minorB",
  number: 64,
  type: "minor",
  cost: { wood: 2 },
  vps: 1,
  category: "Food Provider",
  text: "Each time you use the \"Grain Utilization\" action space while the \"Fishing\" accumulation space is occupied, you get an additional 2 food.",
  onAction(game, player, actionId) {
    if (actionId === 'sow-bake') {
      const fishingSpace = game.state.actionSpaces['fishing']
      if (fishingSpace && fishingSpace.occupiedBy) {
        player.addResource('food', 2)
        game.log.add({
          template: '{player} gets 2 food from {card}',
          args: { player , card: this},
        })
      }
    }
  },
}
