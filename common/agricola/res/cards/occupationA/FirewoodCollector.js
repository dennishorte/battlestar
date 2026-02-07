module.exports = {
  id: "firewood-collector-a119",
  name: "Firewood Collector",
  deck: "occupationA",
  number: 119,
  type: "occupation",
  players: "1+",
  text: "Each time you use the \"Farmland\", \"Grain Seeds\", \"Grain Utilization\", or \"Cultivation\" action space, at the end of that turn, you get 1 wood.",
  onAction(game, player, actionId) {
    if (actionId === 'plow-field' || actionId === 'take-grain' || actionId === 'sow-bake' || actionId === 'plow-sow') {
      player.addResource('wood', 1)
      game.log.add({
        template: '{player} gets 1 wood from Firewood Collector',
        args: { player },
      })
    }
  },
}
