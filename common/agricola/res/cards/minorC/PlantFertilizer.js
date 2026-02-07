module.exports = {
  id: "plant-fertilizer-c008",
  name: "Plant Fertilizer",
  deck: "minorC",
  number: 8,
  type: "minor",
  cost: {},
  category: "Crop Provider",
  text: "In each field with exactly 1 good, you can immediately place 1 additional good of the same type.",
  onPlay(game, player) {
    game.actions.plantFertilizerEffect(player, this)
  },
}
