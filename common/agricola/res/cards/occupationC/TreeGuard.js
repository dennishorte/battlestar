module.exports = {
  id: "tree-guard-c102",
  name: "Tree Guard",
  deck: "occupationC",
  number: 102,
  type: "occupation",
  players: "1+",
  text: "Each time after you use a wood accumulation space, you can place 4 wood from your supply on that space to get 2 stone, 1 clay, 1 reed, and 1 grain.",
  onAction(game, player, actionId) {
    if (game.isWoodAccumulationSpace(actionId) && player.wood >= 4) {
      const selection = game.actions.choose(player, () => [
        'Place 4 wood for 2 stone, 1 clay, 1 reed, 1 grain',
        'Skip',
      ], { title: 'Tree Guard', min: 1, max: 1 })
      if (selection[0] !== 'Skip') {
        player.payCost({ wood: 4 })
        player.addResource('stone', 2)
        player.addResource('clay', 1)
        player.addResource('reed', 1)
        player.addResource('grain', 1)
        game.log.add({
          template: '{player} exchanges 4 wood for resources from {card}',
          args: { player , card: this},
        })
      }
    }
  },
}
