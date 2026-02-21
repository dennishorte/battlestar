module.exports = {
  id: "garden-hoe-a079",
  name: "Garden Hoe",
  deck: "minorA",
  number: 79,
  type: "minor",
  cost: { wood: 1 },
  category: "Building Resource Provider",
  text: "Each time you take an unconditional \"Sow\" action planting vegetables in at least 1 field, you get 1 clay and 1 stone.",
  onSowVegetables(game, player, isUnconditional) {
    if (isUnconditional) {
      player.addResource('clay', 1)
      player.addResource('stone', 1)
      game.log.add({
        template: '{player} gets 1 clay and 1 stone from {card}',
        args: { player , card: this},
      })
    }
  },
}
