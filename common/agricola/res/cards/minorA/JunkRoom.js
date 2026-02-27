module.exports = {
  id: "junk-room-a055",
  name: "Junk Room",
  deck: "minorA",
  number: 55,
  type: "minor",
  cost: { wood: 1, clay: 1 },
  category: "Food Provider",
  text: "Each time after you build an improvement, including this one, you get 1 food.",
  onBuildImprovement(game, player) {
    player.addResource('food', 1)
    game.log.add({
      template: '{player} gets 1 food from {card}',
      args: { player , card: this},
    })
  },
}
