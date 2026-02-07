module.exports = {
  id: "crack-weeder-b058",
  name: "Crack Weeder",
  deck: "minorB",
  number: 58,
  type: "minor",
  cost: { wood: 1 },
  category: "Food Provider",
  text: "When you play this card, you immediately get 1 food. For each vegetable you take from a field in the field phase of a harvest, you also get 1 food.",
  onPlay(game, player) {
    player.addResource('food', 1)
    game.log.add({
      template: '{player} gets 1 food from Crack Weeder',
      args: { player },
    })
  },
  onHarvestVegetables(game, player, count) {
    if (count > 0) {
      player.addResource('food', count)
      game.log.add({
        template: '{player} gets {amount} food from Crack Weeder',
        args: { player, amount: count },
      })
    }
  },
}
