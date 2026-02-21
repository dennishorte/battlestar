module.exports = {
  id: "rustic-b111",
  name: "Rustic",
  deck: "occupationB",
  number: 111,
  type: "occupation",
  players: "1+",
  text: "For each clay room you build, you get 2 food and 1 bonus point. (This does not apply to stone rooms and renovated wood rooms).",
  onBuildRoom(game, player, roomType, isRenovation) {
    if (roomType === 'clay' && !isRenovation) {
      player.addResource('food', 2)
      player.addBonusPoints(1)
      game.log.add({
        template: '{player} gets 2 food and 1 bonus point from {card}',
        args: { player , card: this},
      })
    }
  },
}
