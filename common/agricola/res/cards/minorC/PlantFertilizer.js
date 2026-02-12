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
    const grid = player.farmyard.grid
    let fertilized = 0
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        const space = grid[row][col]
        if (space.type === 'field' && space.crop && space.cropCount === 1) {
          space.cropCount++
          fertilized++
        }
      }
    }
    if (fertilized > 0) {
      game.log.add({
        template: '{player} fertilizes {count} field(s) using {card}',
        args: { player, count: fertilized, card: this },
      })
    }
  },
}
