module.exports = {
  id: "farmers-market-e008",
  name: "Farmers Market",
  deck: "minorE",
  number: 8,
  type: "minor",
  cost: { food: 2 },
  text: "You immediately get 1 vegetable.",
  onPlay(game, player) {
    player.addResource('vegetables', 1)
    game.log.add({
      template: '{player} gets 1 vegetable from {card}',
      args: { player , card: this},
    })
  },
}
