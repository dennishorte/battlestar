module.exports = {
  id: "forest-lake-hut-a042",
  name: "Forest Lake Hut",
  deck: "minorA",
  number: 42,
  type: "minor",
  cost: { clay: 2 },
  vps: 1,
  category: "Food Provider",
  text: "Each time you use the \"Fishing\"/\"Forest\" accumulation space, you also get 1 wood/food.",
  matches_onAction(game, player, actionId) {
    return actionId === 'fishing' || game.isWoodAccumulationSpace(actionId)
  },
  onAction(game, player, actionId) {
    if (actionId === 'fishing') {
      player.addResource('wood', 1)
      game.log.add({
        template: '{player} gets 1 wood',
        args: { player },
      })
    }
    else if (game.isWoodAccumulationSpace(actionId)) {
      player.addResource('food', 1)
      game.log.add({
        template: '{player} gets 1 food',
        args: { player },
      })
    }
  },
}
