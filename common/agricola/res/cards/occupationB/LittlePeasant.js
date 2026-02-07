module.exports = {
  id: "little-peasant-b151",
  name: "Little Peasant",
  deck: "occupationB",
  number: 151,
  type: "occupation",
  players: "3+",
  text: "You immediately get 1 stone. As long as you live in a wooden house with exactly 2 rooms, action spaces - excluding Meeting Place - are not considered occupied for you.",
  excludeFromIgnore: ["meeting-place"],
  onPlay(game, player) {
    player.addResource('stone', 1)
    game.log.add({
      template: '{player} gets 1 stone from Little Peasant',
      args: { player },
    })
  },
  ignoresOccupancy(player) {
    return player.roomType === 'wood' && player.getRoomCount() === 2
  },
}
