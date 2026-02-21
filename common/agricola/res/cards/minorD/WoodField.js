module.exports = {
  id: "wood-field-d075",
  name: "Wood Field",
  deck: "minorD",
  number: 75,
  type: "minor",
  cost: { food: 1 },
  vps: 1,
  prereqs: { occupations: 1 },
  category: "Crop Provider",
  isField: true,
  text: "You can plant wood on this card as though it were 2 fields, but it is considered 1 field. Sow and harvest wood on this card as you would grain.",
  onPlay(game, player) {
    player.addVirtualField({
      id: 'wood-field',
      cardId: this.id,
      label: 'Wood Field',
      cropRestriction: 'wood',
      sowingAmount: 2,
      countsAsFieldForScoring: true,
    })
    game.log.add({
      template: '{player} plays {card}, gaining a wood-only field',
      args: { player , card: this},
    })
  },
}
