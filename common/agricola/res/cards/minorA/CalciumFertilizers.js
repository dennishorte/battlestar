module.exports = {
  id: "calcium-fertilizers-a072",
  name: "Calcium Fertilizers",
  deck: "minorA",
  number: 72,
  type: "minor",
  cost: {},
  prereqs: { noFields: true },
  category: "Crop Provider",
  text: "Each time you use a \"Quarry\" accumulation space, add 1 additional good of the respective type to each of your planted fields growing a single type of crop.",
  onAction(game, player, actionId) {
    if (actionId === 'take-stone-1' || actionId === 'take-stone-2') {
      const sownFields = player.getSownFields()
      for (const field of sownFields) {
        const space = player.getSpace(field.row, field.col)
        space.cropCount += 1
        game.log.add({
          template: '{player} adds 1 {crop} to a field from Calcium Fertilizers',
          args: { player, crop: field.crop },
        })
      }
    }
  },
}
