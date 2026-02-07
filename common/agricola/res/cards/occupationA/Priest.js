module.exports = {
  id: "priest-a125",
  name: "Priest",
  deck: "occupationA",
  number: 125,
  type: "occupation",
  players: "1+",
  text: "When you play this card, if you live in a clay house with exactly 2 rooms, you immediately get 3 clay, 2 reed, and 2 stone.",
  onPlay(game, player) {
    if (player.roomType === 'clay' && player.getRoomCount() === 2) {
      player.addResource('clay', 3)
      player.addResource('reed', 2)
      player.addResource('stone', 2)
      game.log.add({
        template: '{player} gets 3 clay, 2 reed, and 2 stone from Priest',
        args: { player },
      })
    }
  },
}
