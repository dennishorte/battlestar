module.exports = {
  id: "scythe-worker-a112",
  name: "Scythe Worker",
  deck: "occupationA",
  number: 112,
  type: "occupation",
  players: "1+",
  text: "When you play this card, you immediately get 1 grain. In the field phase of each harvest, you can harvest 1 additional grain from each of your grain fields.",
  onPlay(game, player) {
    player.addResource('grain', 1)
    game.log.add({
      template: '{player} gets 1 grain from Scythe Worker',
      args: { player },
    })
  },
  onHarvest(game, player) {
    const grainFields = player.getGrainFieldCount()
    if (grainFields > 0) {
      player.addResource('grain', grainFields)
      game.log.add({
        template: '{player} harvests {amount} additional grain from Scythe Worker',
        args: { player, amount: grainFields },
      })
    }
  },
}
