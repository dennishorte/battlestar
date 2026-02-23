module.exports = {
  id: "stone-axe-e075",
  name: "Stone Axe",
  deck: "minorE",
  number: 75,
  type: "minor",
  cost: { wood: 1, clay: 1 },
  vps: 1,
  prereqs: { occupations: 2 },
  text: "Each time you use a wood accumulation space, you can return 1 stone to the general supply to get an additional 3 wood.",
  onAction(game, player, actionId) {
    if (game.isWoodAccumulationSpace(actionId) && player.stone >= 1) {
      const selection = game.actions.choose(player, [
        'Return 1 stone for 3 additional wood',
        'Skip',
      ], {
        title: 'Stone Axe',
        min: 1,
        max: 1,
      })
      if (selection[0] !== 'Skip') {
        player.payCost({ stone: 1 })
        player.addResource('wood', 3)
        game.log.add({
          template: '{player} returns 1 stone for 3 wood using {card}',
          args: { player, card: this },
        })
      }
    }
  },
}
