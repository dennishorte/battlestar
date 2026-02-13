module.exports = {
  id: "roll-over-plow-c018",
  name: "Roll-Over Plow",
  deck: "minorC",
  number: 18,
  type: "minor",
  cost: { wood: 2 },
  category: "Farm Planner",
  text: "At any time, if you have at least 3 planted fields, you can discard all goods from one of those fields to plow 1 field.",
  allowsAnytimeAction: true,

  getAnytimeActions(game, player) {
    const sownFields = player.getFieldSpaces().filter(f => f.crop && f.cropCount > 0)
    if (sownFields.length < 3) {
      return []
    }
    const validPlowSpaces = player.getValidPlowSpaces()
    if (validPlowSpaces.length === 0) {
      return []
    }
    return [{
      type: 'card-custom',
      cardId: this.id,
      cardName: this.name,
      actionKey: 'activate',
      description: `${this.name}: Clear a planted field to plow a new one`,
    }]
  },

  activate(game, player) {
    const sownFields = player.getFieldSpaces().filter(f => f.crop && f.cropCount > 0)

    // Choose field to clear
    const clearChoices = sownFields.map(f => `${f.row},${f.col} (${f.crop} x${f.cropCount})`)
    const clearSelection = game.actions.choose(player, clearChoices, {
      title: 'Roll-Over Plow: Choose field to clear',
      min: 1,
      max: 1,
    })
    const clearStr = Array.isArray(clearSelection) ? clearSelection[0] : clearSelection
    const [clearRow, clearCol] = clearStr.split(' ')[0].split(',').map(Number)

    const cell = player.farmyard.grid[clearRow][clearCol]
    cell.crop = null
    cell.cropCount = 0

    game.log.add({
      template: '{player} uses {card} to clear field at ({row},{col})',
      args: { player, card: this, row: clearRow, col: clearCol },
    })

    // Choose space to plow
    const validPlowSpaces = player.getValidPlowSpaces()
    let plowRow, plowCol
    if (validPlowSpaces.length === 1) {
      plowRow = validPlowSpaces[0].row
      plowCol = validPlowSpaces[0].col
    }
    else {
      const plowChoices = validPlowSpaces.map(s => `${s.row},${s.col}`)
      const plowSelection = game.actions.choose(player, plowChoices, {
        title: 'Roll-Over Plow: Choose space to plow',
        min: 1,
        max: 1,
      })
      const plowStr = Array.isArray(plowSelection) ? plowSelection[0] : plowSelection
      ;[plowRow, plowCol] = plowStr.split(',').map(Number)
    }

    player.plowField(plowRow, plowCol)

    game.log.add({
      template: '{player} plows a field at ({row},{col})',
      args: { player, row: plowRow, col: plowCol },
    })
  },
}
