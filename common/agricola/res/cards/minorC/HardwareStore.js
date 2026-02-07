module.exports = {
  id: "hardware-store-c082",
  name: "Hardware Store",
  deck: "minorC",
  number: 82,
  type: "minor",
  cost: { wood: 1, clay: 1 },
  vps: 1,
  category: "Building Resource Provider",
  text: "Each time after you use the \"Day Laborer\" action space, you can pay 2 food total to buy 1 wood, 1 clay, 1 reed, and 1 stone.",
  onAction(game, player, actionId) {
    if (actionId === 'day-laborer' && player.food >= 2) {
      game.actions.offerHardwareStore(player, this)
    }
  },
}
