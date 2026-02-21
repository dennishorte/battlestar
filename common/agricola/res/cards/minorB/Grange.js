module.exports = {
  id: "grange-b037",
  name: "Grange",
  deck: "minorB",
  number: 37,
  type: "minor",
  cost: {},
  vps: 3,
  prereqs: { fields: 6, allAnimalTypes: true },
  category: "Points Provider",
  text: "When you play this card, you immediately get 1 food.",
  onPlay(game, player) {
    player.addResource('food', 1)
    game.log.add({
      template: '{player} gets 1 food from {card}',
      args: { player , card: this},
    })
  },
}
