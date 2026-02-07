module.exports = {
  id: "wood-workshop-b075",
  name: "Wood Workshop",
  deck: "minorB",
  number: 75,
  type: "minor",
  cost: { clay: 1 },
  prereqs: { occupations: 1 },
  category: "Building Resource Provider",
  text: "Each time before you play or build an improvement, you get 1 wood.",
  onBuildImprovement(game, player) {
    player.addResource('wood', 1)
    game.log.add({
      template: '{player} gets 1 wood from Wood Workshop',
      args: { player },
    })
  },
}
