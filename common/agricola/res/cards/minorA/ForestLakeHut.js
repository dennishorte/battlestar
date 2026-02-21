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
  onAction(game, player, actionId) {
    if (actionId === 'fishing') {
      player.addResource('wood', 1)
      game.log.add({
        template: '{player} gets 1 wood from {card}',
        args: { player , card: this},
      })
    }
    else if (actionId === 'take-wood' || actionId === 'copse' || actionId === 'take-3-wood' || actionId === 'take-2-wood') {
      player.addResource('food', 1)
      game.log.add({
        template: '{player} gets 1 food from {card}',
        args: { player , card: this},
      })
    }
  },
}
