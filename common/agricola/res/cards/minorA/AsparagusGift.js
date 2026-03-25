module.exports = {
  id: "asparagus-gift-a068",
  name: "Asparagus Gift",
  deck: "minorA",
  number: 68,
  type: "minor",
  cost: {},
  prereqs: { unplantedFields: 1 },
  category: "Crop Provider",
  text: "Each time you build a number of fences equal to or greater than the current round, you immediately get 1 vegetable.",
  matches_onBuildFences(game, _player, fenceCount) {
    return fenceCount >= game.state.round
  },
  onBuildFences(game, player, _fenceCount) {
    player.addResource('vegetables', 1)
    game.log.add({
      template: '{player} gets 1 vegetable',
      args: { player },
    })
  },
}
