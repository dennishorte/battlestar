module.exports = {
  id: "sheep-inspector-d093",
  name: "Sheep Inspector",
  deck: "occupationD",
  number: 93,
  type: "occupation",
  players: "1+",
  text: "Once per work phase, after you complete a person action, you can pay 1 sheep and 2 food to return another person you placed home.",
  oncePerWorkPhase: true,
  onPersonActionEnd(game, player) {
    if (player.sheep >= 1 && player.food >= 2 && player.getPlacedWorkerCount() >= 2) {
      game.actions.offerSheepInspectorReturn(player, this)
    }
  },
}
