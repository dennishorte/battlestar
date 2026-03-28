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
    for (let i = 1; i <= 3; i++) {
      player.addVirtualField({
        id: `rock-garden-e080-${i}`,
        cardId: 'rock-garden-e080',
        label: `Rock Garden ${i}`,
        cropRestriction: 'stone',
        countsAsFieldForScoring: 'rock-garden-e080',
      })
    }
    game.log.add({
      template: '{player} plays {card}, gaining 3 stone-only fields',
      args: { player , card: this},
    })
  },
}
