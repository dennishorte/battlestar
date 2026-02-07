module.exports = {
  id: "rock-garden-e080",
  name: "Rock Garden",
  deck: "minorE",
  number: 80,
  type: "minor",
  cost: {},
  text: "You can only plant stone on this card. Plant as though it were 3 fields, but it is considered 1 field. Sow and harvest stone on this card as you would vegetables.",
  isField: true,
  fieldCrop: "stone",
  fieldSize: 3,
  onPlay(game, player) {
    player.addVirtualField({
      cardId: 'rock-garden-e080',
      label: 'Rock Garden',
      cropRestriction: 'stone',
      sowingAmount: 6,  // Counts as 3 fields × 2 vegetables = 6
    })
    game.log.add({
      template: '{player} plays Rock Garden, gaining a stone-only field (counts as 3 fields)',
      args: { player },
    })
  },
}
