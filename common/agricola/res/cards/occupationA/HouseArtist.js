module.exports = {
  id: "house-artist-a149",
  name: "House Artist",
  deck: "occupationA",
  number: 149,
  type: "occupation",
  players: "3+",
  text: "Each time you use the \"Traveling Players\" accumulation space, you also get a \"Build Rooms\" action. Each room you build during the action costs you 1 reed less.",
  onAction(game, player, actionId) {
    if (actionId === 'traveling-players') {
      game.actions.offerBuildRoomsWithDiscount(player, this, { reed: 1 })
    }
  },
}
