module.exports = {
  id: "changeover-d071",
  name: "Changeover",
  deck: "minorD",
  number: 71,
  type: "minor",
  cost: {},
  category: "Crop Provider",
  text: "At any time, if a field contains exactly 1 good as a result of a harvest, you can discard that good and immediately take a \"Sow\" action limited to that field.",

  onFieldPhaseEnd(game, player) {
    const fieldsWithOne = player.getFieldSpaces().filter(f => f.crop && f.cropCount === 1)
    if (fieldsWithOne.length === 0) {
      return
    }

    for (const field of fieldsWithOne) {
      const canSowGrain = player.grain >= 1
      const canSowVeg = player.vegetables >= 1
      if (!canSowGrain && !canSowVeg) {
        break
      }

      const choices = []
      if (canSowGrain) {
        choices.push(`Sow grain at (${field.row},${field.col})`)
      }
      if (canSowVeg) {
        choices.push(`Sow vegetables at (${field.row},${field.col})`)
      }
      choices.push('Skip')

      const selection = game.actions.choose(player, choices, {
        title: `Changeover: Field (${field.row},${field.col}) has 1 ${field.crop}`,
        min: 1,
        max: 1,
      })
      const sel = Array.isArray(selection) ? selection[0] : selection
      if (sel === 'Skip') {
        continue
      }

      // Discard the existing crop
      const cell = player.farmyard.grid[field.row][field.col]
      cell.crop = null
      cell.cropCount = 0

      // Sow the chosen crop
      const cropType = sel.startsWith('Sow grain') ? 'grain' : 'vegetables'
      player.sowField(field.row, field.col, cropType)

      game.log.add({
        template: '{player} uses {card} to replace 1 {oldCrop} with {newCrop} at ({row},{col})',
        args: { player, card: this, oldCrop: field.crop, newCrop: cropType, row: field.row, col: field.col },
      })
    }
  },
}
