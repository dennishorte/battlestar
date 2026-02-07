module.exports = {
  id: "paintbrush-e039",
  name: "Paintbrush",
  deck: "minorE",
  number: 39,
  type: "minor",
  cost: { wood: 1 },
  prereqs: { boar: 1 },
  text: "Each harvest, you can exchange exactly 1 clay for your choice of 2 food or 1 bonus point.",
  onHarvest(game, player) {
    if (player.clay >= 1) {
      game.actions.offerPaintbrush(player, this)
    }
  },
}
