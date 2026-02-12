module.exports = {
  id: "crop-rotation-field-e070",
  name: "Crop Rotation Field",
  deck: "minorE",
  number: 70,
  type: "minor",
  cost: {},
  prereqs: { occupations: 1 },
  text: "This card is a field. Each time you remove the last grain or vegetable from this card, you can immediately sow vegetable or grain on this card, respectively.",
  isField: true,
  onPlay(game, player) {
    player.addVirtualField({
      cardId: 'crop-rotation-field-e070',
      label: 'Crop Rotation',
      cropRestriction: null,  // Can grow any crop
      onHarvestLast: true,
    })
    game.log.add({
      template: '{player} plays Crop Rotation Field',
      args: { player },
    })
  },
  onHarvestLast(game, player, cropType) {
    const nextCrop = cropType === 'grain' ? 'vegetables' : 'grain'
    const hasNextCrop = nextCrop === 'grain' ? player.grain >= 1 : player.vegetables >= 1
    if (hasNextCrop) {
      const selection = game.actions.choose(player, [
        `Sow ${nextCrop} on Crop Rotation Field`,
        'Skip',
      ], { title: 'Crop Rotation Field', min: 1, max: 1 })
      if (selection[0] !== 'Skip') {
        player.sowVirtualField('crop-rotation-field-e070', nextCrop)
        game.log.add({
          template: '{player} sows {crop} on Crop Rotation Field',
          args: { player, crop: nextCrop },
        })
      }
    }
  },
}
