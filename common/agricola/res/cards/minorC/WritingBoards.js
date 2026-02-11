module.exports = {
  id: "writing-boards-c004",
  name: "Writing Boards",
  deck: "minorC",
  number: 4,
  type: "minor",
  cost: { food: 1 },
  category: "Building Resource Provider",
  text: "You immediately get 1 wood for each occupation you have in front of you.",
  onPlay(game, player) {
    const occs = player.getOccupationCount()
    if (occs > 0) {
      player.addResource('wood', occs)
      game.log.add({
        template: '{player} gets {amount} wood from Writing Boards',
        args: { player, amount: occs },
      })
    }
  },
}
