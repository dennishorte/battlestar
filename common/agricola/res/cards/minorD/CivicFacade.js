module.exports = {
  id: "civic-facade-d048",
  name: "Civic Facade",
  deck: "minorD",
  number: 48,
  type: "minor",
  cost: { clay: 1 },
  prereqs: { rooms: 3 },
  category: "Food Provider",
  text: "Before the start of each round, if you have more occupations than improvements in your hand, you get 1 food.",
  onRoundStart(game, player) {
    const occsInHand = player.getOccupationsInHand().length
    const impsInHand = player.getImprovementsInHand().length
    if (occsInHand > impsInHand) {
      player.addResource('food', 1)
      game.log.add({
        template: '{player} gets 1 food from {card}',
        args: { player , card: this},
      })
    }
  },
}
