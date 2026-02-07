module.exports = {
  id: "hardworking-man-d127",
  name: "Hardworking Man",
  deck: "occupationD",
  number: 127,
  type: "occupation",
  players: "1+",
  text: "This card is an action space for you only. If each other player has more rooms than you, it provides the \"Day Laborer\", \"Build Rooms\", and \"Major Improvement\" actions (all three).",
  isActionSpace: true,
  actionSpaceForOwnerOnly: true,
  isAvailable(game, player) {
    const myRooms = player.getRoomCount()
    return game.players.all().filter(p => p.name !== player.name).every(p => p.getRoomCount() > myRooms)
  },
  actionSpaceEffect(game, player) {
    if (this.isAvailable(game, player)) {
      game.actions.dayLaborer(player)
      game.actions.offerBuildRooms(player, this)
      game.actions.offerBuildMajorImprovement(player, this)
    }
  },
}
