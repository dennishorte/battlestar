module.exports = {
  id: "lettuce-patch-c070",
  name: "Lettuce Patch",
  deck: "minorC",
  number: 70,
  type: "minor",
  cost: {},
  vps: 1,
  prereqs: { occupations: 3 },
  category: "Crop Provider",
  text: "This card is a field that can only grow vegetables. You can immediately turn each vegetable you harvested from this card into 4 food.",
  providesVegetableField: true,
  onPlay(game, player) {
    player.addVirtualField({
      cardId: 'lettuce-patch-c070',
      label: 'Lettuce Patch',
      cropRestriction: 'vegetables',
      onHarvest: true,
    })
    game.log.add({
      template: '{player} plays Lettuce Patch, gaining a vegetable-only field',
      args: { player },
    })
  },
  onHarvest(game, player, amount) {
    // Offer to convert harvested vegetables to food (4 food each)
    if (amount > 0) {
      game.actions.offerLettucePatchConversion(player, amount)
    }
  },
}
