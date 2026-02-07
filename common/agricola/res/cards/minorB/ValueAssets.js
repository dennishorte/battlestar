module.exports = {
  id: "value-assets-b082",
  name: "Value Assets",
  deck: "minorB",
  number: 82,
  type: "minor",
  cost: {},
  category: "Building Resource Provider",
  text: "After each harvest, you can buy exactly one of the following building resources: 1 food → 1 wood; 1 food → 1 clay; 2 food → 1 reed; 2 food → 1 stone.",
  onHarvestEnd(game, player) {
    if (player.food >= 1) {
      game.actions.offerValueAssets(player, this)
    }
  },
}
