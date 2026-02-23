module.exports = {
  id: "wood-cart-c076",
  name: "Wood Cart",
  deck: "minorC",
  number: 76,
  type: "minor",
  cost: { wood: 3 },
  prereqs: { occupations: 3 },
  category: "Building Resource Provider",
  text: "Each time you use a wood accumulation space, you get 2 additional wood.",
  onAction(game, player, actionId) {
    if (game.isWoodAccumulationSpace(actionId)) {
      player.addResource('wood', 2)
      game.log.add({
        template: '{player} gets 2 wood from {card}',
        args: { player , card: this},
      })
    }
  },
}
