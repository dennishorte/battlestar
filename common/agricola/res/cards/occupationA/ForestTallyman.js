module.exports = {
  id: "forest-tallyman-a162",
  name: "Forest Tallyman",
  deck: "occupationA",
  number: 162,
  type: "occupation",
  players: "4+",
  text: "Each time both the \"Forest\" and \"Clay Pit\" accumulation spaces are occupied, you can use the gap between them as an action space to get 2 clay and 3 wood.",
  createsActionSpace: "forest-tallyman-gap",
  actionSpaceAvailable(game) {
    return game.isActionOccupied('take-wood') && game.isActionOccupied('take-clay')
  },
  onUseCreatedSpace(game, player) {
    player.addResource('clay', 2)
    player.addResource('wood', 3)
    game.log.add({
      template: '{player} gets 2 clay and 3 wood from {card}',
      args: { player , card: this},
    })
  },
}
