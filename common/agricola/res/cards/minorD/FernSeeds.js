module.exports = {
  id: "fern-seeds-d008",
  name: "Fern Seeds",
  deck: "minorD",
  number: 8,
  type: "minor",
  cost: {},
  prereqs: { emptyFields: 1, plantedFields: 2 },
  category: "Crop Provider",
  text: "You get 2 food and 1 grain, which you must sow immediately.",
  onPlay(game, player) {
    player.addResource('food', 2)
    player.addResource('grain', 1)
    game.log.add({
      template: '{player} gets 2 food and 1 grain from {card}',
      args: { player, card: this },
    })

    // Must sow grain immediately
    const emptyFields = player.getEmptyFields().filter(f => !f.isVirtualField)
    if (emptyFields.length === 0 || player.grain < 1) {
      return
    }

    let row, col
    if (emptyFields.length === 1) {
      row = emptyFields[0].row
      col = emptyFields[0].col
    }
    else {
      const choices = emptyFields.map(f => `${f.row},${f.col}`)
      const selection = game.actions.choose(player, choices, {
        title: 'Fern Seeds: Choose field to sow grain',
        min: 1,
        max: 1,
      })
      ;[row, col] = selection[0].split(',').map(Number)
    }

    player.sowField(row, col, 'grain')
    game.log.add({
      template: '{player} sows grain at ({row},{col}) using {card}',
      args: { player, row, col, card: this },
    })
  },
}
