module.exports = {
  id: "patron-d152",
  name: "Patron",
  deck: "occupationD",
  number: 152,
  type: "occupation",
  players: "1+",
  text: "Immediately before each time you play an occupation after this one (even before paying the occupation cost), you get 2 food.",
  onBeforePlayOccupation(game, player) {
    player.addResource('food', 2)
    game.log.add({
      template: '{player} gets 2 food from {card}',
      args: { player , card: this},
    })
  },
}
