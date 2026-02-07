module.exports = {
  id: "recreational-carpenter-d130",
  name: "Recreational Carpenter",
  deck: "occupationD",
  number: 130,
  type: "occupation",
  players: "1+",
  text: "At the end of each work phase in which you did not use the \"Meeting Place\" action space, you can take a \"Build Rooms\" action without placing a person.",
  onWorkPhaseEnd(game, player) {
    if (!player.usedMeetingPlaceThisRound) {
      game.actions.offerBuildRooms(player, this)
    }
  },
}
