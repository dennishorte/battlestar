module.exports = {
  id: "pastor-b163",
  name: "Pastor",
  deck: "occupationB",
  number: 163,
  type: "occupation",
  players: "4+",
  text: "Once you are the only player to live in a house with only 2 rooms, you immediately get 3 wood, 2 clay, 1 reed, and 1 stone (only once).",
  checkTrigger(game, player) {
    if (!player.pastorTriggered) {
      const playersWithTwoRooms = game.players.all().filter(p => p.getRoomCount() === 2)
      if (playersWithTwoRooms.length === 1 && playersWithTwoRooms[0].name === player.name) {
        player.pastorTriggered = true
        player.addResource('wood', 3)
        player.addResource('clay', 2)
        player.addResource('reed', 1)
        player.addResource('stone', 1)
        game.log.add({
          template: '{player} gets 3 wood, 2 clay, 1 reed, and 1 stone from {card}',
          args: { player , card: this},
        })
      }
    }
  },
}
