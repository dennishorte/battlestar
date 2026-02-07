module.exports = {
  id: "scales-b049",
  name: "Scales",
  deck: "minorB",
  number: 49,
  type: "minor",
  cost: { wood: 1 },
  prereqs: { noOccupations: true },
  category: "Food Provider",
  text: "Each time after you place an improvement or occupation in front of you, if you have the same number of improvements and occupations in play, you get 2 food.",
  onBuildImprovement(game, player) {
    const imps = player.getImprovementCount()
    const occs = player.occupationsPlayed || 0
    if (imps === occs) {
      player.addResource('food', 2)
      game.log.add({
        template: '{player} gets 2 food from Scales',
        args: { player },
      })
    }
  },
  onPlayOccupation(game, player) {
    const imps = player.getImprovementCount()
    const occs = player.occupationsPlayed || 0
    if (imps === occs) {
      player.addResource('food', 2)
      game.log.add({
        template: '{player} gets 2 food from Scales',
        args: { player },
      })
    }
  },
}
