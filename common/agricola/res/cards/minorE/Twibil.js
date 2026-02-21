module.exports = {
  id: "twibil-e049",
  name: "Twibil",
  deck: "minorE",
  number: 49,
  type: "minor",
  cost: { stone: 1 },
  vps: 1,
  text: "Each time after any player (including you) builds at least 1 wood room, you get 1 food.",
  onAnyBuildRoom(game, player, buildingPlayer, roomType) {
    if (roomType === 'wood') {
      player.addResource('food', 1)
      game.log.add({
        template: '{player} gets 1 food from {card}',
        args: { player , card: this},
      })
    }
  },
}
