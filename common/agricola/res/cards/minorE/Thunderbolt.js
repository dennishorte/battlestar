module.exports = {
  id: "thunderbolt-e004",
  name: "Thunderbolt",
  deck: "minorE",
  number: 4,
  type: "minor",
  cost: {},
  prereqs: { grainFields: 1 },
  text: "Immediately remove all grain from one of your fields to the general supply. Gain 2 wood for each grain you just removed.",
  onPlay(game, player) {
    const grainFields = []
    const grid = player.farmyard.grid
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        const space = grid[row][col]
        if (space.type === 'field' && space.crop === 'grain' && space.cropCount > 0) {
          grainFields.push({ row, col, cropCount: space.cropCount })
        }
      }
    }
    if (grainFields.length === 0) {
      return
    }

    let chosen
    if (grainFields.length === 1) {
      chosen = grainFields[0]
    }
    else {
      const choices = grainFields.map(f => `${f.row},${f.col} (grain x${f.cropCount})`)
      const selection = game.actions.choose(player, choices, {
        title: 'Thunderbolt: Choose a grain field',
        min: 1,
        max: 1,
      })
      const [row, col] = selection[0].split(' ')[0].split(',').map(Number)
      chosen = grainFields.find(f => f.row === row && f.col === col)
    }

    const field = grid[chosen.row][chosen.col]
    const grainRemoved = field.cropCount
    field.crop = null
    field.cropCount = 0
    const woodGained = grainRemoved * 2
    player.addResource('wood', woodGained)
    game.log.add({
      template: '{player} removes {grain} grain for {wood} wood using {card}',
      args: { player, grain: grainRemoved, wood: woodGained, card: this },
    })
  },
}
