module.exports = {
  id: "bed-in-the-grain-field-c024",
  name: "Bed in the Grain Field",
  deck: "minorC",
  number: 24,
  type: "minor",
  cost: {},
  prereqs: { grainFields: 1 },
  category: "Actions Booster",
  text: "At the start of the next harvest, you get a \"Family Growth\" action if you have room for the newborn.",
  onPlay(game, player) {
    player.bedInGrainFieldNextHarvest = true
    game.log.add({
      template: '{player} will get Family Growth at the start of the next harvest',
      args: { player },
    })
  },
  onHarvestStart(game, player) {
    if (player.bedInGrainFieldNextHarvest) {
      delete player.bedInGrainFieldNextHarvest
      game.actions.familyGrowth(player, true)
    }
  },
}
