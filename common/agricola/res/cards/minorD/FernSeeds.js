module.exports = {
  id: "fern-seeds-d008",
  name: "Fern Seeds",
  deck: "minorD",
  number: 8,
  type: "minor",
  cost: {},
  prereqs: { emptyFields: 1, plantedFields: 2 },
  category: "Crop Provider",
  text: "You get 2 food and 1 grain, which you must sow immediately.",
  onPlay(game, player) {
    player.addResource('food', 2)
    player.addResource('grain', 1)
    game.log.add({
      template: '{player} gets 2 food and 1 grain from Fern Seeds',
      args: { player },
    })
    game.actions.sowGrainImmediately(player, this)
  },
}
