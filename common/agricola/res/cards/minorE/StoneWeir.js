module.exports = {
  id: "stone-weir-e055",
  name: "Stone Weir",
  deck: "minorE",
  number: 55,
  type: "minor",
  cost: { stone: 1 },
  vps: 1,
  prereqs: { occupations: 2 },
  text: "Each time you use the \"Fishing\" accumulation space, if there are 0/1/2/3 food on the space, you get an additional 4/3/2/1 food from the general supply.",
  onAction(game, player, actionId) {
    if (actionId === 'fishing') {
      const foodOnSpace = game.getAccumulatedResources('fishing').food || 0
      const bonus = Math.max(0, 4 - foodOnSpace)
      if (bonus > 0) {
        player.addResource('food', bonus)
        game.log.add({
          template: '{player} gets {amount} bonus food from Stone Weir',
          args: { player, amount: bonus },
        })
      }
    }
  },
}
