module.exports = {
  id: "straw-manure-d070",
  name: "Straw Manure",
  deck: "minorD",
  number: 70,
  type: "minor",
  cost: {},
  prereqs: { fields: 2 },
  category: "Crop Provider",
  text: "Before the field phase of each harvest, you can pay 1 grain from your supply to add 1 vegetable to each of up to 2 vegetable fields.",
  onBeforeFieldPhase(game, player) {
    const vegFields = player.getSownFields().filter(f => f.crop === 'vegetables')
    if (player.grain >= 1 && vegFields.length > 0) {
      const count = Math.min(vegFields.length, 2)
      const selection = game.actions.choose(player, [
        `Pay 1 grain to add vegetable to ${count} field${count > 1 ? 's' : ''}`,
        'Skip',
      ], { title: 'Straw Manure', min: 1, max: 1 })
      if (selection[0] !== 'Skip') {
        player.addResource('grain', -1)
        let added = 0
        for (const field of vegFields) {
          if (added >= 2) {
            break
          }
          if (field.isVirtualField) {
            const vf = player.getVirtualField(field.virtualFieldId)
            vf.cropCount++
          }
          else {
            player.farmyard.grid[field.row][field.col].cropCount++
          }
          added++
        }
        game.log.add({
          template: '{player} pays 1 grain to add vegetable to {count} field(s) via Straw Manure',
          args: { player, count: added },
        })
      }
    }
  },
}
