module.exports = {
  id: "hardworking-man-d127",
  name: "Hardworking Man",
  deck: "occupationD",
  number: 127,
  type: "occupation",
  players: "1+",
  text: "This card is an action space for you only. If each other player has more rooms than you, it provides the \"Day Laborer\", \"Build Rooms\", and \"Major Improvement\" actions (all three).",
  createsActionSpace: 'hardworking-man-d127-action',
  actionSpaceAvailable(game, owner) {
    const myRooms = owner.getRoomCount()
    return game.players.all()
      .filter(p => p.name !== owner.name)
      .every(p => p.getRoomCount() > myRooms)
  },
  onUseCreatedSpace(game, player) {
    // Day Laborer effect
    game.actions.giveResources(player, { food: 2 })
    // Build Rooms and/or Stables
    game.actions.buildRoomAndOrStable(player)
    // Major Improvement
    game.actions.buyImprovement(player, true, false)
  },
}
