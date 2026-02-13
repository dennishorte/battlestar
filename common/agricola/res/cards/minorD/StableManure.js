module.exports = {
  id: "stable-manure-d072",
  name: "Stable Manure",
  deck: "minorD",
  number: 72,
  type: "minor",
  cost: {},
  prereqs: { occupationsAtMost: 1 },
  category: "Crop Provider",
  text: "In the field phase of each harvest, you can harvest 1 additional good from a number of fields equal to the number of unfenced stables you have.",
  onHarvest(game, player) {
    const unfencedStables = player.getUnfencedStableCount()
    if (unfencedStables <= 0) {
      return
    }

    // Get fields with crops that can be harvested
    const sownFields = player.getSownFields().filter(f => !f.isVirtualField)
    if (sownFields.length === 0) {
      return
    }

    let extraHarvested = 0
    for (let i = 0; i < unfencedStables; i++) {
      const available = sownFields.filter(f => f.cropCount > 0)
      if (available.length === 0) {
        break
      }

      let field
      if (available.length === 1) {
        field = available[0]
      }
      else {
        const choices = available.map(f => `${f.row},${f.col} (${f.crop} x${f.cropCount})`)
        choices.push('Skip')
        const selection = game.actions.choose(player, choices, {
          title: `Stable Manure: Extra harvest (${i + 1}/${unfencedStables})`,
          min: 1,
          max: 1,
        })
        if (selection[0] === 'Skip') {
          break
        }
        const coords = selection[0].split(' ')[0]
        const [row, col] = coords.split(',').map(Number)
        field = available.find(f => f.row === row && f.col === col)
      }

      const space = player.getSpace(field.row, field.col)
      player.addResource(field.crop, 1)
      space.cropCount -= 1
      field.cropCount -= 1
      if (space.cropCount === 0) {
        space.crop = null
      }
      extraHarvested++
    }

    if (extraHarvested > 0) {
      game.log.add({
        template: '{player} harvests {count} extra good(s) using {card}',
        args: { player, count: extraHarvested, card: this },
      })
    }
  },
}
