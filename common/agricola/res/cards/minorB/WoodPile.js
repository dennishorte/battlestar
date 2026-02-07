module.exports = {
  id: "wood-pile-b004",
  name: "Wood Pile",
  deck: "minorB",
  number: 4,
  type: "minor",
  cost: {},
  category: "Building Resource Provider",
  text: "You immediately get a number of wood equal to the number of people you have on accumulation spaces.",
  onPlay(game, player) {
    const count = player.getPeopleOnAccumulationSpaces()
    if (count > 0) {
      player.addResource('wood', count)
      game.log.add({
        template: '{player} gets {amount} wood from Wood Pile',
        args: { player, amount: count },
      })
    }
  },
}
