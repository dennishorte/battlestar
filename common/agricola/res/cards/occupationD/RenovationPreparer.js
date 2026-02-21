module.exports = {
  id: "renovation-preparer-d123",
  name: "Renovation Preparer",
  deck: "occupationD",
  number: 123,
  type: "occupation",
  players: "1+",
  text: "For each new wood/clay room you build, you get 2 clay/2 stone.",
  onBuildRoom(game, player, roomType) {
    if (roomType === 'wood') {
      player.addResource('clay', 2)
      game.log.add({
        template: '{player} gets 2 clay from {card}',
        args: { player , card: this},
      })
    }
    else if (roomType === 'clay') {
      player.addResource('stone', 2)
      game.log.add({
        template: '{player} gets 2 stone from {card}',
        args: { player , card: this},
      })
    }
  },
}
