module.exports = {
  id: "wood-cutter-a116",
  name: "Wood Cutter",
  deck: "occupationA",
  number: 116,
  type: "occupation",
  players: "1+",
  text: "Each time you use a wood accumulation space, you get 1 additional wood.",
  onAction(game, player, actionId) {
    if (game.isWoodAccumulationSpace(actionId)) {
      player.addResource('wood', 1)
      game.log.add({
        template: '{player} gets 1 additional wood from {card}',
        args: { player , card: this},
      })
    }
  },
}
