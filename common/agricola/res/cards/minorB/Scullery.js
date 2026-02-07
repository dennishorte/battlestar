module.exports = {
  id: "scullery-b057",
  name: "Scullery",
  deck: "minorB",
  number: 57,
  type: "minor",
  cost: { wood: 1, clay: 1 },
  category: "Food Provider",
  text: "At the start of each round, if you live in a wooden house, you get 1 food.",
  onRoundStart(game, player) {
    if (player.roomType === 'wood') {
      player.addResource('food', 1)
      game.log.add({
        template: '{player} gets 1 food from Scullery',
        args: { player },
      })
    }
  },
}
