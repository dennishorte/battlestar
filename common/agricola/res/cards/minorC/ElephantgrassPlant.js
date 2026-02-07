module.exports = {
  id: "elephantgrass-plant-c034",
  name: "Elephantgrass Plant",
  deck: "minorC",
  number: 34,
  type: "minor",
  cost: { clay: 2, stone: 1 },
  prereqs: { occupations: 2 },
  category: "Points Provider",
  text: "Immediately after each harvest, you can use this card to exchange exactly 1 reed for 1 bonus point.",
  onHarvestEnd(game, player) {
    if (player.reed >= 1) {
      game.actions.offerElephantgrassPlant(player, this)
    }
  },
}
