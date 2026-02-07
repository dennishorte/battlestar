module.exports = {
  id: "child-ombudsman-d092",
  name: "Child Ombudsman",
  deck: "occupationD",
  number: 92,
  type: "occupation",
  players: "1+",
  text: "From round 5 on, if you have room in your house, at the end of each person action, you can take a \"Family Growth\" action with that person. If you do, you get 2 negative points.",
  onPersonActionEnd(game, player) {
    if (game.state.round >= 5 && player.hasRoomForFamilyGrowth()) {
      game.actions.offerChildOmbudsmanGrowth(player, this)
    }
  },
}
