module.exports = {
  id: "market-stall-b008",
  name: "Market Stall",
  deck: "minorB",
  number: 8,
  type: "minor",
  cost: { grain: 1 },
  passLeft: true,
  category: "Crop Provider",
  text: "You immediately get 1 vegetable. (Effectively, you are exchanging 1 grain for 1 vegetable.)",
  onPlay(game, player) {
    player.addResource('vegetables', 1)
    game.log.add({
      template: '{player} gets 1 vegetable from {card}',
      args: { player , card: this},
    })
  },
}
