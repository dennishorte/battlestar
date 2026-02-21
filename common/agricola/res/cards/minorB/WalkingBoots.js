module.exports = {
  id: "walking-boots-b022",
  name: "Walking Boots",
  deck: "minorB",
  number: 22,
  type: "minor",
  cost: {},
  prereqs: { maxPeople: 4 },
  category: "Actions Booster",
  text: "You immediately get 2 food. You must immediately place a person from your supply. If you do, in the next returning home phase, you must remove that person from play.",
  onPlay(game, player) {
    player.addResource('food', 2)
    game.log.add({
      template: '{player} gets 2 food from {card}',
      args: { player , card: this},
    })
    player.availableWorkers += 1
    game.log.add({
      template: '{player} places a temporary worker from {card}',
      args: { player , card: this},
    })
  },
}
