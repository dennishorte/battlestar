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
  fieldSize: 2,
  text: "You can plant wood on this card as though it were 2 fields, but it is considered 1 field. Sow and harvest wood on this card as you would grain.",
  onPlay(game, player) {
    for (let i = 1; i <= 2; i++) {
      player.addVirtualField({
        id: `wood-field-d075-${i}`,
        cardId: this.id,
        label: `Wood Field ${i}`,
        cropRestriction: 'wood',
        countsAsFieldForScoring: 'wood-field-d075',
      })
    }
    game.log.add({
      template: '{player} plays {card}, gaining 2 wood-only fields',
      args: { player , card: this},
    })
  },
}
