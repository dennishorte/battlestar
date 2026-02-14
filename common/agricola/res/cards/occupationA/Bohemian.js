module.exports = {
  id: "bohemian-a157",
  name: "Bohemian",
  deck: "occupationA",
  number: 157,
  type: "occupation",
  players: "4+",
  text: "At the start of each returning home phase, if at least one \"Lessons\" action space is unoccupied, you get 1 food.",
  onReturnHomeStart(game, player) {
    // Check all possible Lessons action space IDs
    const lessonsIds = ['occupation', 'lessons-3', 'lessons-4', 'lessons-5', 'lessons-6']
    const activeLessons = lessonsIds.filter(id => game.state.actionSpaces[id])
    const hasUnoccupied = activeLessons.some(id => !game.isActionOccupied(id))

    if (hasUnoccupied) {
      player.addResource('food', 1)
      game.log.add({
        template: '{player} gets 1 food from Bohemian',
        args: { player },
      })
    }
  },
}
