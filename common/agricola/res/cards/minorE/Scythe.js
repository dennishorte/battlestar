module.exports = {
  id: "scythe-e073",
  name: "Scythe",
  deck: "minorE",
  number: 73,
  type: "minor",
  cost: { wood: 1 },
  text: "During the field phase of each harvest, you can select exactly one of your fields and harvest all the crops planted in it.",
  onFieldPhase(game, player) {
    const sownFields = player.getSownFields()
    if (sownFields.length === 0) {
      return
    }

    const choices = sownFields.map(f => {
      if (f.isVirtualField) {
        return `${f.label} (${f.crop}: ${f.cropCount})`
      }
      return `Field (${f.row},${f.col}) - ${f.crop}: ${f.cropCount}`
    })
    choices.push('Skip')

    const selection = game.actions.choose(player, choices, {
      title: 'Scythe: Harvest all crops from one field',
      min: 1,
      max: 1,
    })

    if (selection[0] !== 'Skip') {
      const idx = choices.indexOf(selection[0])
      const field = sownFields[idx]
      const crop = field.crop
      const amount = field.cropCount

      if (field.isVirtualField) {
        const vf = player.getVirtualField(field.virtualFieldId)
        vf.cropCount = 0
        vf.crop = null
      }
      else {
        const space = player.farmyard.grid[field.row][field.col]
        space.cropCount = 0
        space.crop = null
      }

      player.addResource(crop, amount)
      game.log.add({
        template: '{player} uses {card} to harvest {amount} {crop} from a field',
        args: { player, amount, crop , card: this},
      })
    }
  },
}
