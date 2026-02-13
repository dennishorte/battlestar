module.exports = {
  id: "land-consolidation-c069",
  name: "Land Consolidation",
  deck: "minorC",
  number: 69,
  type: "minor",
  cost: {},
  category: "Crop Provider",
  text: "At any time, you can exchange 3 grain in a field for 1 vegetable in that field.",
  allowsAnytimeAction: true,

  getAnytimeActions(game, player) {
    const grainFields = player.getFieldSpaces().filter(f => f.crop === 'grain' && f.cropCount >= 3)
    if (grainFields.length === 0) {
      return []
    }
    return [{
      type: 'card-custom',
      cardId: this.id,
      cardName: this.name,
      actionKey: 'consolidate',
      description: `${this.name}: Exchange 3 grain in a field for 1 vegetable`,
    }]
  },

  consolidate(game, player) {
    const grainFields = player.getFieldSpaces().filter(f => f.crop === 'grain' && f.cropCount >= 3)

    let targetField
    if (grainFields.length === 1) {
      targetField = grainFields[0]
    }
    else {
      const choices = grainFields.map(f => `${f.row},${f.col} (grain x${f.cropCount})`)
      const selection = game.actions.choose(player, choices, {
        title: 'Land Consolidation: Choose a field',
        min: 1,
        max: 1,
      })
      const sel = Array.isArray(selection) ? selection[0] : selection
      const [row, col] = sel.split(' ')[0].split(',').map(Number)
      targetField = grainFields.find(f => f.row === row && f.col === col)
    }

    const cell = player.farmyard.grid[targetField.row][targetField.col]
    cell.cropCount -= 3
    if (cell.cropCount === 0) {
      cell.crop = 'vegetables'
      cell.cropCount = 1
    }
    else {
      player.addResource('vegetables', 1)
    }

    game.log.add({
      template: '{player} uses {card} to convert 3 grain to 1 vegetable in a field',
      args: { player, card: this },
    })
  },
}
