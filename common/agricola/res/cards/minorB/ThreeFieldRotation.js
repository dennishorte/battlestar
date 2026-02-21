module.exports = {
  id: "three-field-rotation-b061",
  name: "Three-Field Rotation",
  deck: "minorB",
  number: 61,
  type: "minor",
  cost: {},
  prereqs: { occupations: 3 },
  category: "Food Provider",
  text: "At the start of the field phase of each harvest, if you have at least 1 grain field, 1 vegetable field, and 1 empty field, you get 3 food.",
  onHarvest(game, player) {
    const hasGrainField = player.getGrainFieldCount() > 0
    let hasVegetableField = false
    let hasEmptyField = false
    const rows = player.farmyard.grid.length
    const cols = player.farmyard.grid[0].length
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const space = player.farmyard.grid[r][c]
        if (space.type === 'field' && space.crop === 'vegetables') {
          hasVegetableField = true
        }
        if (space.type === 'field' && !space.crop) {
          hasEmptyField = true
        }
      }
    }
    if (hasGrainField && hasVegetableField && hasEmptyField) {
      player.addResource('food', 3)
      game.log.add({
        template: '{player} gets 3 food from {card}',
        args: { player , card: this},
      })
    }
  },
}
