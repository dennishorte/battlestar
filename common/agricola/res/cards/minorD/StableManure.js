module.exports = {
  id: "stable-manure-d072",
  name: "Stable Manure",
  deck: "minorD",
  number: 72,
  type: "minor",
  cost: {},
  prereqs: { occupationsAtMost: 1 },
  category: "Crop Provider",
  text: "In the field phase of each harvest, you can harvest 1 additional good from a number of fields equal to the number of unfenced stables you have.",
  onHarvest(game, player) {
    const unfencedStables = player.getUnfencedStableCount()
    if (unfencedStables > 0) {
      game.actions.harvestExtraGoods(player, this, unfencedStables)
    }
  },
}
