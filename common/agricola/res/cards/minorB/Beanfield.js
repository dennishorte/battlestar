module.exports = {
  id: "beanfield-b068",
  name: "Beanfield",
  deck: "minorB",
  number: 68,
  type: "minor",
  cost: { food: 1 },
  vps: 1,
  prereqs: { occupations: 2 },
  category: "Crop Provider",
  text: "This card is a field that can only grow vegetables.",
  providesVegetableField: true,
  onPlay(game, player) {
    // Add a virtual field that can only grow vegetables
    player.addVirtualField({
      cardId: 'beanfield-b068',
      label: 'Beanfield',
      cropRestriction: 'vegetables',
    })
    game.log.add({
      template: '{player} plays {card}, gaining a vegetable-only field',
      args: { player , card: this},
    })
  },
}
