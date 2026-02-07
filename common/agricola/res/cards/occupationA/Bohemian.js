module.exports = {
  id: "bohemian-a157",
  name: "Bohemian",
  deck: "occupationA",
  number: 157,
  type: "occupation",
  players: "4+",
  text: "At the start of each returning home phase, if at least one \"Lessons\" action space is unoccupied, you get 1 food.",
  onReturnHomeStart(game, player) {
    if (!game.isActionOccupied('lessons-1') || !game.isActionOccupied('lessons-2')) {
      player.addResource('food', 1)
      game.log.add({
        template: '{player} gets 1 food from Bohemian',
        args: { player },
      })
    }
  },
}
