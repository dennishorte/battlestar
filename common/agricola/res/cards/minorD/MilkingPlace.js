module.exports = {
  id: "milking-place-d012",
  name: "Milking Place",
  deck: "minorD",
  number: 12,
  type: "minor",
  cost: { grain: 1 },
  vps: 1,
  category: "Food Provider",
  text: "In the feeding phase of each harvest, you get 1 food. You can no longer hold animals in your house (not even via another card).",
  preventsHouseAnimals: true,
  onFeedingPhase(game, player) {
    player.addResource('food', 1)
    game.log.add({
      template: '{player} gets 1 food from {card}',
      args: { player , card: this},
    })
  },
}
