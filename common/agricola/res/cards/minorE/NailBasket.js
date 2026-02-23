module.exports = {
  id: "nail-basket-e015",
  name: "Nail Basket",
  deck: "minorE",
  number: 15,
  type: "minor",
  cost: { reed: 1 },
  vps: 1,
  text: "Each time after you use a wood accumulation space, you can place 1 stone from your supply on that space (for the next visitor) to take a \"Build Fences\" action.",
  afterPlayerAction(game, player, actionId) {
    if (game.isWoodAccumulationSpace(actionId) && player.stone >= 1) {
      const selection = game.actions.choose(player, [
        'Pay 1 stone to build fences',
        'Skip',
      ], {
        title: 'Nail Basket',
        min: 1,
        max: 1,
      })

      if (selection[0] !== 'Skip') {
        player.addResource('stone', -1)
        game.log.add({
          template: '{player} pays 1 stone using {card} to build fences',
          args: { player, card: this },
        })
        game.actions.buildFences(player)
      }
    }
  },
}
