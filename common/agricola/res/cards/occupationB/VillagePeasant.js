module.exports = {
  id: "village-peasant-b133",
  name: "Village Peasant",
  deck: "occupationB",
  number: 133,
  type: "occupation",
  players: "1+",
  text: "At the start of scoring, you get a number of vegetables equal to the smallest of the numbers of major improvements, minor improvements, and occupations you have.",
  onScoring(game, player) {
    const minCount = Math.min(
      player.majorImprovements.length,
      player.playedMinorImprovements.length,
      player.getOccupationCount()
    )
    if (minCount > 0) {
      player.addResource('vegetables', minCount)
      game.log.add({
        template: '{player} gets {amount} vegetables from Village Peasant',
        args: { player, amount: minCount },
      })
    }
  },
}
