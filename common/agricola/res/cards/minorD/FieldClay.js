module.exports = {
  id: "field-clay-d005",
  name: "Field Clay",
  deck: "minorD",
  number: 5,
  type: "minor",
  cost: { food: 1 },
  prereqs: { plantedFields: 1 },
  category: "Building Resource Provider",
  text: "You immediately get 1 clay for each planted field you have.",
  onPlay(game, player) {
    const plantedFields = player.getSownFields().length
    if (plantedFields > 0) {
      player.addResource('clay', plantedFields)
      game.log.add({
        template: '{player} gets {amount} clay from Field Clay',
        args: { player, amount: plantedFields },
      })
    }
  },
}
