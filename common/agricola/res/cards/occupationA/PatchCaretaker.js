module.exports = {
  id: "patch-caretaker-a161",
  name: "Patch Caretaker",
  deck: "occupationA",
  number: 161,
  type: "occupation",
  players: "4+",
  text: "Each time you use an accumulation space while already having used another accumulation space for the same type of good that work phase, you also get 1 vegetable.",
  onAction(game, player, actionId) {
    if (game.isAccumulationSpace(actionId)) {
      const goodType = game.getAccumulationSpaceGoodType(actionId)
      if (player.usedAccumulationSpaceTypes && player.usedAccumulationSpaceTypes.includes(goodType)) {
        player.addResource('vegetables', 1)
        game.log.add({
          template: '{player} gets 1 vegetable from {card}',
          args: { player , card: this},
        })
      }
      if (!player.usedAccumulationSpaceTypes) {
        player.usedAccumulationSpaceTypes = []
      }
      player.usedAccumulationSpaceTypes.push(goodType)
    }
  },
}
