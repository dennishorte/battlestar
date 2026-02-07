module.exports = {
  id: "bed-maker-a093",
  name: "Bed Maker",
  deck: "occupationA",
  number: 93,
  type: "occupation",
  players: "1+",
  text: "Each time you add rooms to your house, you can also pay 1 wood and 1 grain to immediately get a \"Family Growth with Room Only\" action.",
  onBuildRoom(game, player) {
    if (player.wood >= 1 && player.grain >= 1 && player.canGrowFamily()) {
      game.actions.offerBedMakerGrowth(player, this)
    }
  },
}
