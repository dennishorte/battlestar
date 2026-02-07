module.exports = {
  id: "food-chest-b059",
  name: "Food Chest",
  deck: "minorB",
  number: 59,
  type: "minor",
  cost: { wood: 1 },
  category: "Food Provider",
  text: "If you play this card on the \"Major Improvement\" action space, you immediately get 4 food. If you play it on another action space, you immediately get 2 food.",
  onPlay(game, player, actionId) {
    const food = actionId === 'major-improvement' ? 4 : 2
    player.addResource('food', food)
    game.log.add({
      template: '{player} gets {amount} food from Food Chest',
      args: { player, amount: food },
    })
  },
}
