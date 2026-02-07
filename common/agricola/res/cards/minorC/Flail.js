module.exports = {
  id: "flail-c026",
  name: "Flail",
  deck: "minorC",
  number: 26,
  type: "minor",
  cost: { wood: 1 },
  category: "Food Provider",
  text: "When you play this card, you immediately get 2 food. Each time you use the \"Farmland\" or \"Cultivation\" action space, you can also take a \"Bake Bread\" action.",
  onPlay(game, player) {
    player.addResource('food', 2)
    game.log.add({
      template: '{player} gets 2 food from Flail',
      args: { player },
    })
  },
  onAction(game, player, actionId) {
    if (actionId === 'plow-field' || actionId === 'plow-sow') {
      game.actions.bakeBread(player)
    }
  },
}
