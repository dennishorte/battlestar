module.exports = {
  id: "town-hall-e048",
  name: "Town Hall",
  deck: "minorE",
  number: 48,
  type: "minor",
  cost: { wood: 2, clay: 2 },
  vps: 2,
  text: "In the feeding phase of each harvest, if you live in a clay or stone house, you get 1 or 2 food, respectively.",
  onFeedingPhase(game, player) {
    if (player.roomType === 'clay') {
      player.addResource('food', 1)
      game.log.add({
        template: '{player} gets 1 food from Town Hall',
        args: { player },
      })
    }
    else if (player.roomType === 'stone') {
      player.addResource('food', 2)
      game.log.add({
        template: '{player} gets 2 food from Town Hall',
        args: { player },
      })
    }
  },
}
