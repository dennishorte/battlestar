module.exports = {
  id: "grain-bag-e067",
  name: "Grain Bag",
  deck: "minorE",
  number: 67,
  type: "minor",
  cost: { reed: 1 },
  vps: 1,
  text: "Each time you use the \"Grain Seeds\" action space, you get 1 additional grain for each baking improvement you have.",
  onAction(game, player, actionId) {
    if (actionId === 'grain-seeds') {
      const bakingImprovements = player.getBakingImprovementCount()
      if (bakingImprovements > 0) {
        player.addResource('grain', bakingImprovements)
        game.log.add({
          template: '{player} gets {amount} bonus grain from Grain Bag',
          args: { player, amount: bakingImprovements },
        })
      }
    }
  },
}
